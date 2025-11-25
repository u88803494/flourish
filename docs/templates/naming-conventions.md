# 檔案命名規範

本文檔定義 Flourish 專案文檔的檔案命名標準與目錄結構。

## 📋 為什麼需要命名規範？

統一的檔案命名提供：

- **易於查找**：一致的命名模式便於定位文檔
- **版本控制友好**：清晰的命名避免衝突
- **工具整合**：標準命名支援自動化處理
- **團隊協作**：降低溝通成本

---

## 🎯 通用命名原則

所有文檔檔名必須遵循以下原則：

### 基礎規則

1. **使用小寫字母**

   ```bash
   ✅ sprint-14-documentation.md
   ❌ Sprint-14-Documentation.md
   ❌ SPRINT-14-DOCUMENTATION.md
   ```

2. **使用連字符分隔單詞**

   ```bash
   ✅ local-development-setup.md
   ❌ local_development_setup.md
   ❌ localDevelopmentSetup.md
   ```

3. **使用英文檔名**

   ```bash
   ✅ database-migrations.md
   ❌ 資料庫遷移.md
   ❌ database-遷移.md
   ```

4. **保持簡短**

   ```bash
   ✅ supabase-setup.md              # 16 字元
   ❌ supabase-local-development-environment-setup.md  # 49 字元
   ```

   **建議長度**: 10-40 字元

5. **避免特殊字元**

   ```bash
   ✅ api-v2-migration.md
   ❌ api(v2)_migration!.md
   ```

   **允許的字元**: `a-z`, `0-9`, `-` (連字符)

---

## 📁 目錄結構與命名

### Sprint 文檔

**路徑**: `docs/sprints/release-{X}-{name}/`
**檔名格式**: `{number:02d}-{slug}.md`

```bash
docs/sprints/
├── release-0-foundation/
│   ├── 01-monorepo-structure.md
│   ├── 02-05-dev-tooling.md
│   ├── 06-nestjs-polish.md
│   ├── 08-deployment-evaluation.md
│   ├── 09-supabase-migration-plan.md
│   ├── 10-documentation-agent-setup.md
│   └── 11-sprint-numbering-refactoring.md
└── release-1-core-features/
    ├── 12-authentication.md
    ├── 13-transaction-crud.md
    ├── 14-documentation-standardization.md
    └── 15-chart-integration.md
```

**命名規則**：

- **Sprint 編號**: 固定 2 位數（`01`, `14`, `25`）
- **Slug**: 簡短描述性名稱
  - 使用 `kebab-case`（小寫 + 連字符）
  - 3-5 個單詞
  - 清楚描述 Sprint 內容

**範例**：

```bash
✅ 14-documentation-standardization.md
✅ 15-chart-integration.md

❌ 14-doc-std.md                        # 過度縮寫
❌ 14-implement-complete-documentation-standardization-with-templates.md  # 太長
```

### ADR 文檔

**路徑**: `docs/decisions/`
**檔名格式**: `{number:03d}-{slug}.md`

```bash
docs/decisions/
├── 001-architecture-simplification.md
├── 002-authentication-strategy.md
├── 003-database-schema-design.md
└── README.md
```

**命名規則**：

- **ADR 編號**: 固定 3 位數（`001`, `025`, `100`）
- **Slug**: 決策主題名稱
  - 使用 `kebab-case`
  - 3-6 個單詞
  - 清楚描述決策內容

**範例**：

```bash
✅ 001-architecture-simplification.md
✅ 002-authentication-strategy.md

❌ 001-arch-simple.md                   # 過度縮寫
❌ 001-decision-to-simplify-architecture-and-migrate-from-nestjs-to-supabase.md  # 太長
```

### Guide 文檔

**路徑**: `docs/guides/{category}/`
**檔名格式**: `{slug}.md`

```bash
docs/guides/
├── setup/
│   ├── local-development.md
│   ├── supabase-setup.md
│   └── environment-variables.md
├── development/
│   ├── database-migrations.md
│   ├── api-integration.md
│   └── testing-strategy.md
├── deployment/
│   ├── vercel-deployment.md
│   └── supabase-production.md
└── best-practices/
    ├── code-style.md
    └── git-workflow.md
```

**分類定義** (`category`):

| 分類             | 說明                 | 範例                     |
| ---------------- | -------------------- | ------------------------ |
| `setup`          | 環境設定、工具安裝   | `local-development.md`   |
| `development`    | 開發流程、API 使用   | `database-migrations.md` |
| `deployment`     | 部署流程、環境配置   | `vercel-deployment.md`   |
| `testing`        | 測試策略、工具使用   | `unit-testing.md`        |
| `migration`      | 版本升級、資料遷移   | `supabase-migration.md`  |
| `best-practices` | 程式碼規範、設計模式 | `code-style.md`          |

