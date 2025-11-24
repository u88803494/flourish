# Row Level Security (RLS) 策略設計指南

**狀態**: ✅ 完整（Sprint 14 Task 3）

---

## 🎯 目標

設計安全且高效的 Row Level Security 策略，確保使用者資料隔離，在資料庫層級強制執行存取控制。

**核心原則**：

- 每個使用者只能存取自己的資料
- 在資料庫層級強制執行（無法繞過）
- 效能優先（使用適當的索引）
- 可測試、可維護

---

## 🔐 RLS 基礎概念

### 什麼是 RLS？

Row Level Security (RLS) 是 PostgreSQL 的安全機制，在**資料庫層級**強制執行每一行資料的存取控制。

**與應用層權限控制的差異**：

| 比較項目     | 應用層權限                   | RLS（資料庫層）          |
| ------------ | ---------------------------- | ------------------------ |
| **執行位置** | 應用程式程式碼               | PostgreSQL 資料庫        |
| **繞過風險** | 高（API 漏洞、直接 DB 存取） | 低（無法繞過）           |
| **錯誤影響** | 可能洩漏所有資料             | 單一 policy 錯誤影響有限 |
| **效能**     | 需額外查詢條件               | 資料庫原生優化           |
| **維護性**   | 分散在各處                   | 集中在 migrations        |

### RLS 如何運作？

```sql
-- 1. 啟用 RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 2. 定義 policy
CREATE POLICY "users_select_own_transactions" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. 查詢時自動套用
-- 應用程式執行：
SELECT * FROM transactions;

-- PostgreSQL 實際執行（自動加上條件）：
SELECT * FROM transactions WHERE user_id = auth.uid();
```

**關鍵函數**：

- `auth.uid()` - 回傳當前已認證使用者的 UUID
- `USING` - 定義「哪些資料可見」（SELECT, UPDATE, DELETE）
- `WITH CHECK` - 定義「哪些資料可寫入」（INSERT, UPDATE）

---

## 📋 策略設計模式

### 1. 使用者資料隔離（User Data Isolation）

最常見的模式，確保每個使用者只能存取自己的資料。

**Pattern A: 完整 CRUD 控制（推薦用於大多數資料表）**

```sql
-- 適用場景：使用者完全擁有資料的表（cards, categories, transactions）

-- SELECT: 使用者只能看到自己的資料
CREATE POLICY "users_select_own_records" ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 使用者只能插入自己的資料
CREATE POLICY "users_insert_own_records" ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 使用者只能更新自己的資料
CREATE POLICY "users_update_own_records" ON table_name
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: 使用者只能刪除自己的資料
CREATE POLICY "users_delete_own_records" ON table_name
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Pattern B: 簡化寫法（適用於權限一致的表）**

```sql
-- FOR ALL = SELECT + INSERT + UPDATE + DELETE
CREATE POLICY "users_manage_own_records" ON table_name
  FOR ALL
  USING (auth.uid() = user_id);
```

⚠️ **注意**: `FOR ALL` 的 `USING` 等同於同時設定 `USING` 和 `WITH CHECK`。

### 2. 唯讀存取控制

適用於使用者個人檔案等只能看、不能直接寫入的資料。

```sql
-- Users table: 只允許查看和更新自己的個人資料
-- 新增由 Supabase Auth 處理，所以不需要 INSERT policy

CREATE POLICY "users_select_own_profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 沒有 INSERT/DELETE policies
-- 使用者不能自行創建帳號（透過 Supabase Auth 註冊）
-- 使用者不能刪除帳號（需要管理介面或 support）
```

### 3. 關聯資料存取（Relational Access）

透過關聯表檢查權限，適用於多層關聯的資料。

```sql
-- 範例：使用者可以存取自己的 statement 中的 transactions
CREATE POLICY "users_access_own_transactions" ON transactions
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id
      FROM statements
      WHERE statements.id = transactions.statement_id
    )
  );

