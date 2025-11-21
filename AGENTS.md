# AGENTS.md

**目的**: AI Agent 協作指南，用於與 Claude Code 進行高效且一致的開發

**最後更新**: 2025-11-21
**狀態**: 使用中

---

## 🤖 Agent 角色與職責

### 主要 Agent: Claude Code

**角色**: 全端開發助手，專精於 Supabase-first 架構

**核心職責**:

- 程式碼生成與重構
- 文檔創建與維護
- Sprint 規劃與執行
- Git 工作流程管理
- 資料庫遷移 (Supabase SQL)
- 架構決策支援

**上下文來源**:

1. `CLAUDE.md` - 專案開發指南（主要參考）
2. `ARCHITECTURE.md` - 系統架構與設計模式
3. `docs/references/glossary.md` - 專案術語表
4. Sprint 文檔於 `docs/sprints/`
5. ADR 檔案於 `docs/decisions/`

---

## 🛠️ MCP Server 整合

### 可用的 MCP Servers

**Supabase MCP**（主要）

- 資料庫操作與遷移
- Schema 檢查與驗證
- RLS 策略管理
- Function 和 Trigger 創建

**Context7 MCP**

- 函式庫文檔查詢（React, Next.js, TypeScript）
- 框架最佳實踐
- 官方 API 參考

**Sequential Thinking MCP**

- 複雜問題分解
- 多步驟推理與規劃
- 架構分析

**Tavily MCP**（研究）

- 網頁搜尋最新資訊
- 文檔探索
- 技術研究

### 工具使用指南

**何時使用 Supabase MCP**:

- 創建或修改資料庫遷移
- 檢查 schema 一致性
- 測試 RLS 策略
- 檢查資料庫日誌

**何時使用 Context7**:

- 實作新的框架功能
- 查詢官方 API 文檔
- 尋找函式庫最佳實踐

**何時使用 Sequential**:

- Sprint 規劃與分解
- 複雜架構決策
- 多檔案重構策略

**何時使用 Tavily**:

- 查找最新套件版本
- 研究新技術
- 探索社群解決方案

---

## 📋 開發工作流程

### 1. Sprint 規劃階段

**Agent 行動**:

1. 從 `docs/sprints/sprint-X-*/overview.md` 讀取 Sprint 需求
2. 審查相關 ADR 以了解架構限制
3. 使用 Sequential MCP 分解任務
4. 創建詳細實作計劃
5. 在進行前獲得使用者批准

**輸出**:

- 詳細任務分解
- 檔案變更清單（CREATE, UPDATE, DELETE）
- 提交策略
- 驗證檢查清單

**範例**:

```
Sprint 0.9.3: Supabase Client Package
├── Task 1: 創建 @repo/supabase-client 套件
│   ├── CREATE packages/supabase-client/package.json
│   ├── CREATE packages/supabase-client/src/index.ts
│   └── UPDATE pnpm-workspace.yaml
├── Task 2: 生成 TypeScript 類型
│   └── CREATE packages/supabase-client/src/types.ts
└── Task 3: 實作 React hooks
    ├── CREATE packages/supabase-client/src/hooks/useAuth.ts
    └── CREATE packages/supabase-client/src/hooks/useTransactions.ts
```

### 2. 實作階段

**Agent 行動**:

1. 創建功能分支: `feat/sprint-X-description`
2. 逐步實作變更
3. 每次重大變更後執行驗證:
   - `pnpm build --filter=flow --filter=@flourish/apex`
   - `pnpm lint`
   - `pnpm check-types`
4. 使用 Conventional Commits 格式提交
5. 推送並創建包含完整描述的 PR

**分支命名規範**:

```
feat/sprint-X-description       # 功能實作
fix/issue-description           # Bug 修復
docs/documentation-update       # 純文檔更新
refactor/code-improvement       # 程式碼重構
```

**提交訊息格式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**範例**:

