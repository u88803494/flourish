# 狀態 Emoji 指南

本文檔定義 Flourish 專案文檔中統一使用的狀態 emoji 系統。

## 📋 為什麼需要統一 Emoji？

統一的 emoji 使用提供：

- **視覺一致性**：所有文檔使用相同的視覺語言
- **快速識別**：一眼辨識文檔或任務的當前狀態
- **跨文化溝通**：emoji 超越語言障礙
- **工具整合**：統一的 emoji 便於自動化處理

---

## 🎯 任務/進度狀態

用於 Sprint 任務、工作項目的狀態標示。

### 狀態對應表

| Emoji | 狀態碼        | 中文名稱 | 英文名稱    | 使用場景                       |
| ----- | ------------- | -------- | ----------- | ------------------------------ |
| 📦    | `planning`    | 規劃中   | Planning    | 任務尚在規劃階段，尚未開始執行 |
| 🔄    | `in_progress` | 進行中   | In Progress | 任務正在執行中                 |
| ✅    | `completed`   | 已完成   | Completed   | 任務已成功完成                 |
| ⏸️    | `paused`      | 暫停     | Paused      | 任務暫時停止，等待恢復         |
| 🚫    | `cancelled`   | 已取消   | Cancelled   | 任務被取消，不再執行           |
| 🔥    | `blocked`     | 阻塞中   | Blocked     | 任務被阻塞，需解決依賴問題     |

### 使用範例

#### Sprint 文檔中

```yaml
---
status: 'in_progress'
---

**狀態**: 🔄 進行中
```

#### Task 列表中

```markdown
### Task 1: 設定 Supabase Schema

> **狀態**: 🔄 進行中

### Task 2: 建立 RLS 政策

> **狀態**: 📦 規劃中

### Task 3: 遷移現有資料

> **狀態**: ✅ 已完成
```

---

## 📝 決策狀態

用於 ADR (Architecture Decision Record) 的決策狀態標示。

### 狀態對應表

| Emoji | 狀態碼       | 中文名稱 | 英文名稱   | 使用場景                     |
| ----- | ------------ | -------- | ---------- | ---------------------------- |
| 🚧    | `draft`      | 草稿     | Draft      | ADR 正在撰寫中，尚未提案     |
| 📝    | `proposed`   | 提案中   | Proposed   | ADR 已提案，等待決策         |
| ✅    | `accepted`   | 已接受   | Accepted   | 決策已被接受，正式生效       |
| 🔄    | `superseded` | 已取代   | Superseded | 此決策已被新的 ADR 取代      |
| ⚠️    | `deprecated` | 已棄用   | Deprecated | 不再推薦使用，但未被正式取代 |

### 使用範例

#### ADR 文檔中

```yaml
---
status: 'accepted'
superseded_by: ''
---

> **日期**: 2025-11-07 | **狀態**: ✅ Accepted | **決策者**: Henry Lee
```

#### 帶取代資訊的 ADR

```yaml
---
status: 'superseded'
superseded_by: 'ADR 005'
---

> **日期**: 2025-10-15 | **狀態**: 🔄 Superseded by [ADR 005](./005-new-decision.md)
```

---

## 🎯 優先級

用於標示任務或決策的優先程度。

### 優先級對應表

| Emoji | 優先級碼 | 中文名稱 | 英文名稱 | 使用場景                 |
| ----- | -------- | -------- | -------- | ------------------------ |
| 🔴    | `P0`     | 緊急關鍵 | Critical | 阻塞性問題，必須立即處理 |
| 🟠    | `P1`     | 高優先級 | High     | 重要功能，應盡快完成     |
| 🟡    | `P2`     | 中優先級 | Medium   | 改進優化，按計劃完成     |
| 🟢    | `P3`     | 低優先級 | Low      | Nice to have，有空再做   |

### 使用範例

#### Sprint 文檔中

```yaml
---
priority: 'P1'
---

**優先級**: 🟠 P1 - 高優先級
```

#### 任務列表中

```markdown
### 🔴 P0 任務

- [ ] 修復正式環境資料庫連線問題
- [ ] 解決用戶無法登入的緊急錯誤

### 🟠 P1 任務

- [ ] 完成認證系統開發
- [ ] 整合 Supabase RLS

### 🟡 P2 任務

- [ ] 優化查詢效能
- [ ] 改善錯誤訊息
```

---

## 🎓 難度

用於 Guide 文檔標示學習難度。

### 難度對應表

| Emoji | 難度碼         | 中文名稱 | 英文名稱     | 適合對象               |
| ----- | -------------- | -------- | ------------ | ---------------------- |
| 🟢    | `beginner`     | 初級     | Beginner     | 新手，無需前置知識     |
| 🟡    | `intermediate` | 中級     | Intermediate | 需要基礎知識與經驗     |
| 🔴    | `advanced`     | 進階     | Advanced     | 需要深入理解與豐富經驗 |

