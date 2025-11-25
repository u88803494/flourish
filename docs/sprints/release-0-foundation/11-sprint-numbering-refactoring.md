---
title: 'Sprint 11: Sprint 編號重構'
type: 'sprint'
release: 'Release 0'
sprint_number: 11
duration: '1.5-2 小時'
start_date: '2025-11-17'
completed_date: '2025-11-18'
status: 'completed'
priority: 'P1'
tags: ['refactoring', 'documentation', 'standardization']
---

# Sprint 11: Sprint 編號重構

**狀態**: 📋 規劃中
**預估時間**: ~1.5-2 小時
**依賴**: Sprint 10 (Documentation & Agent Setup) 完成
**目標**: 將所有 Sprint 編號重構為業界最佳實踐格式

---

## 🎯 Sprint 目標

重新組織 Sprint 文檔和編號系統，使其符合 Agile 最佳實踐：

- 使用連續序號編號（Sprint 1, 2, 3... 而不是 0.1, 0.2, 0.3）
- 確保檔案系統排序正確（檔名補零）
- 為 Release 1 及未來做好文檔結構準備

---

## 📋 背景說明

### 目前的問題

1. **階層式編號**（0.1, 0.2）造成混淆：
   - Sprint 10 在檔案系統中排在 0.2 後面
   - Sub-sprints（0.9.1-0.9.4）模糊了 sprint 和 task 的界線
   - 不符合 agile 最佳實踐

2. **業界標準**（研究結果）：
   - Sprint 連續編號：1, 2, 3, 4... 10, 11, 12
   - 編號永不重置（跨越所有 Phase）
   - 檔案名稱補零排序：`sprint-01.md`, `sprint-10.md`
   - 內容使用自然數字：「Sprint 1」、「Sprint 10」

### 研究摘要

- ✅ **Scrum/SAFe/Agile 框架**：使用連續編號，內容不補零
- ✅ **業界慣例**：Phase 只是組織分類，不是 Sprint 編號的一部分
- ✅ **檔案系統解法**：只有檔名補零，內容不補零
- ✅ **Sub-sprints**：應該是 Sprint 內的「任務」，不是獨立的 sprint

**參考資料**：[ADR 002 - Imperative Migrations](../../decisions/002-imperative-migrations.md) 最佳實踐研究

---

## 🔄 遷移計劃

### 階段 1：Sprint 編號對照表

| 目前格式         | 新編號          | 新檔名                            | 說明                  |
| ---------------- | --------------- | --------------------------------- | --------------------- |
| Sprint 1         | Sprint 1        | `sprint-01-monorepo.md`           | 基礎 Monorepo         |
| Sprint 2         | Sprint 2        | `sprint-02-prettier.md`           | Prettier 設定         |
| Sprint 3         | Sprint 3        | `sprint-03-husky.md`              | Husky + lint-staged   |
| Sprint 4         | Sprint 4        | `sprint-04-commitlint.md`         | commitlint            |
| Sprint 5         | Sprint 5        | `sprint-05-prisma.md`             | Prisma（設計參考）    |
| Sprint 6         | Sprint 6        | `sprint-06-nestjs.md`             | NestJS 應用程式       |
| Sprint 7         | Sprint 7        | `sprint-07-apex.md`               | Apex 應用程式         |
| Sprint 8         | Sprint 8        | `sprint-08-deployment.md`         | 部署評估              |
| Sprint 9         | Sprint 9        | `sprint-09-supabase/`             | Supabase 遷移（目錄） |
| Sprint 9, Task 1 | Sprint 9 Task 1 | `sprint-09/task-01-cli.md`        | CLI & 環境設定        |
| Sprint 9, Task 2 | Sprint 9 Task 2 | `sprint-09/task-02-migrations.md` | 資料庫遷移            |
| Sprint 9, Task 3 | Sprint 9 Task 3 | `sprint-09/task-03-client.md`     | Supabase Client 套件  |
| Sprint 9, Task 4 | Sprint 9 Task 4 | `sprint-09/task-04-archive.md`    | NestJS 存檔           |
| Sprint 10        | Sprint 10       | `sprint-10-docs.md`               | 文檔 & Agent 設定     |
| Sprint 11        | Sprint 11       | `sprint-11-refactoring.md`        | 本次重構 sprint       |

### 階段 2：資料夾結構

**重構前**：

