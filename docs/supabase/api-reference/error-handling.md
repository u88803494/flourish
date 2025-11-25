# 錯誤處理最佳實踐

**狀態**: ✅ 完整

---

## 🎯 目標

提供 Supabase 錯誤處理的最佳實踐與常見錯誤解決方案，確保應用程式能夠優雅地處理各種錯誤情況。

---

## ⚠️ Supabase 錯誤類型

### 1. 資料庫錯誤 (PostgrestError)

PostgreSQL 資料庫操作產生的錯誤，包含詳細的錯誤代碼和訊息。

```typescript
// ❌ 錯誤範例：違反唯一性約束
const { data, error } = await supabase.from('users').insert({
  id: 'existing-id', // 重複的 ID
  email: 'user@example.com',
});

if (error) {
  console.error('Database error:', error);
  // error.code: '23505' (unique_violation)
  // error.message: 'duplicate key value violates unique constraint'
  // error.details: 詳細錯誤資訊
  // error.hint: PostgreSQL 提供的建議
}
```

**常見資料庫錯誤代碼**:

| 代碼    | 說明                        | 範例情境                   |
| ------- | --------------------------- | -------------------------- |
| `23505` | Unique constraint violation | 插入重複的唯一值           |
| `23503` | Foreign key violation       | 引用不存在的外鍵           |
| `23502` | Not null violation          | 必填欄位為空               |
| `42501` | Insufficient privilege      | 權限不足 (通常是 RLS 問題) |
| `42P01` | Undefined table             | 資料表不存在               |
| `PGRST` | PostgREST error             | API 層級錯誤               |

**處理範例**:

```typescript
// Server Action 中的資料庫錯誤處理
'use server';

import { createServerClient } from '@repo/supabase-client/lib/server';
import type { Transaction } from '@repo/supabase-client/types';

export async function createTransaction(data: TransactionInsert): Promise<{
  data: Transaction | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert(data)
      .select()
      .single();

    if (error) {
      // 根據錯誤代碼提供使用者友善的訊息
      if (error.code === '23503') {
        return {
          data: null,
          error: '無效的分類或卡片 ID。請確認資料正確。',
        };
      }

      if (error.code === '23502') {
        return {
          data: null,
          error: '缺少必填欄位。請填寫所有必填資訊。',
        };
      }

      if (error.code === '42501') {
        return {
          data: null,
          error: '您沒有權限執行此操作。',
        };
      }

      // 預設錯誤訊息
      return {
        data: null,
        error: '建立交易失敗。請稍後再試。',
      };
    }

    return { data: transaction, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      data: null,
      error: '發生未預期的錯誤。請稍後再試。',
    };
  }
}
```

---

### 2. 認證錯誤 (AuthError)

Supabase Auth 產生的認證相關錯誤。

```typescript
// ❌ 錯誤範例：登入失敗
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'wrong-password',
});

if (error) {
  console.error('Auth error:', error);
  // error.message: 'Invalid login credentials'
  // error.status: 400
}
```

**常見認證錯誤**:

| 錯誤訊息                        | 說明                   | 解決方案                    |
| ------------------------------- | ---------------------- | --------------------------- |
| `Invalid login credentials`     | 帳號或密碼錯誤         | 檢查輸入的帳號密碼          |
| `Email not confirmed`           | Email 尚未驗證         | 檢查信箱並完成驗證          |
| `User already registered`       | 帳號已存在             | 使用其他 email 或嘗試登入   |
| `Email rate limit exceeded`     | Email 發送次數過多     | 等待後再試                  |
| `Invalid refresh token`         | Refresh token 無效     | 重新登入                    |
| `Token has expired`             | Token 已過期           | 使用 refresh token 重新取得 |
| `Invalid JWT`                   | JWT 格式錯誤           | 重新登入                    |
| `Password should be at least 6` | 密碼長度不足           | 使用至少 6 個字元的密碼     |
| `Signup disabled`               | 註冊功能已關閉         | 聯絡管理員                  |
| `Email link is invalid`         | Email 連結已過期或無效 | 請求新的驗證 email          |

**處理範例**:

```typescript
// Server Action 中的認證錯誤處理
'use server';

import { createServerClient } from '@repo/supabase-client/lib/server';

export async function signIn(
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 根據錯誤訊息提供使用者友善的回饋
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': '帳號或密碼錯誤。請重新輸入。',
        'Email not confirmed': '請先驗證您的 Email 信箱。',
        'Email rate limit exceeded': '嘗試次數過多，請稍後再試。',
        'Token has expired': '登入已過期，請重新登入。',
      };

      return {
        success: false,
        error: errorMessages[error.message] || '登入失敗，請稍後再試。',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return {
      success: false,
      error: '發生未預期的錯誤。請稍後再試。',
    };
  }
}
```

