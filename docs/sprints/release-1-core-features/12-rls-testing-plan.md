---
title: 'RLS 測試計劃'
type: 'testing-plan'
sprint: 'Sprint 12.4'
date: '2025-12-03'
status: 'ready'
---

# RLS (Row Level Security) 測試計劃

**Sprint**: 12.4
**目標**: 驗證 RLS 策略正確隔離用戶資料，確保安全性

---

## 📋 測試總覽

### 測試範圍

測試 7 個資料表的 RLS 策略：

1. `users` - 用戶資料
2. `cards` - 信用卡資訊
3. `categories` - 類別設定
4. `statements` - 帳單資料
5. `transactions` - 交易記錄
6. `recurring_expenses` - 定期支出
7. `saving_rules` - 儲蓄規則

### 測試類型

- **隔離測試**: 用戶 A 無法存取用戶 B 的資料
- **認證測試**: 未認證用戶無法存取任何資料
- **操作測試**: SELECT, INSERT, UPDATE, DELETE 權限驗證

---

## 🔐 測試前置作業

### 1. 推送 Migration 至 Supabase

```bash
# 連結至 Supabase 專案（如果還沒連結）
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 推送 migration
npx supabase db push

# 驗證 migration 已套用
npx supabase db reset --linked
```

### 2. 建立測試用戶

在 Supabase Dashboard 建立兩個測試用戶：

- **User A**: `test-user-a@example.com`
- **User B**: `test-user-b@example.com`

或使用 Google OAuth 登入兩次（使用不同的 Google 帳號）。

### 3. 準備測試資料

為每個用戶建立測試資料：

- 1 張 Card
- 2 個 Categories
- 1 個 Statement
- 3 筆 Transactions

---

## 🧪 測試案例

### Test Suite 1: 隔離測試（用戶 A vs 用戶 B）

#### Test 1.1: Cards 隔離測試

**測試步驟**：

1. 使用 User A 登入
2. 建立一張卡片 "Test Card A"
3. 登出 User A，使用 User B 登入
4. 嘗試查詢所有 cards

**預期結果**：

- User B 只能看到自己的卡片
- User B 看不到 "Test Card A"

**SQL 驗證**（Supabase SQL Editor）：

```sql
-- 以 User A 身份執行
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims.sub = '<user-a-id>';
SELECT * FROM cards;
-- 應該只返回 User A 的卡片
```

#### Test 1.2: Transactions 隔離測試

**測試步驟**：

1. User A 建立 3 筆交易
2. User B 建立 2 筆交易
3. User A 查詢所有交易

**預期結果**：

- User A 只能看到自己的 3 筆交易
- User B 只能看到自己的 2 筆交易

#### Test 1.3: Categories 隔離測試

**測試步驟**：

1. User A 建立類別 "Food"
2. User B 建立類別 "Food"（同名但不同 user_id）
3. 兩者都查詢 categories

**預期結果**：

- User A 只看到自己的 "Food"
- User B 只看到自己的 "Food"
- 兩個 "Food" 類別有不同的 ID

### Test Suite 2: 認證測試（未登入用戶）

#### Test 2.1: 未認證用戶無法 SELECT

**測試步驟**：

1. 登出所有用戶
2. 嘗試存取 `/api/cards`（如果有 API）或直接查詢資料庫

**預期結果**：

- 返回 401 Unauthorized 或空陣列
- RLS 阻止未認證用戶查詢

**SQL 驗證**：

```sql
-- 模擬未認證用戶
SET LOCAL role anon;
SELECT * FROM cards;
-- 應該返回 0 筆資料
```

#### Test 2.2: 未認證用戶無法 INSERT

**測試步驟**：

1. 未登入狀態
2. 嘗試建立新的 card

**預期結果**：

- INSERT 操作被拒絕
- 返回權限錯誤

### Test Suite 3: CRUD 權限測試

#### Test 3.1: SELECT 權限

**測試**：

- ✅ User A 可以查詢自己的資料
- ❌ User A 無法查詢 User B 的資料
- ❌ 未認證用戶無法查詢任何資料

#### Test 3.2: INSERT 權限

**測試**：

- ✅ User A 可以插入 `userId = User A` 的資料
- ❌ User A 無法插入 `userId = User B` 的資料
- ❌ 未認證用戶無法插入資料

**SQL 驗證**：

```sql
-- 以 User A 身份嘗試插入 User B 的資料
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims.sub = '<user-a-id>';
INSERT INTO cards ("userId", name, bank, last4, "isActive")
VALUES ('<user-b-id>', 'Hacked Card', 'Evil Bank', '6666', true);
-- 應該失敗，違反 RLS policy
```

#### Test 3.3: UPDATE 權限

**測試**：

- ✅ User A 可以更新自己的資料
- ❌ User A 無法更新 User B 的資料
- ❌ 未認證用戶無法更新資料

**SQL 驗證**：

```sql
-- 以 User A 身份嘗試更新 User B 的卡片
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims.sub = '<user-a-id>';
UPDATE cards SET name = 'Hacked Name' WHERE "userId" = '<user-b-id>';
-- 應該更新 0 筆資料（因為 User A 看不到 User B 的資料）
```

