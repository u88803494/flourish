# Supabase Edge Functions 使用指南

**狀態**: ✅ 已完成（Task 3）
**最後更新**: 2025-11-24

---

## 🎯 目標

了解何時以及如何使用 Supabase Edge Functions 實作複雜業務邏輯、第三方 API 整合、以及後端處理。

---

## 💡 Edge Functions 簡介

### 什麼是 Edge Functions？

**Supabase Edge Functions** 是基於 **Deno** 的 serverless functions，運行在全球邊緣節點上。

**核心特性**:

- **Serverless**: 無需管理伺服器，按使用量計費
- **Deno Runtime**: 使用現代 JavaScript/TypeScript runtime
- **全球部署**: 在靠近使用者的邊緣節點執行
- **與 Supabase 整合**: 原生存取 Supabase Database、Auth、Storage
- **快速部署**: 使用 Supabase CLI 一鍵部署

### Edge Functions vs 前端邏輯

| 項目           | 前端（Client-side） | Edge Functions（Server-side） |
| -------------- | ------------------- | ----------------------------- |
| **執行位置**   | 使用者瀏覽器        | Supabase 邊緣節點             |
| **安全性**     | ❌ 暴露給使用者     | ✅ 伺服器端執行               |
| **API Keys**   | ❌ 無法安全儲存     | ✅ 環境變數（安全）           |
| **複雜計算**   | ⚠️ 受瀏覽器限制     | ✅ 無限制                     |
| **第三方整合** | ❌ CORS 問題        | ✅ 無 CORS 限制               |
| **執行時間**   | ⚠️ 使用者網路影響   | ✅ 穩定快速                   |
| **成本**       | 免費（使用者資源）  | 按使用量計費                  |

### 使用時機

#### ✅ 應該使用 Edge Functions

1. **需要保護 API Keys**

   ```typescript
   // ✅ Edge Function（安全）
   const apiKey = Deno.env.get('OPENAI_API_KEY');
   const response = await fetch('https://api.openai.com', {
     headers: { Authorization: `Bearer ${apiKey}` },
   });
   ```

2. **第三方 API 整合**
   - 銀行 API 整合
   - 支付 API（Stripe、PayPal）
   - AI/ML API（OpenAI、Claude）
   - 郵件服務（SendGrid、Mailgun）

3. **複雜業務邏輯**
   - PDF 解析與資料提取
   - 複雜計算（統計分析、預測模型）
   - 多步驟工作流程
   - 資料轉換與驗證

4. **背景任務**
   - 定時任務（Cron jobs）
   - 批次處理
   - 資料同步
   - 報表生成

5. **Webhooks 處理**
   - 接收第三方服務回調
   - 處理支付通知
   - 處理外部事件

#### ❌ 不應該使用 Edge Functions

1. **簡單 CRUD 操作**

   ```typescript
   // ❌ 不需要 Edge Function（直接使用 Supabase Client）
   const { data } = await supabase.from('transactions').select('*');
   ```

2. **使用者認證**
   - Supabase Auth 已處理
   - 不需要額外的 Edge Function

3. **即時 UI 更新**
   - 使用 Realtime subscriptions 更合適

4. **靜態資料查詢**
   - 直接從前端查詢資料庫
   - RLS policies 保護安全

### 限制與注意事項

#### 執行限制

| 限制項目     | Free Tier | Pro Tier |
| ------------ | --------- | -------- |
| **執行時間** | 150 秒    | 400 秒   |
| **記憶體**   | 150 MB    | 150 MB   |
| **並發數**   | 50        | 500      |
| **請求大小** | 2 MB      | 2 MB     |
| **回應大小** | 2 MB      | 2 MB     |

#### 冷啟動時間

- **首次請求**: 1-3 秒（冷啟動）
- **後續請求**: < 100ms（熱啟動）
- **緩解策略**: 使用定時預熱（Cron jobs）

#### 成本考量

**Supabase Edge Functions 計費**:

- Free Tier: 500K 請求/月
- Pro Tier: 2M 請求/月（包含在 $25/月內）
- 超額: $2 / 100K 請求

**實際影響（Flourish）**:

- Release 0-1 預期請求 < 10K/月
- 完全在 Free Tier 範圍內
- 即使付費，成本也極低（< $1/月）