**處理 Session 過期**:

```typescript
// Middleware 中檢查並處理 session 過期
// apps/flow/src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@repo/supabase-client/lib/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Session 過期或無效
  if (error || !user) {
    // 如果在受保護的路由，重新導向至登入頁
    const protectedPaths = ['/dashboard', '/transactions', '/profile'];
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### 3. RLS 策略錯誤

Row Level Security (RLS) 策略違規產生的錯誤，通常表示使用者嘗試存取未授權的資料。

```typescript
// ❌ 錯誤範例：嘗試存取其他使用者的交易
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('id', 'other-user-transaction-id'); // 不屬於當前使用者

if (error) {
  console.error('RLS error:', error);
  // error.code: '42501' (insufficient_privilege)
  // error.message: 'new row violates row-level security policy'
}
```

**常見 RLS 錯誤情境**:

1. **查詢時 RLS 阻擋**: 返回空結果或錯誤
2. **插入時 RLS 阻擋**: 插入失敗並返回權限錯誤
3. **更新時 RLS 阻擋**: 更新失敗，資料未變更
4. **刪除時 RLS 阻擋**: 刪除失敗，資料保持不變

**處理範例**:

```typescript
// 安全的資料存取模式 - Server Action
'use server';

import { createServerClient } from '@repo/supabase-client/lib/server';

export async function getTransaction(transactionId: string) {
  try {
    const supabase = await createServerClient();

    // 取得當前使用者
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: '請先登入。',
      };
    }

    // 明確檢查使用者權限
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user.id) // 明確過濾使用者資料
      .single();

    if (error) {
      // RLS 策略阻擋或資料不存在
      if (error.code === '42501') {
        return {
          data: null,
          error: '您沒有權限存取此交易。',
        };
      }

      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: '找不到此交易。',
        };
      }

      return {
        data: null,
        error: '取得交易失敗。',
      };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      data: null,
      error: '發生未預期的錯誤。',
    };
  }
}
```

**除錯 RLS 策略**:

```sql
-- 在 Supabase SQL Editor 中測試 RLS 策略
-- 1. 切換到特定使用者身份
SELECT auth.uid(); -- 檢查當前使用者 ID

-- 2. 測試查詢是否被 RLS 阻擋
SELECT * FROM transactions WHERE id = 'test-id';

-- 3. 檢查 RLS 策略定義
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'transactions';

-- 4. 暫時停用 RLS 進行除錯（僅開發環境）
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
-- 測試完成後記得重新啟用
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

---

### 4. 網路錯誤

網路連線問題或 API 請求失敗產生的錯誤。

```typescript
// ❌ 錯誤範例：網路連線失敗
try {
  const { data, error } = await supabase.from('transactions').select('*');

  if (error) {
    // 可能是網路錯誤
    throw error;
  }
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    console.error('Network error:', error);
    // 顯示離線提示
  }
}
```

**常見網路錯誤**:

- `Failed to fetch`: 網路連線中斷或伺服器無法連線
- `Network request failed`: 網路請求失敗
- `Timeout`: 請求超時
- `CORS error`: 跨域請求被阻擋

**處理範例 - 帶重試機制**:

```typescript
// 網路請求重試工具函數
async function fetchWithRetry<T>(
  fetchFn: () => Promise<{ data: T | null; error: any }>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<{ data: T | null; error: string | null }> {
  const { maxRetries = 3, retryDelay = 1000, shouldRetry = () => true } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchFn();

      if (!result.error) {
        return { data: result.data, error: null };
      }

      lastError = result.error;

      // 檢查是否應該重試
      if (attempt < maxRetries && shouldRetry(result.error)) {
        // 指數退避策略
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      break;
    } catch (err) {
      lastError = err;

      // 網路錯誤通常值得重試
      if (attempt < maxRetries && err instanceof TypeError && err.message.includes('fetch')) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      break;
    }
  }

  return {
    data: null,
    error: lastError?.message || '請求失敗，請檢查網路連線。',
  };
}

// 使用範例
export async function getTransactionsWithRetry(userId: string) {
  return fetchWithRetry(
    async () => {
      const supabase = await createServerClient();
      return await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: (error) => {
        // 只對網路錯誤重試，不對認證或權限錯誤重試
        return !['42501', '401', '403'].includes(error?.code);
      },
    }
  );
}
```

