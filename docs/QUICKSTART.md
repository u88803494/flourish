# 快速開始指南

**目標**: 在 15 分鐘內讓專案在本地運行

---

## ✅ 前置需求

- **Node.js** 20+
- **pnpm** 9+
- **Git**
- **Supabase 帳號**（免費）

---

## 🚀 快速設定（3 步驟）

### 1. Clone 並安裝依賴

```bash
# Clone repository
git clone https://github.com/u88803494/flourish.git
cd flourish

# 安裝依賴
pnpm install
```

### 2. 設定環境變數

```bash
# 複製範例環境變數檔案
cp .env.example .env.local

# 編輯 .env.local，填入你的 Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**取得 Supabase credentials**:

1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇專案（或建立新專案）
3. Project Settings → API → 複製 URL 和 anon key

### 3. 啟動開發伺服器

```bash
# 啟動所有應用程式
pnpm dev

# Flow app: http://localhost:3100
# Apex app: http://localhost:3200
```

---

## ✅ 驗證安裝

開啟瀏覽器：

- **Flow** (財務追蹤): <http://localhost:3100>
- **Apex** (效能統計): <http://localhost:3200>

看到應用程式畫面即表示成功！🎉

---

## 📚 下一步

### 新手教學

1. [專案總覽](./project-overview.md) - 了解專案目標與架構
2. [開發指南](./guides/development.md) - 開發工作流程
3. [資料庫設定](./guides/database-setup.md) - Supabase 資料庫配置

### 開始開發

1. [Sprint 12 - Authentication](./sprints/release-1-core-features/12-authentication.md) - 當前 Sprint
2. [Supabase 文檔](./supabase/README.md) - Supabase 整合指南
3. [Git 工作流程](./guides/git-workflow.md) - Contribution 指南

---

## 🔧 常見問題

### pnpm 安裝失敗？

```bash
# 確保 pnpm 版本 >= 9
pnpm --version

# 升級 pnpm
npm install -g pnpm@latest
```

### Port 已被佔用？

```bash
# 修改 package.json 中的 port 設定
# Flow: 預設 3100
# Apex: 預設 3200
```

### Supabase 連線錯誤？

1. 檢查 `.env.local` 中的 credentials
2. 確認 Supabase 專案狀態（Dashboard）
3. 檢查網路連線

---

## 💡 開發指令

```bash
# 開發
pnpm dev                    # 啟動所有 apps
pnpm dev --filter=flow      # 只啟動 Flow

# 建置
pnpm build                  # 建置所有 apps
pnpm build --filter=flow    # 只建置 Flow

# 程式碼品質
pnpm lint                   # Lint 檢查
pnpm check-types            # TypeScript 檢查
pnpm format                 # Prettier 格式化

# 資料庫（Supabase CLI）
npx supabase status         # 檢查狀態
npx supabase db reset       # 重置本地資料庫
npx supabase migration new  # 建立新遷移
```

---

## 🆘 需要幫助？

- 📖 [完整文檔](./README.md)
- 🐛 [回報問題](https://github.com/u88803494/flourish/issues)
- 💬 查看 [CLAUDE.md](../CLAUDE.md) 了解 AI Agent 協作方式

---

**祝開發愉快！** 🌱
