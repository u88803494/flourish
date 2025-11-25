# Supabase 資料庫遷移指南

**狀態**: ✅ 完整（Task 3 已完成）

---

## 🎯 目標

理解並執行 Supabase 資料庫遷移的工作流程，確保資料庫 schema 變更的安全性與可追蹤性。

---

## 📐 遷移策略

### SQL-first 方法

Flourish 使用**純 SQL 遷移檔案**，而非 ORM（如 Prisma）遷移工具。

**原因**：

1. **完全控制**：直接控制 SQL，無中間層抽象
2. **透明度**：清楚看到每個 schema 變更
3. **可讀性**：SQL 檔案易於審查和理解
4. **效能最佳化**：可使用 PostgreSQL 特定功能（如 indexes, functions, triggers）
5. **與 Supabase 整合**：Supabase CLI 原生支援 SQL 遷移
6. **回滾友善**：每個遷移都是獨立的 SQL 檔案，易於追蹤和回滾

### 遷移檔案命名規範

```
<timestamp>_<description>.sql
```

**範例**：

```
20251113050233_initial_schema.sql
20251113054218_auth_integration.sql
20251113054418_rls_policies.sql
20251113054900_indexes_functions.sql
```

- `timestamp`：生成時間（`YYYYMMDDHHmmss` 格式）
- `description`：簡短描述（使用 snake_case）

---

## 🔄 遷移工作流程

### 1. 建立新遷移

使用 Supabase CLI 創建新遷移檔案：

```bash
# 創建新遷移（自動生成 timestamp）
npx supabase migration new <description>

# 範例：新增 notes 欄位到 transactions 表
npx supabase migration new add_notes_to_transactions

# 生成檔案：supabase/migrations/20251124103045_add_notes_to_transactions.sql
```

**檔案位置**：`supabase/migrations/`

### 2. 撰寫遷移 SQL

在生成的 SQL 檔案中撰寫 schema 變更：

#### 範例 1：新增欄位

```sql
-- ============================================================================
-- Migration: Add notes field to transactions
-- Description: Add optional notes field for user comments on transactions
-- ============================================================================

-- Add notes column
ALTER TABLE transactions
ADD COLUMN notes TEXT;

-- Add comment for documentation
COMMENT ON COLUMN transactions.notes IS 'User notes or comments about this transaction';
```

#### 範例 2：新增資料表

```sql
-- ============================================================================
-- Migration: Create budgets table
-- Description: Track monthly budgets for categories
-- ============================================================================

-- Create budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, month)
);

-- Add comments
COMMENT ON TABLE budgets IS 'Monthly budget allocations for categories';
COMMENT ON COLUMN budgets.amount IS 'Budget amount for the month';
COMMENT ON COLUMN budgets.month IS 'Budget month (stored as first day of month)';

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_budgets_user_category ON budgets(user_id, category_id);
CREATE INDEX idx_budgets_month ON budgets(month);
```

#### 範例 3：修改現有欄位

```sql
-- ============================================================================
-- Migration: Make transaction description required
-- Description: Change description from nullable to required with default
-- ============================================================================

-- Add default for existing null values
UPDATE transactions
SET description = ''
WHERE description IS NULL;

-- Make column NOT NULL with default
ALTER TABLE transactions
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN description SET NOT NULL;
```

#### 範例 4：新增 Trigger

```sql
-- ============================================================================
-- Migration: Auto-archive old statements
-- Description: Automatically archive statements older than 12 months
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_archive_old_statements()
RETURNS TRIGGER AS $$
BEGIN
  -- Archive statements older than 12 months
  UPDATE statements
  SET status = 'ARCHIVED'
  WHERE statement_date < NOW() - INTERVAL '12 months'
    AND status != 'ARCHIVED';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_archive_old_statements() IS 'Automatically archive statements older than 12 months';

-- Trigger on statement insert or update
CREATE TRIGGER trigger_auto_archive_statements
  AFTER INSERT OR UPDATE ON statements
  FOR EACH ROW EXECUTE FUNCTION auto_archive_old_statements();
```

#### 範例 5：新增 Function