---

## 📋 錯誤處理模式

### Try-Catch 模式

**Server Actions 錯誤處理** (推薦):

```typescript
// Server Action 標準錯誤處理模式
'use server';

import { createServerClient } from '@repo/supabase-client/lib/server';
import { revalidatePath } from 'next/cache';

export async function createTransaction(formData: FormData) {
  try {
    const supabase = await createServerClient();

    // 1. 驗證輸入
    const amount = parseFloat(formData.get('amount') as string);
    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: '金額必須大於 0。',
      };
    }

    // 2. 檢查認證
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: '請先登入。',
      };
    }

    // 3. 執行資料庫操作
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        merchant_name: formData.get('merchant_name') as string,
        amount,
        date: formData.get('date') as string,
        type: formData.get('type') as string,
      })
      .select()
      .single();

    // 4. 處理資料庫錯誤
    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: '建立交易失敗。請稍後再試。',
      };
    }

    // 5. 重新驗證快取
    revalidatePath('/transactions');

    return {
      success: true,
      data,
    };
  } catch (error) {
    // 6. 處理未預期的錯誤
    console.error('Unexpected error in createTransaction:', error);
    return {
      success: false,
      error: '發生未預期的錯誤。請稍後再試。',
    };
  }
}
```

**Client Component 錯誤處理**:

```typescript
// Client Component 中的錯誤處理
'use client';

import { useState } from 'react';
import { createTransaction } from './actions';

export function TransactionForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await createTransaction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // 成功處理
      alert('交易建立成功！');
    } catch (err) {
      console.error('Form submission error:', err);
      setError('發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* 表單欄位 */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          <p>{error}</p>
        </div>
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '處理中...' : '建立交易'}
      </button>
    </form>
  );
}
```

---

### React Error Boundaries

用於捕獲 React 元件樹中的 JavaScript 錯誤，並顯示降級 UI。

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 呼叫自訂錯誤處理器
    this.props.onError?.(error, errorInfo);

    // 可以發送錯誤到追蹤服務
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自訂降級 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設降級 UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
          <h2 className="mb-2 text-xl font-semibold text-red-900">發生錯誤</h2>
          <p className="mb-4 text-center text-red-700">
            抱歉，應用程式遇到了一個問題。
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            重試
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用範例 - 包裹整個應用程式或特定元件
// app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <ErrorBoundary
          fallback={
            <div className="p-8 text-center">
              <h1>應用程式發生錯誤</h1>
              <p>請重新整理頁面或聯絡支援團隊。</p>
            </div>
          }
          onError={(error, errorInfo) => {
            // 發送錯誤到監控服務
            console.error('Global error:', error, errorInfo);
          }}
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

// 使用範例 - 包裹特定功能區塊
export function TransactionsList() {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center">
          <p>載入交易時發生錯誤。</p>
        </div>
      }
    >
      <TransactionsContent />
    </ErrorBoundary>
  );
}
```

**Next.js 15 App Router 錯誤處理**:

```typescript
// app/error.tsx - 自動捕獲路由錯誤
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">發生錯誤</h2>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        重試
      </button>
    </div>
  );
}

// app/global-error.tsx - 捕獲根 layout 的錯誤
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-bold">全域錯誤</h2>
          <p className="mb-4 text-gray-600">應用程式遇到嚴重錯誤。</p>
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            重新載入應用程式
          </button>
        </div>
      </body>
    </html>
  );
}
```

---

### 全域錯誤處理

集中式錯誤處理與日誌記錄。

```typescript
// lib/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 500, true);
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '請先登入') {
    super(message, 'AUTH_REQUIRED', 401, true);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = '您沒有權限執行此操作') {
    super(message, 'FORBIDDEN', 403, true);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400, true);
    this.name = 'ValidationError';
  }
}