```bash
git commit -m "feat(supabase-client): add authentication hooks

- 實作 useAuth hook 用於 session 管理
- 新增 useUser hook 用於當前使用者資料
- 包含 auth state 的 TypeScript 類型

Closes #20"
```

### 3. 驗證階段

**必要檢查**:

- [ ] Build 通過: `pnpm build --filter=flow --filter=@flourish/apex`
- [ ] Lint 通過: `pnpm lint`
- [ ] 類型有效: `pnpm check-types`
- [ ] 文檔已更新（如適用）
- [ ] 提交遵循 Conventional Commits

**已知可跳過問題**:

- `docs` app build 失敗（既有問題，與本次無關）

### 4. Pull Request 階段

**PR 描述範本**:

```markdown
## Sprint X: [標題]

**Issue**: Closes #XX
**Sprint Doc**: `docs/sprints/sprint-X-*/overview.md`

---

## Changes

### 創建

- [ ] 檔案/目錄路徑
- [ ] 檔案/目錄路徑

### 修改

- [ ] 檔案/目錄路徑
- [ ] 檔案/目錄路徑

### 刪除

- [ ] 檔案/目錄路徑

---

## Verification

- [x] Build 通過
- [x] Lint 通過
- [x] 類型有效
- [x] 文檔已更新

---

## 實作注意事項

[任何重要細節、決策或上下文]
```

---

## 🎯 最佳實踐

### 程式碼生成

**應該做**:

- ✅ 遵循檔案中現有的程式碼模式
- ✅ 使用 TypeScript strict mode
- ✅ 為公開 API 添加 JSDoc 註解
- ✅ 包含錯誤處理
- ✅ 使用描述性的變數名稱

**不應該做**:

- ❌ 在不理解上下文的情況下生成程式碼
- ❌ 跳過類型標註
- ❌ 忽略現有模式
- ❌ 創建不必要的抽象
- ❌ 硬編碼環境變數

### 文檔

**應該做**:

- ✅ 架構變更時更新 CLAUDE.md
- ✅ 為重大決策創建 ADR
- ✅ 記錄 breaking changes
- ✅ 完成任務時更新 Sprint overview
- ✅ 一致使用 glossary 術語

**不應該做**:

- ❌ 在沒有程式碼變更的情況下生成文檔
- ❌ 在沒有實作的情況下更新文檔
- ❌ 在文檔中留下 TODO
- ❌ 使用不一致的術語
- ❌ 忘記更新「最後更新」日期

### 資料庫遷移

**應該做**:

- ✅ 使用 Supabase CLI 進行遷移: `npx supabase migration new [name]`
- ✅ 遵循遷移指南: `docs/guides/database-migrations.md`
- ✅ 本地測試遷移: `npx supabase db reset`
- ✅ 為新表包含 RLS 策略
- ✅ 為外鍵添加索引

**不應該做**:

- ❌ 使用 Prisma 遷移（已棄用）
- ❌ 跳過 RLS 策略
- ❌ 硬編碼 UUID
- ❌ 推送未測試的遷移到生產環境
- ❌ 忘記記錄 breaking changes

---

## 🔍 上下文管理

### 閱讀優先級

**開始新任務時**:

1. 閱讀 CLAUDE.md（永遠是第一個）
2. 閱讀 ARCHITECTURE.md（如果與架構相關）
3. 閱讀 Sprint overview (`docs/sprints/sprint-X-*/overview.md`)
4. 如有引用則閱讀 ADR
5. 閱讀 glossary 以了解不熟悉的術語

**實作功能時**:

1. 閱讀程式碼庫中現有的類似程式碼
2. 使用 Context7 查找框架特定模式
3. 檢查 git 歷史查看最近變更: `git log --oneline -- <file>`

**遇到困難時**:

1. 使用 Sequential MCP 分解問題
2. 使用 Tavily 搜尋網頁解決方案
3. 審查 Sprint 文檔以了解上下文
4. 向使用者尋求澄清

### 記憶管理

**Agent 應該記住**:

