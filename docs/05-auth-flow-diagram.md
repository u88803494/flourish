# 完整認證流程圖

## 🔐 認證架構總覽

本文檔詳細說明 Supabase Auth + NestJS JWT 驗證的完整流程。

---

## 系統組件

### 1. Supabase Auth
- **角色**：身份認證服務（Identity Provider）
- **職責**：
  - 使用者註冊和登入
  - 簽發和刷新 JWT token
  - 管理 session
  - 密碼重設、Email 驗證等

### 2. Next.js 前端
- **角色**：客戶端應用
- **職責**：
  - 提供使用者介面
  - 與 Supabase Auth 互動
  - 儲存和傳遞 JWT token
  - 呼叫 NestJS API

### 3. NestJS 後端
- **角色**：資源伺服器（Resource Server）
- **職責**：
  - 驗證 JWT token 有效性
  - 執行商業邏輯
  - 存取資料庫
  - **不負責簽發 token**

### 4. Prisma + PostgreSQL
- **角色**：資料持久化
- **職責**：
  - 儲存業務資料（交易、分類等）
  - 可選：儲存使用者 profile

---

## 📊 註冊流程

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  使用者  │         │   Next.js    │         │   Supabase   │
│          │         │    前端      │         │     Auth     │
└────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                      │                        │
     │  1. 填寫註冊表單     │                        │
     │ (email, password)    │                        │
     ├─────────────────────>│                        │
     │                      │                        │
     │                      │  2. supabase.auth      │
     │                      │     .signUp()          │
     │                      ├───────────────────────>│
     │                      │                        │
     │                      │                        │  3. 建立使用者
     │                      │                        │     在 auth.users
     │                      │                        │
     │                      │  4. 回傳 session       │
     │                      │     包含 JWT token     │
     │                      │<───────────────────────┤
     │                      │                        │
     │                      │  5. 儲存 token 到      │
     │                      │     localStorage/      │
     │                      │     cookie             │
     │                      │                        │
     │  6. 顯示成功訊息     │                        │
     │  （或 Email 驗證）   │                        │
     │<─────────────────────┤                        │
     │                      │                        │
```

### 程式碼範例

```typescript
// app/register/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RegisterPage() {
  const supabase = createClientComponentClient();

  const handleRegister = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('註冊失敗:', error.message);
      return;
    }

    if (data.session) {
      // 註冊成功，已自動登入
      console.log('Token:', data.session.access_token);
      // 跳轉到主頁
      router.push('/dashboard');
    } else {
      // 需要 Email 驗證
      console.log('請檢查您的 Email 進行驗證');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleRegister(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">註冊</button>
    </form>
  );
}
```

---

## 📊 登入流程

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  使用者  │         │   Next.js    │         │   Supabase   │
│          │         │    前端      │         │     Auth     │
└────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                      │                        │
     │  1. 填寫登入表單     │                        │
     │ (email, password)    │                        │
     ├─────────────────────>│                        │
     │                      │                        │
     │                      │  2. supabase.auth      │
     │                      │  .signInWithPassword() │
     │                      ├───────────────────────>│
     │                      │                        │
     │                      │                        │  3. 驗證密碼
     │                      │                        │
     │                      │  4. 回傳 session       │
     │                      │     包含 JWT token     │
     │                      │<───────────────────────┤
     │                      │                        │
     │                      │  5. 儲存 token         │
     │                      │                        │
     │  6. 跳轉到 Dashboard │                        │
     │<─────────────────────┤                        │
     │                      │                        │
```

### 程式碼範例

```typescript
// app/login/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('登入失敗:', error.message);
      return;
    }

    console.log('登入成功，Token:', data.session.access_token);
    router.push('/dashboard');
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">登入</button>
    </form>
  );
}
```

---