-- 或使用 JOIN 語法（通常更高效）
CREATE POLICY "users_access_own_transactions" ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM statements
      WHERE statements.id = transactions.statement_id
        AND statements.user_id = auth.uid()
    )
  );
```

**效能考量**：

- 使用 `EXISTS` 比 `IN` 更高效（PostgreSQL 優化器更友善）
- 確保關聯欄位有索引（`statement_id`, `user_id`）

### 4. 角色型存取控制（RBAC）

適用於有管理員或不同角色的應用程式。

```sql
-- 創建 roles enum（如果需要）
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

-- 在 users table 新增 role 欄位
ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';

-- Policy: 一般使用者看自己，管理員看全部
CREATE POLICY "users_or_admins_select" ON sensitive_data
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    (
      SELECT role FROM users WHERE id = auth.uid()
    ) = 'admin'
  );
```

⚠️ **Flourish 目前不使用 RBAC**（Release 0-1 僅單一使用者），此模式供未來參考。

---

## 🎯 Flourish 的 RLS 策略

以下是 Flourish 實際使用的 RLS 策略（來自 `20251113054418_rls_policies.sql`）。

### 啟用 RLS

首先在所有資料表上啟用 RLS：

```sql
-- 啟用 RLS（必須步驟）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saving_rules ENABLE ROW LEVEL SECURITY;
```

### 1. Users 表策略

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

**設計說明**：

- ✅ 使用者可以查看、更新自己的個人資料
- ❌ 不允許 INSERT（帳號由 Supabase Auth 創建）
- ❌ 不允許 DELETE（帳號刪除需要特殊流程）
- `users.id` 直接參照 `auth.users(id)`，因此 `auth.uid()` 可直接比對

**使用範例**（supabase-client）：

```typescript
// ✅ 可以查詢自己的資料
const { data } = await supabase.from('users').select('*').eq('id', user.id).single();

// ✅ 可以更新自己的資料
const { error } = await supabase.from('users').update({ name: 'New Name' }).eq('id', user.id);

// ❌ 無法查詢其他使用者
const { data } = await supabase.from('users').select('*').eq('id', 'other-user-id'); // 回傳空陣列
```

### 2. Cards 表策略

```sql
-- Users can view their own cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cards
CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cards
CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);
```

**設計說明**：

- 完整的 CRUD 控制（SELECT, INSERT, UPDATE, DELETE）
- 使用者完全擁有自己的信用卡資料
- `WITH CHECK` 確保 INSERT 時 `user_id` 必須是當前使用者

**使用範例**：

```typescript
// ✅ 查詢自己的卡片
const { data: cards } = await supabase.from('cards').select('*');

// ✅ 新增卡片
const { data, error } = await supabase.from('cards').insert({
  user_id: currentUser.id, // 必須是當前使用者
  name: 'Chase Sapphire',
  bank: 'Chase',
  last4: '1234',
});

// ✅ 更新卡片
await supabase.from('cards').update({ name: 'New Name' }).eq('id', cardId);

// ✅ 刪除卡片（soft delete 更好）
await supabase.from('cards').update({ is_active: false }).eq('id', cardId);
```

### 3. Categories 表策略

```sql
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);
```

**設計說明**：

- 使用 `FOR ALL` 簡化語法（等同於 4 個獨立 policies）
- 使用者可以完全管理自己的分類

### 4. Statements 表策略

```sql
CREATE POLICY "Users can manage own statements" ON statements
  FOR ALL USING (auth.uid() = user_id);
```

**設計說明**：

- 使用者上傳的 PDF statement 完全由使用者擁有
- 包含 PDF URL、處理狀態等敏感資訊

**安全考量**：

```typescript
// ✅ 正確：只能存取自己的 statement
const { data } = await supabase.from('statements').select('pdf_url').eq('id', statementId);

