# Supabase Auth 整合指南

**狀態**: ✅ 完整（Sprint 14 Task 3）

---

## 🎯 目標

整合 Supabase Auth 至 Flow 和 Apex 應用程式，實作完整的認證流程，包括：

- Email/Password 認證（Sprint 12 實作）
- React Query hooks 整合
- Protected Routes 保護
- Session 管理與自動更新
- 安全最佳實踐

---

## 🔐 認證流程

### 支援的認證方式

#### 1. **Email/Password** (Sprint 12 實作)

最基本且最常用的認證方式，適用於 Flourish 的使用場景。

**優點**：

- 簡單直接，使用者熟悉
- 完全由 Supabase 管理密碼安全
- 支援密碼重設流程

**實作位置**：

- Client hooks: `packages/supabase-client/src/features/auth/mutations.ts`
- Server actions: `packages/supabase-client/src/features/auth/server.ts`

#### 2. **Magic Link** (可選，未來擴充)

無密碼登入方式，透過 email 發送登入連結。

**優點**：

- 無需記憶密碼
- 更安全（無密碼洩漏風險）
- 使用者體驗佳

**限制**：

- 需要 email 服務配置
- 使用者需要存取 email

#### 3. **Social OAuth** (可選，未來擴充)

支援第三方登入（Google、GitHub 等）。

**優點**：

- 快速註冊流程
- 使用已驗證的社交帳號
- 減少表單填寫

**Supabase 支援的 providers**：

- Google
- GitHub
- Apple
- Facebook
- Discord
- 其他 10+ providers

---

## 📋 實作步驟

### 1. Supabase Auth 配置

#### 1.1 環境變數設定

確保你的 `.env.local` 包含必要的 Supabase 配置：

```bash
# Supabase 公開配置（前端使用）
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key（僅後端使用，絕不暴露給前端）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **安全提醒**：

- `NEXT_PUBLIC_*` 變數會暴露給瀏覽器
- `SUPABASE_SERVICE_ROLE_KEY` 只能在伺服器端使用
- 絕不將 service role key 傳送至前端

#### 1.2 Supabase Client 初始化

**Browser Client** (前端使用):

```typescript
// packages/supabase-client/src/lib/client/index.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Server Client** (伺服器端使用):

```typescript
// packages/supabase-client/src/lib/server/client.ts
'use server';

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component 中可能無法設定 cookies
          }
        },
      },
    }
  );
}
```

---

### 2. React Hooks 整合

使用 TanStack React Query 實作認證 hooks，提供：

- 自動快取管理
- 自動重新驗證
- 樂觀更新
- 錯誤處理

#### 2.1 查詢當前使用者

````typescript
// packages/supabase-client/src/features/auth/queries.ts
'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '../../shared/utils/query-keys';
import { getUser } from './server';
import type { AuthUser } from './types';

/**
 * React Query hook for fetching the current user
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { data: user, isLoading } = useAuthQuery();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!user) return <div>Please sign in</div>;
 *
 *   return <div>Welcome, {user.email}</div>;
 * }
 * ```
 */
export function useAuthQuery(
  initialData?: AuthUser | null
): UseQueryResult<AuthUser | null, Error> {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      return await getUser();
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
````

**使用範例**：

```tsx
'use client';

import { useAuthQuery } from '@repo/supabase-client/auth';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useAuthQuery();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

#### 2.2 登入 Mutation

````typescript
// packages/supabase-client/src/features/auth/mutations.ts
'use client';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { queryKeys } from '../../shared/utils/query-keys';
import { signIn, signUp, signOut } from './server';
import type { AuthUser, SignInCredentials, SignUpCredentials } from './types';

/**
 * React Query mutation hook for signing in
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const signInMutation = useSignInMutation();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     signInMutation.mutate(
 *       { email: 'user@example.com', password: 'password' },
 *       {
 *         onSuccess: (user) => {
 *           console.log('Signed in:', user);
 *           router.push('/dashboard');
 *         },
 *         onError: (error) => {
 *           console.error('Sign in failed:', error);
 *         }
 *       }
 *     );
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <button disabled={signInMutation.isPending}>
 *         {signInMutation.isPending ? 'Signing in...' : 'Sign In'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useSignInMutation(): UseMutationResult<AuthUser, Error, SignInCredentials> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (user) => {
      // 更新快取中的使用者資料
      queryClient.setQueryData(queryKeys.auth.user(), user);

      // 重新驗證所有 auth 相關查詢
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * React Query mutation hook for signing up
 */
export function useSignUpMutation(): UseMutationResult<AuthUser, Error, SignUpCredentials> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * React Query mutation hook for signing out
 */
export function useSignOutMutation(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // 清除使用者資料
      queryClient.setQueryData(queryKeys.auth.user(), null);

      // 清除所有快取（因為資料可能是使用者特定的）
      queryClient.clear();
    },
  });
}
````

**登入表單範例**：

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '@repo/supabase-client/auth';

export default function LoginForm() {
  const router = useRouter();
  const signInMutation = useSignInMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          console.log('Successfully signed in:', user.email);
          router.push('/dashboard');
        },
        onError: (error) => {
          console.error('Sign in failed:', error.message);
          alert(`登入失敗: ${error.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={signInMutation.isPending}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={signInMutation.isPending}
        />
      </div>

      <button type="submit" disabled={signInMutation.isPending}>
        {signInMutation.isPending ? '登入中...' : '登入'}
      </button>

      {signInMutation.error && <p className="text-red-600">錯誤: {signInMutation.error.message}</p>}
    </form>
  );
}
```

#### 2.3 Server Actions

所有認證操作都透過 Next.js Server Actions 執行，確保安全性：

```typescript
// packages/supabase-client/src/features/auth/server.ts
'use server';

