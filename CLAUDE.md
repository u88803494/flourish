# CLAUDE.md

本檔案提供 Claude Code (claude.ai/code) 在此儲存庫中工作時的指引。

**文檔框架**: 本檔案遵循 [Diataxis framework](https://diataxis.fr/) 結構：

- **Tutorials**（學習導向）：新手的逐步指南
- **How-to Guides**（目標導向）：特定任務的解決方案
- **Reference**（資訊導向）：技術規格
- **Explanation**（理解導向）：概念澄清

**相關文檔**:

- `AGENTS.md` - AI agent 協作工作流程與最佳實踐
- `ARCHITECTURE.md` - 系統架構與設計模式
- `docs/references/glossary.md` - 專案術語參考

## 🌱 專案總覽

**Flourish** 是整合的個人成長平台，用於財務追蹤和效能統計。基於理念：「When money flows and statistics rise, everything will **flourish**.」（當金錢流動、統計上升，一切都會繁榮）

### 當前架構（Sprint 8 決策）

專案已採用 **Supabase-first 架構**（ADR 001）：

```
前端（Flow/Apex）→ Supabase（資料庫 + 認證 + REST API）
         ↓
     Vercel
```

**關鍵優勢**：

- 成本：$0/月（vs NestJS + Render (已棄用) 的 $7+/月）
- 維護：減少約 70%
- 開發速度：快約 60%
- 完美符合當前需求（CRUD + 統計）

**狀態**：Sprint 9 已完成（Supabase 遷移完成）

---

## 🛠️ 必要開發指令

### 先決條件

- Node.js 20+
- pnpm 9+
- Turborepo monorepo 設定（所有 apps 在同一個 workspace）

### 快速開始

```bash
# 安裝依賴
pnpm install

# 以開發模式啟動所有 apps
pnpm dev
# 啟動：flow (3100), apex (3200)

# 啟動特定 app
pnpm dev --filter=flow      # 財務追蹤（Next.js）
pnpm dev --filter=apex      # 統計工具（Next.js）

# 建置所有應用程式
pnpm build

# Lint 所有應用程式
pnpm lint

# 類型檢查
pnpm check-types
```

### 資料庫（Prisma - 僅供參考）

**重要**：在 Sprint 9 中，遷移將改用 Supabase SQL 格式。Prisma schema 保留作為設計參考用途。

```bash
cd packages/database

# 檢視 Prisma schema
cat prisma/schema.prisma

# 生成 Prisma client（已完成）
pnpm prisma generate

# 本地執行遷移（僅開發環境）
pnpm migrate

# 推送 schema 至資料庫
pnpm db:push
```

### Supabase CLI（Sprint 9+）

```bash
# 登入 Supabase
npx supabase login

# 初始化本地開發
npx supabase init

# 連結至遠端專案
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 管理遷移
npx supabase migration new [name]     # 創建新遷移
npx supabase db push                  # 推送至遠端
npx supabase db reset                 # 重置本地資料庫
```

---

## 📁 專案結構

### 應用程式（apps/）

**flow** - 財務追蹤應用程式

- 框架：Next.js 15（App Router）
- Port：3100（開發環境）
- 狀態：核心功能就緒
- URL：https://flourish-flow.vercel.app

**apex** - 統計與效能追蹤

- 框架：Next.js 15（App Router）
- Port：3200（開發環境）
- 狀態：基礎完成，功能將在 Phase 1 推出
- URL：https://flourish-apex.vercel.app

**api** - ⚠️ **已封存**（2025-11-21）

- 框架：NestJS 11
- 狀態：不再維護
- 原因：遷移至 Supabase 架構（ADR 001）
- 封存位置：`docs/archive/nestjs-api/`
- 所有功能已由 Supabase 取代

### 共享套件（packages/）

**database**

- Prisma schema + client
- 狀態：遷移期間保留作為設計參考
- 位置：`packages/database/prisma/schema.prisma`
- 資料表：users, cards, categories, statements, transactions, recurring_expenses, saving_rules

**supabase-client**

- Supabase JavaScript client 包裝器
- TypeScript 類型（從 schema 自動生成）
- 常用操作的 React hooks
- 狀態：✅ 完成（Sprint 9, Task 3）

**ui**

- 共享 React 元件
- 基於 Tailwind CSS

**chart-engine**

- 圖表渲染邏輯
- 狀態：Phase 1 規劃中

**typescript-config, eslint-config**

- 共享配置檔案

---

## 🏗️ 架構決策

### ADR 001：架構簡化（2025-11-07）

**決策**：從 NestJS + Render 遷移至純 Supabase 架構

**原因**：

- Supabase 處理：資料庫 + 認證 + REST API + Realtime 訂閱
- 當前功能集不需要獨立後端
- 100% 成本削減（$0 vs $7+/月）
- 減少 70% 維護負擔
- 開發速度提升 60%

**實施**：Sprint 9（4 個任務）

**重要檔案**：

- 決策記錄：`docs/decisions/001-architecture-simplification.md`
- 評估：`docs/sprints/sprint-0-foundation/08-deployment-evaluation.md`
- 計劃：`docs/sprints/sprint-0-foundation/09-supabase-migration-plan.md`

---

## 🚀 開發工作流程

### 分支

- `main` - 正式環境（部署至 Vercel）
- `staging` - 測試環境（Sprint 9 後將棄用）
- `feat/*` - 功能分支
- `fix/*` - 錯誤修復分支

### 提交

遵循 **Conventional Commits** 格式：

```
feat(scope): description        # 新功能
fix(scope): description         # 錯誤修復
docs(scope): description        # 文檔
chore(scope): description       # 維護
refactor(scope): description    # 程式碼重構
```

範例：

```bash
git commit -m "feat(flow): add transaction filtering

- Add date range selector
- Add category filter
- Implement local state management"
```

### 創建功能

```bash
# 1. 創建功能分支
git checkout -b feat/new-feature

# 2. 開發循環
pnpm dev                    # 啟動開發
# ... 程式碼、測試、提交 ...

# 3. 推送並創建 PR
git push origin feat/new-feature

# 4. 審查並批准後
# 合併至 main → 自動部署至正式環境
```

---

## 📊 技術堆疊

### 前端

- **框架**：Next.js 15（App Router）
- **語言**：TypeScript（strict mode）
- **樣式**：Tailwind CSS
- **UI 元件**：React 19
- **狀態管理**：React Context（Phase 1 規劃 Redux）

### 後端（已遷移至 Supabase）

- **框架**：Supabase Edge Functions / PostgreSQL（根據需求選用）
- **ORM**：Prisma (保留 schema 作為參考，實際使用 Supabase CLI 和 SQL)
- **測試**：Jest (單元測試), Supertest (API，封存中)

### 資料庫

- **供應商**：Supabase（PostgreSQL）
- **遷移**：SQL 檔案（Supabase CLI）
- **認證**：Supabase Auth
- **API**：自動生成的 REST API，配合 RLS

### 部署

- **前端**：Vercel（從 main 自動部署）
- **資料庫**：Supabase (後端/資料庫)
- **後端**：正在移除（Sprint 9）

---

## 📚 關鍵文檔

### 架構與決策

- `docs/decisions/001-architecture-simplification.md` - 當前架構決策
- `docs/deployment/README.md` - 部署總覽（Supabase + Vercel）

### Sprint 規劃

- `docs/sprints/sprint-0-foundation/overview.md` - Phase 0 進度追蹤
- `docs/sprints/sprint-0-foundation/09-supabase-migration-plan.md` - Sprint 9 詳細計劃

### 開發指南

- `docs/guides/development.md` - 本地開發設定
- `docs/guides/mcp-setup.md` - MCP 配置指南（可用時）
- `docs/guides/database-migrations.md` - 遷移工作流程（Sprint 9）

### Git 工作流程

- `docs/deployment/git-workflow.md` - 分支與部署策略

---

## 🎯 當前階段：Phase 0 Foundation

**狀態**：✅ 完成（100% - 11 個 Sprint 已完成）

已完成的 Sprint：

- Sprint 1：Monorepo 結構 ✅
- Sprint 2-5：開發工具 ✅
- Sprint 6：NestJS ✅
- Sprint 7：Apex app ✅
- Sprint 8：架構決策 ✅
- Sprint 9：Supabase 遷移 ✅（4 個任務）
- Sprint 10：文檔與 Agent 設定 ✅
- Sprint 11：Sprint 編號重構 ✅

**下一個階段**：Phase 1 - 認證與核心功能

---

## 🔐 安全與環境變數

### 本地開發（.env.local）

```bash
# Supabase 配置（Sprint 9+）
SUPABASE_PROJECT_REF=fstcioczrehqtcbdzuij
SUPABASE_ACCESS_TOKEN=<your-access-token>  # 用於 Supabase CLI
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>   # 用於前端

# MCP 配置（選用，Sprint 9+）
# MCP config 使用上面定義的環境變數
```

**重要**：

- `.env.local` 在 `.gitignore` 中（絕不提交機密資訊）
- 在配置檔案中使用環境變數
- Service role key 僅用於遷移，絕不暴露給前端

---

## 🧠 程式碼庫工作

### 需要理解的關鍵檔案

1. **Turborepo 配置**
   - `turbo.json` - Monorepo 管線定義
   - 根目錄 `package.json` - Workspace 配置

2. **Prisma Schema**（參考）
   - `packages/database/prisma/schema.prisma`
   - 包含 7 個主要資料表（users, cards, categories, statements 等）
   - 已在 Sprint 9 中遷移至 Supabase SQL 格式

3. **前端配置**
   - `apps/flow/next.config.js` - Flow 的 Next.js 配置
   - `apps/apex/next.config.js` - Apex 的 Next.js 配置
   - 兩者皆使用 Tailwind CSS

4. **類型安全**
   - 所有地方都啟用 TypeScript strict mode
   - packages 中的共享類型
   - Prisma 生成資料庫模型的類型

### 重要：閱讀程式碼

**進行變更前**：

1. 檢查檔案是否有既有模式（遵循它們）
2. 查看檔案歷史中的最近提交
3. 檢查 ADR 以了解架構決策
4. 提交前執行 `pnpm lint`

**常見問題**：

- 類型錯誤？執行 `pnpm check-types`
- Lint 錯誤？執行 `pnpm lint --fix`
- 建置失敗？檢查 `pnpm build` 輸出

---

## 🚨 已知限制與未來工作

### 目前正在移除

- **NestJS API**（`apps/api/`）- 已在 Sprint 9 封存
  - 所有後端邏輯將直接使用 Supabase
  - 已儲存封存程式碼供參考：`docs/archive/nestjs-api/`

### 尚未實作

- **認證** - Sprint 1 將推出（Supabase Auth）
- **圖表** - Phase 1 規劃圖表引擎
- **Realtime** - Supabase Realtime 訂閱（未來）

### 架構假設

- 小型團隊（獨立開發者）
- 當前負載：小型使用者基礎（~50K MAU 免費層級）
- 未來成長：RLS 策略可擴展，複雜邏輯可能需要 Edge Functions
- 如需要可稍後升級至 NestJS（程式碼已封存）

---

## 💡 開發技巧

### 效能

- Monorepo：使用 `--filter` flag 專注於特定 apps
- 建置：Turborepo 快取建置，刪除 `.turbo/` 可清除快取
- 開發：每個 app 獨立執行，執行期間無跨 app 依賴

### 測試

- Jest 用於單元測試
- 執行：`pnpm test`（如已配置）
- E2E 測試使用 Supertest（僅 API，Sprint 9 封存期間）

### 除錯

- 前端使用瀏覽器 DevTools
- Supabase Dashboard 檢查資料庫
- Vercel Dashboard 檢查應用程式日誌

---

## 📞 取得協助

### 文檔

1. 檢查 `docs/` 目錄以獲取完整文檔
2. 閱讀相關 ADR 以了解架構決策
3. 檢查 Sprint 記錄以了解上下文

### 常見問題

- 「如何新增 API 端點？」→ 參閱 Supabase REST API 文檔
- 「如何部署？」→ 參閱 `docs/deployment/` 資料夾
- 「如何建立遷移？」→ 參閱 `docs/guides/database-migrations.md`（Sprint 9+）

---

**最後更新**：2025-11-21
**當前階段**：Phase 0 Foundation（100% 完成）
**下一步**：Phase 1 - 認證與核心功能