// RLS 自動確保 statement.user_id = auth.uid()
// 如果 statementId 屬於其他使用者，回傳空陣列
```

### 5. Transactions 表策略

```sql
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);
```

**設計說明**：

- 交易資料是核心財務資訊，必須嚴格隔離
- 每筆交易都有 `user_id` 欄位直接標記擁有者

**常見查詢模式**：

```typescript
// 查詢特定月份的交易
const { data } = await supabase
  .from('transactions')
  .select('*')
  .gte('date', '2024-01-01')
  .lt('date', '2024-02-01')
  .order('date', { ascending: false });

// RLS 自動加上: WHERE user_id = auth.uid()
```

### 6. Recurring Expenses 表策略

```sql
CREATE POLICY "Users can manage own recurring expenses" ON recurring_expenses
  FOR ALL USING (auth.uid() = user_id);
```

**設計說明**：

- 定期費用規則（Netflix、房租等）
- 使用者完全控制自己的定期支出設定

### 7. Saving Rules 表策略

```sql
CREATE POLICY "Users can manage own saving rules" ON saving_rules
  FOR ALL USING (auth.uid() = user_id);
```

**設計說明**：

- 自動儲蓄規則（例如「每月存 $500」）
- 個人理財規劃資料，必須嚴格隔離

---

## 🔧 實作步驟

### 步驟 1: 創建 Migration

```bash
# 創建新的 RLS migration
npx supabase migration new add_rls_to_new_table

# 或使用專案腳本
cd supabase
./scripts/create-migration.sh add_rls_to_new_table
```

### 步驟 2: 編寫 Policy SQL

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_rls_to_new_table.sql

-- 1. 啟用 RLS
ALTER TABLE my_new_table ENABLE ROW LEVEL SECURITY;

-- 2. 定義 policies
CREATE POLICY "users_manage_own_records" ON my_new_table
  FOR ALL
  USING (auth.uid() = user_id);

-- 3. 創建必要的索引
CREATE INDEX idx_my_new_table_user_id ON my_new_table(user_id);
```

### 步驟 3: 測試 Policy

```sql
-- 使用 SET LOCAL 模擬不同使用者（測試環境）

-- 測試 User A
SET LOCAL request.jwt.claim.sub = 'user-a-uuid';
SELECT * FROM my_new_table;  -- 應只回傳 User A 的資料

-- 測試 User B
SET LOCAL request.jwt.claim.sub = 'user-b-uuid';
SELECT * FROM my_new_table;  -- 應只回傳 User B 的資料

-- 測試未認證（應回傳 0 筆）
RESET request.jwt.claim.sub;
SELECT * FROM my_new_table;  -- 應回傳空陣列
```

### 步驟 4: 部署 Migration

```bash
# 推送至遠端 Supabase 專案
npx supabase db push

# 驗證 RLS 已啟用
npx supabase db lint
```

---

## ⚡ 效能最佳化

### 1. 索引設計

**關鍵原則**: 為所有 RLS policy 中使用的欄位創建索引。

```sql
-- 基本索引：user_id 欄位
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- 複合索引：常用查詢組合
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

-- 部分索引：只索引常用的資料子集
CREATE INDEX idx_active_cards_user_id ON cards(user_id)
WHERE is_active = true;
```

**索引策略**：

| 表名           | 建議索引                         | 原因                   |
| -------------- | -------------------------------- | ---------------------- |
| `transactions` | `(user_id, date DESC)`           | 使用者常按日期排序查詢 |
| `cards`        | `(user_id, is_active)`           | 通常只查詢活躍卡片     |
| `statements`   | `(user_id, statement_date DESC)` | 按帳單日期查詢         |
| `categories`   | `(user_id, name)`                | 按名稱搜尋分類         |

### 2. 策略簡化

**❌ 錯誤：過於複雜的 policy**