### 使用範例

#### Guide 文檔中

```yaml
---
difficulty: 'beginner'
---

> **難度**: 🟢 初級 | **預估時間**: 15-20 分鐘
```

```markdown
## 📚 相關指南

- 🟢 [Supabase 快速開始](./supabase-quickstart.md) - 5 分鐘上手
- 🟡 [RLS 政策設計](./rls-policy-design.md) - 需了解權限控制
- 🔴 [效能調校進階](./performance-tuning.md) - 需深入資料庫知識
```

---

## ⚠️ 警示與提示

用於文檔中的警示訊息、提示說明。

### 警示對應表

| Emoji | 類型       | 中文名稱 | 英文名稱 | 使用場景             |
| ----- | ---------- | -------- | -------- | -------------------- |
| ⚠️    | `warning`  | 警告     | Warning  | 需要注意的重要資訊   |
| 🚨    | `error`    | 錯誤     | Error    | 錯誤或嚴重問題       |
| 💡    | `tip`      | 提示     | Tip      | 有用的建議或技巧     |
| 📝    | `note`     | 備註     | Note     | 額外的補充說明       |
| ℹ️    | `info`     | 資訊     | Info     | 一般性資訊           |
| 🔒    | `security` | 安全     | Security | 安全相關的警告或建議 |

### 使用範例

```markdown
⚠️ **警告**: 此操作將刪除所有資料，請先備份。

🚨 **錯誤**: 無法連接到資料庫，請檢查環境變數設定。

💡 **提示**: 使用 `pnpm dev --filter=flow` 可以只啟動 Flow 應用程式。

📝 **備註**: Supabase 免費方案包含 500MB 資料庫空間。

ℹ️ **資訊**: 此功能將在 Release 1 中推出。

🔒 **安全**: 絕不要將 Service Role Key 暴露給前端。
```

---

## 📦 文檔類型

用於快速識別文檔類型。

### 類型對應表

| Emoji | 類型碼      | 中文名稱 | 英文名稱  | 文檔類型                     |
| ----- | ----------- | -------- | --------- | ---------------------------- |
| 🏃    | `sprint`    | Sprint   | Sprint    | Sprint 規劃與追蹤文檔        |
| 🏛️    | `adr`       | ADR      | ADR       | Architecture Decision Record |
| 📖    | `guide`     | 指南     | Guide     | 技術指南與教學               |
| 📊    | `reference` | 參考     | Reference | API 參考、技術規格           |
| 📝    | `tutorial`  | 教學     | Tutorial  | 逐步教學文檔                 |

### 使用範例

```markdown
## 📚 相關文檔

### Sprint 文檔

- 🏃 [Sprint 14: 文檔標準化](../sprints/sprint-14-documentation-standardization.md)
- 🏃 [Sprint 13: Transaction CRUD](../sprints/sprint-13-transaction-crud.md)

### 架構決策

- 🏛️ [ADR 001: 架構簡化](../decisions/001-architecture-simplification.md)

### 技術指南

- 📖 [Supabase 本地開發設定](./supabase-local-setup.md)
- 📖 [資料庫遷移指南](./database-migrations.md)
```

---

## 🔗 GitHub 整合

用於標示 GitHub 相關資源。

### GitHub 對應表

| Emoji | 類型        | 中文名稱  | 英文名稱     | 使用場景            |
| ----- | ----------- | --------- | ------------ | ------------------- |
| 🔗    | `link`      | 連結      | Link         | 一般連結            |
| #️⃣    | `issue`     | Issue     | Issue        | GitHub Issue        |
| 🔀    | `pr`        | PR        | Pull Request | GitHub Pull Request |
| 🎯    | `milestone` | Milestone | Milestone    | GitHub Milestone    |
| 🏷️    | `label`     | 標籤      | Label        | GitHub Label        |

### 使用範例

```markdown
## 🔗 相關資源

- #️⃣ **Issue**: [#35 - 文檔標準化](https://github.com/u88803494/flourish/issues/35)
- 🔀 **PR**: [#38 - Task 4 完成](https://github.com/u88803494/flourish/pull/38)
- 🎯 **Milestone**: Release 1
- 🏷️ **Labels**: `documentation`, `p1-high`, `enhancement`
```

---

## 📊 進度與統計

用於視覺化進度與統計資訊。

### 進度對應表

| Emoji | 用途         | 中文名稱 | 使用場景       |
| ----- | ------------ | -------- | -------------- |
| 📈    | `trend-up`   | 上升趨勢 | 正向進展、增長 |
| 📉    | `trend-down` | 下降趨勢 | 減少、下降     |
| 📊    | `chart`      | 圖表     | 統計數據       |
| ⏱️    | `timer`      | 計時     | 時間追蹤       |
| 🎯    | `target`     | 目標     | 目標達成       |
| 📌    | `pin`        | 釘選     | 重點標記       |