## 📊 呼叫受保護的 API 流程

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  使用者  │    │   Next.js    │    │   NestJS     │    │   Prisma     │
│          │    │    前端      │    │     API      │    │  PostgreSQL  │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                   │                   │
     │  1. 點擊按鈕    │                   │                   │
     │  （查看交易）   │                   │                   │
     ├────────────────>│                   │                   │
     │                 │                   │                   │
     │                 │  2. 從 localStorage│                   │
     │                 │     取得 JWT token │                   │
     │                 │                   │                   │
     │                 │  3. 發送請求       │                   │
     │                 │  GET /transactions │                   │
     │                 │  Header:           │                   │
     │                 │  Authorization:    │                   │
     │                 │  Bearer <token>    │                   │
     │                 ├──────────────────>│                   │
     │                 │                   │                   │
     │                 │                   │  4. 驗證 token    │
     │                 │                   │     (Passport     │
     │                 │                   │      Strategy)    │
     │                 │                   │                   │
     │                 │                   │  5. 解析 user ID  │
     │                 │                   │     from JWT      │
     │                 │                   │                   │
     │                 │                   │  6. 查詢資料      │
     │                 │                   ├──────────────────>│
     │                 │                   │                   │
     │                 │                   │  7. 回傳交易記錄  │
     │                 │                   │<──────────────────┤
     │                 │                   │                   │
     │                 │  8. 回傳 JSON 資料 │                   │
     │                 │<──────────────────┤                   │
     │                 │                   │                   │
     │  9. 顯示交易    │                   │                   │
     │     列表        │                   │                   │
     │<────────────────┤                   │                   │
     │                 │                   │                   │
```

### 前端程式碼

```typescript
// app/transactions/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TransactionsPage() {
  const supabase = createClientComponentClient();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    // 1. 取得 token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    // 2. 呼叫 NestJS API
    const response = await fetch('http://localhost:3001/transactions', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    // 3. 處理回應
    if (response.ok) {
      const data = await response.json();
      setTransactions(data);
    } else {
      console.error('取得交易失敗');
    }
  };

  return (
    <div>
      <h1>我的交易記錄</h1>
      {transactions.map(t => (
        <div key={t.id}>{t.description}: ${t.amount}</div>
      ))}
    </div>
  );
}
```

### 後端程式碼

```typescript
// transactions.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(SupabaseAuthGuard)  // 🔒 保護此路由
  async findAll(@Request() req) {
    // req.user 已經由 Guard 自動填充
    const userId = req.user.id;
    
    // 只回傳該使用者的交易
    return this.transactionsService.findAll(userId);
  }
}
```

---

## 📊 Token 驗證詳細流程（NestJS 內部）

```
┌─────────────────┐
│  HTTP Request   │
│  Authorization: │
│  Bearer <token> │
└────────┬────────┘
         │
         │  1. Request 進入 NestJS
         │
         v
┌─────────────────────┐
│ SupabaseAuthGuard   │
│                     │
│  extends            │
│  AuthGuard('jwt')   │
└────────┬────────────┘
         │
         │  2. 觸發 JwtStrategy
         │
         v
┌──────────────────────────┐
│  SupabaseJwtStrategy     │
│                          │
│  1. 從 Header 提取 token │
│  2. 驗證簽章             │
│     使用 JWT_SECRET      │
│  3. 檢查有效期限         │
│  4. 解析 payload         │
└────────┬─────────────────┘
         │
         │  3. 呼叫 validate()
         │
         v
┌──────────────────────────┐
│  validate(payload)       │
│                          │
│  return {                │
│    id: payload.sub,      │
│    email: payload.email  │
│  }                       │
└────────┬─────────────────┘
         │
         │  4. 將 user 附加到 request
         │
         v
┌──────────────────────────┐
│  req.user = {            │
│    id: '...',            │
│    email: '...'          │
│  }                       │
└────────┬─────────────────┘
         │
         │  5. 繼續執行 Controller
         │
         v
┌──────────────────────────┐
│  TransactionsController  │
│                          │
│  @Get()                  │
│  findAll(@User() user) { │
│    // user.id 可用       │
│  }                       │
└──────────────────────────┘
```

### JWT Payload 結構

Supabase 簽發的 JWT token 解碼後的 payload 範例：

```json
{
  "aud": "authenticated",
  "exp": 1697625600,
  "iat": 1697622000,
  "iss": "https://xxx.supabase.co/auth/v1",
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user ID
  "email": "user@example.com",
  "phone": "",
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {},
  "role": "authenticated"
}
```

**關鍵欄位**：
- `sub`：Subject，即使用者的唯一 ID
- `email`：使用者的 email
- `exp`：過期時間（Unix timestamp）
- `iat`：簽發時間

---

## 🔄 Token 刷新流程

JWT token 有有效期限（通常 1 小時），需要定期刷新。

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  Next.js │         │   Supabase   │         │   NestJS     │
│  前端    │         │     Auth     │         │     API      │
└────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                      │                        │
     │  1. API 請求失敗     │                        │
     │     (401 Unauthorized)                        │
     │<──────────────────────────────────────────────┤
     │                      │                        │
     │  2. 檢測到 token     │                        │
     │     已過期           │                        │
     │                      │                        │
     │  3. supabase.auth    │                        │
     │     .refreshSession()│                        │
     ├─────────────────────>│                        │
     │                      │                        │
     │                      │  4. 驗證 refresh token │
     │                      │                        │
     │  5. 回傳新的 token   │                        │
     │<─────────────────────┤                        │
     │                      │                        │
     │  6. 儲存新 token     │                        │
     │                      │                        │
     │  7. 重試原本的請求   │                        │
     │     (帶新 token)     │                        │
     ├───────────────────────────────────────────────>│
     │                      │                        │
     │  8. 成功回應         │                        │
     │<───────────────────────────────────────────────┤
     │                      │                        │
```

