---
title: 'Sprint 14: 文檔標準化'
type: 'sprint'
release: 'Release 1'
sprint_number: 14
duration: '79-117 小時'
start_date: '2025-11-24'
completed_date: '2025-11-25'
status: 'completed'
priority: 'P1'
tags: ['documentation', 'standardization', 'markdown', 'templates']
---

# Sprint 14: 文檔標準化

**持續時間**: 79-117 小時（估計）
**開始日期**: 2025-11-24
**完成日期**: 2025-11-25
**狀態**: ✅ 已完成
**Issue**: [#33](https://github.com/u88803494/flourish/issues/33)
**PR**: [#41](https://github.com/u88803494/flourish/pull/41)

---

## 🎯 Sprint 目標

將專案文檔結構標準化，採用 Agile/Scrum 標準術語（Release），並修正術語不一致問題，提升文檔品質與可維護性。

---

## 🎯 背景

根據 Agile 專家研究（見 Sprint 11），當前使用的 "Phase" 和 "Sub-Sprint" 不是標準 Scrum 術語。應該使用：

- **Release**（釋出）：一組相關 Sprints，產出可發布版本
- **Sprint**（衝刺）：獨立的開發迭代
- **Task**（任務）：Sprint 內的工作項目

**正確層級**:

```
Project → Release → Sprint → Task
```

---

## 📋 Tasks

### Task 1: Emergency Fixes ✅ COMPLETED

**時間**: 4-6 小時（實際約 4 小時）
**PR**: [#34](https://github.com/u88803494/flourish/pull/34)
**狀態**: ✅ 已合併

**完成的工作**:

1. **批次術語替換**
   - ✅ `Phase 0/1` → `Release 0/1`（38 處）
   - ✅ `Sub-Sprint` → `Sprint`（4 處）
   - ✅ 功能需求中的 `**Phase**:` → `**Release**:`
   - ✅ 區分軟體釋出 vs. 程序階段的 "Phase" 使用

2. **目錄和檔案重命名**
   - ✅ `phase-0-foundation/` → `release-0-foundation/`
   - ✅ `phase-1-core-features/` → `release-1-core-features/`
   - ✅ `overview.md` → `README.md`（2 個檔案）

3. **連結修正**
   - ✅ 更新 50+ 內部文檔引用
   - ✅ CLAUDE.md 中的 Sprint 規劃連結
   - ✅ README.md 中的路徑引用

4. **Sprint 狀態更新**
   - ✅ 標記 Sprint 1-11 為已完成
   - ✅ 更新 Release 0 進度為 100%
   - ✅ 新增 Sprint 9, 10, 11 詳細資訊

5. **PR Review 修正**
   - ✅ ARCHITECTURE.md 擴展性階段保持 "Phase"
   - ✅ render-deployment-guide.md 部署步驟保持 "Phase"
   - ✅ functional-requirements.md Phase 2, 3+ 改為 Release 2, 3+

**影響檔案**: 38 個
**變更統計**: 180 insertions, 164 deletions

---

### Task 2: Structure Completion 🔄 進行中

**時間**: 21-32 小時（估計）
**PR**: TBD
**狀態**: 🔄 進行中

**規劃的工作**:

1. **Sprint 1-6 獨立文檔**（繁體中文）
   - ✅ Sprint 1: Monorepo 基礎架構
   - ✅ Sprint 2-5: 開發工具設定
   - ✅ Sprint 6: NestJS 應用程式與最佳化
   - 從 Release 0 README 提取內容
   - 標準化文檔格式

2. **Sprint 13, 15 Placeholder**（繁體中文）
   - ✅ Sprint 13: 交易 CRUD 功能（placeholder）
   - ✅ Sprint 15: 圖表整合（placeholder）
   - 待 Sprint 12 完成後細化

3. **Sprint 14 完整文檔**（繁體中文）
   - 🔄 此文檔本身
   - 記錄 Task 1-4 執行細節
   - 包含決策記錄與學習經驗

4. **Supabase 文檔結構**（12 個檔案，繁體中文）
   - 架構概覽（3 個檔案）
   - 使用指南（5 個檔案）
   - API 參考（4 個檔案）
   - 詳見 Task 3

5. **Index 檔案**（繁體中文）
   - `docs/QUICKSTART.md` - 快速開始指南
   - `docs/PROGRESS.md` - 專案進度追蹤
   - `docs/archive/README.md` - 封存文檔索引
   - `docs/references/agile-terminology.md` - Agile 術語參考

---

### Task 3: Content Optimization

**時間**: 28-43 小時（估計）
**PR**: TBD
**狀態**: 📦 規劃中

**規劃的工作**:

1. **Supabase 架構文檔**（繁體中文）
   - Supabase-first 架構總覽
   - 與 NestJS 架構的比較
   - 遷移決策記錄（ADR 001 擴展）

2. **Supabase 使用指南**（繁體中文）
   - 本地開發設定
   - 資料庫遷移工作流程
   - RLS 策略設計指南
   - Auth 整合指南
   - Edge Functions 使用（未來）

3. **Supabase API 參考**（繁體中文）
   - TypeScript 類型參考
   - React Hooks API
   - 常用查詢模式
   - 錯誤處理最佳實踐

---

### Task 4: Standardization

**時間**: 15-21 小時（估計）
**PR**: TBD
**狀態**: 📦 規劃中

**規劃的工作**:

1. **YAML Frontmatter**
   - 為所有 Sprint 文檔新增 frontmatter
   - 標準化 metadata（status, duration, completed date）

2. **文檔模板**（繁體中文）
   - Sprint 文檔模板
   - ADR 模板
   - 指南文檔模板

3. **markdownlint 設定**
   - 配置 markdownlint 規則
   - 修復現有 lint 錯誤
   - 新增 pre-commit hook

---

## 🎯 成功標準

- [x] Task 1: Emergency Fixes 完成並合併
- [ ] Task 2: Structure Completion 完成
  - [ ] Sprint 1-6 獨立文檔建立
  - [ ] Sprint 13, 15 placeholder 建立
  - [ ] Sprint 14 完整文檔建立
  - [ ] Supabase 文檔結構建立
  - [ ] Index 檔案建立
- [ ] Task 3: Content Optimization 完成
- [ ] Task 4: Standardization 完成
- [ ] 所有 PR 合併至 `feat/sprint-14-doc-standardization`
- [ ] Sprint 14 總分支合併至 `main`

---

## 📚 學到的經驗

### Task 1 經驗

1. **Context-Aware 替換**: 不是所有 "Phase" 都該改為 "Release"
   - 軟體功能釋出 → Release
   - 程序性/技術性階段 → Phase（如擴展性階段、部署步驟）

2. **Git 歷史保留**: 使用 `git mv` 保留檔案重命名歷史

3. **分層 PR 策略**:
   - 總分支：`feat/sprint-14-doc-standardization`
   - Task 分支：`feat/sprint-14-task-1-emergency-fixes`
   - 便於獨立審查與合併

4. **日期注意**: 2025-11-24 不是 2025-01-24（月份錯誤）

5. **.gitignore AI 記憶檔**: `.serena/memories/` 不應 commit

---

## 🔗 相關文檔

- [Issue #33 - Documentation Standardization](https://github.com/u88803494/flourish/issues/33)
- [PR #34 - Task 1: Emergency Fixes](https://github.com/u88803494/flourish/pull/34)
- [Sprint 11 - Sprint Numbering Refactoring](../release-0-foundation/11-sprint-numbering-refactoring.md)
- [Agile 術語參考](../../references/glossary.md)

---

**最後更新**: 2025-11-25
**狀態**: ✅ Sprint 完成並合併至 main
**成果**: 92 檔案變更，22,758+ 行新增，315- 行刪除