### 使用範例

```markdown
## 📊 Sprint 進度統計

**總覽**: [3/5] 任務完成 (60%) | **實際/估計**: 45h / 79-117h

- 📈 **進度**: 比預期快 15%
- ⏱️ **剩餘時間**: 約 30-70 小時
- 🎯 **目標達成率**: 60%
- 📌 **關鍵里程碑**: Task 4 完成
```

---

## 🎨 最佳實踐

### DO ✅

1. **保持一致性**

   ```markdown
   ✅ 統一使用：🔄 進行中
   ❌ 不要混用：🔄 進行中 / ⚙️ 進行中 / 🏃 進行中
   ```

2. **emoji 後加空格**

   ```markdown
   ✅ 正確：🔄 進行中
   ❌ 錯誤：🔄進行中
   ```

3. **保持語義清晰**
   ```markdown
   ✅ 明確：✅ 已完成 / 🔄 進行中
   ❌ 混淆：✅ 進行中（狀態與 emoji 不符）
   ```

### DON'T ❌

1. **不要自創 emoji**

   ```markdown
   ❌ 不要使用未定義的 emoji：🎉 完成、🚀 進行中
   ✅ 使用標準 emoji：✅ 已完成、🔄 進行中
   ```

2. **不要過度使用**

   ```markdown
   ❌ 過度：🎯🔥💪 重要任務 ✨🚀
   ✅ 適當：🔴 P0 - 緊急任務
   ```

3. **不要混淆類似 emoji**

   ```markdown
   ❌ 混淆：

   - ✔️ (Check Mark) vs ✅ (Check Mark Button)
   - ⚠ (Warning) vs ⚠️ (Warning Sign)

   ✅ 使用：

   - ✅ 統一使用 Check Mark Button
   - ⚠️ 統一使用 Warning Sign
   ```

---

## 🔄 Emoji 組合使用

### 狀態 + 優先級

```markdown
### 🔴 P0 - 緊急任務

- 🔄 修復正式環境錯誤（進行中）
- 📦 部署熱修復（規劃中）

### 🟠 P1 - 高優先級

- ✅ 完成認證系統（已完成）
- 🔄 整合 Supabase（進行中）
```

### 文檔類型 + 難度

```markdown
## 📚 學習資源

- 📖 🟢 [快速開始指南](./quickstart.md) - 5 分鐘上手
- 📖 🟡 [進階配置](./advanced-config.md) - 需基礎知識
- 📖 🔴 [效能調校](./performance.md) - 專家級內容
```

### 警示 + 類型

```markdown
⚠️ **警告**: 此 API 將在 v2.0 被取代
🔒 **安全**: 使用環境變數儲存敏感資訊
💡 **提示**: 善用 TypeScript 類型提示
```

---

## 📋 快速參考表

### 常用 Emoji 速查

| 情境       | Emoji | 狀態碼         |
| ---------- | ----- | -------------- |
| 任務執行中 | 🔄    | `in_progress`  |
| 任務完成   | ✅    | `completed`    |
| 任務規劃   | 📦    | `planning`     |
| 任務阻塞   | 🔥    | `blocked`      |
| 決策已接受 | ✅    | `accepted`     |
| 決策提案中 | 📝    | `proposed`     |
| 緊急關鍵   | 🔴    | `P0`           |
| 高優先級   | 🟠    | `P1`           |
| 中優先級   | 🟡    | `P2`           |
| 低優先級   | 🟢    | `P3`           |
| 初級難度   | 🟢    | `beginner`     |
| 中級難度   | 🟡    | `intermediate` |
| 進階難度   | 🔴    | `advanced`     |
| 警告訊息   | ⚠️    | `warning`      |
| 提示技巧   | 💡    | `tip`          |
| 安全相關   | 🔒    | `security`     |

---

## 🔄 版本控制

### 當前版本

**版本**: 1.0.0
**發布日期**: 2025-11-25
**狀態**: ✅ 正式發布

### 變更歷史

#### v1.0.0 (2025-11-25)

- ✅ 初始版本發布
- ✅ 定義 6 大類 emoji 系統
- ✅ 提供完整使用範例
- ✅ 建立最佳實踐指南

---

## 📚 相關文檔

- [Frontmatter Schema 規範](./frontmatter-schema.md) - YAML frontmatter 結構定義
- [檔案命名規範](./naming-conventions.md) - 文檔檔案命名標準
- [模板使用指南](./template-usage-guide.md) - 如何使用文檔模板

---

**最後更新**: 2025-11-25
**維護者**: Henry Lee