### 自動刷新實作

```typescript
// lib/api-client.ts
export async function apiClient(url: string, options: RequestInit = {}) {
  const supabase = createClientComponentClient();
  
  // 取得 session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  // 第一次嘗試
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  // 如果 401，嘗試刷新 token
  if (response.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session) {
      // 刷新失敗，需要重新登入
      router.push('/login');
      throw new Error('Session expired');
    }

    // 用新 token 重試
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${data.session.access_token}`,
      },
    });
  }

  return response;
}
```

---

## 📊 登出流程

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  使用者  │         │   Next.js    │         │   Supabase   │
│          │         │    前端      │         │     Auth     │
└────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                      │                        │
     │  1. 點擊登出         │                        │
     ├─────────────────────>│                        │
     │                      │                        │
     │                      │  2. supabase.auth      │
     │                      │     .signOut()         │
     │                      ├───────────────────────>│
     │                      │                        │
     │                      │                        │  3. 清除 session
     │                      │                        │
     │                      │  4. 確認               │
     │                      │<───────────────────────┤
     │                      │                        │
     │                      │  5. 清除本地 token     │
     │                      │                        │
     │  6. 跳轉到登入頁     │                        │
     │<─────────────────────┤                        │
     │                      │                        │
```

### 程式碼範例

```typescript
// components/logout-button.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>
      登出
    </button>
  );
}
```

---

## 🔒 安全性考量

### 1. HTTPS Only
- ✅ 生產環境必須使用 HTTPS
- ✅ 防止 token 在傳輸中被攔截

### 2. Token 儲存
```typescript
// ✅ 好的做法：使用 httpOnly cookie（由 Supabase Auth Helpers 自動處理）
// ✅ 可接受：localStorage（開發階段）
// ❌ 不好：localStorage in production（容易被 XSS 攻擊）
```

### 3. CORS 設定
```typescript
// NestJS main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true,
});
```

### 4. Token 驗證
- ✅ 每次請求都驗證 token
- ✅ 檢查 token 有效期限
- ✅ 檢查簽章
- ✅ 使用正確的 JWT Secret

### 5. 使用者權限檢查
```typescript
// ✅ 確保使用者只能存取自己的資料
async findAll(userId: string) {
  return this.prisma.transaction.findMany({
    where: { userId }  // 必須過濾 userId！
  });
}

// ❌ 危險：沒有 userId 過濾
async findAll() {
  return this.prisma.transaction.findMany();  // 會回傳所有使用者的資料！
}
```

---

## 🛠️ 實作檢查清單

### Supabase 設定
- [ ] 建立 Supabase 專案
- [ ] 取得 API URL 和 anon key
- [ ] 取得 JWT Secret（在 Settings → API）
- [ ] 設定 Email templates（可選）

### Next.js 前端
- [ ] 安裝 `@supabase/auth-helpers-nextjs`
- [ ] 設定環境變數（`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] 建立 Supabase client
- [ ] 實作註冊頁面
- [ ] 實作登入頁面
- [ ] 實作登出功能
- [ ] 實作 Protected Routes

### NestJS 後端
- [ ] 安裝 `@nestjs/passport`, `passport`, `passport-jwt`
- [ ] 設定環境變數（`SUPABASE_JWT_SECRET`）
- [ ] 建立 `SupabaseJwtStrategy`
- [ ] 建立 `SupabaseAuthGuard`
- [ ] 在 Controller 使用 `@UseGuards()`
- [ ] 實作 User decorator（可選但推薦）
- [ ] 設定 CORS

### 測試
- [ ] 測試註冊流程
- [ ] 測試登入流程
- [ ] 測試 token 驗證
- [ ] 測試未授權存取（應回傳 401）
- [ ] 測試 token 過期處理
- [ ] 測試登出流程

---

## 📚 參考資源

- [Supabase Auth 文檔](https://supabase.com/docs/guides/auth)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
- [JWT.io](https://jwt.io/) - JWT decoder 工具