// 全域錯誤處理器
export function handleError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  // 1. 處理已知的應用程式錯誤
  if (error instanceof AppError) {
    console.error(`[${error.name}] ${error.message}`, {
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // 2. 處理 Supabase 錯誤
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string };

    console.error('[Supabase Error]', supabaseError);

    // 根據錯誤代碼返回使用者友善訊息
    const errorMessages: Record<string, string> = {
      '23505': '資料已存在',
      '23503': '相關資料不存在',
      '42501': '權限不足',
      PGRST116: '找不到資料',
    };

    return {
      message: errorMessages[supabaseError.code] || '資料庫操作失敗',
      code: supabaseError.code,
      statusCode: supabaseError.code === '42501' ? 403 : 400,
    };
  }

  // 3. 處理一般 JavaScript 錯誤
  if (error instanceof Error) {
    console.error('[Unexpected Error]', error.message, error.stack);

    return {
      message: '發生未預期的錯誤',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  // 4. 處理未知錯誤
  console.error('[Unknown Error]', error);

  return {
    message: '發生未知錯誤',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}

// 使用範例
('use server');

import { handleError, AuthenticationError, ValidationError } from '@/lib/error-handler';

export async function createTransaction(data: TransactionInsert) {
  try {
    // 驗證輸入
    if (!data.amount || data.amount <= 0) {
      throw new ValidationError('金額必須大於 0', { amount: '無效的金額' });
    }

    const supabase = await createServerClient();

    // 檢查認證
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // 執行操作
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: transaction };
  } catch (error) {
    const handledError = handleError(error);
    return {
      success: false,
      error: handledError.message,
      code: handledError.code,
    };
  }
}
```

---

## 🎯 常見錯誤與解決方案

### RLS Policy Violation

**錯誤訊息**: `new row violates row-level security policy` / `insufficient_privilege`

**錯誤代碼**: `42501`

**原因**:

1. 嘗試存取不屬於當前使用者的資料
2. RLS 策略配置錯誤或過於嚴格
3. 插入資料時缺少必要的欄位（如 `user_id`）
4. 使用匿名使用者存取受保護的資料

**解決方案**:

```typescript
// ✅ 正確做法：明確指定 user_id
'use server';

export async function createTransaction(data: Omit<TransactionInsert, 'user_id'>) {
  const supabase = await createServerClient();

  // 取得當前使用者
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  // 確保 user_id 正確設定
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      ...data,
      user_id: user.id, // 明確設定 user_id
    })
    .select()
    .single();

  if (error) {
    if (error.code === '42501') {
      throw new AuthorizationError('您沒有權限建立此交易');
    }
    throw error;
  }

  return transaction;
}
```

**除錯步驟**:

1. **檢查 RLS 策略**:

```sql
-- 查看資料表的 RLS 策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'transactions';

-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'transactions';
```

1. **測試策略**:

```sql
-- 以特定使用者身份測試查詢
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM transactions WHERE user_id = 'user-uuid-here';
```

1. **暫時停用 RLS（僅開發環境）**:

```sql
-- 停用 RLS 測試查詢
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- 測試完成後重新啟用
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

---

### Foreign Key Constraint

**錯誤訊息**: `insert or update violates foreign key constraint`

**錯誤代碼**: `23503`

**原因**:

1. 引用的外鍵 ID 不存在
2. 外鍵欄位為 null（如果未設定 `ON DELETE SET NULL`）
3. 相關資料已被刪除

**解決方案**:

```typescript
// ✅ 正確做法：插入前驗證外鍵存在
'use server';

export async function createTransaction(data: TransactionInsert) {
  const supabase = await createServerClient();

  // 1. 驗證 category 存在
  if (data.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', data.category_id)
      .single();

    if (categoryError || !category) {
      throw new ValidationError('選擇的分類不存在', {
        category_id: '無效的分類',
      });
    }
  }

  // 2. 驗證 card 存在
  if (data.card_id) {
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('id')
      .eq('id', data.card_id)
      .eq('user_id', user.id) // 確認卡片屬於當前使用者
      .single();

    if (cardError || !card) {
      throw new ValidationError('選擇的卡片不存在或不屬於您', {
        card_id: '無效的卡片',
      });
    }
  }

  // 3. 執行插入
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert(data)
    .select()
    .single();

  if (error) {
    if (error.code === '23503') {
      throw new ValidationError('相關資料不存在或已被刪除');
    }
    throw error;
  }

  return transaction;
}
```

**防止級聯刪除問題**:

```sql
-- 設定 ON DELETE 行為（在 migration 中）
ALTER TABLE transactions
  DROP CONSTRAINT transactions_category_id_fkey,
  ADD CONSTRAINT transactions_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL; -- 或 CASCADE / RESTRICT

ALTER TABLE transactions
  DROP CONSTRAINT transactions_card_id_fkey,
  ADD CONSTRAINT transactions_card_id_fkey
    FOREIGN KEY (card_id)
    REFERENCES cards(id)
    ON DELETE SET NULL;
```

---

### Session Expired

**錯誤訊息**: `JWT expired` / `Invalid refresh token`