```
docs/sprints/sprint-0-foundation/
├── overview.md
├── requirements.md
├── implementation.md
├── tasks.md
├── 08-deployment-evaluation.md
├── 09-supabase-migration-plan.md
└── 10-documentation-agent-setup.md
```

**重構後**：

```
docs/sprints/
├── README.md（新增：所有 sprint 總覽）
├── phase-0-foundation/
│   ├── overview.md
│   ├── requirements.md
│   ├── sprint-01-monorepo.md
│   ├── sprint-02-prettier.md
│   ├── sprint-03-husky.md
│   ├── sprint-04-commitlint.md
│   ├── sprint-05-prisma.md
│   ├── sprint-06-nestjs.md
│   ├── sprint-07-apex.md
│   ├── sprint-08-deployment.md
│   ├── sprint-09-supabase/
│   │   ├── overview.md（從 09-supabase-migration-plan.md 改名）
│   │   ├── task-01-cli.md
│   │   ├── task-02-migrations.md
│   │   ├── task-03-client.md
│   │   └── task-04-archive.md
│   ├── sprint-10-docs.md
│   └── sprint-11-refactoring.md（本文件）
└── phase-1-core-features/
    ├── overview.md（待建立）
    └── sprint-12-authentication.md（Release 1 從這裡開始）
```

### 階段 3：內容更新

需要更新以下文件中的 Sprint 引用：

1. **Sprint 文檔**：
   - 所有現有 sprint 文檔（將「Sprint 0.X」改為「Sprint X」）
   - 更新 sprint 之間的交叉引用

2. **總覽文件**：
   - `docs/sprints/release-0-foundation/README.md`
   - 更新 Progress Tracking 區段
   - 更新內容中的所有 sprint 引用

3. **架構決策記錄（ADR）**：
   - `docs/decisions/001-architecture-simplification.md`
   - `docs/decisions/002-imperative-migrations.md`
   - 更新 sprint 引用（例如「Sprint 8」→「Sprint 8」）

4. **指南文件**：
   - `docs/guides/supabase-migration-approaches.md`
   - `docs/guides/database-setup.md`
   - 其他引用 sprint 的指南

5. **專案根目錄**：
   - `CLAUDE.md`
   - 更新目前 sprint 狀態
   - 更新 sprint 引用範例

---

## 📝 詳細任務

### 任務 1：建立新資料夾結構（15 分鐘）

```bash
# 建立新的 phase-1 資料夾
mkdir -p docs/sprints/release-1-core-features

# 建立 phase-1 總覽
touch docs/sprints/release-1-core-features/README.md

# 建立 sprints README
touch docs/sprints/README.md
```

### 任務 2：重新命名 Sprint 檔案（20 分鐘）

**Sprint 8（部署評估）**：

```bash
mv docs/sprints/sprint-0-foundation/08-deployment-evaluation.md \
   docs/sprints/release-0-foundation/sprint-08-deployment.md
```

**Sprint 9（Supabase 遷移）**：

```bash
# 建立 sprint-09 資料夾
mkdir -p docs/sprints/release-0-foundation/sprint-09-supabase

# 移動並重新命名規劃文件
mv docs/sprints/sprint-0-foundation/09-supabase-migration-plan.md \
   docs/sprints/release-0-foundation/sprint-09-supabase/README.md

# 注意：Task 檔案（0.9.1-0.9.4）目前還不存在
# 會在執行 Sprint 9 各 task 時建立
```

**Sprint 10（文檔）**：

```bash
mv docs/sprints/sprint-0-foundation/10-documentation-agent-setup.md \
   docs/sprints/release-0-foundation/sprint-10-docs.md
```

**Sprint 11（本文件）**：

```bash
mv docs/sprints/sprint-0-foundation/11-sprint-numbering-refactoring.md \
   docs/sprints/release-0-foundation/sprint-11-refactoring.md
```

### 任務 3：更新內容引用（30 分鐘）

**批次搜尋取代**所有文檔：

```bash
# 模式：「Sprint 0.X」→「Sprint X」
# 需要手動檢查上下文

# 需要更新的檔案：
# - docs/sprints/release-0-foundation/README.md
# - docs/sprints/release-0-foundation/sprint-08-deployment.md
# - docs/sprints/release-0-foundation/sprint-09-supabase/README.md
# - docs/sprints/release-0-foundation/sprint-10-docs.md
# - docs/decisions/001-architecture-simplification.md
# - docs/decisions/002-imperative-migrations.md
# - docs/guides/supabase-migration-approaches.md
# - CLAUDE.md
```