#### Test 3.4: DELETE 權限

**測試**：

- ✅ User A 可以刪除自己的資料
- ❌ User A 無法刪除 User B 的資料
- ❌ 未認證用戶無法刪除資料

### Test Suite 4: 關聯資料測試

#### Test 4.1: Statement → Transactions 關聯

**測試步驟**：

1. User A 建立 statement A，包含 3 筆 transactions
2. User B 建立 statement B，包含 2 筆 transactions
3. User A 查詢 statement A 的 transactions

**預期結果**：

- User A 只能看到 statement A 的 3 筆 transactions
- User A 看不到 statement B 的 transactions

#### Test 4.2: Card → Statements 關聯

**測試步驟**：

1. User A 有 card A，建立 2 個 statements
2. User B 有 card B，建立 1 個 statement
3. User A 查詢 card A 的 statements

**預期結果**：

- User A 只能看到 card A 的 2 個 statements
- User A 看不到 card B 的 statement

---

## 📊 測試執行記錄

### 執行日期：[待填寫]

#### Test Suite 1: 隔離測試

| Test ID | 測試項目          | 狀態 | 備註 |
| ------- | ----------------- | ---- | ---- |
| 1.1     | Cards 隔離測試    | ⏳   |      |
| 1.2     | Transactions 隔離 | ⏳   |      |
| 1.3     | Categories 隔離   | ⏳   |      |

#### Test Suite 2: 認證測試

| Test ID | 測試項目           | 狀態 | 備註 |
| ------- | ------------------ | ---- | ---- |
| 2.1     | 未認證 SELECT 拒絕 | ⏳   |      |
| 2.2     | 未認證 INSERT 拒絕 | ⏳   |      |

#### Test Suite 3: CRUD 權限

| Test ID | 測試項目    | 狀態 | 備註 |
| ------- | ----------- | ---- | ---- |
| 3.1     | SELECT 權限 | ⏳   |      |
| 3.2     | INSERT 權限 | ⏳   |      |
| 3.3     | UPDATE 權限 | ⏳   |      |
| 3.4     | DELETE 權限 | ⏳   |      |

#### Test Suite 4: 關聯資料

| Test ID | 測試項目                 | 狀態 | 備註 |
| ------- | ------------------------ | ---- | ---- |
| 4.1     | Statement → Transactions | ⏳   |      |
| 4.2     | Card → Statements        | ⏳   |      |

---

## 🔍 驗證指令

### 檢查 RLS 是否啟用

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'cards', 'categories', 'statements',
    'transactions', 'recurring_expenses', 'saving_rules'
  );
-- 所有 rowsecurity 應該為 true
```

### 列出所有 RLS 策略

```sql
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- 應該看到每個資料表有 4 個策略（SELECT, INSERT, UPDATE, DELETE）
-- users 除外（只有 SELECT 和 UPDATE）
```

### 測試特定策略

```sql
-- 模擬 User A（使用真實 user_id）
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims.sub = '<user-a-uuid>';

-- 查詢 cards（應該只返回 User A 的卡片）
SELECT * FROM cards;

-- 重置角色
RESET role;
```

---

## ✅ 驗收標準

RLS 測試通過的標準：

- [ ] 所有 7 個資料表都已啟用 RLS
- [ ] 所有資料表都有正確的 CRUD 策略
- [ ] User A 無法存取 User B 的資料（所有資料表）
- [ ] 未認證用戶無法存取任何資料
- [ ] 所有 CRUD 操作（SELECT, INSERT, UPDATE, DELETE）權限正確
- [ ] 關聯資料查詢正確隔離
- [ ] 前端應用程式不會顯示其他用戶的資料
- [ ] Supabase Dashboard 驗證策略已套用

---

## 🐛 已知問題與解決方案

### Issue 1: Migration 推送失敗

**症狀**: `npx supabase db push` 失敗

**解決方案**:

```bash
# 檢查 Supabase CLI 是否已登入
npx supabase login

# 確認專案連結
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 重試推送
npx supabase db push
```

### Issue 2: 策略未生效

**症狀**: User A 仍然可以看到 User B 的資料

**檢查**:

1. 確認 RLS 已啟用：`SELECT rowsecurity FROM pg_tables WHERE tablename = 'cards';`
2. 確認策略存在：`SELECT * FROM pg_policies WHERE tablename = 'cards';`
3. 確認 `auth.uid()` 返回正確值：`SELECT auth.uid();`

**解決方案**:

- 重新套用 migration
- 清除 Supabase 快取（重新整理瀏覽器）
- 重新登入應用程式

---

## 📚 參考資源

- **Supabase RLS 文件**: <https://supabase.com/docs/guides/auth/row-level-security>
- **PostgreSQL RLS**: <https://www.postgresql.org/docs/current/ddl-rowsecurity.html>
- **測試最佳實踐**: <https://supabase.com/docs/guides/database/testing>

---

**建立日期**: 2025-12-03
**最後更新**: 2025-12-03
**狀態**: 就緒，等待執行
