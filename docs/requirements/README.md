# Requirements Documentation

**Last Updated**: 2025-10-30

本目錄包含 Flourish 專案的所有需求文件，記錄從初始規劃到實際需求發現的完整過程。

---

## 📋 文件索引

### 核心需求文件

#### [Vision and Workflow](vision-and-workflow.md)

**目的**: 詳細記錄實際使用者工作流程和需求

**內容**:

- 使用者輪廓（信用卡 power user）
- PDF 對帳單處理主要流程
- 多卡管理需求（20+ 張卡片）
- 預扣系統詳細說明（月費、年費分攤、自動儲蓄）
- 歷史資料匯入策略（2019-2025 Google Sheets 資料）
- 預算計算公式和顯示需求
- 成功指標定義

**適合對象**: 所有團隊成員，了解專案核心價值和使用者需求

---

#### [Workflow Pivot Analysis](workflow-pivot-analysis.md)

**目的**: 記錄需求轉變過程和架構調整決策

**內容**:

- 原始假設 vs 實際需求對比
- 從「每日手動輸入」到「月度 PDF 批次處理」的轉變
- 資料庫架構影響分析
- UI/UX 流程差異
- 功能優先順序調整
- 實作階段規劃（Sprint 0.5, 2, 3+）
- 風險與緩解措施
- 經驗教訓

**適合對象**: 架構師、技術決策者、專案管理者

---

#### [Functional Requirements](functional-requirements.md)

**目的**: 列出所有功能需求，包含優先順序和實作細節

**內容**:

- FR-001: PDF Statement Upload Workflow (P0, Sprint 0.5)
- FR-002: AI Transaction Extraction (P0, Sprint 0.5)
- FR-003: Batch Transaction Import (P0, Sprint 0.5)
- FR-004: Multi-Card Management (P0, Sprint 0.5)
- FR-005: Pre-Deduction Budget System (P1, Sprint 2)
- FR-006: Transaction Matching (P1, Sprint 2)
- FR-007: Historical Data Import (P1, Sprint 2)
- FR-008: Category Management (P0, Sprint 0.5)

每個需求包含：

- User Stories (使用者故事)
- Acceptance Criteria (驗收標準)
- API Endpoints (API 端點設計)
- Database Schema (資料庫結構)
- Technical Requirements (技術需求)

**適合對象**: 開發者、QA 測試人員、產品經理

---

## 🎯 需求優先順序

### P0 (Must Have) - Sprint 0.5 MVP

核心對帳單處理功能，必須在第一版實作

- ✅ PDF 上傳工作流程
- ✅ AI 交易辨識
- ✅ 批次匯入與檢視
- ✅ 多卡管理
- ✅ 基礎分類系統

**目標**: 2 週內完成，讓使用者能開始處理月度對帳單

---

### P1 (Should Have) - Sprint 2

進階預算功能，提供完整的預扣系統

- 📅 固定支出追蹤（月費 + 年費分攤）
- 💰 收入管理
- 💾 自動儲蓄規則
- 🔗 交易配對（預期 vs 實際）
- 📊 月度預算儀表板
- 📥 歷史資料匯入工具

**目標**: 2 週內完成，提供完整預算管理體驗

---

### P2 (Nice to Have) - Sprint 3+

優化與進階功能

- 多幣別支援
- 收據附件上傳
- 進階統計分析
- 預算預測功能
- Apex 整合（統計值匯出）

**目標**: 持續優化，根據使用者回饋調整

---

## 📊 需求可追溯性矩陣