```sql
-- 不好：效能差且難以維護
CREATE POLICY "complex_policy" ON transactions
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT friend_id FROM friendships WHERE user_id = transactions.user_id
    ) OR
    EXISTS (
      SELECT 1 FROM shared_budgets
      WHERE transactions.category_id = shared_budgets.category_id
        AND shared_budgets.user_id = auth.uid()
    )
  );
```

**✅ 正確：簡單直接的 policy**

```sql
-- 好：簡單、快速、易懂
CREATE POLICY "simple_policy" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

**最佳實踐**：

1. 優先使用簡單的直接比對（`auth.uid() = user_id`）
2. 避免多層 subquery
3. 如需複雜邏輯，考慮在應用層處理

### 3. 查詢最佳化

**使用 EXPLAIN ANALYZE 檢查效能**：

```sql
-- 檢查 RLS policy 的執行計畫
EXPLAIN ANALYZE
SELECT * FROM transactions
WHERE user_id = 'some-user-id';
```

**優化技巧**：

```sql
-- ❌ 不好：強制 sequential scan
SELECT * FROM transactions
WHERE date::date = '2024-01-01';

-- ✅ 好：可以使用索引
SELECT * FROM transactions
WHERE date >= '2024-01-01' AND date < '2024-01-02';
```

### 4. 快取策略

在應用層使用 React Query 快取，減少資料庫查詢：

```typescript
// 使用 React Query 快取使用者的交易資料
export function useUserTransactions() {
  return useQuery({
    queryKey: ['transactions', 'user'],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新查詢
  });
}
```

---

## 🧪 測試 RLS 策略

### 1. 單元測試（SQL）

創建測試 migration 來驗證 RLS policies：

```sql
-- supabase/migrations/test_rls_policies.sql

-- 創建測試使用者
INSERT INTO auth.users (id, email) VALUES
  ('user-a-uuid', 'usera@test.com'),
  ('user-b-uuid', 'userb@test.com');

-- 插入測試資料
INSERT INTO transactions (user_id, amount, description) VALUES
  ('user-a-uuid', 100, 'User A transaction'),
  ('user-b-uuid', 200, 'User B transaction');

-- 測試：User A 只能看到自己的資料
SET LOCAL request.jwt.claim.sub = 'user-a-uuid';
DO $$
DECLARE
  record_count INT;
BEGIN
  SELECT COUNT(*) INTO record_count FROM transactions;
  IF record_count != 1 THEN
    RAISE EXCEPTION 'RLS test failed: User A should see 1 record, got %', record_count;
  END IF;
END $$;

-- 清理測試資料
DELETE FROM transactions WHERE user_id IN ('user-a-uuid', 'user-b-uuid');
DELETE FROM auth.users WHERE id IN ('user-a-uuid', 'user-b-uuid');
```

### 2. E2E 測試（TypeScript）

使用真實的 Supabase client 測試：

```typescript
// __tests__/rls/transactions.test.ts
import { createClient } from '@repo/supabase-client/client';

describe('RLS: Transactions', () => {
  let supabaseUserA: SupabaseClient;
  let supabaseUserB: SupabaseClient;

  beforeAll(async () => {
    // 創建兩個測試使用者的 client
    supabaseUserA = createTestClient('usera@test.com', 'password');
    supabaseUserB = createTestClient('userb@test.com', 'password');

    // 登入
    await supabaseUserA.auth.signIn({ email: 'usera@test.com', password: 'password' });
    await supabaseUserB.auth.signIn({ email: 'userb@test.com', password: 'password' });
  });

  test('User A cannot see User B transactions', async () => {
    // User B 插入一筆交易
    const { data: transactionB } = await supabaseUserB
      .from('transactions')
      .insert({ amount: 100, description: 'User B transaction' })
      .select()
      .single();

    // User A 嘗試查詢 User B 的交易
    const { data, error } = await supabaseUserA
      .from('transactions')
      .select('*')
      .eq('id', transactionB!.id);

    // 應該回傳空陣列（RLS 阻擋）
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });

  test('User A can only update own transactions', async () => {
    // User A 插入一筆交易
    const { data: transactionA } = await supabaseUserA
      .from('transactions')
      .insert({ amount: 50, description: 'User A transaction' })
      .select()
      .single();

    // User B 嘗試更新 User A 的交易
    const { data, error } = await supabaseUserB
      .from('transactions')
      .update({ amount: 999 })
      .eq('id', transactionA!.id);

    // 應該失敗（RLS 阻擋）
    expect(data).toBeNull();

    // 驗證資料未被修改
    const { data: unchanged } = await supabaseUserA
      .from('transactions')
      .select('amount')
      .eq('id', transactionA!.id)
      .single();

    expect(unchanged!.amount).toBe(50);
  });
});
```

### 3. 常見錯誤檢查

**錯誤 1: 忘記啟用 RLS**

```sql
-- 檢查哪些表未啟用 RLS
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename
    FROM pg_policies
  );
