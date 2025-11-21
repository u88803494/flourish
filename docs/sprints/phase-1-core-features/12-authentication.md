## 🔐 Sprint 12: 認證系統

**時間**: 1-2 週
**目標**: 實現完整的使用者認證流程（Supabase Auth + NestJS JWT 驗證）
**優先級**: P0（最高優先，功能基礎）
**前置需求**: Sprint 1-0.7 完成 + 建議完成 Sprint 9

### 主要任務

#### 1.1 Supabase Auth 設定

- [ ] 確認 Supabase 專案已建立並運行
- [ ] 在 `.env.local` 中設定好 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 啟用 Email/Password 登入方式
- [ ] (可選) 考慮啟用第三方登入，如 Google 或 GitHub

#### 1.2 前端整合 Supabase Auth

- [ ] 在 `apps/flow` 中安裝 `@supabase/auth-helpers-nextjs` 和 `@supabase/supabase-js`
- [ ] 建立一個共享的 Supabase client 實例 (`packages/supabase-client`)
- [ ] 實作包含註冊、登入功能的 Auth UI
- [ ] 實作登出功能
- [ ] 使用 Auth Helpers 建立 `protected routes`，未登入使用者將被導向登入頁面
- [ ] 建立一個使用者 Profile 頁面，顯示已登入的用戶資訊

#### 1.3 資料庫與後端安全

- [ ] 設計並啟用 RLS (Row Level Security) policies
  - 確保使用者 `update`/`delete`/`select` 操作只能針對自己的資料
  - 為 `users`, `transactions`, `categories` 等核心資料表建立 policies
- [ ] (可選) 如果需要註冊後觸發特定邏輯（如建立 profile），則建立一個 Supabase Edge Function
  - 建立一個 on `auth.users` insert 的 database webhook 或 trigger
  - 編寫 Edge Function 處理新用戶的初始化

#### 1.4 測試與文檔

- [ ] 手動測試完整認證流程：註冊 -> 登入 -> 訪問受保護頁面 -> 登出
- [ ] 確保 RLS policies 正確生效（嘗試A用戶訪問B用戶資料，應失敗）
- [ ] 撰寫認證流程和 RLS 策略的相關文檔

### 完成標準

- ✅ 使用者可以透過 Email/Password 註冊和登入
- ✅ 登入後，JWT 會被自動管理和刷新
- ✅ 前端的路由能有效保護，未登入者無法訪問
- ✅ 資料庫 RLS 策略能有效隔離不同用戶的資料
- ✅ (可選) Edge Function 能在用戶註冊後正確觸發