```sql
-- ============================================================================
-- Migration: Add budget utilization function
-- Description: Calculate percentage of budget used
-- ============================================================================

CREATE OR REPLACE FUNCTION get_budget_utilization(
  p_user_id UUID,
  p_category_id UUID,
  p_month DATE
)
RETURNS DECIMAL AS $$
DECLARE
  v_budget DECIMAL;
  v_spent DECIMAL;
BEGIN
  -- Get budget for the month
  SELECT amount INTO v_budget
  FROM budgets
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND month = p_month;

  -- If no budget exists, return NULL
  IF v_budget IS NULL THEN
    RETURN NULL;
  END IF;

  -- Calculate spending for the month
  SELECT COALESCE(SUM(amount), 0) INTO v_spent
  FROM transactions
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'EXPENSE'
    AND DATE_TRUNC('month', date) = p_month;

  -- Calculate and return percentage
  IF v_budget = 0 THEN
    RETURN 0;
  ELSE
    RETURN (v_spent / v_budget) * 100;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_budget_utilization(UUID, UUID, DATE) IS 'Calculate percentage of budget utilized for a category in a specific month';
```

### 3. 本地測試

在本地 Supabase 環境測試遷移：

```bash
# 1. 啟動本地 Supabase（如果尚未啟動）
npx supabase start

# 2. 重置本地資料庫（應用所有遷移）
npx supabase db reset

# 輸出：
# Applying migration 20251113050233_initial_schema.sql...
# Applying migration 20251113054218_auth_integration.sql...
# Applying migration 20251113054418_rls_policies.sql...
# Applying migration 20251113054900_indexes_functions.sql...
# Applying migration 20251124103045_add_notes_to_transactions.sql...
# Seeding data...

# 3. 檢查遷移狀態
npx supabase migration list

# 輸出：
#   20251113050233_initial_schema.sql      | Applied
#   20251113054218_auth_integration.sql    | Applied
#   20251113054418_rls_policies.sql        | Applied
#   20251113054900_indexes_functions.sql   | Applied
#   20251124103045_add_notes_to_transactions.sql | Applied

# 4. 驗證 schema 變更
npx supabase db diff

# 如果有未捕獲的變更，會顯示 SQL diff
```

#### 手動驗證

連接到本地資料庫進行手動測試：

```bash
# 使用 psql 連接本地資料庫
npx supabase db connect

# 或使用 SQL 編輯器
# 開啟 Supabase Studio: http://localhost:54323
```

**驗證範例**：

```sql
-- 檢查新欄位
\d transactions

-- 檢查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'budgets';

-- 測試 Function
SELECT get_budget_utilization(
  'user-uuid'::UUID,
  'category-uuid'::UUID,
  '2024-01-01'::DATE
);

-- 測試 Trigger
INSERT INTO transactions (user_id, type, merchant_name, amount, date)
VALUES ('test-uuid', 'EXPENSE', 'Test', 100, NOW());

-- 檢查 updated_at 是否自動更新
SELECT updated_at FROM transactions WHERE merchant_name = 'Test';
```

### 4. 部署至遠端

遷移測試完成後，部署到遠端資料庫：

```bash
# 推送遷移到遠端（正式環境）
npx supabase db push

# 輸出：
# Connecting to remote database...
# Applying migration 20251124103045_add_notes_to_transactions.sql...
# Migration applied successfully!

# 檢查遠端遷移狀態
npx supabase migration list --linked

# 輸出：
#   20251113050233_initial_schema.sql      | Applied (remote)
#   20251113054218_auth_integration.sql    | Applied (remote)
#   20251113054418_rls_policies.sql        | Applied (remote)
#   20251113054900_indexes_functions.sql   | Applied (remote)
#   20251124103045_add_notes_to_transactions.sql | Applied (remote)
```

**重要**：`db push` 會：

1. 將所有未應用的遷移推送到遠端
2. 按照 timestamp 順序執行
3. 如果遷移失敗，會回滾該遷移
4. 遷移記錄保存在 `_prisma_migrations` 資料表

### 5. 更新類型定義

遷移完成後，重新生成 TypeScript 類型：

```bash
# 從遠端資料庫生成類型
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > packages/supabase-client/src/shared/types/database.ts

# 或從本地資料庫生成（開發環境）
npx supabase gen types typescript --local > packages/supabase-client/src/shared/types/database.ts

# 檢查類型變更
git diff packages/supabase-client/src/shared/types/database.ts

# 執行類型檢查
pnpm check-types
```

---

## 📋 遷移最佳實踐

### 1. 遷移命名規範

**好的命名**：

- `add_notes_to_transactions` - 清楚描述變更
- `create_budgets_table` - 明確的動作和對象
- `rls_policies_for_statements` - 具體的功能

**避免的命名**：

- `update` - 太模糊
- `fix` - 沒有說明修復什麼
- `changes` - 不清楚變更內容

