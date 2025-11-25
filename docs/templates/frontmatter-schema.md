# Frontmatter Schema 規範

本文檔定義所有 Flourish 專案文檔的 YAML frontmatter 標準結構。

## 📋 為什麼需要 Frontmatter？

YAML frontmatter 提供：

- **機器可讀**：支援自動化工具解析與處理
- **結構化元數據**：統一的文檔分類與查詢
- **版本控制友好**：易於追蹤文檔變更歷史
- **單一真實來源**：避免元數據與內文不同步

---

## 🎯 通用欄位（所有文檔類型）

所有文檔都必須包含以下基礎欄位：

```yaml
# 基本資訊
title: string # 必填：文檔標題
type: enum # 必填：文檔類型（sprint | adr | guide）
last_updated: 'YYYY-MM-DD' # 必填：最後更新日期（ISO 8601 格式）
tags: ['tag1', 'tag2'] # 選填：相關標籤（建議 2-5 個）
status: enum # 必填：文檔狀態（各類型定義不同）
```

**欄位說明**：

| 欄位           | 類型   | 必填 | 說明                          | 範例                             |
| -------------- | ------ | ---- | ----------------------------- | -------------------------------- |
| `title`        | string | ✅   | 文檔標題，應清楚描述內容      | `'Sprint 14: 文檔標準化'`        |
| `type`         | enum   | ✅   | 文檔類型，用於分類與工具處理  | `'sprint'`                       |
| `last_updated` | date   | ✅   | ISO 8601 格式，用於排序與過濾 | `'2025-11-24'`                   |
| `tags`         | array  | ❌   | 標籤陣列，建議使用既有標籤    | `['documentation', 'templates']` |
| `status`       | enum   | ✅   | 文檔狀態，各類型定義允許值    | `'completed'`                    |

---

## 📋 Sprint 文檔 Schema

```yaml
---
# 基本資訊
title: 'Sprint [編號]: [Sprint 名稱]' # 必填
type: 'sprint' # 必填：固定值
release: 'Release [X]' # 必填：所屬 Release
sprint_number: [編號] # 必填：數字編號

# 時間追蹤
duration: '[X-Y] 小時' # 必填：預估時間範圍
start_date: 'YYYY-MM-DD' # 必填：開始日期
completed_date: 'YYYY-MM-DD' # 選填：完成日期（未完成時省略）
status: 'planning' # 必填：planning | in_progress | completed | blocked

# 分類與關聯
priority: 'P[X]' # 必填：P0 | P1 | P2 | P3
category: '[類別]' # 選填：infrastructure | feature | documentation | refactor | bugfix
tags: ['tag1', 'tag2'] # 選填：相關標籤
related_sprints: [] # 選填：相關 Sprint 編號陣列
related_adrs: [] # 選填：相關 ADR 編號陣列

# 團隊資訊（選填）
assignee: '' # 選填：負責人
reviewers: [] # 選填：審查者列表

# GitHub 整合（選填）
github_issue: '' # 選填：GitHub Issue URL
github_milestone: '' # 選填：GitHub Milestone 名稱

# 元數據
last_updated: 'YYYY-MM-DD' # 必填：最後更新日期
---
```

### Sprint 欄位詳解

**狀態值定義** (`status`):

- `planning` 📦 - Sprint 規劃階段
- `in_progress` 🔄 - Sprint 執行中
- `completed` ✅ - Sprint 已完成
- `blocked` 🔥 - Sprint 被阻塞（需說明原因）

**優先級定義** (`priority`):

- `P0` 🔴 - 緊急關鍵（阻塞性問題）
- `P1` 🟠 - 高優先級（重要功能）
- `P2` 🟡 - 中優先級（改進優化）
- `P3` 🟢 - 低優先級（Nice to have）

**分類定義** (`category`):

- `infrastructure` - 基礎設施（CI/CD, 部署, monorepo）
- `feature` - 功能開發
- `documentation` - 文檔撰寫
- `refactor` - 程式碼重構
- `bugfix` - 錯誤修復

---

## 📋 ADR 文檔 Schema

