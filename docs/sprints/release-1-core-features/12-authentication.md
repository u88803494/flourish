---
title: 'Sprint 12: 認證系統'
type: 'sprint'
release: 'Release 1'
sprint_number: 12
duration: '1-2 週'
start_date: '2025-11-26'
completed_date: ''
status: 'in_progress'
priority: 'P0'
tags: ['authentication', 'supabase-auth', 'google-oauth', 'security']
---

## 🔐 Sprint 12: 認證系統

**時間**: 1-2 週
**目標**: 使用 Supabase Auth + Google OAuth 實現使用者認證流程
**優先級**: P0（最高優先 - 核心基礎）
**前置需求**: Sprint 11 已完成

### 架構決策

本 Sprint 遵循 **ADR 003: 認證策略**，選擇 Supabase Auth + **Google OAuth** 作為主要認證方式。

**主要原因**：

- 與現有 Supabase 基礎設施原生整合（ADR 001）
- $0/月成本（50K MAU 免費額度）
- 與 RLS 無縫整合，可直接使用 `auth.uid()`
- **Google OAuth 優勢**：
  - 不需要 SMTP 設定（省去 email 寄送問題）
  - 一鍵登入，更好的用戶體驗
  - Google 處理 email 驗證和安全性
  - 未來可擴展支援 Email/Password

**參考文件**: `docs/decisions/003-authentication-strategy.md`

---

## 📋 任務分解（Stacked PRs 策略）

### 任務 12.0: shadcn/ui 設定 ✅