---

## 📋 基本使用範例

### Hello World

```typescript
// supabase/functions/hello-world/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { name } = await req.json();

  const data = {
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**部署**:

```bash
npx supabase functions deploy hello-world
```

**調用**:

```typescript
// 前端
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Henry' },
});
```

### 使用者認證

```typescript
// supabase/functions/protected-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // 1. 創建 Supabase client（使用使用者的 token）
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  // 2. 驗證使用者
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. 執行業務邏輯
  const data = {
    message: `Hello ${user.email}!`,
    userId: user.id,
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### 資料庫存取

```typescript
// supabase/functions/get-user-stats/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  // 驗證使用者
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // 查詢使用者統計（複雜計算，適合 Edge Function）
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // 計算統計
  const stats = {
    total: transactions.length,
    totalIncome: transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### 第三方 API 整合

```typescript
// supabase/functions/analyze-spending/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  // 驗證使用者
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // 獲取使用者最近的交易
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(10);

  // 調用 OpenAI API 分析（使用環境變數中的 API Key）
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
    });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor. Analyze the spending patterns and provide insights.',
        },
        {
          role: 'user',
          content: `Here are my recent transactions: ${JSON.stringify(transactions)}`,
        },
      ],
    }),
  });

  const aiAnalysis = await response.json();

  return new Response(JSON.stringify(aiAnalysis), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 🚀 完整開發流程

### 1. 本地開發

#### 創建新 Function

```bash
# 創建新的 Edge Function
npx supabase functions new my-function

# 生成的檔案結構
supabase/
└── functions/
    └── my-function/
        └── index.ts
```

#### 本地運行

```bash
# 啟動本地 Edge Functions
npx supabase functions serve

# 指定 Function
npx supabase functions serve my-function --env-file ./supabase/.env.local
```

#### 測試

```bash
# 使用 curl 測試
curl -i --location --request POST 'http://localhost:54321/functions/v1/my-function' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"test"}'
```

或使用 Supabase Client:

```typescript
// 前端測試
const { data, error } = await supabase.functions.invoke('my-function', {
  body: { name: 'test' },
});
console.log(data, error);
```

### 2. 環境變數設置

#### 本地環境

```bash
# supabase/.env.local
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
```

#### 遠端環境

```bash
# 設置 secret（生產環境）
npx supabase secrets set OPENAI_API_KEY=sk-...
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# 列出 secrets
npx supabase secrets list

# 刪除 secret
npx supabase secrets unset OPENAI_API_KEY
```

### 3. 部署

#### 部署到 Supabase

```bash
# 部署單一 Function
npx supabase functions deploy my-function

# 部署所有 Functions
npx supabase functions deploy

# 查看部署狀態
npx supabase functions list
```

#### 部署輸出

```
Deploying Function (project: fstcioczrehqtcbdzuij)...
  ✓ my-function deployed successfully

Function URL: https://fstcioczrehqtcbdzuij.functions.supabase.co/my-function
```

### 4. 監控與日誌

```bash
# 查看 Function 日誌
npx supabase functions logs my-function

# 實時監控日誌
npx supabase functions logs my-function --follow
```

**Supabase Dashboard**:

1. 進入 Supabase Dashboard
2. 選擇 "Edge Functions"
3. 查看：
   - 執行次數
   - 錯誤率
   - 平均執行時間
   - 詳細日誌

---

## 🎯 Flourish 潛在使用場景

Flourish 當前（Release 0-1）不使用 Edge Functions，但未來可能用於：

### 1. PDF 解析（AI 提取交易）

**場景**: 使用者上傳銀行對帳單 PDF，自動提取交易記錄

```typescript
// supabase/functions/parse-statement-pdf/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  // 驗證使用者
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // 獲取上傳的 PDF URL
  const { pdfUrl } = await req.json();

  // 從 Supabase Storage 下載 PDF
  const { data: pdfBlob, error: storageError } = await supabase.storage
    .from('statements')
    .download(pdfUrl);

  if (storageError) {
    return new Response(JSON.stringify({ error: storageError.message }), {
      status: 500,
    });
  }

  // 使用 OpenAI API 解析 PDF（GPT-4 Vision 或專用 API）
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const pdfBuffer = await pdfBlob.arrayBuffer();
  const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content:
            'Extract transactions from this bank statement. Return JSON array with date, description, amount.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${base64Pdf}`,
              },
            },
          ],
        },
      ],
    }),
  });

  const aiResult = await aiResponse.json();
  const transactions = JSON.parse(aiResult.choices[0].message.content);

  // 批次插入交易記錄
  const { data: insertedTransactions, error: insertError } = await supabase
    .from('transactions')
    .insert(
      transactions.map((t: any) => ({
        user_id: user.id,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.amount > 0 ? 'INCOME' : 'EXPENSE',
      }))
    )
    .select();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      transactionsCreated: insertedTransactions.length,
      transactions: insertedTransactions,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