```yaml
---
# 基本資訊
title: 'ADR [編號]: [決策標題]' # 必填
type: 'adr' # 必填：固定值
adr_number: [編號] # 必填：數字編號（3 位數）

# 決策時間
date: 'YYYY-MM-DD' # 必填：ADR 撰寫日期
decision_date: 'YYYY-MM-DD' # 選填：實際決策日期（可能與撰寫日期不同）
review_date: 'YYYY-MM-DD' # 選填：計劃審查日期

# 狀態追蹤
status: 'accepted' # 必填：draft | proposed | accepted | deprecated | superseded
status_reason: '' # 選填：狀態變更原因（deprecated/superseded 時必填）
status_history: [] # 選填：狀態變更歷史陣列

# 決策分類
decision_type: 'strategic' # 必填：strategic | technical | process | tooling

# 決策影響評估
impact_scope: 'architecture' # 選填：architecture | implementation | process | tooling
impact_level: 'high' # 選填：low | medium | high | critical
reversibility: 'medium' # 選填：easy | medium | hard | irreversible

# 關聯資訊
supersedes: 'ADR [編號]' # 選填：此 ADR 取代的舊 ADR
superseded_by: 'ADR [編號]' # 選填：取代此 ADR 的新 ADR
related_adrs: [] # 選填：相關 ADR 編號陣列
related_sprints: [] # 選填：實施 Sprint 編號陣列
stakeholders: [] # 選填：利益相關者列表

# 元數據
tags: ['tag1', 'tag2'] # 選填：相關標籤
last_updated: 'YYYY-MM-DD' # 必填：最後更新日期
---
```

### ADR 欄位詳解

**狀態值定義** (`status`):

- `draft` 🚧 - 草稿階段
- `proposed` 📝 - 提案中（等待決策）
- `accepted` ✅ - 已接受（正式決策）
- `deprecated` ⚠️ - 已棄用（不再推薦，但未被取代）
- `superseded` 🔄 - 已取代（被新 ADR 取代）

**決策類型** (`decision_type`):

- `strategic` - 策略性決策（影響產品方向）
- `technical` - 技術性決策（架構、技術選型）
- `process` - 流程決策（開發流程、工作方式）
- `tooling` - 工具決策（開發工具選擇）

**影響範圍** (`impact_scope`):

- `architecture` - 架構層級（系統設計）
- `implementation` - 實作層級（程式碼實作）
- `process` - 流程層級（工作流程）
- `tooling` - 工具層級（開發工具）

**影響程度** (`impact_level`):

- `low` - 低影響（局部調整）
- `medium` - 中影響（部分系統）
- `high` - 高影響（多數系統）
- `critical` - 關鍵影響（全系統）

**可逆性** (`reversibility`):

- `easy` - 易逆轉（可快速回滾）
- `medium` - 中等難度（需計劃回滾）
- `hard` - 困難（代價高昂）
- `irreversible` - 不可逆（無法回滾）

---

## 📋 Guide 文檔 Schema

```yaml
---
# 基本資訊
title: '[指南標題]' # 必填
type: 'guide' # 必填：固定值

# 分類
category: '[分類]' # 必填：setup | development | deployment | testing | migration | best-practices
difficulty: '[難度]' # 必填：beginner | intermediate | advanced
estimated_time: '[X-Y] 分鐘' # 必填：預估閱讀/完成時間

# 前置條件
prerequisites: [] # 選填：需要的前置知識或工具陣列

# 模板層級（Guide 特有）
template_level: 'standard' # 選填：basic | standard | comprehensive（決定使用哪個模板版本）

# 元數據
status: 'published' # 必填：draft | review | published | outdated
tags: ['tag1', 'tag2'] # 選填：相關標籤
last_updated: 'YYYY-MM-DD' # 必填：最後更新日期

# 維護資訊（選填）
maintainer: '' # 選填：維護者
reviewers: [] # 選填：審查者列表
---
```

### Guide 欄位詳解

**分類定義** (`category`):

- `setup` - 設定指南（環境設定、工具安裝）
- `development` - 開發指南（開發流程、API 使用）
- `deployment` - 部署指南（部署流程、環境配置）
- `testing` - 測試指南（測試策略、工具使用）
- `migration` - 遷移指南（版本升級、資料遷移）
- `best-practices` - 最佳實踐（程式碼規範、設計模式）

**難度定義** (`difficulty`):

- `beginner` 🟢 - 初級（適合新手）
- `intermediate` 🟡 - 中級（需基礎知識）
- `advanced` 🔴 - 進階（需深入理解）

**狀態值定義** (`status`):

