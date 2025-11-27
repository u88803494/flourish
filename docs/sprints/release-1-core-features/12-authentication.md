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
tags: ['authentication', 'supabase-auth', 'security']
---

## 🔐 Sprint 12: 認證系統

**時間**: 1-2 週
**目標**: 使用 Supabase Auth 實現完整的使用者認證流程
**優先級**: P0（最高優先 - 核心基礎）
**前置需求**: Sprint 11 已完成

### 架構決策

本 Sprint 遵循 **ADR 003: 認證策略**，選擇 Supabase Auth 而非 Clerk 或 NextAuth.js。

**主要原因**：

- 與現有 Supabase 基礎設施原生整合（ADR 001）
- $0/月成本（50K MAU 免費額度）
- 與 RLS 無縫整合，可直接使用 `auth.uid()`
- 若未來需要，有清晰的 Clerk 遷移路徑

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

### 任務 12.1: Supabase Auth 伺服器/客戶端設定 ✅

**GitHub Issue**: [#44](https://github.com/u88803494/flourish/issues/44) (已關閉)
**狀態**: 完成（程式碼在 Sprint 9 已實作，手動設定已完成）

#### 子任務

- [x] 安裝 `@supabase/ssr` 到 `packages/supabase-client`（Sprint 9）
- [x] 建立 `server.ts`，使用 `createServerClient`（Sprint 9）
- [x] 建立 `browser.ts`，使用 `createBrowserClient`（Sprint 9）
- [x] 更新套件導出設定（Sprint 9）
- [x] 確認環境變數已配置
- [x] 在 Supabase Dashboard 啟用 Email/Password 認證
- [x] 配置 Site URL 和 Redirect URLs

---

### 任務 12.2: Middleware + 路由保護 + Next.js 升級

**GitHub Issue**: [#45](https://github.com/u88803494/flourish/issues/45)
**預估時間**: 45-60 分鐘
**依賴**: 任務 12.1 完成

#### 子任務

- [ ] 🔒 升級所有 apps 的 Next.js 至 15.2.3+（CVE-2025-29927 修復）
- [ ] 建立 `apps/flow/middleware.ts`
- [ ] 實現 session 刷新邏輯
- [ ] 定義公開路由（`/login`, `/register`, `/`）
- [ ] 定義受保護路由（`/dashboard`, `/transactions`）
- [ ] 建立 `app/auth/callback/route.ts` 處理 OAuth/magic links
- [ ] 驗證 middleware 安全性

---

### 任務 12.3: 登入/註冊 UI 頁面

**GitHub Issue**: [#46](https://github.com/u88803494/flourish/issues/46)
**預估時間**: 1-1.5 小時
**依賴**: PR #43 已合併、任務 12.2 完成

#### 子任務

- [ ] 建立 `app/(auth)/login/page.tsx`
- [ ] 建立 `app/(auth)/register/page.tsx`
- [ ] 使用 zod 實現表單驗證
- [ ] 新增 loading 狀態和錯誤處理
- [ ] 實現登出功能
- [ ] 建立 `app/(protected)/profile/page.tsx`

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

- [ ] 使用者可以透過 Email/Password 註冊和登入
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
- **Supabase SSR**: <https://supabase.com/docs/guides/auth/server-side-rendering>
- **Next.js 認證**: <https://nextjs.org/docs/app/building-your-application/authentication>

---

## 📊 進度追蹤

| 任務               | Issue | 狀態      | PR  |
| ------------------ | ----- | --------- | --- |
| shadcn/ui 設定     | #48   | ✅ 完成   | #43 |
| Supabase Auth 設定 | #44   | ✅ 完成   | -   |
| Middleware         | #45   | ⏳ 待處理 | -   |
| 登入/註冊 UI       | #46   | ⏳ 待處理 | -   |
| RLS 策略           | #47   | ⏳ 待處理 | -   |

---

**最後更新**: 2025-11-27
**Sprint 狀態**: 進行中（2/5 任務完成）