**命名規則**：

- **Slug**: 指南主題名稱
  - 使用 `kebab-case`
  - 2-5 個單詞
  - 清楚描述指南內容
  - 無需加編號（由分類目錄組織）

**範例**：

```bash
✅ supabase-setup.md
✅ database-migrations.md

❌ 01-supabase-setup.md                # 不需要編號
❌ supabase-local-dev-env-setup-guide.md  # 太長
❌ supabase.md                         # 不夠具體
```

---

## 📝 Slug 命名建議

### 好的 Slug 範例

**清晰描述內容**：

```bash
✅ authentication-setup.md            # 清楚知道是認證設定
✅ database-migrations.md             # 清楚知道是資料庫遷移
✅ vercel-deployment.md               # 清楚知道是 Vercel 部署
```

**適當的長度**：

```bash
✅ supabase-setup.md                  # 2 個單詞，簡潔明確
✅ local-development.md               # 2 個單詞，清楚易懂
✅ api-integration-guide.md           # 3 個單詞，完整描述
```

### 不好的 Slug 範例

**過度縮寫**：

```bash
❌ db-mig.md                          # 不清楚含義
❌ auth-setup.md                      # auth 可能是 authentication 或 authorization
❌ sb-setup.md                        # sb 是什麼？
```

**過於冗長**：

```bash
❌ complete-guide-to-setting-up-local-development-environment.md
❌ how-to-deploy-your-application-to-vercel-production-environment.md
❌ step-by-step-database-migration-guide-for-supabase.md
```

**不夠具體**：

```bash
❌ setup.md                           # 設定什麼？
❌ guide.md                           # 哪種指南？
❌ documentation.md                   # 關於什麼的文檔？
```

---

## 🎨 命名模式範例

### Sprint 文檔命名模式

| 類型     | 檔名格式                               | 範例                                  |
| -------- | -------------------------------------- | ------------------------------------- |
| 基礎設施 | `{num}-{infra-type}-{action}.md`       | `01-monorepo-structure.md`            |
| 功能開發 | `{num}-{feature}-{scope}.md`           | `13-transaction-crud.md`              |
| 文檔撰寫 | `{num}-{doc-type}-{action}.md`         | `14-documentation-standardization.md` |
| 重構     | `{num}-{component}-{refactor-type}.md` | `11-sprint-numbering-refactoring.md`  |

### ADR 文檔命名模式

| 類型     | 檔名格式                      | 範例                                 |
| -------- | ----------------------------- | ------------------------------------ |
| 架構決策 | `{num}-{scope}-{decision}.md` | `001-architecture-simplification.md` |
| 技術選型 | `{num}-{tech}-{purpose}.md`   | `002-supabase-backend.md`            |
| 流程決策 | `{num}-{process}-{change}.md` | `003-git-workflow-update.md`         |
| 工具決策 | `{num}-{tool}-{reason}.md`    | `004-vscode-extensions.md`           |

### Guide 文檔命名模式

| 類型     | 檔名格式                 | 範例                     |
| -------- | ------------------------ | ------------------------ |
| 設定指南 | `{tool}-{action}.md`     | `supabase-setup.md`      |
| 開發指南 | `{feature}-{process}.md` | `database-migrations.md` |
| 部署指南 | `{platform}-{action}.md` | `vercel-deployment.md`   |
| 最佳實踐 | `{area}-{topic}.md`      | `code-style.md`          |

---

## 🔄 檔案重新命名

如需重新命名文檔，請遵循以下步驟：

### 步驟 1：檢查參照

```bash
# 搜尋所有參照此檔案的連結
grep -r "old-filename.md" docs/
```

### 步驟 2：更新所有參照

```markdown
<!-- 更新所有連結 -->

❌ [舊連結](./old-filename.md)
✅ [新連結](./new-filename.md)
```

### 步驟 3：使用 Git 移動檔案

```bash
# 使用 git mv 保留歷史記錄
git mv docs/guides/old-filename.md docs/guides/new-filename.md
```

### 步驟 4：更新 frontmatter

```yaml
---
title: '更新後的標題'
last_updated: '2025-11-25' # 更新日期
---
```

---

## 📚 README 檔案

每個目錄都應包含 `README.md` 提供導覽：

