<!--
📖 Guide Template - Standard（標準版）

**適用場景**:
- 完整的技術指南（15-30 分鐘）
- 需要配置說明的設定指南
- 多步驟的開發流程
- 需要最佳實踐的技術教學

**不適用場景**:
- 簡單快速開始 → 使用 Basic 版
- 需要深入架構說明 → 使用 Comprehensive 版
- 5 分鐘內完成的任務 → 使用 Basic 版

📚 其他模板：
- [Basic 版](./guide-template-basic.md) - 快速開始指南
- [Comprehensive 版](./guide-template-comprehensive.md) - 深度指南
-->

---

# 指南元資料（YAML Frontmatter）

# 🔴 基本資訊（必填）

title: '[指南標題]' # 範例: "Supabase 本地開發設定"
type: 'guide' # 固定值: "guide"

# 🔴 分類（必填）

category: 'development' # setup | development | deployment | testing | migration | best-practices
difficulty: 'intermediate' # beginner | intermediate | advanced
estimated_time: '15-30 分鐘' # 範例: "15-30 分鐘"

# 🟢 前置條件（選填）

prerequisites: [] # 範例: ["Node.js 18+", "Supabase CLI", "基礎 SQL 知識"]

# 🟢 模板層級

template_level: 'standard' # standard（標準版）

# 🔴 元數據（必填）

status: 'published' # draft | review | published | outdated
tags: ['tag1', 'tag2', 'tag3'] # 範例: ["supabase", "development", "database", "rls"]
last_updated: 'YYYY-MM-DD' # 最後更新日期

---

# [指南標題]

> **目的**: [用一句話概括此指南的目的和預期成果]
> **難度**: 🟡 中級 | **時間**: 15-30 分鐘 | **前置知識**: [所需背景知識]

<!-- 範例：
> **目的**: 設定 Supabase 本地開發環境，包含資料庫遷移與 RLS 測試
> **難度**: 🟡 中級 | **時間**: 15-30 分鐘 | **前置知識**: 基礎 SQL、PostgreSQL 概念
-->

---

## 📑 內容目錄