- `draft` 🚧 - 草稿階段
- `review` 📝 - 審查中
- `published` ✅ - 已發布（可公開使用）
- `outdated` ⚠️ - 過時（需更新）

**模板層級** (`template_level`):

- `basic` - 基礎模板（~150 行，快速指南）
- `standard` - 標準模板（~250 行，完整指南）
- `comprehensive` - 完整模板（~350 行，深度指南）

---

## 🔧 使用範例

### Sprint 文檔範例

```yaml
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
category: 'documentation'
tags: ['documentation', 'standardization', 'templates']
related_sprints: [10, 11]
related_adrs: []
assignee: 'Henry Lee'
reviewers: []
github_issue: 'https://github.com/u88803494/flourish/issues/35'
github_milestone: 'Release 1'
last_updated: '2025-11-25'
---
```

### ADR 文檔範例

```yaml
---
title: 'ADR 001: 架構簡化 - 從 NestJS 遷移至 Supabase'
type: 'adr'
adr_number: 1
date: '2025-11-07'
decision_date: '2025-11-07'
review_date: '2026-11-07'
status: 'accepted'
status_reason: ''
decision_type: 'strategic'
impact_scope: 'architecture'
impact_level: 'critical'
reversibility: 'hard'
supersedes: ''
superseded_by: ''
related_adrs: []
related_sprints: [8, 9]
stakeholders: ['Henry Lee']
tags: ['architecture', 'backend', 'supabase', 'cost-optimization']
last_updated: '2025-11-07'
---
```

### Guide 文檔範例

```yaml
---
title: 'Supabase 本地開發設定指南'
type: 'guide'
category: 'setup'
difficulty: 'beginner'
estimated_time: '15-20 分鐘'
prerequisites: ['Node.js 18+', 'pnpm 9+', 'Docker']
template_level: 'standard'
status: 'published'
tags: ['supabase', 'setup', 'local-development']
last_updated: '2025-11-24'
maintainer: 'Henry Lee'
reviewers: []
---
```

---

## 📝 最佳實踐

### DO ✅

1. **保持一致性**
   - 使用定義的枚舉值，不要自創狀態
   - 日期格式統一使用 ISO 8601 (`YYYY-MM-DD`)
   - 標籤使用小寫加連字符 (`kebab-case`)

2. **及時更新**
   - 修改文檔時更新 `last_updated`
   - 狀態變更時更新 `status` 和 `status_reason`
   - 完成時補充 `completed_date`

3. **善用關聯**
   - 使用 `related_sprints` 追蹤相關工作
   - 使用 `related_adrs` 記錄決策脈絡
   - 使用 `supersedes` / `superseded_by` 追蹤 ADR 演進

### DON'T ❌

1. **不要重複資訊**
   - Frontmatter 是單一真實來源
   - 內文應引用 frontmatter，不要重複填寫
   - 使用模板變數引用（如 `{title}`, `{status_emoji}`）

2. **不要使用非標準值**
   - 不要自創狀態值（如 `in-review`、`done`）
   - 不要使用非 ISO 8601 日期格式
   - 不要遺漏必填欄位

3. **不要忽略元數據**
   - 不要省略 `last_updated`
   - 不要忘記更新 `status`
   - 不要留空必填欄位

---

## 🔄 版本控制

### 當前版本

**版本**: 1.0.0
**發布日期**: 2025-11-25
**狀態**: ✅ 正式發布

### 變更歷史

#### v1.0.0 (2025-11-25)

- ✅ 初始版本發布
- ✅ 定義 Sprint、ADR、Guide 三種文檔類型
- ✅ 建立通用欄位規範
- ✅ 提供完整範例與最佳實踐

---

## 📚 相關文檔

- [狀態 Emoji 指南](./status-emoji-guide.md) - 統一的狀態表示系統
- [檔案命名規範](./naming-conventions.md) - 文檔檔案命名標準
- [模板使用指南](./template-usage-guide.md) - 如何使用文檔模板
- [Sprint 模板](./sprint-template.md)
- [ADR 模板](./adr-template.md)
- [Guide 模板（基礎版）](./guide-template-basic.md)
- [Guide 模板（標準版）](./guide-template-standard.md)
- [Guide 模板（完整版）](./guide-template-comprehensive.md)

---

**最後更新**: 2025-11-25
**維護者**: Henry Lee