### 2. 遷移結構

每個遷移檔案應包含：

```sql
-- ============================================================================
-- Migration: <標題>
-- Description: <詳細描述>
-- Date: <日期>
-- Author: <作者>（選填）
-- ============================================================================

-- Schema 變更
<SQL statements>

-- Comments（文檔）
COMMENT ON TABLE/COLUMN ... IS '...';

-- RLS 策略（如果需要）
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...

-- Indexes（如果需要）
CREATE INDEX ...

-- Functions/Triggers（如果需要）
CREATE OR REPLACE FUNCTION ...
CREATE TRIGGER ...
```

### 3. 可逆性設計

**原則**：每個遷移都應該可以回滾（雖然 Supabase 不支援自動回滾）。

**策略**：

1. **紀錄回滾 SQL**：在遷移檔案註解中記錄回滾指令

```sql
-- ============================================================================
-- Migration: Add notes to transactions
-- ============================================================================

-- Forward migration
ALTER TABLE transactions ADD COLUMN notes TEXT;

-- Rollback (if needed):
-- ALTER TABLE transactions DROP COLUMN notes;
```

1. **使用版本化欄位**：而非刪除舊欄位，標記為已棄用

```sql
-- ❌ 不好：直接刪除欄位（資料遺失）
-- ALTER TABLE transactions DROP COLUMN old_field;

-- ✅ 好：標記為已棄用，保留資料
ALTER TABLE transactions RENAME COLUMN old_field TO deprecated_old_field;
COMMENT ON COLUMN transactions.deprecated_old_field IS 'DEPRECATED: Use new_field instead';
```

1. **分階段遷移**：大型變更拆分為多個小遷移

```sql
-- Migration 1: Add new column
ALTER TABLE transactions ADD COLUMN new_field TEXT;

-- Migration 2: Migrate data
UPDATE transactions SET new_field = old_field;

-- Migration 3: Make new column required
ALTER TABLE transactions ALTER COLUMN new_field SET NOT NULL;

-- Migration 4 (Future): Remove old column
-- ALTER TABLE transactions DROP COLUMN old_field;
```

### 4. 資料遷移策略

處理現有資料時要小心：

```sql
-- ============================================================================
-- Migration: Normalize transaction amounts
-- Description: Convert negative amounts to positive with type adjustment
-- ============================================================================

-- Step 1: Add temporary column
ALTER TABLE transactions ADD COLUMN amount_new DECIMAL(10, 2);

-- Step 2: Migrate data with validation
UPDATE transactions
SET amount_new = ABS(amount)
WHERE amount IS NOT NULL;

-- Step 3: Verify migration
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM transactions
  WHERE amount IS NOT NULL AND amount_new IS NULL;

  IF v_count > 0 THEN
    RAISE EXCEPTION 'Data migration failed: % rows not migrated', v_count;
  END IF;
END $$;

-- Step 4: Drop old column and rename
ALTER TABLE transactions DROP COLUMN amount;
ALTER TABLE transactions RENAME COLUMN amount_new TO amount;
ALTER TABLE transactions ALTER COLUMN amount SET NOT NULL;
```

### 5. 效能考量

**新增 Indexes**：

- 在大型資料表上新增 index 可能很慢
- 使用 `CONCURRENTLY` 避免鎖定（需要在 transaction 外執行）

```sql
-- 非阻塞式建立 index
CREATE INDEX CONCURRENTLY idx_transactions_user_date
ON transactions(user_id, date);

-- 檢查 index 狀態
SELECT * FROM pg_stat_progress_create_index;
```

**批次處理**：

```sql
-- ❌ 不好：一次更新所有資料（可能鎖定資料表）
UPDATE transactions SET processed = true;

-- ✅ 好：批次更新
DO $$
DECLARE
  v_batch_size INTEGER := 1000;
  v_updated INTEGER;
BEGIN
  LOOP
    UPDATE transactions
    SET processed = true
    WHERE id IN (
      SELECT id FROM transactions
      WHERE processed = false
      LIMIT v_batch_size
    );

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    EXIT WHEN v_updated = 0;
    COMMIT;
  END LOOP;
END $$;
```

### 6. 測試遷移

**建立測試 seed 資料**：

