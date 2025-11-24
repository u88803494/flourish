# Supabase-first 架構總覽

**狀態**: ✅ 完整

---

## 🎯 架構概述

Flourish 採用 **Supabase-first 架構**，使用 Supabase 作為主要後端，取代傳統的自訂 API 伺服器。這個決策是在 Sprint 8 經過完整評估後做出的（參見 [ADR 001](../../decisions/001-architecture-simplification.md)），旨在簡化開發流程、降低維護成本，並加速產品迭代。

### 核心理念

1. **簡化優於複雜**：使用 Supabase 提供的功能，避免重新發明輪子
2. **安全優先**：在資料庫層級強制執行權限控制（RLS）
3. **成本效益**：利用 Supabase 免費層級（Release 0-1 階段）
4. **快速迭代**：減少 60% 開發時間，專注於業務邏輯

### 適用場景

**Flourish 符合 Supabase-first 架構的特徵**：

- ✅ 標準 CRUD 操作為主（交易記錄、分類管理）
- ✅ 使用 Supabase Auth（Email/Password 登入）
- ✅ 簡單到中等權限需求（使用者資料隔離）
- ✅ 快速原型驗證與迭代
- ✅ 小型團隊或獨立開發者

**不適合的場景**：

- ❌ 複雜的多步驟業務邏輯
- ❌ 大量第三方 API 整合（需要隱藏 API keys）
- ❌ 複雜的背景任務處理
- ❌ 需要自訂協議或非 HTTP 通訊

---

## 📐 架構圖

### 整體架構

```
┌─────────────────────────────────────────────┐
│           Frontend (Vercel)                  │
│  ┌─────────┐            ┌─────────┐        │
│  │  Flow   │            │  Apex   │        │
│  │ (3100)  │            │ (3200)  │        │
│  └────┬────┘            └────┬────┘        │
│       │                      │              │
│       └──────────┬───────────┘              │
└──────────────────┼──────────────────────────┘
                   │
                   │ Supabase JS Client
                   │ (@repo/supabase-client)
                   │
┌──────────────────▼──────────────────────────┐
│            Supabase                          │
│  ┌──────────────────────────────────────┐  │
│  │  PostgreSQL Database                  │  │
│  │  + Row Level Security (RLS)          │  │
│  │  + Triggers & Functions               │  │
│  │  + Indexes                            │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Auto-generated REST API             │  │
│  │  (PostgREST)                         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Supabase Auth                        │  │
│  │  (GoTrue)                            │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Storage                              │  │
│  │  (S3-compatible)                     │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Edge Functions (Deno)                │  │
│  │  (未來使用)                           │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 資料流程

```
1. 使用者操作
   │
   ▼
2. Next.js App Router
   │
   ├─ Server Components     (SSR, getUser from server)
   │  └─ createServerClient() → Supabase
   │
   └─ Client Components     (CSR, useUser from client)
      └─ createBrowserClient() → Supabase
         │
         ▼
3. Supabase JS Client
   │
   ├─ Auth: signIn, signUp, signOut
   ├─ Database: .from('table').select()
   ├─ Storage: .from('bucket').upload()
   └─ Realtime: .channel().on()
         │
         ▼
4. Supabase Backend
   │
   ├─ Auth (GoTrue)         → 驗證 JWT token
   ├─ API (PostgREST)       → 轉換為 SQL query
   ├─ RLS Policies          → 檢查權限
   ├─ Database (PostgreSQL) → 執行查詢
   └─ Response              → 返回結果