- [Prerequisites](#prerequisites前置條件)
- [Overview](#overview概覽)
- [Getting Started](#getting-started快速開始)
- [Configuration](#configuration配置說明)
- [Best Practices](#best-practices最佳實踐)
- [Troubleshooting](#troubleshooting問題排查)
- [Advanced Usage](#advanced-usage進階用法)
- [Next Steps](#next-steps下一步)

---

## ✅ Prerequisites（前置條件）

### 必要工具

| 工具     | 版本   | 檢查命令    | 安裝連結 |
| -------- | ------ | ----------- | -------- |
| [工具 1] | [版本] | `[command]` | [連結]   |
| [工具 2] | [版本] | `[command]` | [連結]   |
| [工具 3] | [版本] | `[command]` | [連結]   |

<!-- 範例：
| 工具 | 版本 | 檢查命令 | 安裝連結 |
|------|------|----------|----------|
| Node.js | 18+ | `node -v` | [安裝](https://nodejs.org/) |
| Supabase CLI | 1.0+ | `supabase --version` | [安裝](https://supabase.com/docs/guides/cli) |
| Docker | 20+ | `docker --version` | [安裝](https://docs.docker.com/get-docker/) |
-->

### 前置知識

- [x] **[知識 1]**: [簡短說明為何需要此知識]
- [x] **[知識 2]**: [簡短說明為何需要此知識]
- [x] **[知識 3]**: [簡短說明為何需要此知識]

<!-- 範例：
- [x] **基礎 SQL**: 需要撰寫和理解資料庫查詢
- [x] **PostgreSQL 概念**: 了解資料表、欄位、外鍵等基本概念
- [x] **環境變數**: 知道如何設定和使用 .env 檔案
-->

### 環境準備

```bash
# 驗證所有工具已安裝
node -v && pnpm -v && supabase --version

# 預期輸出範例：
# v20.x.x
# 9.x.x
# 1.x.x
```

---

## 🎯 Overview（概覽）

### 你將學到什麼

完成本指南後，你將能夠：

1. **[技能 1]**: [具體描述你能做什麼]
2. **[技能 2]**: [具體描述你能做什麼]
3. **[技能 3]**: [具體描述你能做什麼]
4. **[技能 4]**: [具體描述你能做什麼]

<!-- 範例：
1. **本地環境設定**: 在本地機器上執行完整的 Supabase 堆疊
2. **資料庫遷移**: 建立和管理資料庫 schema 版本
3. **RLS 政策測試**: 在本地測試 Row Level Security 政策
4. **除錯技巧**: 使用 Supabase Studio 進行本地除錯
-->

### 架構概覽（選用）

```mermaid
graph TD
    A[元件 A] --> B[元件 B]
    B --> C[元件 C]
    C --> D[最終結果]
```

<!-- 範例：
```mermaid
graph TD
    A[Supabase CLI] --> B[Docker Containers]

    B --> C[PostgreSQL + PostgREST + GoTrue]
    C --> D[Local Dev Environment]
    D --> E[Your App]

````
-->

---

## 🚀 Getting Started（快速開始）

### Step 1: [第一步驟標題]（預計 X 分鐘）

[詳細說明此步驟的目的和重要性]

```bash
# 步驟 1 命令
command-here

# 預期輸出
expected-output-here
````

**驗證**：[如何確認此步驟成功完成]

<!-- 範例：
### Step 1: 初始化 Supabase 專案（預計 5 分鐘）

在專案根目錄初始化 Supabase 設定，這將建立本地配置檔案和資料庫遷移目錄。

```bash
# 初始化 Supabase 專案
supabase init

# 預期輸出
# Finished supabase init.
# Created supabase/ directory
```

**驗證**：確認已建立 `supabase/` 目錄，包含 `config.toml` 檔案
-->

---

### Step 2: [第二步驟標題]（預計 X 分鐘）

[詳細說明此步驟的目的和重要性]

```bash
# 步驟 2 命令
command-here
```

**重要提示**：

⚠️ **警告**: [如果有需要特別注意的事項]
💡 **提示**: [有助於理解或執行的建議]

---

### Step 3: [第三步驟標題]（預計 X 分鐘）

[繼續後續步驟...]

---

## ⚙️ Configuration（配置說明）

### 基礎配置

本節說明必要的配置選項。

#### 配置檔案位置

```plaintext
project-root/
├── .env.local              # 本地環境變數
├── [config-file]           # 主要配置檔案
└── [other-config]          # 其他配置
```

<!-- 範例：
```plaintext
project-root/
├── .env.local              # 本地環境變數
├── supabase/
│   ├── config.toml         # Supabase 主配置
│   └── migrations/         # 資料庫遷移檔案
└── package.json
```
-->

#### 環境變數設定

創建 `.env.local` 檔案：

```bash
# [分類 1] - [說明]
VARIABLE_1=value1
VARIABLE_2=value2

# [分類 2] - [說明]
VARIABLE_3=value3
```

<!-- 範例：
```bash
# Supabase 連線資訊
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 資料庫連線（僅後端使用）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```
-->

<details>
<summary>📖 環境變數詳細說明（點擊展開）</summary>

| 變數名稱     | 用途   | 必填 | 預設值    | 備註   |
| ------------ | ------ | ---- | --------- | ------ |
| `VARIABLE_1` | [用途] | ✅   | -         | [備註] |
| `VARIABLE_2` | [用途] | ✅   | -         | [備註] |
| `VARIABLE_3` | [用途] | 🟢   | `default` | [備註] |

<!-- 範例：
| 變數名稱 | 用途 | 必填 | 預設值 | 備註 |
|----------|------|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | ✅ | - | 前端可見 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服務端 API Key | ✅ | - | 絕不暴露給前端 |
| `DATABASE_URL` | PostgreSQL 連線字串 | 🟢 | 自動生成 | 僅限後端使用 |
-->

</details>

---

### 進階配置（選用）

<details>
<summary>📋 進階配置選項（點擊展開）</summary>

#### [配置項目 1]

[說明此配置項目的用途和影響]

```[格式]
# 配置範例
config-example-here
```

#### [配置項目 2]

[說明此配置項目的用途和影響]

```[格式]
# 配置範例
config-example-here
```

</details>

---

## 💎 Best Practices（最佳實踐）

### 開發最佳實踐

#### 1. [實踐主題 1]

**為什麼重要**：[解釋為何這是最佳實踐]

**如何實施**：

```[語言]
// ✅ 推薦做法
good-practice-example

// ❌ 避免做法
bad-practice-example
```

**範例場景**：[提供實際應用場景]

<!-- 範例：
#### 1. 使用環境變數而非硬編碼

**為什麼重要**：確保敏感資訊不會洩漏到版本控制，並支援多環境部署。

**如何實施**：

```typescript
// ✅ 推薦做法
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ❌ 避免做法
const supabaseUrl = "https://myproject.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

**範例場景**：在不同環境（開發、測試、正式）使用不同的 Supabase 專案
-->

---

#### 2. [實踐主題 2]

[重複實踐主題 1 的結構]

---

### 安全最佳實踐

- **[安全實踐 1]**: [簡短說明]
- **[安全實踐 2]**: [簡短說明]
- **[安全實踐 3]**: [簡短說明]

<!-- 範例：
- **絕不提交 Service Role Key**: 永遠使用環境變數，並將 .env.local 加入 .gitignore
- **啟用 RLS 政策**: 所有資料表都應有 Row Level Security 保護
- **最小權限原則**: 僅授予必要的權限給使用者角色
-->

---

### 效能最佳實踐

💡 **提示**：以下實踐可顯著提升效能

1. **[效能實踐 1]**: [說明和影響]
2. **[效能實踐 2]**: [說明和影響]
3. **[效能實踐 3]**: [說明和影響]

---

## 🐛 Troubleshooting（問題排查）

### 常見問題快速診斷

| 症狀     | 可能原因 | 快速修復   | 相關章節 |
| -------- | -------- | ---------- | -------- |
| [錯誤 1] | [原因]   | [解決方案] | [連結]   |
| [錯誤 2] | [原因]   | [解決方案] | [連結]   |
| [錯誤 3] | [原因]   | [解決方案] | [連結]   |

<!-- 範例：
| 症狀 | 可能原因 | 快速修復 | 相關章節 |
|------|----------|----------|----------|
| `Connection refused` | Docker 未啟動 | `docker ps` 確認服務狀態 | [Step 2](#step-2) |
| `Permission denied` | RLS 政策錯誤 | 檢查 RLS 政策設定 | [Security](#best-practices) |
| Port 54321 in use | 端口被佔用 | 修改 config.toml 端口設定 | [Configuration](#configuration) |
-->

---

<details>
<summary>📖 詳細問題解決（點擊展開）</summary>

### 問題 1: [錯誤描述]

**完整錯誤訊息**:

```bash
[貼上完整錯誤訊息]
```

**原因分析**:

[深入解釋為何會發生此錯誤]

**解決步驟**:

1. **[步驟 1]**: [詳細說明]

   ```bash
   # 執行命令
   command-here
   ```

2. **[步驟 2]**: [詳細說明]

3. **[步驟 3]**: [詳細說明]

**驗證解決**:

[如何確認問題已完全解決]

---

### 問題 2: [錯誤描述]

[重複問題 1 的結構]

---

### 問題 3: [錯誤描述]

[重複問題 1 的結構]

</details>

---

## 🚀 Advanced Usage（進階用法）

### [進階主題 1]

[說明此進階功能的用途和適用場景]

```[語言]
// 進階用法範例
advanced-code-example
```

**使用場景**：[何時應該使用此進階功能]

**注意事項**：

- ⚠️ **[注意 1]**: [說明]
- 💡 **[提示 1]**: [說明]

---

### [進階主題 2]

[重複進階主題 1 的結構]

---

## 🎯 Next Steps（下一步）

完成此指南後，建議的學習路徑：

### 推薦順序

1. **📖 [下一個指南 1](./next-guide-1.md)**
   - **難度**: [emoji] [等級]
   - **時間**: [估計時間]
   - **目的**: [簡短說明]
   - **為什麼接著學**: [解釋連貫性]

2. **📖 [下一個指南 2](./next-guide-2.md)**
   - **難度**: [emoji] [等級]
   - **時間**: [估計時間]
   - **目的**: [簡短說明]
   - **為什麼接著學**: [解釋連貫性]

3. **📖 [進階指南](./advanced-guide.md)**
   - **難度**: [emoji] [等級]
   - **時間**: [估計時間]
   - **目的**: [簡短說明]
   - **為什麼接著學**: [解釋連貫性]

<!-- 範例：
1. **📖 [RLS 政策設計](./rls-policy-design.md)**
   - **難度**: 🟡 中級
   - **時間**: 20-30 分鐘
   - **目的**: 學習設計安全的 Row Level Security 政策
   - **為什麼接著學**: 本地環境已設定，接著應確保資料安全

2. **📖 [資料庫遷移最佳實踐](./database-migrations.md)**
   - **難度**: 🟡 中級
   - **時間**: 25-35 分鐘
   - **目的**: 掌握版本化的 schema 管理
   - **為什麼接著學**: 擴展 schema 時保持團隊同步

3. **📖 [Supabase 效能調校](./supabase-performance.md)**
   - **難度**: 🔴 進階
   - **時間**: 40-60 分鐘
   - **目的**: 優化查詢效能和資料庫索引
   - **為什麼接著學**: 當應用程式規模增長時的必備知識
-->

---

## 📚 Related Documentation（相關文檔）

### 指南

- 📖 [相關指南 1](./related-guide-1.md) - [簡短說明]
- 📖 [相關指南 2](./related-guide-2.md) - [簡短說明]

### 架構決策

- 🏛️ [ADR XXX: 相關決策](../decisions/XXX-name.md) - [簡短說明]

### Sprint 文檔

- 🏃 [Sprint XX: 相關 Sprint](../sprints/release-X/XX-name.md) - [簡短說明]

### 外部資源

- 🔗 [官方文檔](https://external-link.com) - 完整 API 參考
- 🔗 [最佳實踐](https://external-link.com) - 官方最佳實踐指南
- 🔗 [社群資源](https://external-link.com) - 社群教學和範例

---

## 📋 Checklist（完成檢查清單）

完成本指南後，確認以下項目：

### 基礎設定

- [ ] 所有前置工具已安裝並驗證版本
- [ ] 環境變數正確配置
- [ ] 基礎功能正常運作
- [ ] 能夠成功執行基本操作

### 配置驗證

- [ ] 所有配置檔案已創建
- [ ] 配置值正確無誤
- [ ] 安全設定已啟用
- [ ] 效能設定已優化

### 最佳實踐

- [ ] 遵循安全最佳實踐
- [ ] 遵循效能最佳實踐
- [ ] 遵循開發最佳實踐
- [ ] 程式碼品質符合標準

### 進階功能（選用）

- [ ] 理解進階功能用途
- [ ] 已嘗試進階功能
- [ ] 知道何時使用進階功能

---

**最後更新**: YYYY-MM-DD
**維護者**: [名稱]
**難度評級**: 🟡 中級
**預估完成時間**: 15-30 分鐘