**原因**:

1. Access token 已過期（預設 1 小時）
2. Refresh token 已過期（預設 30 天）
3. 使用者登出或 session 被清除
4. Token 被手動撤銷

**解決方案**:

```typescript
// ✅ 自動重新整理 session
// lib/supabase/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@repo/supabase-client/lib/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = await createServerClient();

  // 自動重新整理 session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Session refresh error:', error);

    // Session 已過期，重新導向至登入頁
    if (error.message.includes('expired')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Session 即將過期（剩餘時間少於 10 分鐘），主動重新整理
  if (session) {
    const expiresAt = new Date(session.expires_at! * 1000);
    const now = new Date();
    const minutesUntilExpiry = (expiresAt.getTime() - now.getTime()) / 1000 / 60;

    if (minutesUntilExpiry < 10) {
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        // 導向登入頁
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'refresh_failed');
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return response;
}
```

**Client 端處理**:

```typescript
// 監聽 auth state 變化
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase-client/lib/client';

export function AuthStateListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        router.push('/login');
      }

      if (event === 'USER_UPDATED') {
        console.log('User updated');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
```

---

## 💡 最佳實踐

### 1. 使用者友善的錯誤訊息

**❌ 不好的做法**:

```typescript
if (error) {
  alert(error.message); // 顯示技術性錯誤訊息
}
```

**✅ 好的做法**:

```typescript
// 建立錯誤訊息對應表
const USER_FRIENDLY_ERRORS: Record<string, string> = {
  // 資料庫錯誤
  '23505': '此資料已存在，請檢查是否重複。',
  '23503': '相關資料不存在，請重新選擇。',
  '42501': '您沒有權限執行此操作。',
  PGRST116: '找不到資料。',

  // 認證錯誤
  'Invalid login credentials': '帳號或密碼錯誤，請重新輸入。',
  'Email not confirmed': '請先驗證您的 Email 信箱。',
  'User already registered': '此 Email 已被註冊，請使用其他 Email 或嘗試登入。',

  // 預設訊息
  default: '操作失敗，請稍後再試。',
};

function getErrorMessage(error: any): string {
  if (error?.code && USER_FRIENDLY_ERRORS[error.code]) {
    return USER_FRIENDLY_ERRORS[error.code];
  }

  if (error?.message && USER_FRIENDLY_ERRORS[error.message]) {
    return USER_FRIENDLY_ERRORS[error.message];
  }

  return USER_FRIENDLY_ERRORS.default;
}

// 使用
if (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

---

### 2. 錯誤日誌記錄

建立結構化的錯誤日誌系統。

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;

    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (context && Object.keys(context).length > 0) {
      logMessage += `\n  Context: ${JSON.stringify(context, null, 2)}`;
    }

    if (error) {
      logMessage += `\n  Error: ${error.message}`;
      logMessage += `\n  Stack: ${error.stack}`;
    }

    return logMessage;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedLog = this.formatLog(entry);

    // 在開發環境使用 console
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(formattedLog);
          break;
        case 'info':
          console.info(formattedLog);
          break;
        case 'warn':
          console.warn(formattedLog);
          break;
        case 'error':
          console.error(formattedLog);
          break;
      }
    }

    // 在生產環境發送到監控服務
    // if (!this.isDevelopment) {
    //   sendToMonitoringService(entry);
    // }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();

// 使用範例
('use server');

import { logger } from '@/lib/logger';

export async function createTransaction(data: TransactionInsert) {
  try {
    logger.info('Creating transaction', { userId: data.user_id });

    const supabase = await createServerClient();
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert(data)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create transaction', error, {
        userId: data.user_id,
        errorCode: error.code,
      });
      throw error;
    }

    logger.info('Transaction created successfully', {
      transactionId: transaction.id,
    });

    return transaction;
  } catch (error) {
    logger.error('Unexpected error in createTransaction', error as Error, {
      data,
    });
    throw error;
  }
}
```

---

### 3. 重試機制

對於暫時性錯誤實作智能重試。