```

---

## 🔑 核心組件

### 1. PostgreSQL Database

**角色**：Flourish 的主要資料儲存層

**關鍵特性**：

1. **完整的 SQL 功能**
   - 支援 JSON/JSONB 類型
   - 強大的查詢能力（JOIN、聚合、子查詢）
   - 事務支援（ACID 保證）

2. **資料模型**（7 個主要資料表）

   ```sql
   -- 核心資料表
   users           -- 使用者帳號
   cards           -- 信用卡/金融卡
   categories      -- 交易分類
   transactions    -- 交易記錄
   statements      -- 帳單
   recurring_expenses  -- 定期支出
   saving_rules    -- 儲蓄規則
   ```

3. **資料完整性**
   - Foreign Key Constraints（外鍵約束）
   - NOT NULL Constraints（非空約束）
   - Check Constraints（檢查約束，如金額 > 0）
   - Unique Constraints（唯一性約束）

4. **自動化機制**
   - `created_at` / `updated_at` 自動時間戳
   - Triggers 自動更新 `updated_at`
   - UUID 主鍵自動生成（`gen_random_uuid()`）

**資料庫函數範例**：

```sql
-- 計算月度支出（PostgreSQL Function）
CREATE OR REPLACE FUNCTION get_monthly_spending(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'EXPENSE'
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
$$ LANGUAGE SQL STABLE;

-- 前端調用
const { data } = await supabase.rpc('get_monthly_spending', {
  p_user_id: userId,
  p_year: 2024,
  p_month: 11,
});
```

**最佳實踐**：

- ✅ 使用 migrations 管理 schema 變更
- ✅ 建立適當的索引提升查詢效能
- ✅ 使用 Database Functions 處理複雜計算
- ✅ 定期備份資料（Supabase 自動每日備份）

**效能優化**：

```sql
-- 索引策略（已在 migration 中實作）
CREATE INDEX idx_transactions_user_date
  ON transactions(user_id, date DESC);

CREATE INDEX idx_transactions_category
  ON transactions(category_id);

CREATE INDEX idx_cards_user
  ON cards(user_id);
```

---

### 2. Row Level Security (RLS)

**角色**：資料庫層級的權限控制，確保使用者只能存取自己的資料

**核心概念**：

每個 SQL 查詢都會自動應用 RLS policy，在資料庫層級強制執行權限檢查。即使前端程式碼有漏洞，也無法繞過 RLS 限制。

**RLS 策略範例**：

```sql
-- 1. 啟用 RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 2. 定義策略：使用者只能存取自己的交易
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);
```

**RLS 工作原理**：

```
1. 前端發送請求：
   supabase.from('transactions').select('*')

2. Supabase 解析 JWT token：
   auth.uid() = '550e8400-e29b-41d4-a716-446655440000'

3. 自動添加 WHERE 子句：
   SELECT * FROM transactions
   WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'

4. 即使前端嘗試查詢其他使用者資料也會被阻擋：
   SELECT * FROM transactions WHERE user_id = 'other-user-id'
   → 返回空結果或錯誤（取決於 policy 設定）
```

**Flourish 的 RLS 策略設計**：

| 資料表             | SELECT | INSERT  | UPDATE  | DELETE  |
| ------------------ | ------ | ------- | ------- | ------- |
| users              | 僅自己 | Service | Service | Service |
| cards              | 僅自己 | 僅自己  | 僅自己  | 僅自己  |
| categories         | 僅自己 | 僅自己  | 僅自己  | 僅自己  |
| transactions       | 僅自己 | 僅自己  | 僅自己  | 僅自己  |
| statements         | 僅自己 | 僅自己  | 僅自己  | 僅自己  |
| recurring_expenses | 僅自己 | 僅自己  | 僅自己  | 僅自己  |
| saving_rules       | 僅自己 | 僅自己  | 僅自己  | 僅自己  |

**安全性優勢**：

1. **防止資料洩漏**：即使有 SQL injection 也無法存取其他使用者資料
2. **統一權限管理**：無需在前端和 API 重複驗證邏輯
3. **強制執行**：無法繞過，即使直接操作資料庫
4. **審計友善**：可在資料庫層級追蹤所有存取

**效能考量**：

```sql
-- ✅ 良好：RLS policy 使用索引欄位
CREATE POLICY "policy" ON transactions
  USING (auth.uid() = user_id);  -- user_id 有索引

-- ❌ 不好：RLS policy 使用複雜子查詢（避免）
CREATE POLICY "policy" ON transactions
  USING (
    user_id IN (
      SELECT id FROM users WHERE email LIKE '%@example.com'
    )
  );  -- 每次查詢都要執行子查詢，效能差