```sql
-- supabase/seed.sql
-- 測試資料用於驗證遷移

-- Insert test user
INSERT INTO users (id, email, name)
VALUES ('test-user-id', 'test@example.com', 'Test User');

-- Insert test transactions
INSERT INTO transactions (user_id, type, merchant_name, amount, date)
VALUES
  ('test-user-id', 'EXPENSE', 'Test Store 1', 100, NOW()),
  ('test-user-id', 'INCOME', 'Test Source', 500, NOW());

-- Verify RLS policies work
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "test-user-id"}';

SELECT * FROM transactions;  -- Should only return test user's transactions
```

**執行測試**：

```bash
# 重置並載入 seed 資料
npx supabase db reset

# 執行自定義測試
npx supabase db execute -f tests/verify_migration.sql
```

---

## 🗂️ Flourish 現有遷移

### Migration 1: Initial Schema (20251113050233)

**檔案**：`20251113050233_initial_schema.sql`

**內容**：

- 建立所有基礎資料表（users, cards, categories, transactions, statements, recurring_expenses, saving_rules）
- 定義 Enum 類型（transaction_type, statement_status, recurring_frequency）
- 建立外鍵關係
- 設定預設值和約束

**關鍵亮點**：

```sql
-- Users 連結到 Supabase Auth
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions 支援 AI 提取
CREATE TABLE transactions (
  -- ... 其他欄位
  raw_text TEXT,                    -- PDF 原始文字
  confidence DECIMAL(5, 4),         -- AI 信心度（0-1）
  is_manual_entry BOOLEAN DEFAULT FALSE
);
```

### Migration 2: Auth Integration (20251113054218)

**檔案**：`20251113054218_auth_integration.sql`

**內容**：

- 自動建立 user profile 的 Trigger
- 所有資料表的 `updated_at` 自動更新 Trigger

**關鍵亮點**：

```sql
-- 自動建立使用者 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Migration 3: RLS Policies (20251113054418)

**檔案**：`20251113054418_rls_policies.sql`

**內容**：

- 啟用所有資料表的 RLS
- 建立基於 `auth.uid()` 的使用者資料隔離策略

**關鍵亮點**：

```sql
-- 使用者只能管理自己的交易
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- 使用者只能查看和更新自己的 profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Migration 4: Indexes & Functions (20251113054900)

**檔案**：`20251113054900_indexes_functions.sql`

**內容**：

- 效能最佳化 indexes
- 常用統計函數（月支出、分類總計）

**關鍵亮點**：

```sql
-- 查詢最佳化
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- 統計函數
CREATE OR REPLACE FUNCTION get_monthly_spending(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'EXPENSE'
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
$$ LANGUAGE SQL STABLE;
```

---

## ⚠️ 常見問題

### 1. 遷移失敗處理

**問題**：遷移執行失敗

```bash
Error: Migration failed: syntax error at or near "FRON"
```

**解決方案**：

1. **檢查 SQL 語法**：使用 PostgreSQL 編輯器或 `psql` 驗證 SQL

```bash
# 測試 SQL 語法
npx supabase db execute -f supabase/migrations/20251124103045_add_notes.sql --local
```

1. **回滾失敗的遷移**：Supabase 會自動回滾失敗的遷移，但需要修復 SQL 後重新執行

```bash
# 修正 SQL 後重新執行
npx supabase db reset
```

1. **檢查遷移狀態**：

```bash
npx supabase migration list
```

### 2. 遷移衝突

**問題**：多人開發時遷移 timestamp 衝突

**解決方案**：

1. **協調 timestamp**：如果兩個遷移同時創建，手動調整其中一個的 timestamp

```bash
# 重命名衝突的遷移
mv supabase/migrations/20251124103045_feature_a.sql \
   supabase/migrations/20251124103046_feature_a.sql
```

1. **使用分支合併策略**：在合併前確保遷移順序正確

### 3. 本地與遠端不同步

**問題**：本地資料庫與遠端資料庫遷移狀態不一致

**解決方案**：

```bash
# 1. 查看本地遷移狀態
npx supabase migration list

# 2. 查看遠端遷移狀態
npx supabase migration list --linked

# 3. 同步本地到遠端
npx supabase db push

# 4. 從遠端拉取遷移（如果遠端有新遷移）
npx supabase db pull

# 5. 重置本地以匹配遠端
npx supabase db reset
```

### 4. 無法刪除已應用的遷移

**問題**：想要刪除或修改已應用的遷移

**解決方案**：

**⚠️ 警告**：不要刪除或修改已經推送到正式環境的遷移！

**如果在本地開發環境**：