```

**前端調用**:

```typescript
// 1. 上傳 PDF 到 Storage
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('statements')
  .upload(`statements/${userId}/${Date.now()}.pdf`, pdfFile);

// 2. 調用 Edge Function 解析
const { data, error } = await supabase.functions.invoke('parse-statement-pdf', {
  body: { pdfUrl: uploadData.path },
});

console.log(`Created ${data.transactionsCreated} transactions`);
```

### 2. 複雜計算（預算建議）

**場景**: 根據歷史數據生成個性化預算建議

```typescript
// supabase/functions/generate-budget-advice/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // 獲取過去 6 個月的交易數據
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .gte('date', sixMonthsAgo.toISOString())
    .order('date', { ascending: true });

  // 統計分析
  const categorySpending = transactions.reduce((acc, t) => {
    if (t.type === 'EXPENSE') {
      const category = t.category?.name || 'Other';
      acc[category] = (acc[category] || 0) + t.amount;
    }
    return acc;
  }, {});

  const monthlyAverage = Object.entries(categorySpending).reduce((acc, [category, total]) => {
    acc[category] = total / 6; // 6 個月平均
    return acc;
  }, {});

  // 使用 AI 生成個性化建議
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor. Provide personalized budget advice based on spending patterns.',
        },
        {
          role: 'user',
          content: `Monthly average spending by category: ${JSON.stringify(monthlyAverage)}. Provide budget recommendations.`,
        },
      ],
    }),
  });

  const aiResult = await aiResponse.json();
  const advice = aiResult.choices[0].message.content;

  return new Response(
    JSON.stringify({
      monthlyAverage,
      advice,
      analysisDate: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
```

### 3. 第三方 API 整合（銀行 API）

**場景**: 連接銀行 API 自動同步交易

```typescript
// supabase/functions/sync-bank-transactions/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { bankAccountId } = await req.json();

  // 從資料庫獲取銀行帳戶資訊（包含加密的 access token）
  const { data: bankAccount } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('id', bankAccountId)
    .eq('user_id', user.id)
    .single();

  if (!bankAccount) {
    return new Response(JSON.stringify({ error: 'Bank account not found' }), { status: 404 });
  }

  // 調用銀行 API（例如 Plaid）
  const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
  const plaidSecret = Deno.env.get('PLAID_SECRET');

  const plaidResponse = await fetch('https://sandbox.plaid.com/transactions/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: plaidClientId,
      secret: plaidSecret,
      access_token: bankAccount.access_token,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    }),
  });

  const plaidData = await plaidResponse.json();
  const transactions = plaidData.transactions;

  // 批次插入新交易（避免重複）
  const newTransactions = [];
  for (const t of transactions) {
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('external_id', t.transaction_id)
      .single();

    if (!existing) {
      newTransactions.push({
        user_id: user.id,
        external_id: t.transaction_id,
        date: t.date,
        description: t.name,
        amount: t.amount,
        type: t.amount > 0 ? 'INCOME' : 'EXPENSE',
      });
    }
  }

  const { data: insertedTransactions, error: insertError } = await supabase
    .from('transactions')
    .insert(newTransactions)
    .select();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      newTransactions: insertedTransactions.length,
      totalTransactions: transactions.length,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