```

---

### 3. Auto-generated REST API (PostgREST)

**角色**：自動將 PostgreSQL 資料表轉換為 RESTful API

**核心特性**：

1. **自動生成**
   - 無需手寫 CRUD endpoints
   - Schema 變更立即反映到 API
   - 自動生成 OpenAPI 規格

2. **豐富的查詢語法**

   ```typescript
   // 基礎查詢
   const { data } = await supabase.from('transactions').select('*');

   // 過濾
   const { data } = await supabase
     .from('transactions')
     .select('*')
     .eq('type', 'EXPENSE')
     .gte('amount', 100)
     .lte('amount', 1000);

   // JOIN (使用外鍵關係)
   const { data } = await supabase.from('transactions').select(`
       *,
       category:categories(*),
       card:cards(*)
     `);

   // 排序與分頁
   const { data } = await supabase
     .from('transactions')
     .select('*')
     .order('date', { ascending: false })
     .range(0, 9); // 第 1-10 筆

   // 聚合（透過 RPC）
   const { data } = await supabase.rpc('get_monthly_spending', {
     p_user_id: userId,
     p_year: 2024,
     p_month: 11,
   });
   ```

3. **類型安全**

   ```typescript
   // 自動生成的類型
   const { data } = await supabase.from('transactions').select('*').single();

   // data 的類型自動推斷為 Transaction
   ```

**請求流程**：

```
1. 前端調用 Supabase Client
   supabase.from('transactions').select('*').eq('type', 'EXPENSE')

2. 轉換為 HTTP 請求
   GET /rest/v1/transactions?type=eq.EXPENSE
   Headers: {
     apikey: 'SUPABASE_ANON_KEY',
     Authorization: 'Bearer <JWT>'
   }

3. PostgREST 解析請求
   - 驗證 JWT token
   - 解析查詢參數
   - 應用 RLS policies

4. 生成 SQL 查詢
   SELECT * FROM transactions
   WHERE type = 'EXPENSE'
     AND user_id = auth.uid();  -- RLS 自動添加

5. 執行查詢並返回 JSON
   {
     "data": [...],
     "error": null
   }
```

**限制與考量**：

| 限制                   | 說明                       | 解決方案                |
| ---------------------- | -------------------------- | ----------------------- |
| 複雜查詢               | 多層 JOIN 可能效能不佳     | 使用 Database Functions |
| 客戶端邏輯             | 商業邏輯需在前端或 DB 處理 | Edge Functions          |
| 請求大小               | 單次請求有大小限制         | 分頁查詢                |
| 無法隱藏 API structure | 資料表結構對外可見         | RLS 保護敏感資料        |

**最佳實踐**：

```typescript
// ✅ 好：選擇性查詢，只取需要的欄位
const { data } = await supabase
  .from('transactions')
  .select('id, merchant_name, amount, date')
  .limit(20);

// ❌ 不好：查詢所有資料
const { data } = await supabase.from('transactions').select('*'); // 可能返回大量不需要的資料

// ✅ 好：使用 RPC 處理複雜聚合
const { data } = await supabase.rpc('calculate_monthly_stats', {
  user_id: userId,
  year: 2024,
});

// ❌ 不好：在客戶端處理聚合
const { data: allTransactions } = await supabase.from('transactions').select('*');
const total = allTransactions.reduce((sum, tx) => sum + tx.amount, 0);
```

---

### 4. Supabase Auth (GoTrue)

**角色**：完整的使用者認證與授權系統

**核心功能**：

1. **Email/Password 認證**（Flourish 使用）

   ```typescript
   // 註冊
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'secure-password-123',
   });

   // 登入
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'secure-password-123',
   });

   // 登出
   const { error } = await supabase.auth.signOut();

   // 取得當前使用者
   const {
     data: { user },
   } = await supabase.auth.getUser();
   ```

2. **Session 管理**

   ```typescript
   // 檢查 session
   const {
     data: { session },
   } = await supabase.auth.getSession();

   // 監聽 auth state 變化
   supabase.auth.onAuthStateChange((event, session) => {
     if (event === 'SIGNED_IN') {
       console.log('User signed in:', session.user);
     }
     if (event === 'SIGNED_OUT') {
       console.log('User signed out');
     }
     if (event === 'TOKEN_REFRESHED') {
       console.log('Token refreshed');
     }
   });

   // 手動刷新 token
   const { data, error } = await supabase.auth.refreshSession();
   ```

3. **Token 機制**
   - **Access Token**：短期 JWT（預設 1 小時），用於 API 請求
   - **Refresh Token**：長期 token（預設 30 天），用於刷新 access token
   - **自動刷新**：Supabase Client 自動處理 token 刷新

4. **JWT Payload**

   ```json
   {
     "sub": "550e8400-e29b-41d4-a716-446655440000", // user.id
     "email": "user@example.com",
     "role": "authenticated",
     "iat": 1700000000,
     "exp": 1700003600 // 1 小時後過期
   }
   ```

**認證流程**：

```
1. 使用者登入
   ↓