```bash
# 1. 刪除遷移檔案
rm supabase/migrations/20251124103045_bad_migration.sql

# 2. 重置本地資料庫
npx supabase db reset

# 3. 重新生成類型
npx supabase gen types typescript --local > packages/supabase-client/src/shared/types/database.ts
```

**如果已經推送到正式環境**：

- ❌ **不要刪除遷移**
- ✅ **建立新遷移來修正錯誤**

```bash
# 建立修正遷移
npx supabase migration new fix_previous_migration

# 在新遷移中撤銷錯誤變更
# supabase/migrations/20251124103050_fix_previous_migration.sql
ALTER TABLE transactions DROP COLUMN wrong_field;
```

### 5. 大型資料表遷移

**問題**：在大型資料表上執行遷移導致超時或鎖定

**解決方案**：

1. **使用 CONCURRENTLY**（適用於 index 建立）：

```sql
CREATE INDEX CONCURRENTLY idx_transactions_user_date
ON transactions(user_id, date);
```

1. **分批處理**：

```sql
-- 分批更新避免長時間鎖定
DO $$
DECLARE
  v_batch_size INTEGER := 1000;
  v_offset INTEGER := 0;
  v_updated INTEGER;
BEGIN
  LOOP
    UPDATE transactions
    SET new_field = old_field
    WHERE id IN (
      SELECT id FROM transactions
      WHERE new_field IS NULL
      ORDER BY id
      LIMIT v_batch_size
      OFFSET v_offset
    );

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    v_offset := v_offset + v_batch_size;

    EXIT WHEN v_updated = 0;

    -- 短暫休息避免持續鎖定
    PERFORM pg_sleep(0.1);
  END LOOP;
END $$;
```

1. **在離峰時間執行**：重大遷移應在使用者活動較少時執行

### 6. RLS 策略錯誤

**問題**：遷移後無法查詢資料

```
Error: new row violates row-level security policy for table "transactions"
```

**解決方案**：

1. **檢查 RLS 策略**：

```sql
-- 查看資料表的 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'transactions';

-- 暫時停用 RLS 進行測試（僅本地）
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

1. **驗證策略邏輯**：

```sql
-- 測試策略是否正確
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "test-user-id"}';

SELECT * FROM transactions;  -- 應該只返回該使用者的資料
```

1. **修正策略**：

```bash
# 建立新遷移修正 RLS 策略
npx supabase migration new fix_rls_policies

# 在新遷移中更新策略
DROP POLICY "old_policy" ON transactions;
CREATE POLICY "corrected_policy" ON transactions
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🚨 生產環境注意事項

### 部署前檢查清單

- [ ] 在本地環境完整測試遷移
- [ ] 驗證 RLS 策略正確（不會意外暴露資料）
- [ ] 檢查遷移效能（大型資料表是否會超時）
- [ ] 確認有回滾計劃（知道如何撤銷變更）
- [ ] 備份正式資料庫（Supabase 每日自動備份，但可手動備份）
- [ ] 在離峰時間執行（如果是重大變更）
- [ ] 更新類型定義並測試前端
- [ ] 通知團隊成員即將部署

### 緊急回滾

如果遷移後發現嚴重問題：

```bash
# 1. 建立回滾遷移
npx supabase migration new rollback_problem_migration

# 2. 在回滾遷移中撤銷變更
# supabase/migrations/20251124103055_rollback_problem_migration.sql

-- 撤銷 schema 變更
ALTER TABLE transactions DROP COLUMN problem_field;

-- 恢復舊的 RLS 策略
DROP POLICY "new_policy" ON transactions;
CREATE POLICY "old_policy" ON transactions
  FOR ALL USING (auth.uid() = user_id);

# 3. 部署回滾遷移
npx supabase db push

# 4. 重新生成類型
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > packages/supabase-client/src/shared/types/database.ts

# 5. 部署前端修正（如果需要）
git revert <commit-hash>
git push origin main
```

---

## 🔗 相關文檔

- **資料庫設計**：[database-design.md](../../architecture/database-design.md)
- **Sprint 9, Task 2**：[Supabase 遷移計劃](../../sprints/release-0-foundation/09-supabase-migration-plan.md#task-2)
- **TypeScript 類型**：[types.md](../api-reference/types.md)
- **RLS 策略**：[rls-policies.md](./rls-policies.md)
- **Supabase 官方文檔**：[Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

**最後更新**：2025-11-24
**狀態**：✅ 完整（Task 3 已完成）
**涵蓋範圍**：完整遷移工作流程、現有遷移詳解、最佳實踐、故障排除