```

### 4. 定時任務（Cron Jobs）

**場景**: 每日自動生成報表並發送郵件

```typescript
// supabase/functions/daily-report/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // 驗證是否為 Cron Job（使用 secret header）
  const cronSecret = req.headers.get('x-cron-secret');
  if (cronSecret !== Deno.env.get('CRON_SECRET')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // 使用 Service Role Key
  );

  // 獲取所有啟用每日報表的使用者
  const { data: users } = await supabase.from('users').select('*').eq('daily_report_enabled', true);

  const sendGridKey = Deno.env.get('SENDGRID_API_KEY');
  let sentCount = 0;

  for (const user of users) {
    // 獲取昨日交易統計
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', yesterday.toISOString())
      .lt('date', today.toISOString());

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // 發送郵件（使用 SendGrid）
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendGridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: user.email }],
            subject: `Flourish Daily Report - ${yesterday.toLocaleDateString()}`,
          },
        ],
        from: { email: 'noreply@flourish.app' },
        content: [
          {
            type: 'text/html',
            value: `
              <h1>Your Daily Financial Report</h1>
              <p>Date: ${yesterday.toLocaleDateString()}</p>
              <p>Total Income: $${totalIncome.toFixed(2)}</p>
              <p>Total Expense: $${totalExpense.toFixed(2)}</p>
              <p>Net: $${(totalIncome - totalExpense).toFixed(2)}</p>
              <p>Total Transactions: ${transactions.length}</p>
            `,
          },
        ],
      }),
    });

    if (emailResponse.ok) {
      sentCount++;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      reportsSent: sentCount,
      totalUsers: users.length,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
```

**設置 Cron Job**:

在 Supabase Dashboard 或使用外部服務（如 GitHub Actions、Vercel Cron）:

```yaml
# .github/workflows/daily-report.yml
name: Daily Report Cron

on:
  schedule:
    - cron: '0 9 * * *' # 每天 9:00 UTC

jobs:
  trigger-report:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            https://fstcioczrehqtcbdzuij.functions.supabase.co/daily-report \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}"
```

---

## ⚠️ 注意事項與最佳實踐

### 冷啟動優化

#### 問題

- **首次請求**: 1-3 秒冷啟動時間
- **影響**: 使用者體驗差

#### 解決方案

1. **預熱策略（Keep-Warm）**:

   ```typescript
   // 定時預熱 Function（每 5 分鐘）
   // 使用 GitHub Actions 或 Vercel Cron
   ```

2. **快取策略**:

   ```typescript
   // 使用 Deno KV 或 Redis 快取結果
   const cached = await kv.get(['result', userId]);
   if (cached) return cached.value;

   const result = await expensiveOperation();
   await kv.set(['result', userId], result, { expireIn: 3600 });
   ```

3. **使用者體驗優化**:

   ```typescript
   // 前端顯示載入狀態
   const [loading, setLoading] = useState(false);

   const handleAnalyze = async () => {
     setLoading(true);
     try {
       const { data } = await supabase.functions.invoke('analyze-spending');
       setResult(data);
     } finally {
       setLoading(false);
     }
   };
   ```

### 執行時間限制

#### 問題

- Free Tier: 150 秒
- Pro Tier: 400 秒

#### 解決方案

1. **拆分長時間任務**:

   ```typescript
   // ❌ 不好：單一 Function 處理所有
   async function processAllTransactions() {
     const transactions = await fetchAll(); // 10000 筆
     for (const t of transactions) {
       await expensiveOperation(t); // 可能超時
     }
   }

   // ✅ 好：批次處理
   async function processBatch(batchId: number) {
     const transactions = await fetchBatch(batchId, 100); // 每次 100 筆
     for (const t of transactions) {
       await expensiveOperation(t);
     }
   }
   ```

2. **使用佇列系統**:

   ```typescript
   // Function 1: 接收請求並加入佇列
   async function enqueueTask(taskData) {
     await supabase.from('task_queue').insert({ data: taskData });
     return { taskId: '...' };
   }

   // Function 2: Cron Job 處理佇列
   async function processQueue() {
     const tasks = await supabase.from('task_queue').select('*').eq('status', 'pending').limit(10);

     for (const task of tasks) {
       await processTask(task);
       await supabase.from('task_queue').update({ status: 'completed' }).eq('id', task.id);
     }
   }
   ```

### 錯誤處理

```typescript
// supabase/functions/my-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    // 業務邏輯
    const result = await businessLogic();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // 記錄錯誤
    console.error('Error in my-function:', error);

    // 返回友善的錯誤訊息
    return new Response(
      JSON.stringify({
        error: 'An error occurred processing your request',
        message: error.message, // 開發環境可以返回詳細錯誤
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### 安全最佳實踐

1. **驗證所有輸入**:

   ```typescript
   const { data } = await req.json();

   // 使用 Zod 驗證
   import { z } from 'https://deno.land/x/zod/mod.ts';

   const schema = z.object({
     amount: z.number().positive(),
     description: z.string().min(1).max(100),
   });

   const validated = schema.parse(data);
   ```

2. **限制 CORS**:

   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': 'https://flourish.app', // 只允許特定 origin
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   };

   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }

   return new Response(JSON.stringify(data), {
     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
   });
   ```

3. **Rate Limiting**:

   ```typescript
   // 使用 Supabase Database 追蹤請求
   const { count } = await supabase
     .from('function_calls')
     .select('*', { count: 'exact', head: true })
     .eq('user_id', user.id)
     .gte('created_at', new Date(Date.now() - 60000).toISOString()); // 最近 1 分鐘

   if (count > 10) {
     return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
       status: 429,
     });
   }
   ```

### 成本優化

1. **減少外部 API 調用**:

   ```typescript
   // ✅ 使用快取避免重複調用
   const cacheKey = `ai-analysis-${userId}-${date}`;
   const cached = await getCached(cacheKey);
   if (cached) return cached;

   const result = await callOpenAI();
   await setCached(cacheKey, result, 3600); // 快取 1 小時
   ```

2. **批次處理**:

   ```typescript
   // ✅ 批次插入而非逐筆
   const { data } = await supabase.from('transactions').insert(transactions); // 批次插入
   ```

3. **監控使用量**:
   ```typescript
   // 使用 Supabase Dashboard 監控
   // 或設置自訂監控
   await supabase.from('function_metrics').insert({
     function_name: 'my-function',
     execution_time_ms: executionTime,
     success: true,
   });
   ```

---

## 🔗 相關文檔

### 官方文檔

- [Supabase Edge Functions 官方文檔](https://supabase.com/docs/guides/functions)
- [Deno Runtime 文檔](https://deno.land/manual)
- [Supabase CLI 文檔](https://supabase.com/docs/reference/cli/introduction)

### Flourish 架構文檔

- [架構總覽](../architecture/overview.md)
- [架構決策記錄](../architecture/decisions.md)（ADR 001 - 遷移路徑）
- [架構比較](../architecture/comparison.md)（Supabase vs NestJS）

### 相關指南

- [本地開發設置](./local-development.md)
- [認證整合](./authentication.md)
- [錯誤處理](../api-reference/error-handling.md)

---

## 📊 決策指南：何時使用 Edge Functions？

### 決策樹

```
需要處理敏感資料（API keys）？
├─ 是 → 使用 Edge Functions ✅
└─ 否 → 繼續評估

需要第三方 API 整合？
├─ 是 → 使用 Edge Functions ✅
└─ 否 → 繼續評估

需要複雜計算（> 1 秒）？
├─ 是 → 使用 Edge Functions ✅
└─ 否 → 繼續評估

需要背景任務或定時執行？
├─ 是 → 使用 Edge Functions ✅
└─ 否 → 直接使用 Supabase Client 🚀
```

### 快速參考

| 使用情況   | 建議方案                   |
| ---------- | -------------------------- |
| 簡單 CRUD  | ❌ 不需要 Edge Functions   |
| 使用者認證 | ❌ 使用 Supabase Auth      |
| 複雜查詢   | ❌ 使用 Database Functions |
| AI/ML 整合 | ✅ Edge Functions          |
| 第三方 API | ✅ Edge Functions          |
| PDF 解析   | ✅ Edge Functions          |
| 定時任務   | ✅ Edge Functions          |
| Webhooks   | ✅ Edge Functions          |

---

**最後更新**: 2025-11-24
**狀態**: ✅ 已完成（Task 3）
**適用版本**: Flourish Release 0-1+
**未來實施**: Edge Functions 將在 Release 2+ 根據實際需求引入