2. Supabase Auth 驗證帳號密碼
   ↓
3. 生成 JWT token (Access Token + Refresh Token)
   ↓
4. 儲存 token 到 localStorage (瀏覽器端)
   ↓
5. 每次 API 請求自動附帶 JWT token
   Authorization: Bearer <access-token>
   ↓
6. Supabase 驗證 JWT 並執行 RLS policies
   ↓
7. Access token 過期前自動刷新（透過 Refresh Token）
```

**Next.js 整合**：

```typescript
// Server Component (SSR)
import { createServerClient } from '@repo/supabase-client/lib/server';

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.email}</div>;
}

// Client Component (CSR)
'use client';

import { createBrowserClient } from '@repo/supabase-client/lib/client';
import { useEffect, useState } from 'react';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return user ? <div>Hello, {user.email}</div> : <div>Loading...</div>;
}

// Middleware (保護路由)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@repo/supabase-client/lib/server';

export async function middleware(request: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 未登入時重新導向至登入頁
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*'],
};
```

**安全性特性**：

1. **Email 驗證**（可選）
   - 註冊後發送驗證 email
   - 未驗證的使用者無法登入

2. **密碼強度要求**
   - 最少 6 個字元（Supabase 預設）
   - 可自訂密碼規則

3. **Rate Limiting**
   - 防止暴力破解攻擊
   - 限制每小時登入嘗試次數

4. **Session 安全**
   - HttpOnly cookies（Server Components）
   - Secure flag（HTTPS only）
   - SameSite protection

**未來擴展**（Release 1 後考慮）：

- OAuth 登入（Google、GitHub）
- Magic Link（無密碼登入）
- 多因素認證（MFA/2FA）
- 密碼重設流程

---

### 5. Storage (S3-compatible)

**角色**：檔案儲存服務（PDF 上傳、使用者頭像等）

**Flourish 使用場景**（未來功能）：

1. **PDF 帳單上傳**
   - 使用者上傳信用卡帳單 PDF
   - 使用 AI 解析交易記錄
   - 儲存原始 PDF 供查閱

2. **使用者頭像**（可選）
   - 允許使用者上傳個人頭像
   - 壓縮並優化圖片

**Storage 結構設計**：

```
supabase-storage/
├── statements/           # 帳單 PDF
│   └── {user_id}/
│       ├── {statement_id}.pdf
│       └── {statement_id}_parsed.json
│
└── avatars/             # 使用者頭像
    └── {user_id}.jpg
```

**使用範例**：

```typescript
// 上傳檔案
const { data, error } = await supabase.storage
  .from('statements')
  .upload(`${userId}/${statementId}.pdf`, file, {
    contentType: 'application/pdf',
    upsert: false, // 不允許覆蓋
  });

// 下載檔案
const { data, error } = await supabase.storage
  .from('statements')
  .download(`${userId}/${statementId}.pdf`);

// 取得公開 URL
const { data } = supabase.storage.from('statements').getPublicUrl(`${userId}/${statementId}.pdf`);

// 刪除檔案
const { error } = await supabase.storage
  .from('statements')
  .remove([`${userId}/${statementId}.pdf`]);
```

**Storage Policies（權限控制）**：

```sql
-- 使用者只能上傳到自己的資料夾
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'statements'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 使用者只能查看自己的檔案
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'statements'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 使用者只能刪除自己的檔案
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'statements'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**容量與限制**：

| 項目     | 免費層級 | 說明                 |
| -------- | -------- | -------------------- |
| 儲存空間 | 1 GB     | 可儲存約 1000 個 PDF |
| 檔案大小 | 50 MB    | 單個檔案上傳限制     |
| 頻寬     | 2 GB     | 每月下載流量         |

**最佳實踐**：