- 當前 Sprint 編號和目標
- 最近的架構決策（ADR）
- 活動分支名稱
- 當前 Sprint 的未完成任務

**Agent 可以忘記**:

- 已完成的 Sprint 細節（已記錄在 overview 中）
- 已棄用的功能（已記錄在 archive 中）
- 臨時實作細節

---

## 🚨 錯誤處理

### 常見問題

**Build 失敗**:

```bash
# 問題: 類型錯誤
# 解決方案:
pnpm check-types
# 修復報告的類型錯誤

# 問題: Lint 錯誤
# 解決方案:
pnpm lint --fix
```

**遷移失敗**:

```bash
# 問題: 遷移已存在
# 解決方案: 使用 IF NOT EXISTS
CREATE TABLE IF NOT EXISTS table_name (...)

# 問題: RLS 阻擋存取
# 解決方案: 檢查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'table_name'
```

**Git 問題**:

```bash
# 問題: 合併衝突
# 解決方案:
git status
git diff <conflicted-file>
# 解決衝突，然後:
git add <resolved-file>
git commit

# 問題: 分支錯誤
# 解決方案:
git checkout main
git pull
git checkout -b feat/correct-branch
```

### 升級協議

**何時詢問使用者**:

1. ADR 未涵蓋的架構決策
2. 影響現有功能的 breaking changes
3. Sprint 文檔中的模糊需求
4. 資源限制（例如套件大小考量）
5. 安全考量（例如暴露敏感資料）

**如何詢問**:

- 提供文檔中的上下文
- 解釋權衡取捨
- 建議 2-3 個選項及其優缺點
- 推薦首選方案並說明理由

---

## 📊 品質標準

### 程式碼品質

**指標**:

- TypeScript strict mode 合規: 100%
- Lint 錯誤: 0
- Build 成功: 必要
- 測試覆蓋率: 尚未要求（未來）

**審查檢查清單**:

- [ ] 遵循專案程式碼風格
- [ ] 無 console.log 陳述句（使用適當的日誌記錄）
- [ ] 已實作錯誤處理
- [ ] 類型是具體的（不是 `any`）
- [ ] 函式是專注且可測試的

### 文檔品質

**指標**:

- 時效性: 變更後 7 天內更新「最後更新」
- 完整性: 所有章節已填寫
- 準確性: 符合實際實作
- 一致性: 使用 glossary 術語

**審查檢查清單**:

- [ ] 遵循 Diataxis 框架（如適用）
- [ ] 範例經過測試
- [ ] 連結有效
- [ ] 程式碼區塊有語言標籤
- [ ] 使用適當的標題階層

---

## 🎓 學習與適應

### Agent 改進領域

**技術技能**:

- Supabase 進階功能（Edge Functions, Realtime）
- Next.js 15 App Router 模式
- React Server Components
- 效能優化

**流程技能**:

- Sprint 規劃準確性
- 時間估算
- 分解複雜任務
- Git 工作流程效率

### 反饋循環

**每個 Sprint 後**:

1. 審查哪些做得好
2. 識別可以改進的地方
3. 根據學習更新本文檔
4. 將反饋納入下一個 Sprint

**使用者反饋整合**:

- 使用者更正 → 更新理解
- 使用者偏好 → 記錄在 CLAUDE.md
- 使用者模式 → 識別並遵循
- 使用者關注 → 主動處理

---

## 🔗 相關文檔

**核心文檔**:

- `CLAUDE.md` - 主要開發指南
- `ARCHITECTURE.md` - 系統架構
- `docs/references/glossary.md` - 專案術語

**工作流程文檔**:

- `docs/deployment/git-workflow.md` - Git 和部署流程
- `docs/guides/database-migrations.md` - 遷移工作流程

**規劃文檔**:

- `docs/sprints/sprint-0-foundation/overview.md` - 當前階段狀態
- `docs/decisions/` - 架構決策記錄

---

**維護者**: Claude Code Agent
**審查頻率**: 每個 Sprint
**下次審查**: Sprint 11 完成後