```

**錯誤 2: Policy 名稱重複**

```sql
-- 檢查是否有重複的 policy 名稱
SELECT tablename, policyname, COUNT(*)
FROM pg_policies
GROUP BY tablename, policyname
HAVING COUNT(*) > 1;
```

**錯誤 3: 忘記加索引**

```sql
-- 檢查 user_id 欄位是否有索引
SELECT
  t.tablename,
  i.indexname
FROM pg_tables t
LEFT JOIN pg_indexes i
  ON t.tablename = i.tablename
  AND i.indexdef LIKE '%user_id%'
WHERE t.schemaname = 'public'
  AND t.tablename IN ('cards', 'transactions', 'statements')
ORDER BY t.tablename;
```

---

## 🔒 安全最佳實踐

### 1. 永遠啟用 RLS

```sql
-- ❌ 錯誤：忘記啟用 RLS
CREATE TABLE sensitive_data (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  secret_info TEXT
);
-- 沒有 RLS！任何人都可以讀取所有資料

-- ✅ 正確：立即啟用 RLS
CREATE TABLE sensitive_data (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  secret_info TEXT
);
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON sensitive_data
  FOR ALL USING (auth.uid() = user_id);
```

### 2. 使用 WITH CHECK 防止權限繞過

```sql
-- ❌ 錯誤：只檢查 USING，INSERT 時可以插入任意 user_id
CREATE POLICY "weak_insert" ON transactions
  FOR INSERT
  USING (true);  -- 危險！

-- ✅ 正確：WITH CHECK 確保插入的 user_id 是當前使用者
CREATE POLICY "strong_insert" ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 3. 預設拒絕原則（Default Deny）

PostgreSQL RLS 預設行為：

- 如果**沒有 policy** → **拒絕所有存取**
- 如果**有 policy** → 只有符合條件的可以存取

```sql
-- 即使沒有明確的 DENY policy，未匹配的請求也會被拒絕
-- 這是安全的預設行為
```

### 4. 避免使用 Bypassable RLS

```sql
-- ❌ 危險：允許任何人存取
CREATE POLICY "allow_all" ON sensitive_data
  FOR ALL
  USING (true);  -- 不要這樣做！

-- ✅ 安全：只允許擁有者存取
CREATE POLICY "owner_only" ON sensitive_data
  FOR ALL
  USING (auth.uid() = user_id);
```

### 5. 測試匿名存取

確保未登入使用者無法存取受保護資料：

```typescript
// 創建匿名 client（未登入）
const anonClient = createClient();

// 應該回傳空陣列或錯誤
const { data, error } = await anonClient.from('transactions').select('*');

console.log(data); // []
```

---

## 📊 常見錯誤與解決方案

### 錯誤 1: "new row violates row-level security policy"

**原因**: `INSERT` 時 `WITH CHECK` 條件失敗

```typescript
// ❌ 錯誤：試圖插入其他使用者的資料
const { error } = await supabase.from('transactions').insert({
  user_id: 'other-user-id', // 不是當前使用者！
  amount: 100,
});

// Error: new row violates row-level security policy for table "transactions"
```