```typescript
// ✅ 好：壓縮並限制檔案大小
async function uploadPdf(file: File, userId: string, statementId: string) {
  // 1. 驗證檔案大小
  if (file.size > 10 * 1024 * 1024) {
    // 10MB
    throw new Error('檔案大小超過 10MB');
  }

  // 2. 驗證檔案類型
  if (file.type !== 'application/pdf') {
    throw new Error('只允許上傳 PDF 檔案');
  }

  // 3. 上傳
  const { data, error } = await supabase.storage
    .from('statements')
    .upload(`${userId}/${statementId}.pdf`, file, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data;
}

// ❌ 不好：無驗證直接上傳
await supabase.storage.from('statements').upload(`${userId}/file.pdf`, file);
```

---

### 6. Edge Functions (Deno)

**角色**：Serverless functions 用於處理複雜業務邏輯（未來功能）

**Flourish 潛在使用場景**：

1. **PDF 解析**
   - 上傳 PDF 後觸發 Edge Function
   - 使用 AI/OCR 解析交易記錄
   - 自動建立 transactions

2. **定時任務**
   - 每日計算統計數據
   - 生成月度報告
   - 發送提醒通知

3. **第三方 API 整合**
   - 匯率轉換 API
   - Email 發送服務
   - 隱藏 API keys（不暴露給前端）

**Edge Function 範例**：

```typescript
// supabase/functions/parse-pdf/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    // 1. 驗證請求
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. 取得 PDF URL
    const { pdfUrl } = await req.json();

    // 3. 下載並解析 PDF
    const response = await fetch(pdfUrl);
    const pdfBuffer = await response.arrayBuffer();

    // TODO: 使用 AI 解析 PDF（如 OpenAI API）
    const transactions = await parsePdfWithAI(pdfBuffer);

    // 4. 寫入資料庫
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase.from('transactions').insert(transactions);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, count: transactions.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

**部署與調用**：

```bash
# 部署 Edge Function
supabase functions deploy parse-pdf

# 從前端調用
const { data, error } = await supabase.functions.invoke('parse-pdf', {
  body: { pdfUrl: 'https://...' },
});
```

**何時使用 Edge Functions**：

| 情境              | 是否使用 Edge Function   |
| ----------------- | ------------------------ |
| 簡單 CRUD         | ❌ 使用 Supabase API     |
| 複雜計算          | ⚠️ 優先考慮 DB Functions |
| 需要第三方 API    | ✅ 使用 Edge Functions   |
| 需要隱藏 API keys | ✅ 使用 Edge Functions   |
| 定時任務          | ✅ 使用 Edge Functions   |
| 圖片/PDF 處理     | ✅ 使用 Edge Functions   |
| Webhook 處理      | ✅ 使用 Edge Functions   |

**Edge Functions vs Database Functions**：

| 特性       | Edge Functions    | Database Functions |
| ---------- | ----------------- | ------------------ |
| 語言       | TypeScript (Deno) | SQL / PL/pgSQL     |
| 執行位置   | Edge (靠近使用者) | Database server    |
| 適合場景   | 複雜業務邏輯      | 資料庫計算         |
| 第三方整合 | ✅ 支援           | ❌ 限制多          |
| 效能       | 較慢（冷啟動）    | 快速               |
| 成本       | 按執行次數計費    | 包含在 DB 資源     |

---

## 💡 設計原則

### 1. 安全優先 (Security First)

**原則**：所有資料存取都必須通過 RLS 策略驗證

**實作**：

- ✅ 所有資料表啟用 RLS
- ✅ 明確定義 SELECT、INSERT、UPDATE、DELETE 策略
- ✅ 使用 `auth.uid()` 確保使用者資料隔離
- ✅ 敏感操作使用 Service Role Key（僅後端）

**反模式**：

```typescript
// ❌ 不好：信任前端傳入的 user_id
const { data } = await supabase.from('transactions').insert({
  user_id: request.userId, // 前端可能偽造
  amount: 100,
});