```typescript
// lib/retry.ts
interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // 預設：只重試網路錯誤和暫時性錯誤
      if (error?.code) {
        // 不重試認證和權限錯誤
        const nonRetryableCodes = ['42501', '401', '403', '23505', '23503'];
        return !nonRetryableCodes.includes(error.code);
      }
      // 重試網路錯誤
      return error instanceof TypeError && error.message.includes('fetch');
    },
    onRetry = (error, attempt) => {
      logger.warn(`Retrying operation (attempt ${attempt})`, { error: error.message });
    },
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // 最後一次嘗試失敗
      if (attempt === maxAttempts) {
        logger.error(`Operation failed after ${maxAttempts} attempts`, error as Error);
        throw error;
      }

      // 檢查是否應該重試
      if (!shouldRetry(error, attempt)) {
        logger.warn('Error is not retryable, failing immediately', {
          error: error.message,
        });
        throw error;
      }

      // 呼叫重試回調
      onRetry(error, attempt);

      // 等待後重試（指數退避）
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

// 使用範例
export async function getTransactions(userId: string) {
  return withRetry(
    async () => {
      const supabase = await createServerClient();
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    {
      maxAttempts: 3,
      initialDelay: 1000,
      onRetry: (error, attempt) => {
        console.log(`Retrying getTransactions (attempt ${attempt}):`, error.message);
      },
    }
  );
}
```

---

### 4. 降級策略

當功能無法正常運作時，提供降級體驗。

```typescript
// 策略 1: 降級至快取資料
export async function getTransactionsWithFallback(userId: string) {
  try {
    // 嘗試從資料庫取得最新資料
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    // 成功：儲存至快取
    await cacheTransactions(userId, data);

    return {
      data,
      source: 'live',
      error: null,
    };
  } catch (error) {
    logger.warn('Failed to fetch live data, falling back to cache', {
      userId,
      error: error.message,
    });

    // 降級：從快取讀取
    const cachedData = await getCachedTransactions(userId);

    if (cachedData) {
      return {
        data: cachedData,
        source: 'cache',
        error: null,
      };
    }

    // 快取也沒有：返回空陣列
    return {
      data: [],
      source: 'empty',
      error: '無法載入交易記錄，請稍後再試。',
    };
  }
}

// 策略 2: 功能降級
export async function getTransactionsWithDetails(userId: string) {
  try {
    // 嘗試取得完整資料（包含 JOIN）
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(*), card:cards(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return {
      data,
      hasDetails: true,
    };
  } catch (error) {
    logger.warn('Failed to fetch with details, falling back to basic query', {
      userId,
      error: error.message,
    });

    // 降級：只取得基本資料（無 JOIN）
    const { data: basicData, error: basicError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (basicError) throw basicError;

    return {
      data: basicData,
      hasDetails: false,
    };
  }
}

// UI 中顯示降級狀態
'use client';

export function TransactionsList() {
  const [result, setResult] = useState<{
    data: Transaction[];
    source: 'live' | 'cache' | 'empty';
    error: string | null;
  } | null>(null);

  useEffect(() => {
    getTransactionsWithFallback(userId).then(setResult);
  }, [userId]);

  if (!result) return <div>載入中...</div>;

  return (
    <div>
      {result.source === 'cache' && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
          ⚠️ 顯示快取資料，最新資料載入失敗
        </div>
      )}

      {result.source === 'empty' && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          ❌ 無法載入交易記錄，請檢查網路連線後重試
        </div>
      )}

      {result.data.map((transaction) => (
        <div key={transaction.id}>{/* 交易項目 */}</div>
      ))}
    </div>
  );
}
```

---

## 🔗 相關文檔

- [React Hooks API](./hooks.md) - React hooks 錯誤處理
- [RLS 策略設計](../guides/rls-policies.md) - RLS 錯誤預防
- [認證指南](../guides/authentication.md) - 認證錯誤處理
- [Query Patterns](./query-patterns.md) - 查詢錯誤處理

---

## 📋 錯誤處理檢查清單

### 開發階段

- [ ] 所有 Server Actions 都有適當的 try-catch
- [ ] 資料庫錯誤有對應的使用者友善訊息
- [ ] 認證錯誤會重新導向至登入頁
- [ ] 外鍵約束在插入前驗證
- [ ] RLS 策略錯誤有明確的提示訊息

### 測試階段

- [ ] 測試網路中斷情境
- [ ] 測試 session 過期處理
- [ ] 測試並行請求的錯誤處理
- [ ] 測試資料驗證錯誤
- [ ] 測試 Error Boundary 降級 UI

### 生產環境

- [ ] 錯誤日誌系統已配置
- [ ] 關鍵操作有重試機制
- [ ] 降級策略已實作
- [ ] 錯誤監控服務已設定
- [ ] 使用者回報錯誤的流程已建立

---

**最後更新**: 2025-11-24
**Task 3 已完成**: 詳細錯誤處理、實際範例、故障排除