```bash
docs/
├── README.md                    # 文檔總覽
├── sprints/
│   ├── README.md                # Sprint 文檔導覽
│   ├── release-0-foundation/
│   │   └── README.md            # Release 0 Sprint 列表
│   └── release-1-core-features/
│       └── README.md            # Release 1 Sprint 列表
├── decisions/
│   └── README.md                # ADR 索引
└── guides/
    ├── README.md                # Guide 分類導覽
    ├── setup/
    │   └── README.md            # Setup 指南列表
    └── development/
        └── README.md            # Development 指南列表
```

### README 命名規則

- **固定檔名**: `README.md`（全大寫）
- **每個目錄一個**: 提供該目錄的導覽與說明
- **包含索引**: 列出該目錄下的所有文檔

---

## 🔧 特殊檔案命名

### 模板檔案

**路徑**: `docs/templates/`

```bash
docs/templates/
├── sprint-template.md                    # Sprint 模板
├── adr-template.md                       # ADR 模板
├── guide-template-basic.md               # Guide 基礎模板
├── guide-template-standard.md            # Guide 標準模板
├── guide-template-comprehensive.md       # Guide 完整模板
├── frontmatter-schema.md                 # Frontmatter 規範
├── status-emoji-guide.md                 # Emoji 指南
└── naming-conventions.md                 # 命名規範（本文檔）
```

**命名規則**：

- 使用 `{type}-template.md` 格式
- 如有多個版本，使用 `{type}-template-{variant}.md`
- 規範文檔使用描述性名稱

### 封存檔案

**路徑**: `docs/archive/{category}/`

```bash
docs/archive/
├── nestjs-api/
│   ├── api-architecture.md
│   ├── deployment-guide.md
│   └── README.md
└── render-deployment/
    ├── render-deployment-guide.md
    └── README.md
```

**命名規則**：

- 保持原始檔名
- 在封存目錄的 `README.md` 中註明封存原因
- 使用日期標示封存時間

---

## 📊 命名檢查清單

創建新文檔時，請檢查以下項目：

### 基礎檢查

- [ ] 使用小寫字母
- [ ] 使用連字符分隔單詞
- [ ] 使用英文檔名
- [ ] 檔名長度適當（10-40 字元）
- [ ] 無特殊字元（僅 `a-z`, `0-9`, `-`）

### 結構檢查

- [ ] 檔案在正確的目錄中
- [ ] 檔名符合該類型的命名格式
- [ ] 編號正確（Sprint/ADR）
- [ ] Slug 清晰描述內容

### 內容檢查

- [ ] Frontmatter 的 `title` 與檔名一致
- [ ] `type` 欄位正確
- [ ] `last_updated` 為當前日期

---

## 🎯 最佳實踐

### DO ✅

1. **使用描述性名稱**

   ```bash
   ✅ database-migrations.md          # 清楚描述內容
   ```

2. **保持一致性**

   ```bash
   ✅ supabase-setup.md
   ✅ vercel-deployment.md
   ✅ github-workflow.md
   # 統一使用 {platform}-{action} 格式
   ```

3. **定期審查檔名**
   ```bash
   # 定期檢查是否有命名不一致的檔案
   find docs/ -name "*.md" | grep -E "[A-Z]|_"
   ```

### DON'T ❌

1. **不要使用日期作為檔名**

   ```bash
   ❌ 2025-11-25-sprint-update.md     # 日期會過時
   ✅ sprint-14-documentation.md       # 使用編號
   ```

2. **不要使用臨時檔名**

   ```bash
   ❌ temp-doc.md
   ❌ new-guide.md
   ❌ untitled.md
   ```

3. **不要使用版本號**
   ```bash
   ❌ api-guide-v2.md                 # 使用 git 管理版本
   ✅ api-guide.md                    # 檔名不含版本
   ```

---

## 🔄 版本控制

### 當前版本

**版本**: 1.0.0
**發布日期**: 2025-11-25
**狀態**: ✅ 正式發布

### 變更歷史

#### v1.0.0 (2025-11-25)

- ✅ 初始版本發布
- ✅ 定義 Sprint、ADR、Guide 命名規範
- ✅ 建立目錄結構標準
- ✅ 提供完整範例與檢查清單

---

## 📚 相關文檔

- [Frontmatter Schema 規範](./frontmatter-schema.md) - YAML frontmatter 結構定義
- [狀態 Emoji 指南](./status-emoji-guide.md) - 統一的狀態表示系統
- [模板使用指南](./template-usage-guide.md) - 如何使用文檔模板

---

**最後更新**: 2025-11-25
**維護者**: Henry Lee