// ✅ 好：Server Action 中驗證並設定 user_id
('use server');
export async function createTransaction(amount: number) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  return await supabase.from('transactions').insert({
    user_id: user.id, // Server 端驗證後的真實 user_id
    amount,
  });
}
```

---

### 2. 成本效益 (Cost Efficiency)

**原則**：在 Release 0-1 階段使用免費資源，避免不必要的開銷

**Supabase 免費層級**：

| 資源                | 免費額度            | Flourish 預估使用 |
| ------------------- | ------------------- | ----------------- |
| 資料庫儲存          | 500 MB              | ~100 MB (充足)    |
| 檔案儲存            | 1 GB                | ~500 MB (充足)    |
| 月活躍使用者 (MAU)  | 50,000              | <1,000 (充足)     |
| 資料庫頻寬          | 5 GB                | ~2 GB (充足)      |
| Edge Functions 執行 | 500,000 invocations | 未使用            |

**成本比較**：

| 方案                | 月費用 | Release 0-1 適用性 |
| ------------------- | ------ | ------------------ |
| **Supabase Free**   | $0     | ✅ 完全足夠        |
| Supabase Pro        | $25    | Release 2+ 考慮    |
| ~~NestJS + Render~~ | $7+    | ❌ 已棄用          |
| ~~NestJS + Vercel~~ | $20+   | ❌ 成本過高        |

**成本優化策略**：

```typescript
// ✅ 好：選擇性查詢，減少頻寬
const { data } = await supabase
  .from('transactions')
  .select('id, merchant_name, amount, date') // 只取需要的欄位
  .limit(20);

// ❌ 不好：查詢所有資料
const { data } = await supabase
  .from('transactions')
  .select('*') // 浪費頻寬
  .limit(1000); // 返回過多資料

// ✅ 好：使用 Database Functions 處理聚合
const { data } = await supabase.rpc('get_stats'); // 1 次請求

// ❌ 不好：多次查詢後在客戶端聚合
const { data: tx1 } = await supabase.from('transactions').select('*');
const { data: tx2 } = await supabase.from('categories').select('*');
const { data: tx3 } = await supabase.from('cards').select('*');
// 3 次請求 + 客戶端計算
```

---

### 3. 開發效率 (Development Efficiency)

**原則**：減少重複性工作，專注於業務邏輯

**時間節省對比**：

| 任務                 | NestJS 時間 | Supabase 時間 | 節省    |
| -------------------- | ----------- | ------------- | ------- |
| 建立 CRUD endpoints  | 2 小時      | 0 分鐘        | 100%    |
| 認證系統             | 4 小時      | 30 分鐘       | 87.5%   |
| 權限控制             | 3 小時      | 1 小時        | 67%     |
| API 文檔             | 1 小時      | 自動生成      | 100%    |
| **總計（範例功能）** | **10 小時** | **1.5 小時**  | **85%** |

**開發流程比較**：

```
NestJS 開發流程：
1. 設計 API endpoint      (30 分鐘)
2. 撰寫 Controller       (30 分鐘)
3. 撰寫 Service          (45 分鐘)
4. 撰寫 DTO 驗證         (30 分鐘)
5. 撰寫單元測試          (1 小時)
6. 撰寫 E2E 測試         (1 小時)
7. 撰寫 API 文檔         (30 分鐘)
8. 部署更新              (30 分鐘)
-----------------------------------
總計：5 小時 15 分鐘

Supabase 開發流程：
1. 設計 database schema  (30 分鐘)
2. 撰寫 migration        (15 分鐘)
3. 前端呼叫 API          (15 分鐘)
4. 設定 RLS policies     (30 分鐘)
-----------------------------------
總計：1 小時 30 分鐘

節省：3 小時 45 分鐘 (71%)
```

**自動化優勢**：

- ✅ API 自動生成（PostgREST）
- ✅ TypeScript 類型自動生成（Supabase CLI）
- ✅ OpenAPI 規格自動生成
- ✅ Realtime subscriptions 內建支援
- ✅ Authentication 內建支援

---

### 4. 可擴展性 (Scalability)

**原則**：架構設計需考慮未來擴展需求

**垂直擴展**（升級 Supabase 方案）：

| 項目           | Free      | Pro     | Enterprise |
| -------------- | --------- | ------- | ---------- |
| 資料庫儲存     | 500 MB    | 8 GB    | 無限制     |
| 檔案儲存       | 1 GB      | 100 GB  | 無限制     |
| MAU            | 50,000    | 100,000 | 無限制     |
| Edge Functions | 500K/月   | 2M/月   | 無限制     |
| 支援           | Community | Email   | 專屬支援   |
| 價格           | $0/月     | $25/月  | 客製化     |

**水平擴展**（架構升級路徑）：

```
階段 1: Pure Supabase (現在)
Frontend → Supabase (Database + Auth + API)

