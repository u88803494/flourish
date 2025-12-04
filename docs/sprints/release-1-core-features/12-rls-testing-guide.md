# RLS 測試指南

**目的**: 驗證 Row Level Security (RLS) 策略正確隔離用戶資料

**時間**: 約 15-20 分鐘

---

## 📋 測試前準備

### 需要準備

1. **兩個 Google 帳號**（用於測試用戶隔離）
2. **Supabase Dashboard 訪問權限**
3. **Flow 應用程式訪問權限**（<https://flourish-flow.vercel.app>）

---

## 🔍 階段 1：SQL 驗證（5 分鐘）

### 步驟 1: 前往 Supabase SQL Editor

1. 打開 <https://supabase.com/dashboard/project/fstcioczrehqtcbdzuij>
2. 點擊左側選單的「**SQL Editor**」
3. 點擊「**New query**」

### 步驟 2: 驗證 RLS 啟用狀態

**複製並執行以下查詢**：

```sql
-- 檢查 RLS 是否在所有表啟用
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'cards', 'categories', 'statements',
    'transactions', 'recurring_expenses', 'saving_rules'
  )
ORDER BY tablename;
```

**✅ 預期結果**：所有 7 個表的 `rls_enabled` 欄位都應該是 `true`

### 步驟 3: 驗證策略數量

**執行此查詢**：

```sql
-- 計算每個表的策略數量
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**✅ 預期結果**：

| tablename           | policy_count |
| ------------------- | ------------ |
| \_prisma_migrations | 1            |
| cards               | 4            |
| categories          | 4            |
| recurring_expenses  | 4            |
| saving_rules        | 4            |
| statements          | 4            |
| transactions        | 4            |
| users               | 2            |

**總計**: 29 個策略（28 個用戶資料表 + 1 個 prisma_migrations）

### 步驟 4: 查看策略詳細資訊（選用）

```sql
-- 列出所有 RLS 策略
SELECT
  tablename,
  policyname,
  cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 👥 階段 2：用戶隔離測試（10 分鐘）

### 測試目標

- 驗證 User A 無法看到 User B 的資料
- 驗證每個用戶只能 CRUD 自己的資料

### 步驟 1: User A 建立測試資料

1. **使用 Google 帳號 A 登入** Flow 應用程式
2. **記錄 User A 的 email**（之後用於驗證）
3. **建立測試資料**：
   - 前往 Dashboard（應該是空的，因為是新用戶）
   - 如果有資料，記下現有資料數量

### 步驟 2: User B 建立測試資料

1. **登出 User A**
2. **使用 Google 帳號 B 登入** Flow 應用程式
3. **記錄 User B 的 email**
4. **建立測試資料**：
   - 前往 Dashboard
   - 確認看不到 User A 的任何資料

### 步驟 3: 在 Supabase Dashboard 驗證

1. 前往 **Supabase Dashboard** → **Table Editor**
2. 打開 `users` 表
3. **確認**：可以看到兩個用戶記錄（User A 和 User B）

4. 執行以下查詢：

```sql
-- 列出所有用戶（應該看到兩個）
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC;
```

**✅ 預期結果**：看到兩個用戶記錄

---

## 🔒 階段 3：RLS 策略驗證（5 分鐘）

### 測試 SELECT 權限

在 **Supabase SQL Editor** 執行：

```sql
-- 嘗試以特定用戶身份查詢（模擬）
-- 注意：此查詢在 SQL Editor 以 service_role 執行，會看到所有資料
-- 實際 RLS 保護在應用程式層級（透過 API）生效

SELECT
  u.email,
  COUNT(DISTINCT c.id) as card_count,
  COUNT(DISTINCT t.id) as transaction_count
FROM users u
LEFT JOIN cards c ON c.user_id = u.id
LEFT JOIN transactions t ON t.user_id = u.id
GROUP BY u.id, u.email;
```

**✅ 預期結果**：看到兩個用戶的資料摘要

### 測試 API 層級的 RLS

**最佳測試方式**：透過應用程式的實際操作

1. **User A 登入** → 只能看到自己的資料
2. **User B 登入** → 只能看到自己的資料
3. **未登入** → 無法訪問受保護路由（自動重定向到 `/login`）

---

## ✅ 測試檢查清單

### SQL 驗證

- [ ] 所有 7 個用戶資料表啟用 RLS（`rowsecurity = true`）
- [ ] 總共 29 個 RLS 策略（28 個用戶資料 + 1 個 prisma_migrations）
- [ ] `users` 表有 2 個策略（SELECT, UPDATE）
- [ ] 其他 6 個表各有 4 個策略（SELECT, INSERT, UPDATE, DELETE）

### 用戶隔離測試

- [ ] User A 登入後只能看到自己的資料
- [ ] User B 登入後只能看到自己的資料
- [ ] User A 看不到 User B 的任何資料（反之亦然）
- [ ] Dashboard 中確實有兩個用戶記錄

### 認證測試

- [ ] 未登入用戶訪問 `/dashboard` 會重定向到 `/login`
- [ ] 登入後可以正常訪問受保護路由
- [ ] 登出後再次被保護

---

## 🐛 常見問題

### Q1: SQL Editor 看到所有用戶的資料，RLS 是否失效？

**A**: 不是！SQL Editor 使用 `service_role` key，擁有完整權限。RLS 保護作用於：

- 應用程式透過 `anon` key 的 API 呼叫
- Supabase 自動生成的 REST API
- PostgREST endpoints

在應用程式中（透過 `@repo/supabase-client`）才會真正受到 RLS 限制。

### Q2: 如何測試 INSERT/UPDATE/DELETE 權限？

**A**: 目前最簡單的方式：

1. User A 登入，嘗試建立資料（應該成功）
2. 在 SQL Editor 查看資料，確認 `user_id` 是 User A 的 UUID
3. User B 登入，確認看不到 User A 剛建立的資料

### Q3: 我沒有兩個 Google 帳號怎麼辦？

**A**: 你可以：

1. **簡化測試**：使用一個帳號測試基本功能（登入、看到自己的資料）
2. **Incognito Mode**：一個正常視窗 + 一個無痕視窗使用同一個 Google 帳號（**不推薦**，因為會共享 session）
3. **暫時跳過**：先部署到 production，之後再用兩個帳號測試

---

## 📝 測試結果記錄

完成測試後，請在 `12-rls-test-results.md` 更新以下資訊：

```markdown
### 手動測試結果（2025-12-03）

**測試者**: [你的名字]

#### SQL 驗證

- ✅ RLS 啟用檢查通過（7/7 表）
- ✅ 策略數量正確（29 個策略）

#### 用戶隔離測試

- ✅ User A (email: xxx@gmail.com) 登入成功
- ✅ User B (email: yyy@gmail.com) 登入成功
- ✅ 資料隔離驗證通過（User A 看不到 User B 的資料）

#### 問題與發現

- [如有任何問題或意外發現，記錄在此]
```

---

## 🎯 測試完成後

1. **更新測試結果文檔**：`12-rls-test-results.md`
2. **建立 PR**：將 `feat/sprint-12.4-rls-policies` 合併到 `main`
3. **部署驗證**：確認 production 環境 RLS 正常運作
4. **開始 Sprint 13**：Transaction CRUD 功能開發

---

**最後更新**: 2025-12-03
**版本**: 1.0
