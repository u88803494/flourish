---
title: 'Sprint 2-5: 開發工具設定'
type: 'sprint'
release: 'Release 0'
sprint_number: 2
duration: '80 分鐘'
start_date: '2025-10-29'
completed_date: '2025-10-30'
status: 'completed'
priority: 'P0'
tags: ['tooling', 'eslint', 'prettier', 'commitlint', 'husky']
---

# Sprint 2-5: 開發工具設定

**持續時間**: Sprint 2 (15分鐘) + Sprint 3 (20分鐘) + Sprint 4 (15分鐘) + Sprint 5 (30分鐘) = 80 分鐘
**完成日期**: 2025-10-30
**狀態**: ✅ 已完成

---

## 🎯 Sprint 目標

建立完整的開發工具鏈，確保程式碼品質、格式一致性和資料庫存取能力。

---

## 📋 Sprint 細分

### Sprint 2: Prettier 設定 ✅

**時間**: 15 分鐘
**目標**: 統一程式碼格式

**完成的工作**:

- ✅ 安裝並配置 Prettier
- ✅ 新增 format scripts
- ✅ 格式化現有程式碼庫
- ✅ 文檔化 Prettier 配置

**配置檔案**:

- `.prettierrc.json` - Prettier 配置
- `.prettierignore` - 忽略檔案清單

---

### Sprint 3: Husky + lint-staged ✅

**時間**: 20 分鐘
**目標**: Git hooks 自動化

**完成的工作**:

- ✅ 安裝 Husky for Git hooks
- ✅ 配置 lint-staged 進行 pre-commit 檢查
- ✅ 測試自動化工作流程
- ✅ 確保程式碼品質門檻

**配置檔案**:

- `.husky/pre-commit` - Pre-commit hook
- `.lintstagedrc.json` - lint-staged 配置

---

### Sprint 4: commitlint ✅

**時間**: 15 分鐘
**目標**: Commit message 驗證

**完成的工作**:

- ✅ 安裝 commitlint
- ✅ 配置 Conventional Commits 強制執行
- ✅ 新增 commit-msg hook
- ✅ 測試 commit message 驗證

**配置檔案**:

- `commitlint.config.js` - commitlint 配置
- `.husky/commit-msg` - Commit message hook

**規範格式**:

```
<type>(<scope>): <subject>

type: feat, fix, docs, chore, refactor, test, style, perf
scope: 選填，例如 flow, apex, api
subject: 簡短描述
```

---

### Sprint 5: Prisma 設定 ✅

**時間**: 30 分鐘
**目標**: 資料庫存取層建立

**完成的工作**:

- ✅ 建立 `@repo/database` 套件
- ✅ 初始化 Prisma 並連接 Supabase
- ✅ 定義基本 schema
- ✅ 配置 Turbo pipeline for Prisma

**重要說明**:

在 Sprint 9（Supabase Migration）後，Prisma schema 保留作為設計參考。實際資料庫操作使用：

- Supabase SQL migrations
- Supabase JavaScript client
- 自動生成的 TypeScript types

**Schema 涵蓋的資料表**:

- `User` - 使用者帳號
- `Card` - 信用卡資訊
- `Category` - 交易分類
- `Statement` - 信用卡帳單
- `Transaction` - 交易明細
- `RecurringExpense` - 週期性支出
- `SavingRule` - 儲蓄規則

---

## 🎯 關鍵成就

### 自動化工具鏈

- ✅ Pre-commit 自動格式化（Prettier + lint-staged）
- ✅ Commit message 自動驗證（commitlint）
- ✅ 程式碼品質門檻建立

### 資料庫基礎

- ✅ Prisma ORM 設定完成
- ✅ Schema 設計完成（7 個主要資料表）
- ✅ Supabase 連接配置

---

## 📚 學到的經驗

### 技術技能

1. **Husky + lint-staged**: Git hooks 自動化的最佳實踐
2. **Prisma**: ORM 設定與 schema 設計
3. **Monorepo 工具整合**: 在 workspace 環境中配置開發工具

### 流程技能

1. **程式碼品質自動化**: 建立門檻而非依賴手動檢查
2. **漸進式建立**: 逐步新增工具，每個 Sprint 專注一個面向
3. **文檔即程式碼**: 配置檔案即文檔

---

## 🔗 相關文檔

- [開發工具規劃](../../05-dev-tooling-plan.md)
- [Git 工作流程與 Commit 指南](../../07-git-workflow-and-commit-guidelines.md)
- [Release 0 總覽](./README.md)

---

**最後更新**: 2025-11-24