import { createServerClient } from '../../lib/server/client';
import { revalidatePath } from 'next/cache';
import type { AuthUser, SignInCredentials, SignUpCredentials } from './types';

/**
 * Get the current authenticated user
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthUser> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(credentials);

  if (error || !user) {
    throw new Error(error?.message || 'Sign in failed');
  }

  // 重新驗證所有頁面快取
  revalidatePath('/', 'layout');

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthUser> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(credentials);

  if (error || !user) {
    throw new Error(error?.message || 'Sign up failed');
  }

  revalidatePath('/', 'layout');

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
}
```

---

### 3. Protected Routes

實作路由保護，確保只有已登入使用者可存取特定頁面。

#### 3.1 Middleware 保護

使用 Next.js Middleware 在伺服器端檢查認證狀態：

```typescript
// apps/flow/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未登入且嘗試存取受保護路徑 -> 重定向至登入頁
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 已登入且嘗試存取登入頁 -> 重定向至 dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

#### 3.2 Client Component 保護

在 Client Component 中檢查認證狀態：

```tsx
'use client';

import { useAuthQuery } from '@repo/supabase-client/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: user, isLoading } = useAuthQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // 或顯示 "Redirecting..."
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only visible to authenticated users</p>
    </div>
  );
}
```

#### 3.3 Higher-Order Component (HOC)

建立可重用的保護元件：

```tsx
// components/auth/withAuth.tsx
'use client';

import { useAuthQuery } from '@repo/supabase-client/auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function ProtectedComponent(props: P) {
    const { data: user, isLoading } = useAuthQuery();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push(redirectTo);
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}

// 使用範例
export default withAuth(DashboardPage);
```

---

### 4. Session 管理

#### 4.1 自動 Session 更新

Supabase 會自動處理 session refresh，但你可以手動控制：

```typescript
// lib/auth/session-manager.ts
import { createClient } from '@repo/supabase-client/client';

export class SessionManager {
  private static instance: SessionManager;
  private refreshInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * 開始自動更新 session（每 50 分鐘）
   */
  startAutoRefresh() {
    if (this.refreshInterval) {
      return;
    }

    this.refreshInterval = setInterval(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Failed to refresh session:', error);
      }
    }, 50 * 60 * 1000); // 50 minutes
  }

  /**
   * 停止自動更新
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}

// 在 app layout 中使用
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { SessionManager } from '@/lib/auth/session-manager';

export default function RootLayout({ children }) {
  useEffect(() => {
    const manager = SessionManager.getInstance();
    manager.startAutoRefresh();

    return () => {
      manager.stopAutoRefresh();
    };
  }, []);

  return <html>{children}</html>;
}
```

#### 4.2 Session 狀態監聽

監聽認證狀態變化：

```typescript
'use client';

import { useEffect } from 'react';
import { createClient } from '@repo/supabase-client/client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@repo/supabase-client/types';

export function AuthStateListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          // 重新驗證使用者資料
          queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
          break;

        case 'SIGNED_OUT':
          // 清除所有快取
          queryClient.setQueryData(queryKeys.auth.user(), null);
          queryClient.clear();
          break;

        case 'PASSWORD_RECOVERY':
          // 處理密碼重設
          console.log('Password recovery initiated');
          break;

        case 'USER_UPDATED':
          // 使用者資料更新
          queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return null;
}
```

---

## 🎨 UI 元件

### 登入表單

完整的登入表單元件，包含錯誤處理和載入狀態：

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '@repo/supabase-client/auth';

export function LoginForm() {
  const router = useRouter();
  const signInMutation = useSignInMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">登入</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="your@email.com"
            required
            disabled={signInMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="••••••••"
            required
            disabled={signInMutation.isPending}
          />
        </div>

        {signInMutation.error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {signInMutation.error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={signInMutation.isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {signInMutation.isPending ? '登入中...' : '登入'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <a href="/signup" className="text-blue-600 hover:underline">
          還沒有帳號？註冊
        </a>
      </div>
    </div>
  );
}
```

### 註冊表單

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpMutation } from '@repo/supabase-client/auth';

export function SignUpForm() {
  const router = useRouter();
  const signUpMutation = useSignUpMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('密碼不符合');
      return;
    }

    signUpMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          alert('註冊成功！請檢查你的 email 進行驗證。');
          router.push('/login');
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">註冊</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={signUpMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={signUpMutation.isPending}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            確認密碼
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={signUpMutation.isPending}
          />
        </div>

        {signUpMutation.error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {signUpMutation.error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={signUpMutation.isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {signUpMutation.isPending ? '註冊中...' : '註冊'}
        </button>
      </form>
    </div>
  );
}
```

### 忘記密碼

```tsx
'use client';

import { useState } from 'react';
import { createClient } from '@repo/supabase-client/client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: '密碼重設連結已發送至你的 email',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">忘記密碼</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '發送中...' : '發送重設連結'}
        </button>
      </form>
    </div>
  );
}
```

### 個人資料頁面

```tsx
'use client';

import { useAuthQuery, useSignOutMutation } from '@repo/supabase-client/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: user, isLoading } = useAuthQuery();
  const signOutMutation = useSignOutMutation();
  const router = useRouter();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">個人資料</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <p className="mt-1 text-sm text-gray-600 font-mono">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">加入時間</label>
          <p className="mt-1 text-lg">
            {new Date(user.createdAt).toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <button
          onClick={handleSignOut}
          disabled={signOutMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {signOutMutation.isPending ? '登出中...' : '登出'}
        </button>
      </div>
    </div>
  );
}
```

---

## 🔒 安全最佳實踐

### 1. Token 儲存

**✅ 正確做法**：

Supabase 自動將 token 儲存在 HTTP-only cookies 中（當使用 `@supabase/ssr`）。

```typescript
// ✅ 使用 SSR package 自動處理 cookies
import { createServerClient } from '@supabase/ssr';
```

**❌ 錯誤做法**：

```typescript
// ❌ 不要手動儲存 token 在 localStorage
localStorage.setItem('token', session.access_token);

// ❌ 不要在 client 端暴露 service role key
const supabase = createClient(url, SERVICE_ROLE_KEY); // 危險！
```

### 2. CSRF 防護

Next.js 和 Supabase SSR 自動處理 CSRF protection。

**額外保護**：

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 檢查 referer header
  const referer = request.headers.get('referer');
  const origin = new URL(request.url).origin;

  if (referer && !referer.startsWith(origin)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ... 其他 middleware 邏輯
}
```

### 3. Rate Limiting

在 Supabase Dashboard 設定 rate limiting：

1. 前往 **Authentication > Settings**
2. 設定 **Rate Limits**：
   - Sign up: 5 requests / hour / IP
   - Sign in: 10 requests / minute / IP
   - Password reset: 5 requests / hour / IP

**自訂 rate limiting**（使用 Redis）：

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(identifier: string, max: number = 5) {
  const key = `rate-limit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }

  if (count > max) {
    throw new Error('Rate limit exceeded');
  }
}

// 在 server action 中使用
export async function signIn(credentials: SignInCredentials) {
  await rateLimit(`sign-in:${credentials.email}`);

  // ... 正常登入邏輯
}
```

### 4. 密碼強度要求

在 Supabase Dashboard 設定密碼政策：

1. 前往 **Authentication > Settings**
2. 設定 **Password Requirements**：
   - Minimum length: 8 characters
   - Require uppercase: Yes
   - Require numbers: Yes
   - Require special characters: Yes

**前端驗證**：

```typescript
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密碼至少需要 8 個字元');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密碼需要包含大寫字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密碼需要包含小寫字母');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密碼需要包含數字');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('密碼需要包含特殊字元');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### 5. Email 驗證

**啟用 email 驗證**：

在 Supabase Dashboard:

1. 前往 **Authentication > Settings**
2. 啟用 **Enable email confirmations**

**處理未驗證使用者**：

```typescript
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // 檢查 email 是否已驗證
  if (!user.email_confirmed_at) {
    throw new Error('Please verify your email before continuing');
  }

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}
```

### 6. 安全 Headers

在 `next.config.js` 中設定安全 headers：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🧪 測試

### 單元測試

測試 auth server actions：

```typescript
// __tests__/auth/server.test.ts
import { signIn, signUp, signOut, getUser } from '@repo/supabase-client/auth/server';
import { createServerClient } from '@repo/supabase-client/server';

// Mock Supabase client
jest.mock('@repo/supabase-client/server');

describe('Auth Server Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      },
    };

    (createServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe('getUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await getUser();

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should return null when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      });

      const result = await getUser();

      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signIn(credentials);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      });
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    });

    it('should throw error on invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid credentials'),
      });

      await expect(signIn({ email: 'wrong@example.com', password: 'wrong' })).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});
```

### E2E 測試（使用 Playwright）

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should sign up, verify email, and sign in', async ({ page }) => {
    // 前往註冊頁面
    await page.goto('/signup');

    // 填寫註冊表單
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // 驗證成功訊息
    await expect(page.locator('text=請檢查你的 email')).toBeVisible();

    // 模擬 email 驗證（在實際測試中需要使用測試 email 服務）
    // ...

    // 登入
    await page.goto('/login');
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[type="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // 驗證重定向至 dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should sign out successfully', async ({ page, context }) => {
    // 先登入
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // 登出
    await page.click('button:has-text("登出")');

    // 驗證重定向至登入頁
    await expect(page).toHaveURL('/login');

    // 驗證無法存取受保護頁面
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
});
```

### 安全測試

```typescript
// __tests__/security/auth.security.test.ts
describe('Auth Security Tests', () => {
  it('should not expose service role key in browser', async () => {
    const { page } = await render(<LoginForm />);

    // 檢查瀏覽器中的環境變數
    const exposedKeys = await page.evaluate(() => {
      return Object.keys(window).filter(key =>
        key.includes('SUPABASE') || key.includes('SERVICE')
      );
    });

    expect(exposedKeys).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  });

  it('should enforce rate limiting on sign in', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };

    // 嘗試快速登入 15 次
    const attempts = Array(15).fill(null).map(() => signIn(credentials));

    await expect(Promise.all(attempts)).rejects.toThrow('Rate limit exceeded');
  });

  it('should reject weak passwords', async () => {
    const weakPasswords = ['123456', 'password', 'abc123', 'qwerty'];

    for (const password of weakPasswords) {
      await expect(
        signUp({ email: 'test@example.com', password })
      ).rejects.toThrow('Password does not meet requirements');
    }
  });
});
```

---

## 🔗 相關文檔

- [Sprint 12 - Authentication](../../sprints/release-1-core-features/12-authentication.md)
- [Supabase Auth 官方文檔](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [RLS Policies Guide](./rls-policies.md)
- [Local Development Setup](./local-development.md)

---

## 📊 常見錯誤與解決方案

### 錯誤 1: "Invalid JWT"

**原因**: Session token 過期或無效

**解決方案**:

```typescript
// 手動 refresh session
const supabase = createClient();
const { error } = await supabase.auth.refreshSession();

if (error) {
  // 重新登入
  await supabase.auth.signOut();
  router.push('/login');
}
```

### 錯誤 2: "Email not confirmed"

**原因**: 使用者尚未驗證 email

**解決方案**:

```typescript
// 重新發送驗證 email
const supabase = createClient();
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: 'user@example.com',
});
```

### 錯誤 3: "User already registered"

**原因**: Email 已被註冊

**解決方案**:

```typescript
// 提供明確的錯誤訊息
signUpMutation.mutate(credentials, {
  onError: (error) => {
    if (error.message.includes('already registered')) {
      alert('此 email 已註冊，請直接登入或使用忘記密碼功能');
    }
  },
});
```

### 錯誤 4: "Failed to fetch"

**原因**: 網路問題或 Supabase URL 配置錯誤

**解決方案**:

```bash
# 檢查環境變數
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 重新生成環境變數（如果錯誤）
npx supabase status
```

### 錯誤 5: "PKCE flow failed"

**原因**: Cookie 設定問題（通常發生在 Safari）

**解決方案**:

```typescript
// 在 middleware.ts 中確保正確設定 cookies
export async function middleware(request: NextRequest) {
  // 確保 cookies 正確設定
  const response = NextResponse.next();

  response.cookies.set({
    name: 'supabase-auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 重要：設定為 'lax' 或 'none'
  });

  return response;
}
```

---

**最後更新**: 2025-11-24
**完成狀態**: ✅ Sprint 14 Task 3
**實作 Sprint**: Sprint 12 - Authentication
