# Supabase 遷移方法

**最後更新**: 2025-11-13
**狀態**: 使用中的決策
**相關文件**: [ADR 002 - Imperative Migrations](../decisions/002-imperative-migrations.md)

---

## 📖 概述

資料庫遷移是版本控制的資料庫 schema 變更。Supabase 支援兩種管理遷移的方法：

1. **Imperative Migrations（命令式遷移）**（SQL 檔案）- 我們使用的方法 ✅
2. **Declarative Schema（宣告式 Schema）**（狀態式）- 替代方法

本文件說明兩種方法、它們的權衡，以及為什麼 Flourish 使用 Imperative Migrations。

---

## 🔧 Imperative Migrations（目前方法）

### 什麼是 Imperative Migrations？

Imperative migrations 定義**逐步變更**資料庫 schema。每個遷移都是一個 SQL 檔案，描述如何將資料庫從一個狀態轉換到另一個狀態。

**比喻**：就像食譜告訴你每個烹飪步驟的順序。

### 運作方式

```bash
# 1. 建立新遷移
npx supabase migration new add_user_preferences

# 2. 編輯產生的 SQL 檔案
# supabase/migrations/20251113120000_add_user_preferences.sql
```

```sql
-- supabase/migrations/20251113120000_add_user_preferences.sql

-- 新增欄位
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- 新增索引以提升效能
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

-- 新增註解
COMMENT ON COLUMN users.preferences IS 'User preference settings stored as JSON';
```

```bash
# 3. 推送到 Supabase
npx supabase db push
```

### Flourish 的實際範例

來自 `supabase/migrations/20251113050233_initial_schema.sql`：

```sql
-- 建立 ENUM 型別
CREATE TYPE statement_status AS ENUM ('PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED');
CREATE TYPE transaction_type AS ENUM ('EXPENSE', 'INCOME', 'REFUND');

-- 建立 users 資料表
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';
```

### 優點 ✅

| 優勢           | 為什麼重要                             |
| -------------- | -------------------------------------- |
| **完全控制**   | 你可以精確撰寫應該發生的變更           |
| **明確的歷史** | 每個遷移檔案都顯示確切的變更內容與時間 |
| **易於審查**   | 清楚的 SQL 可在 PRs 中審查             |
| **可預測**     | 沒有意外 - 你清楚知道會執行什麼        |
| **學習 SQL**   | 透過實際練習提升 SQL 技能              |
| **複雜操作**   | 可處理複雜的遷移（資料轉換、條件邏輯） |

### 缺點 ❌

| 劣勢                 | 影響                     |
| -------------------- | ------------------------ |
| **手動工作**         | 必須手寫所有 SQL         |
| **需要 SQL 知識**    | 需要了解 PostgreSQL 語法 |
| **沒有自動差異比對** | 無法自動偵測 schema 漂移 |
| **較冗長**           | 需要撰寫和維護更多程式碼 |

### 何時使用

- ✅ 你想要完全控制資料庫變更
- ✅ 你正在學習 SQL 和 PostgreSQL
- ✅ 你的團隊熟悉 SQL
- ✅ 你需要複雜遷移（資料轉換、條件邏輯）
- ✅ 你重視明確的遷移歷史

---

## 🎯 Declarative Schema（替代方法）

### 什麼是 Declarative Schema？

Declarative schema 定義資料庫的**期望最終狀態**。工具會自動產生達到該狀態所需的遷移。

**比喻**：就像告訴某人「我想要一個巧克力蛋糕」，他們會想出食譜。

### 運作方式

```bash
# 1. 在單一檔案中定義你的 schema
# supabase/schema.sql
```

```sql
-- supabase/schema.sql（完整的資料庫狀態）

CREATE TYPE statement_status AS ENUM ('PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}',  -- 新增這一行
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
```

```bash
# 2. 自動產生遷移
npx supabase db diff --schema public

# 輸出：產生 20251113120000_add_preferences.sql
# ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
# CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

# 3. 推送到 Supabase
npx supabase db push
```

### 範例工作流程

**之前**（目前的 schema）：

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT
);
```

**之後**（你編輯 schema.sql 加入 preferences）：

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'  -- 新增
);
```

**CLI 自動產生**：

```sql
-- 產生的遷移
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
```

### 優點 ✅

| 優勢                | 為什麼重要             |
| ------------------- | ---------------------- |
| **70% 更快**        | CLI 為你產生 SQL       |
| **自動差異比對**    | 自動偵測 schema 差異   |
| **減少 SQL 撰寫**   | 只需定義最終狀態       |
| **更安全的變更**    | 工具產生正確的遷移語法 |
| **Schema 漂移偵測** | 可自動比較遠端與本地   |

### 缺點 ❌

| 劣勢              | 影響                       |
| ----------------- | -------------------------- |
| **較少控制**      | 工具決定如何遷移           |
| **隱藏的變更**    | 產生的遷移可能出乎意料     |
| **學習曲線**      | Supabase 新功能，資源較少  |
| **複雜操作**      | 可能無法處理複雜的資料轉換 |
| **Supabase 專屬** | 鎖定在 Supabase 工具中     |

### 何時使用

- ✅ 大型團隊想要簡化工作流程
- ✅ 頻繁的 schema 變更
- ✅ 團隊的 SQL 專業知識較少
- ✅ 想要自動化漂移偵測
- ✅ 簡單的 CRUD schema（沒有複雜轉換）

---