**具體取代項目**：

- `Sprint 1` → `Sprint 1`
- `Sprint 6` → `Sprint 6`
- `Sprint 7` → `Sprint 7`
- `Sprint 8` → `Sprint 8`
- `Sprint 9` → `Sprint 9`
- `Sprint 9, Task 1` → `Sprint 9 Task 1` 或 `Sprint 9.1`
- `Sprint 9, Task 2` → `Sprint 9 Task 2` 或 `Sprint 9.2`
- `Sprint 9, Task 3` → `Sprint 9 Task 3` 或 `Sprint 9.3`
- `Sprint 9, Task 4` → `Sprint 9 Task 4` 或 `Sprint 9.4`
- `Sprint 10` → `Sprint 10`
- `Sprint 11` → `Sprint 11`

### 任務 4：建立慣例文件（15 分鐘）

**檔案**：`docs/conventions/sprint-numbering.md`

記錄新的 sprint 編號慣例：

- 連續編號（永不重置）
- 檔案命名補零
- 內容使用自然數字
- 如何處理 sprint 內的 tasks
- Phase 資料夾作為組織分類

### 任務 5：更新總覽文件（20 分鐘）

**Release 0 總覽**（`docs/sprints/release-0-foundation/README.md`）：

- 更新 Progress Tracking 使用新 sprint 編號
- 更新內文所有 sprint 引用
- 更新「Next Steps」區段

**Sprints README**（`docs/sprints/README.md`）：

- Sprint 組織方式總覽
- 連結到 phase 資料夾
- 說明編號系統

**Release 1 總覽**（`docs/sprints/release-1-core-features/README.md`）：

- 建立初始總覽
- Sprint 12+ 會列在這裡
- 參照回 Release 0 完成狀態

### 任務 6：更新 CLAUDE.md（10 分鐘）

更新專案說明，使用新的 sprint 編號：

- 目前 phase 狀態
- 最近完成的 sprints
- Sprint 編號慣例

---

## ✅ 驗收標準

- [ ] 所有 sprint 檔案按新慣例重新命名
- [ ] 資料夾結構符合最佳實踐
- [ ] 文檔中所有 sprint 引用都已更新
- [ ] 文檔中沒有損壞的連結
- [ ] 慣例文件已建立且完整
- [ ] Release 1 資料夾已準備好含總覽
- [ ] 可以順暢瀏覽文檔
- [ ] 檔案系統排序正確（sprint-01, sprint-02, sprint-10）

---

## 📊 成功指標

**重構前**：

```
排序：sprint-0.1, sprint-0.10, sprint-0.2 ❌
引用：Sprint 8, Sprint 9, Task 1（不一致）
結構：扁平，難以導覽
```

**重構後**：

```
排序：sprint-01, sprint-02, sprint-10 ✅
引用：Sprint 8, Sprint 9 Task 1（一致）
結構：Phase 組織，清楚的階層
```

---

## 🔗 相關文檔

- **研究基礎**：基於 agile 最佳實踐的深度研究
- **ADR 002**：遷移方法類似的重構考量
- **Release 0 總覽**：會在本 sprint 中更新

---

## 🎬 Sprint 11 之後

### Release 0 完成

Sprint 11 完成後：

- ✅ 全部 11 個 sprints 完成
- ✅ Release 0 基礎穩固
- ✅ 文檔組織良好
- ✅ 準備好進入 Release 1

### Release 1 開始

下一個 sprint：

- **Sprint 12: Authentication（認證系統）**
- 位置：`docs/sprints/release-1-core-features/sprint-12-authentication.md`
- 繼續序號編號（12, 13, 14...）

---

## 💡 備註

### 為什麼這很重要

良好的文檔結構：

- 讓專案容易被新開發者理解
- 減少瀏覽時的認知負擔
- 遵循業界標準
- 隨專案成長良好擴展

### 未來考量

- Sprint 編號會無限延續（12, 13, 14... 50, 100...）
- 如果專案達到 Sprint 100+，考慮使用三位數補零
- Phase 資料夾提供自然的回顧分界點

---

**建立日期**：2025-11-13
**執行時機**：Sprint 10 完成後
**預估工作量**：1.5-2 小時
