<!--
📖 Guide Template - Basic（基礎版）

**適用場景**:
- 簡單的快速開始指南（5-15 分鐘）
- 基礎設定與安裝教學
- 單一功能的使用說明
- 不需要複雜配置的指南

**不適用場景**:
- 需要詳細配置說明 → 使用 Standard 版
- 需要深入最佳實踐 → 使用 Comprehensive 版
- 複雜的多步驟教學 → 使用 Comprehensive 版

📚 其他模板：
- [Standard 版](./guide-template-standard.md) - 完整指南
- [Comprehensive 版](./guide-template-comprehensive.md) - 深度指南
-->

---

# 指南元資料（YAML Frontmatter）

# 🔴 基本資訊（必填）

title: '[指南標題]' # 範例: "Supabase 快速開始"
type: 'guide' # 固定值: "guide"

# 🔴 分類（必填）

category: 'setup' # setup | development | deployment | testing | migration | best-practices
difficulty: 'beginner' # beginner | intermediate | advanced
estimated_time: '5-10 分鐘' # 範例: "5-10 分鐘"

# 🟢 前置條件（選填）

prerequisites: [] # 範例: ["Node.js 18+", "pnpm 9+"]

# 🟢 模板層級

template_level: 'basic' # basic（基礎版）

# 🔴 元數據（必填）

status: 'published' # draft | review | published | outdated
tags: ['tag1', 'tag2'] # 範例: ["supabase", "setup", "quickstart"]
last_updated: 'YYYY-MM-DD' # 最後更新日期

---

# [指南標題]

> **目的**: [用一句話概括此指南的目的]
> **難度**: 🟢 初級 | **時間**: 5-10 分鐘

<!-- 範例：
> **目的**: 5 分鐘內完成 Supabase 專案建立並連線成功
> **難度**: 🟢 初級 | **時間**: 5-10 分鐘
-->

---

## ✅ Prerequisites（前置條件）

**快速檢查**：

| 項目     | 版本   | 檢查命令    | 安裝連結 |
| -------- | ------ | ----------- | -------- |
| [工具 1] | [版本] | `[command]` | [連結]   |
| [工具 2] | [版本] | `[command]` | [連結]   |

<!-- 範例：
| 項目 | 版本 | 檢查命令 | 安裝連結 |
|------|------|----------|----------|
| Node.js | 18+ | `node -v` | [安裝](https://nodejs.org/) |
| pnpm | 9+ | `pnpm -v` | [安裝](https://pnpm.io/) |
-->

---

## 🚀 Quick Start（快速開始）

**目標**：讓你在 [X] 分鐘內 [達成什麼目標]

### 🎬 Step-by-Step（複製貼上即可）

```bash
# 1️⃣ 步驟 1（預計 X 分鐘）
command-here

# 2️⃣ 步驟 2（預計 X 分鐘）
command-here

# 3️⃣ 步驟 3（預計 X 分鐘）
command-here

# 4️⃣ 驗證（預計 X 秒）
verification-command
```

<!-- 範例：
```bash
# 1️⃣ 安裝依賴（預計 2 分鐘）
pnpm install

# 2️⃣ 設定環境變數（預計 1 分鐘）
cp .env.example .env.local
# 編輯 .env.local 並填入 SUPABASE_URL 和 SUPABASE_ANON_KEY

# 3️⃣ 啟動開發伺服器（預計 30 秒）
pnpm dev

# 4️⃣ 驗證（預計 30 秒）
# 瀏覽器開啟 http://localhost:3100
# 應看到 "連線成功" 訊息
```
-->

### ✅ 驗證成功標準

- [ ] [標準 1]
- [ ] [標準 2]
- [ ] [標準 3]
- [ ] 無任何錯誤訊息

<!-- 範例：
- [x] 終端顯示 `✓ Ready in [X]ms`
- [x] 瀏覽器可開啟 `http://localhost:3100`
- [x] 頁面顯示 "連線成功"
- [x] 無任何錯誤訊息
-->

**遇到問題？** → 跳至 [常見問題](#troubleshooting) 章節

---

## 🐛 Troubleshooting（問題排查）

### 🔍 快速診斷

| 症狀     | 可能原因 | 快速修復   |
| -------- | -------- | ---------- |
| [錯誤 1] | [原因]   | [解決方案] |
| [錯誤 2] | [原因]   | [解決方案] |
| [錯誤 3] | [原因]   | [解決方案] |

<!-- 範例：
| 症狀 | 可能原因 | 快速修復 |
|------|----------|----------|
| `command not found: pnpm` | pnpm 未安裝 | `npm install -g pnpm` |
| Port 3100 already in use | 端口被佔用 | 關閉其他應用或使用 `PORT=3200 pnpm dev` |
| Connection refused | Supabase URL 錯誤 | 檢查 `.env.local` 中的 `SUPABASE_URL` |
-->

---

<details>
<summary>📖 詳細問題解決（點擊展開）</summary>

### 問題 1: [錯誤描述]

**完整錯誤訊息**:

```bash
[貼上完整錯誤訊息]
```

**解決步驟**:

1. [步驟 1]
2. [步驟 2]
3. [步驟 3]

**驗證**: [如何確認問題已解決]

---

### 問題 2: [錯誤描述]

[重複問題 1 的結構]

</details>

---

## 🎯 Next Steps（下一步）

完成此指南後，你可以：

1. 📖 [建議的下一步 1](./next-guide.md) - [簡短說明]
2. 📖 [建議的下一步 2](./another-guide.md) - [簡短說明]
3. 📖 [進階主題](./advanced-guide.md) - [簡短說明]

<!-- 範例：
1. 📖 [設定 RLS 政策](./rls-policies.md) - 保護你的資料安全
2. 📖 [整合認證系統](./authentication.md) - 加入用戶登入功能
3. 📖 [Supabase 進階配置](./advanced-config.md) - 深入了解配置選項
-->

---

## 📚 Related Documentation（相關文檔）

- 📖 [相關指南 1](./related-guide-1.md)
- 📖 [相關指南 2](./related-guide-2.md)
- 🏛️ [相關 ADR](../decisions/XXX-name.md)
- 🔗 [官方文檔](https://external-link.com)

---

**最後更新**: YYYY-MM-DD
**維護者**: [名稱]