階段 2: Supabase + Edge Functions (複雜邏輯需求)
Frontend → Supabase
         ↓
      Edge Functions (Deno)

階段 3: Supabase + Microservices (大規模需求)
Frontend → Supabase
         ↓
      Edge Functions
         ↓
      Microservices (NestJS/Go)
```

**效能擴展考量**：

```sql
-- ✅ 好：建立適當的索引
CREATE INDEX idx_transactions_user_date
  ON transactions(user_id, date DESC);

-- ✅ 好：使用 Database Functions 處理複雜查詢
CREATE OR REPLACE FUNCTION get_monthly_stats(p_user_id UUID)
RETURNS JSON AS $$
  -- 複雜的聚合邏輯
$$ LANGUAGE SQL STABLE;

-- ✅ 好：使用 Materialized Views 快取計算結果
CREATE MATERIALIZED VIEW monthly_spending_summary AS
SELECT
  user_id,
  DATE_TRUNC('month', date) AS month,
  SUM(amount) AS total_spending,
  COUNT(*) AS transaction_count
FROM transactions
WHERE type = 'EXPENSE'
GROUP BY user_id, DATE_TRUNC('month', date);

-- 定期刷新
REFRESH MATERIALIZED VIEW monthly_spending_summary;
```

**監控與優化**：

- ✅ 使用 Supabase Dashboard 監控查詢效能
- ✅ 追蹤慢查詢（>1 秒）並優化
- ✅ 定期檢查 RLS policy 效能
- ✅ 監控資料庫連線數
- ✅ 設定適當的 cache 策略

---

## 📊 與傳統架構比較

### NestJS + Render vs Supabase

| 面向         | NestJS + Render         | Supabase                    | 優勢           |
| ------------ | ----------------------- | --------------------------- | -------------- |
| **成本**     | $7+/月                  | $0/月 (免費層級)            | Supabase       |
| **維護**     | 雙環境 + API 程式碼     | 單一專案配置                | Supabase       |
| **開發速度** | 需手寫所有 endpoints    | 自動生成 API                | Supabase       |
| **安全性**   | 需自行實作 + 測試       | RLS 強制執行                | Supabase       |
| **擴展性**   | 高（完全自訂）          | 中（Supabase 限制內）       | NestJS         |
| **學習曲線** | 陡峭（NestJS + Prisma） | 平緩（SQL + Supabase docs） | Supabase       |
| **靈活性**   | 極高（任意業務邏輯）    | 中（Edge Functions 補充）   | NestJS         |
| **適合場景** | 複雜業務邏輯            | 標準 CRUD + 簡單邏輯        | 取決於專案需求 |

詳細比較請參見：[架構比較文檔](./comparison.md)

---

## 🔗 相關文檔

**架構設計**：

- [架構決策記錄 (ADR)](./decisions.md) - 所有架構決策的記錄
- [與 NestJS 比較](./comparison.md) - 詳細的技術比較
- [ADR 001: 架構簡化](../../decisions/001-architecture-simplification.md) - 遷移至 Supabase 的決策過程

**實作指南**：

- [本地開發環境](../guides/local-development.md) - 環境設定與開發工作流程
- [RLS 策略設計](../guides/rls-policies.md) - Row Level Security 實作指南
- [認證指南](../guides/authentication.md) - Supabase Auth 使用方式
- [遷移指南](../guides/migrations.md) - 資料庫 schema 變更流程

**API 參考**：

- [React Hooks API](../api-reference/hooks.md) - 前端資料存取 hooks
- [TypeScript Types](../api-reference/types.md) - 完整的類型定義
- [Query Patterns](../api-reference/query-patterns.md) - 查詢模式與最佳實踐
- [錯誤處理](../api-reference/error-handling.md) - 錯誤處理指南

---

## 🎯 下一步

1. **理解 RLS**：閱讀 [RLS 策略設計](../guides/rls-policies.md) 了解權限控制
2. **設定開發環境**：跟隨 [本地開發環境](../guides/local-development.md) 指南
3. **實作認證**：參考 [認證指南](../guides/authentication.md) 整合 Supabase Auth
4. **學習查詢模式**：查看 [Query Patterns](../api-reference/query-patterns.md) 掌握資料存取

---

**最後更新**: 2025-11-24
**Task 3 已完成**: 詳細架構說明、設計原則、核心組件、擴展策略
