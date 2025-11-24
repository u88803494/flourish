# Agile/Scrum 術語參考

本文檔定義 Flourish 專案使用的 Agile/Scrum 標準術語。

---

## 🎯 核心術語

### Project（專案）

**定義**: 整個軟體產品或系統

**範例**: Flourish（整合式個人成長平台）

**特性**:

- 最高層級的組織單位
- 包含多個 Releases
- 有明確的願景與目標

---

### Release（釋出）

**定義**: 一組相關 Sprints 的集合，產出可發布的產品版本或重要里程碑

**英文**: Release
**中文**: 釋出、版本
**複數**: Releases

**特性**:

- 包含多個 Sprint
- 有明確的功能目標
- 產出可發布的版本
- 符合 Scrum 標準術語

**階層**: `Project → Release → Sprint → Task`

**Flourish 範例**:

- **Release 0**: Foundation（基礎建設，Sprint 1-11）
- **Release 1**: Core Features（核心功能，Sprint 12-15）
- **Release 2**: Production Readiness（生產就緒）

**對應 SAFe**:

- 未來可升級至 SAFe 的 **PI (Program Increment)**

---

### Sprint（衝刺）

**定義**: 固定時間框內的開發迭代，通常 1-4 週

**英文**: Sprint
**中文**: 衝刺、迭代
**複數**: Sprints

**特性**:

- 固定時間框（Time-boxed）
- 有明確的 Sprint Goal
- 產出可工作的增量（Increment）
- 獨立編號（跨越所有 Releases）

**Flourish 規範**:

- 編號：1, 2, 3... (連續編號，不重置)
- 非：0.1, 0.2（已廢棄）
- 非：Sub-Sprint（不存在此術語）

**範例**:

- Sprint 1: Monorepo 基礎架構
- Sprint 9: Supabase 遷移
- Sprint 12: Authentication

---

### Task（任務）

**定義**: Sprint 內的具體工作項目

**英文**: Task
**中文**: 任務、工作項
**複數**: Tasks

**特性**:

- 屬於特定 Sprint
- 可獨立執行（通常）
- 有明確的完成標準
- 4-48 小時工作量

**Flourish 範例**:

- Sprint 9, Task 1: Supabase CLI & Environment Setup
- Sprint 9, Task 2: Database Schema & Migrations
- Sprint 14, Task 1: Emergency Fixes

**編號格式**: `Sprint X, Task Y` 或 `Task Y`（在 Sprint 內文中）

---

## ❌ 非標準術語（已棄用）

### Phase（階段）

**問題**:

- 不是 Scrum 標準術語
- 來自 Waterfall 瀑布式開發
- 容易與 "Release" 概念混淆

**Flourish 處理**:

- ❌ 不再使用 "Phase 0", "Phase 1" 指稱軟體釋出
- ✅ 改用 "Release 0", "Release 1"
- ✅ "Phase" 僅用於程序性/技術性階段（如：擴展性 Phase 1-3）

**遷移**: Sprint 11, Sprint 14

---

### Sub-Sprint

**問題**:

- Scrum 中不存在此概念
- Sprint 本身就是最小的迭代單位
- 應使用 "Task" 表示 Sprint 內的工作項

**Flourish 處理**:

- ❌ 完全棄用
- ✅ 改用 "Task"

**遷移**: Sprint 11

---

## 📊 術語對照表

| 英文           | 繁體中文  | Scrum 標準     | Flourish 使用       |
| -------------- | --------- | -------------- | ------------------- |
| **Project**    | 專案      | ✅             | ✅ Flourish         |
| **Release**    | 釋出/版本 | ✅             | ✅ Release 0, 1, 2  |
| **Sprint**     | 衝刺/迭代 | ✅             | ✅ Sprint 1-15      |
| **Task**       | 任務      | ✅             | ✅ Sprint X, Task Y |
| **Epic**       | 史詩      | ✅             | 📦 未來可能使用     |
| **Phase**      | 階段      | ❌ (Waterfall) | ⚠️ 僅特定情境       |
| **Sub-Sprint** | -         | ❌             | ❌ 已棄用           |

---

## 🎓 延伸術語（未來可能使用）

### Epic（史詩）

**定義**: 需要多個 Sprints 才能完成的大型功能

**範例**: "PDF Statement Processing" Epic

- Sprint X: Upload & Parsing
- Sprint Y: AI Extraction
- Sprint Z: Transaction Matching

**狀態**: 📦 Flourish 目前未使用，未來 Release 2+ 可能引入

---

### PI (Program Increment)

**定義**: SAFe (Scaled Agile Framework) 中的計劃週期

**對應關係**: PI ≈ Release (但更正式、更大規模)

**狀態**: 📦 未來若團隊擴大，可考慮採用 SAFe

---

## 🔗 參考資源

### 官方文檔

- [Scrum Guide](https://scrumguides.org/) - Scrum 官方指南
- [Atlassian Agile Coach](https://www.atlassian.com/agile) - Agile 概念與實踐
- [Scaled Agile Framework (SAFe)](https://scaledagileframework.com/) - 大規模 Agile

### Flourish 相關

- [Sprint 11 - Sprint Numbering Refactoring](../sprints/release-0-foundation/11-sprint-numbering-refactoring.md)
- [Sprint 14 - Documentation Standardization](../sprints/release-1-core-features/14-documentation-standardization.md)
- [專案術語表](./glossary.md)

---

## 📝 使用指南

### 文檔撰寫時

✅ **正確**:

- "Release 1 will include Sprint 12-15"
- "Sprint 14, Task 2 is in progress"
- "This feature is part of Release 2"

❌ **錯誤**:

- "Phase 1 will include Sprint 12-15" (應使用 Release)
- "Sprint 14, Sub-task 2" (應使用 Task)
- "Sprint 0.14" (應使用 Sprint 14)

### Issue/PR 標題時

✅ **正確**:

- `feat(sprint-14): task 2 - structure completion`
- `docs(release-1): update sprint overview`

❌ **錯誤**:

- `feat(phase-1): ...` (應使用 release-1)
- `docs(sprint-0.14): ...` (應使用 sprint-14)

---

**最後更新**: 2025-11-24
**維護**: 隨 Agile 實踐演進持續更新