**GitHub Issue**: [#48](https://github.com/u88803494/flourish/issues/48)
**狀態**: 待合併（PR #43）

- [x] 安裝 shadcn/ui 依賴（clsx, tailwind-merge, cva）
- [x] 建立 `cn()` 工具函數
- [x] 新增 button, card, input, label, form 元件
- [x] 設定套件導出

---

### 任務 12.1: Supabase Auth 設定 + Google OAuth ✅

**GitHub Issue**: [#44](https://github.com/u88803494/flourish/issues/44) (已關閉)
**狀態**: 完成

#### 子任務

**程式碼（Sprint 9 已完成）**：

- [x] 安裝 `@supabase/ssr` 到 `packages/supabase-client`
- [x] 建立 `server.ts`，使用 `createServerClient`
- [x] 建立 `browser.ts`，使用 `createBrowserClient`
- [x] 更新套件導出設定

**Supabase Dashboard 設定**：

- [x] 確認環境變數已配置
- [x] 配置 Site URL：`http://localhost:3100`
- [x] 配置 Redirect URLs（localhost + production）

**Google OAuth 設定**：

- [ ] 建立 Google Cloud Console 專案
- [ ] 設定 OAuth 2.0 憑證
- [ ] 在 Supabase Dashboard 啟用 Google Provider
- [ ] 配置 Client ID 和 Client Secret

---

### 任務 12.2: Middleware + 路由保護 + 安全修復 🔄

**GitHub Issue**: [#45](https://github.com/u88803494/flourish/issues/45)
**預估時間**: 45-60 分鐘
**依賴**: 任務 12.1 完成
**狀態**: 進行中（安全修復已完成，待 PR 合併）

#### 子任務

- [x] 建立 `apps/flow/middleware.ts`
- [x] 實現 session 刷新邏輯
- [x] 定義公開路由（`/login`, `/`, `/about`, `/pricing`, `/maintenance`）
- [x] 定義受保護路由（`/dashboard`, `/transactions`, `/profile`, `/settings`, `/cards`, `/categories`, `/statements`）
- [x] 建立 `app/auth/callback/route.ts` 處理 OAuth callback
- [ ] 🔒 升級所有 apps 的 Next.js 至 15.2.3+（CVE-2025-29927 修復）

#### 安全修復（Code Review 後新增）

- [x] **Open Redirect 修復**：使用白名單驗證重定向路徑
- [x] **Zod 環境變數驗證**：使用 Zod v4 進行類型安全驗證
- [x] **Cookie 安全屬性**：強制 Secure、HttpOnly、SameSite 屬性
- [x] **錯誤處理**：try-catch + 維護頁面 fallback
- [x] **效能優化**：靜態資源和公開路由 early return（減少 ~70-80% API 呼叫）
- [x] **維護頁面**：`/maintenance` 頁面顯示服務異常訊息

#### 新增檔案

| 檔案                                                      | 用途             |
| --------------------------------------------------------- | ---------------- |
| `packages/supabase-client/src/lib/utils/url-validator.ts` | URL 白名單驗證   |
| `packages/supabase-client/src/lib/utils/env-validator.ts` | Zod 環境變數驗證 |
| `apps/flow/app/maintenance/page.tsx`                      | 服務維護頁面     |

---

### 任務 12.3: 登入 UI 頁面（Google OAuth）

**GitHub Issue**: [#46](https://github.com/u88803494/flourish/issues/46)
**預估時間**: 30-45 分鐘
**依賴**: PR #43 已合併、任務 12.2 完成

#### 子任務

- [ ] 建立 `app/(auth)/login/page.tsx`（Google 登入按鈕）
- [ ] 實現 `signInWithOAuth` 呼叫
- [ ] 新增 loading 狀態和錯誤處理
- [ ] 實現登出功能
- [ ] 建立 `app/(protected)/profile/page.tsx`（顯示用戶資訊）

**注意**：使用 Google OAuth 不需要註冊頁面，用戶首次登入自動建立帳號。

---

### 任務 12.4: RLS 策略 + 測試

**GitHub Issue**: [#47](https://github.com/u88803494/flourish/issues/47)
**預估時間**: 30-45 分鐘
**依賴**: 任務 12.1 完成（可與 12.3 平行進行）

#### 子任務

- [ ] 在所有資料表啟用 RLS（users, cards, transactions, categories, statements, recurring_expenses, saving_rules）
- [ ] 建立 SELECT 策略，使用 `auth.uid()` 檢查
- [ ] 建立 INSERT/UPDATE/DELETE 策略
- [ ] 建立 Supabase migration 檔案
- [ ] 測試：用戶 A 無法存取用戶 B 的資料
- [ ] 測試：未認證用戶無法存取任何資料
- [ ] 記錄所有 RLS 策略

---

## 🔄 工作流程：Stacked PRs 策略

```
main
  └── PR #43: 任務 12.0（shadcn/ui 設定）✅
        └── PR: 任務 12.1（Supabase Auth 設定）
              └── PR: 任務 12.2（Middleware）
                    └── PR: 任務 12.3（登入/註冊 UI）
              └── PR: 任務 12.4（RLS 策略）[平行分支]
```

**合併順序**：

1. PR #43（任務 12.0）→ main
2. 任務 12.1 PR → main
3. 任務 12.2 PR → main
4. 任務 12.3 PR → main（UI 依賴 middleware）
5. 任務 12.4 PR → main（12.1 完成後可隨時合併）

---

## ✅ 完成標準

- [ ] 使用者可以透過 Google 帳號一鍵登入
- [ ] JWT token 自動管理和刷新
- [ ] 受保護路由將未認證用戶重定向到登入頁
- [ ] 已認證用戶在登入頁會重定向到 dashboard
- [ ] RLS 策略有效隔離用戶資料
- [ ] 所有認證流程已手動測試
- [ ] 文檔已更新

---

## 🔗 相關文件

- **ADR**: `docs/decisions/003-authentication-strategy.md`
- **Supabase Auth 文件**: <https://supabase.com/docs/guides/auth>
- **Supabase Google OAuth**: <https://supabase.com/docs/guides/auth/social-login/auth-google>
- **Google Cloud Console**: <https://console.cloud.google.com/>
- **Supabase SSR**: <https://supabase.com/docs/guides/auth/server-side-rendering>
- **Next.js 認證**: <https://nextjs.org/docs/app/building-your-application/authentication>

---

## 📊 進度追蹤

| 任務                  | Issue | 狀態      | PR  |
| --------------------- | ----- | --------- | --- |
| shadcn/ui 設定        | #48   | ✅ 完成   | #43 |
| Supabase Auth 設定    | #44   | ✅ 完成   | #49 |
| Middleware + 安全修復 | #45   | 🔄 進行中 | #50 |
| 登入/註冊 UI          | #46   | ⏳ 待處理 | -   |
| RLS 策略              | #47   | ⏳ 待處理 | -   |

---

**最後更新**: 2025-11-28
**Sprint 狀態**: 進行中（2.5/5 任務完成，安全修復已完成待合併）

### 技術堆疊更新

- **Zod v4**: 用於環境變數驗證（`@repo/supabase-client`）