**解決方案**:

```typescript
// ✅ 正確：使用當前使用者的 ID
const {
  data: { user },
} = await supabase.auth.getUser();

const { error } = await supabase.from('transactions').insert({
  user_id: user!.id, // 當前使用者
  amount: 100,
});
```

### 錯誤 2: Policy 太寬鬆

**問題**: Policy 允許存取不應該存取的資料

```sql
-- ❌ 錯誤：所有登入使用者都能看到所有資料
CREATE POLICY "too_permissive" ON transactions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

**解決方案**:

```sql
-- ✅ 正確：只允許存取自己的資料
CREATE POLICY "correct_policy" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 錯誤 3: 忘記創建索引導致效能問題

**症狀**: 查詢非常慢，特別是資料量增加後

```sql
-- 檢查是否缺少索引
EXPLAIN ANALYZE
SELECT * FROM transactions WHERE user_id = 'some-uuid';

-- 如果看到 "Seq Scan"，表示缺少索引
```

**解決方案**:

```sql
-- 創建索引
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- 重新檢查（應該看到 "Index Scan"）
EXPLAIN ANALYZE
SELECT * FROM transactions WHERE user_id = 'some-uuid';
```

### 錯誤 4: 在 UPDATE 中忘記檢查 user_id

```typescript
// ❌ 錯誤：只用 ID 更新，沒有驗證擁有者
const { error } = await supabase
  .from('transactions')
  .update({ amount: 999 })
  .eq('id', transactionId);

// 如果 transactionId 屬於其他使用者，RLS 會阻擋
// 但錯誤訊息可能讓使用者困惑
```

**解決方案**:

```typescript
// ✅ 正確：明確檢查 user_id
const {
  data: { user },
} = await supabase.auth.getUser();

const { error } = await supabase
  .from('transactions')
  .update({ amount: 999 })
  .eq('id', transactionId)
  .eq('user_id', user!.id); // 明確驗證擁有者

// 如果失敗，可以提供更清晰的錯誤訊息
if (error) {
  console.error('無法更新交易：可能不屬於當前使用者');
}
```

---

## 🔗 相關文檔

- [Supabase RLS 官方文檔](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Sprint 9, Task 2 - RLS Implementation](../../sprints/release-0-foundation/09-supabase-migration-plan.md#task-2)
- [Authentication Guide](./authentication.md)
- [Migrations Guide](./migrations.md)
- [SQL Migration Files](../../../supabase/migrations/)

---

## 📖 進階主題

### 使用 Security Definer Functions

某些操作需要繞過 RLS（例如管理功能），可以使用 `SECURITY DEFINER` 函數：

```sql
-- 創建具有更高權限的函數
CREATE OR REPLACE FUNCTION admin_get_all_transactions()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  amount DECIMAL,
  description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER  -- 以函數擁有者權限執行
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.user_id, t.amount, t.description
  FROM transactions t;
END;
$$;

-- 只允許管理員呼叫此函數
REVOKE ALL ON FUNCTION admin_get_all_transactions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_get_all_transactions() TO authenticated;
```

⚠️ **警告**: `SECURITY DEFINER` 繞過 RLS，必須謹慎使用並實作額外的權限檢查。

### 使用 Realtime 與 RLS

Supabase Realtime 會自動遵守 RLS policies：

```typescript
// 訂閱自己的交易更新
const channel = supabase
  .channel('user-transactions')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${currentUser.id}`, // 只訂閱自己的
    },
    (payload) => {
      console.log('Transaction changed:', payload);
    }
  )
  .subscribe();

// RLS 確保只收到當前使用者的更新
```

---

**最後更新**: 2025-11-24
**完成狀態**: ✅ Sprint 14 Task 3
**實作 Sprint**: Sprint 9 Task 2 - RLS Implementation