| Req ID | 功能描述 | 優先級 | Sprint | 架構文件                                                                             | 實作狀態   |
| ------ | -------- | ------ | ------ | ------------------------------------------------------------------------------------ | ---------- |
| FR-001 | PDF 上傳 | P0     | 0.5    | [database-design.md](../architecture/database-design.md#sprint-05-mvp-schema)        | 📝 Planned |
| FR-002 | AI 辨識  | P0     | 0.5    | functional-requirements.md                                                           | 📝 Planned |
| FR-003 | 批次匯入 | P0     | 0.5    | functional-requirements.md                                                           | 📝 Planned |
| FR-004 | 多卡管理 | P0     | 0.5    | [database-design.md](../architecture/database-design.md#信用卡管理)                  | 📝 Planned |
| FR-005 | 預扣系統 | P1     | 2      | [database-design.md](../architecture/database-design.md#sprint-2-enhancement-models) | 📋 Future  |
| FR-006 | 交易配對 | P1     | 2      | functional-requirements.md                                                           | 📋 Future  |
| FR-007 | 歷史匯入 | P1     | 2      | functional-requirements.md                                                           | 📋 Future  |
| FR-008 | 分類管理 | P0     | 0.5    | [database-design.md](../architecture/database-design.md#分類管理)                    | 📝 Planned |

---

## 🔄 需求變更歷史

### 2025-10-30: 重大需求轉變

**變更類型**: 架構調整

**原因**:
在 Sprint 0.5 規劃期間，通過與使用者深入對話，發現實際工作流程與初始假設有重大差異。

**變更內容**:

- ❌ 移除：每日手動輸入交易作為主要流程
- ✅ 新增：PDF 對帳單上傳 + AI 辨識 + 批次匯入
- ✅ 新增：Statement 模型作為核心實體
- ✅ 新增：多卡管理系統（支援 20+ 張卡片）
- ⏸️ 延後：預扣系統從 Sprint 0.5 延至 Sprint 2

**影響**:

- 資料庫架構：從 Transaction-Centric 改為 Statement-Centric
- 開發時程：Sprint 0.5 範圍縮小，但更聚焦
- 使用者價值：更符合實際使用場景，效率大幅提升

**相關文件**:

- [Workflow Pivot Analysis](workflow-pivot-analysis.md)
- [Database Design - 階段式設計](../architecture/database-design.md#架構演進與階段式設計)

---

## 📖 相關文件

### 架構設計

- [Database Design](../architecture/database-design.md) - 資料庫設計（包含 MVP 和未來增強模型）
- [Authentication Flow](../architecture/authentication-flow.md) - Supabase Auth 整合
- [Curves Integration](../architecture/curves-integration.md) - Apex 統計整合

### Sprint 規劃

- [Sprint 0 Foundation](../sprints/sprint-0-foundation/) - 基礎建設 Sprint
  - [Tasks](../sprints/sprint-0-foundation/tasks.md) - 任務追蹤
  - [Requirements](../sprints/sprint-0-foundation/requirements.md) - Sprint 需求

### 技術參考

- [Prisma Guide](../references/prisma-guide.md) - Prisma ORM 使用指南
- [NestJS Quick Reference](../references/nestjs-quick-ref.md) - NestJS 快速參考

---

## 🎯 使用指南

### 對於產品經理

1. 閱讀 [Vision and Workflow](vision-and-workflow.md) 了解使用者需求
2. 檢視 [Functional Requirements](functional-requirements.md) 確認功能範圍
3. 追蹤需求可追溯性矩陣，確保實作符合需求

### 對於開發者

1. 閱讀 [Workflow Pivot Analysis](workflow-pivot-analysis.md) 了解架構決策
2. 參考 [Functional Requirements](functional-requirements.md) 查看 API 設計和驗收標準
3. 查看 [Database Design](../architecture/database-design.md) 了解資料模型

### 對於 QA 測試人員

1. 從 [Functional Requirements](functional-requirements.md) 取得驗收標準
2. 了解 [Vision and Workflow](vision-and-workflow.md) 中的使用者場景
3. 設計測試案例涵蓋各優先級功能

### 對於新團隊成員

1. 先讀 [Vision and Workflow](vision-and-workflow.md) 理解專案目標
2. 閱讀 [Workflow Pivot Analysis](workflow-pivot-analysis.md) 了解專案演進
3. 查看需求可追溯性矩陣，掌握當前進度

---

## 💡 需求管理原則

### 1. 文件導向開發

- 所有需求變更必須記錄在此目錄
- 重大變更需更新「需求變更歷史」章節
- 保持文件與實作同步

### 2. 使用者為中心

- 需求來自真實使用者場景，不是臆測
- 定期驗證需求與實際使用行為的匹配度
- 保持對使用者回饋的開放態度

### 3. 優先順序清晰

- 使用 P0/P1/P2 區分優先級
- P0 = Must Have (MVP 必備)
- P1 = Should Have (重要但非阻塞)
- P2 = Nice to Have (優化功能)

### 4. 可追溯性

- 每個功能都能追溯到需求文件
- 每個需求都能連結到實作和測試
- 使用 Req ID 建立清楚的對應關係

### 5. 階段式交付

- 優先完成核心流程（PDF 處理）
- 驗證 MVP 後再添加進階功能
- 避免過早優化

---

## 📝 更新此文件

當需求有變更時，請：

1. 更新相關的需求文件（vision-and-workflow.md, functional-requirements.md）
2. 在「需求變更歷史」章節記錄變更
3. 更新需求可追溯性矩陣
4. 通知相關團隊成員
5. 如有架構影響，同步更新 [Database Design](../architecture/database-design.md)

---

**問題或建議？** 請聯繫專案負責人或在 GitHub Issues 提出。