## 📊 並排比較

### 新增欄位

**Imperative（我們的方法）**：

```sql
-- 20251113120000_add_user_preferences.sql
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
COMMENT ON COLUMN users.preferences IS 'User preference settings';
```

**Declarative（替代方法）**：

```sql
-- schema.sql（只需編輯資料表定義）
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'  -- 只需新增這一行
);

CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
```

```bash
# 然後執行：npx supabase db diff
# 自動產生 ALTER TABLE 遷移
```

### 比較表格

| 功能         | Imperative          | Declarative         |
| ------------ | ------------------- | ------------------- |
| **學習曲線** | 🟡 中等（需要 SQL） | 🟢 簡單（較少 SQL） |
| **控制**     | 🟢 完全控制         | 🟡 依賴工具         |
| **速度**     | 🟡 手動撰寫 SQL     | 🟢 70% 更快         |
| **歷史**     | 🟢 明確的檔案       | 🟡 產生的檔案       |
| **審查**     | 🟢 清楚的 SQL 差異  | 🟡 審查產生的程式碼 |
| **複雜操作** | 🟢 完整的 SQL 能力  | 🔴 有限             |
| **SQL 學習** | 🟢 高價值           | 🔴 被抽象化         |
| **漂移偵測** | 🔴 手動             | 🟢 自動             |
| **工具**     | 🟢 標準 SQL         | 🟡 僅 Supabase CLI  |

---

## 🏗️ Flourish 的決策：Imperative Migrations

### 為什麼我們選擇 Imperative

1. **學習價值** 🎓
   - Henry 想成為全端工程師
   - 學習 SQL 對後端開發至關重要
   - Imperative migrations 就是 SQL 練習

2. **專案規模** 📏
   - 單一開發者專案
   - 小型 schema（7 個資料表）
   - 不頻繁的 schema 變更
   - Declarative 的 70% 速度優勢影響不大

3. **控制與可預測性** 🎯
   - 完全控制遷移順序
   - 沒有自動產生 SQL 的意外
   - 可在需要時加入複雜邏輯（資料轉換、條件遷移）

4. **已經完成** ✅
   - 4 個遷移已撰寫且正常運作
   - Schema 已部署並測試
   - 現在切換沒有好處

### 何時重新考慮

如果出現以下情況，考慮切換至 Declarative Schema：

- ⚠️ **團隊成長** → 多位開發者受益於簡化工作流程
- ⚠️ **Schema 變更變得頻繁** → 70% 速度節省變得顯著
- ⚠️ **維護 schema 漂移變得痛苦** → 自動差異比對變得有價值
- ⚠️ **Henry 熟悉 SQL** → 學習價值已達成，可優化速度

### 遷移路徑（如果未來需要）

如果之後決定切換至 Declarative：

```bash
# 1. 從目前的遷移產生 schema.sql
npx supabase db dump --schema public > supabase/schema.sql

# 2. 未來變更只需編輯 schema.sql
# 3. 使用 db diff 產生遷移
npx supabase db diff
```

我們現有的遷移保持有效，不需要重寫。

---

## 📚 工作流程指南

### 目前工作流程（Imperative）

```bash
# 1. 建立新遷移
npx supabase migration new feature_name

# 2. 編輯產生的 SQL 檔案
# supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql

# 3. 撰寫你的 SQL
ALTER TABLE users ADD COLUMN new_field TEXT;

# 4. 本地測試（選擇性）
npx supabase db reset  # 重置本地 DB 並執行所有遷移

# 5. 推送到遠端
npx supabase db push

# 6. 提交到 Git
git add supabase/migrations/
git commit -m "feat(db): add new_field to users"
```

### 替代工作流程（Declarative）

```bash
# 1. 編輯 schema.sql
# supabase/schema.sql - 修改期望狀態

# 2. 產生遷移差異
npx supabase db diff --schema public

# 3. 審查產生的遷移
cat supabase/migrations/YYYYMMDDHHMMSS_generated.sql

# 4. 推送到遠端
npx supabase db push

# 5. 提交到 Git
git add supabase/schema.sql supabase/migrations/
git commit -m "feat(db): add new_field to users"
```

---

## 🔗 相關文檔

- [ADR 002 - Imperative Migrations 決策](../decisions/002-imperative-migrations.md)
- [Sprint 0.9.2 - 資料庫遷移](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md)
- [資料庫設置指南](./database-setup.md)
- [Supabase CLI 參考](https://supabase.com/docs/guides/cli)

---

## 🤔 常見問題

**問：可以在同一個專案中使用兩種方法嗎？**
答：技術上可以，但不建議。選擇一種方法以保持一致性。

**問：Declarative Schema 穩定嗎？**
答：是的，從 2024-2025 開始它是正式環境功能。但它比 Imperative migrations 更新。

**問：我的 Imperative migrations 會過時嗎？**
答：不會。Imperative migrations 是兩種方法的基礎。Declarative 只是自動產生它們。

**問：可以之後從 Imperative 切換到 Declarative 嗎？**
答：可以！從現有遷移產生 schema.sql 並從那裡繼續。

**問：Supabase 推薦哪種方法？**
答：Supabase 同等支援兩者。Declarative 較新且被宣傳為「更簡單」，但 Imperative 仍然完全支援。

---

**決策制定者**：Henry Lee
**決策日期**：2025-11-13
**審查日期**：Sprint 1 之後（當 schema 變更變得更頻繁時）
