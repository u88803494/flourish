# Supabase 本地開發設定

**狀態**: ✅ 完成
**最後更新**: 2025-11-24

---

## 🎯 目標

設定本地開發環境，連接至 Supabase 專案，並配置必要的工具與環境變數，開始使用 Supabase 進行 Flourish 專案開發。

---

## 📋 前置需求

在開始之前，請確保你已準備好以下環境：

| 項目              | 版本要求       | 驗證指令                                          |
| ----------------- | -------------- | ------------------------------------------------- |
| **Node.js**       | 20+            | `node --version`                                  |
| **pnpm**          | 9+             | `pnpm --version`                                  |
| **Supabase 帳號** | -              | 訪問 [app.supabase.com](https://app.supabase.com) |
| **Git**           | 最新版本       | `git --version`                                   |
| **程式碼編輯器**  | VS Code (推薦) | -                                                 |

**Flourish 專案存取權限**：

- Supabase 專案 ID：`fstcioczrehqtcbdzuij`
- 專案名稱：`flourish`
- 區域：Asia Pacific (Tokyo) `ap-northeast-1`

---

## 🚀 設定步驟

### 1. Clone 專案（如果尚未 clone）

```bash
# Clone 專案
git checkout https://github.com/u88803494/flourish.git
cd flourish

# 安裝依賴
pnpm install
```

### 2. Supabase CLI 安裝與登入

Flourish 使用 Supabase CLI 進行資料庫遷移和開發工具操作。

#### 2.1 安裝 CLI

```bash
# 使用 npx 執行（不需要全域安裝）
npx supabase --version

# 或全域安裝（可選）
npm install -g supabase
```

#### 2.2 登入 Supabase

```bash
# 登入你的 Supabase 帳號
npx supabase login

# 這會打開瀏覽器讓你授權
# 成功後會顯示：Successfully logged in
```

### 3. 連接至 Flourish Supabase 專案

```bash
# 連接到遠端專案
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 如果遇到 "Project not found" 錯誤：
# 1. 確認你的 Supabase 帳號有存取權限
# 2. 聯繫專案管理員授予權限
```

**驗證連接**：

```bash
# 列出所有遷移
npx supabase migration list

# 應該看到 Sprint 9 的遷移記錄
```

### 4. 環境變數配置

#### 4.1 建立 `.env.local`

Flourish 專案不提供 `.env.example`，請手動建立 `.env.local`：

```bash
# 在專案根目錄建立環境變數檔案
touch .env.local
```

#### 4.2 獲取 Supabase 金鑰

訪問 [Supabase Dashboard](https://app.supabase.com/project/fstcioczrehqtcbdzuij/settings/api)，複製以下金鑰：

1. **Project URL** - API URL
2. **anon/public key** - 前端使用的公開金鑰

#### 4.3 配置環境變數

編輯 `.env.local`，加入以下內容：

```bash
# ==========================================
# Supabase 配置（必要）
# ==========================================

# Supabase API URL
# 來源: Supabase Dashboard > Settings > API > Project URL
# 用途: 前端與後端連接至 Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co

# Supabase Anon Key（公開金鑰）
# 來源: Supabase Dashboard > Settings > API > anon public key
# 用途: 前端存取 Supabase（受 RLS 保護）
# ⚠️ 注意: 這是公開金鑰，會暴露給前端，使用 RLS 保護資料
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdGNpb2N6cmVocXRjYmR6dWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NTg2NzUsImV4cCI6MjA0NzIzNDY3NX0.YOUR_ACTUAL_KEY

# ==========================================
# Supabase CLI 配置（選用）
# ==========================================

# 專案參考 ID
# 來源: Supabase Dashboard > Settings > General > Reference ID
# 用途: Supabase CLI 連接至專案
SUPABASE_PROJECT_REF=fstcioczrehqtcbdzuij

# Supabase Access Token（個人存取令牌）
# 來源: Supabase Dashboard > Account > Access Tokens > Generate new token
# 用途: Supabase CLI 認證（生成類型、執行遷移）
# ⚠️ 注意: 這是個人令牌，絕不提交至 Git
# ℹ️ 提示: 如果不使用 CLI，可以省略此變數
SUPABASE_ACCESS_TOKEN=sbp_1234567890abcdef1234567890abcdef

# ==========================================
# Edge Functions 配置（未來使用）
# ==========================================

# Service Role Key（僅用於 Edge Functions）
# 來源: Supabase Dashboard > Settings > API > service_role key
# 用途: Edge Functions 中的管理權限操作（繞過 RLS）
# ⚠️ 危險: 絕不在前端使用，僅用於 Edge Functions
# ℹ️ 提示: Release 0-1 不使用 Edge Functions，可以省略
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# 應用程式配置（選用）
# ==========================================

# Next.js 環境模式
# 用途: 區分開發/正式環境
NODE_ENV=development

# 應用程式 Port（選用，預設值已在 package.json 中）
# Flow app: 3100
# Apex app: 3200
# PORT=3100

# ==========================================
# 第三方服務配置（未來使用）
# ==========================================

# OpenAI API Key（未來 AI 功能使用）
# OPENAI_API_KEY=sk-...

# Stripe API Key（未來付費功能使用）
# STRIPE_SECRET_KEY=sk_test_...
```

**重要提示**：

| 變數                            | 前端可見？ | 必要？    | 說明                              |
| ------------------------------- | ---------- | --------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅ 是      | ✅ 必要   | Supabase API URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 是      | ✅ 必要   | 前端公開金鑰（RLS 保護）          |
| `SUPABASE_PROJECT_REF`          | ❌ 否      | ⚠️ 選用   | CLI 使用，不使用 CLI 可省略       |
| `SUPABASE_ACCESS_TOKEN`         | ❌ 否      | ⚠️ 選用   | CLI 認證，登入後可省略            |
| `SUPABASE_SERVICE_ROLE_KEY`     | ❌ 否      | ❌ 不需要 | **危險！** 僅 Edge Functions 使用 |

**安全性警告**：

- ❌ **絕不提交 `.env.local` 至 Git**（已在 `.gitignore` 中）
- ❌ **絕不在前端使用 Service Role Key**
- ✅ 使用 `NEXT_PUBLIC_` 前綴的變數會暴露給前端
- ✅ Anon Key 是公開的，安全性由 RLS policies 保證

#### 4.4 驗證環境變數

```bash
# 在 flow app 中測試
cd apps/flow
pnpm dev

# 訪問 http://localhost:3100
# 打開瀏覽器 Console，檢查是否有 Supabase 連線錯誤
```

### 5. 生成 TypeScript 類型

Supabase 可以自動生成 TypeScript 類型，確保類型安全：

```bash
# 在專案根目錄執行
cd packages/supabase-client
pnpm generate-types

# 這會更新 src/shared/types/database.ts
```

**生成的類型檔案**：

```typescript
// packages/supabase-client/src/shared/types/database.ts

export type Database = {
  public: {
    Tables: {
      users: { ... },
      transactions: { ... },
      categories: { ... },
      // ... 所有資料表的類型
    }
  }
}
```

### 6. MCP 配置（選用，進階功能）

如果你使用 Claude Code，可以配置 MCP (Model Context Protocol) 讓 Claude 直接存取 Supabase 資料庫。

**詳細步驟**：請參閱 [MCP 設定指南](../../guides/mcp-setup.md)

**快速摘要**：

1. 在 Supabase Dashboard 生成 Access Token
2. 編輯 `~/.claude.json`，加入 Supabase MCP 配置
3. 重啟 Claude Code
4. 測試：「列出 Supabase 中的所有表」

---

## 🔧 開發工具

### 常用 Supabase CLI 指令

#### 資料庫操作

```bash
# 檢視資料庫狀態
npx supabase db diff

# 建立新遷移
npx supabase migration new <migration-name>

# 執行遷移（推送至遠端）
npx supabase db push

# 重置本地資料庫（危險！）
npx supabase db reset
```

#### 類型生成

```bash
# 自動生成 TypeScript 類型
cd packages/supabase-client
pnpm generate-types

# 或手動執行
npx supabase gen types typescript --linked > src/shared/types/database.ts
```

#### 專案資訊

```bash
# 查看當前連接的專案
npx supabase projects list

# 查看遷移歷史
npx supabase migration list
```

### 本地資料庫管理

**注意**：Flourish 目前不使用本地 Supabase 實例，所有開發直接連接至遠端 Supabase。

如果未來需要本地開發：

```bash
# 啟動本地 Supabase（需要 Docker）
npx supabase start

# 停止本地 Supabase
npx supabase stop
```

### 開發伺服器

```bash
# 啟動 Flow app（財務追蹤）
cd apps/flow
pnpm dev
# 訪問: http://localhost:3100

# 啟動 Apex app（統計工具）
cd apps/apex
pnpm dev
# 訪問: http://localhost:3200

# 同時啟動所有 apps（在根目錄）
pnpm dev
```

---

## ✅ 驗證設定

完成所有設定後，執行以下驗證步驟：

### 1. 驗證 Supabase CLI 連線

```bash
npx supabase projects list

# 應該看到：
# │ flourish │ fstcioczrehqtcbdzuij │ ap-northeast-1 │ ...
```

### 2. 驗證環境變數

```bash
# 檢查 .env.local 是否存在
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL

# 應該輸出：
# NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
```

### 3. 驗證類型生成

```bash
# 檢查類型檔案是否存在
ls -lh packages/supabase-client/src/shared/types/database.ts

# 應該看到檔案大小 > 10KB
```

### 4. 驗證前端連線

啟動 Flow app，打開瀏覽器 Console：

```javascript
// 在瀏覽器 Console 執行
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// 應該輸出：
// https://fstcioczrehqtcbdzuij.supabase.co
```

如果看到 `undefined`，代表環境變數未正確載入。

### 5. 測試 Supabase 連線（前端）

在 `apps/flow/app/page.tsx` 加入測試程式碼：

```typescript
import { createBrowserClient } from '@repo/supabase-client/client'

export default function Home() {
  // 測試連線
  const supabase = createBrowserClient()

  supabase.auth.getSession().then(({ data, error }) => {
    console.log('Supabase 連線狀態:', error ? 'Failed' : 'Success')
    console.log('Session:', data.session)
  })

  return <div>Check console for Supabase connection status</div>
}
```

---

## 🚨 故障排除

### 問題 1：`supabase: command not found`

**症狀**：執行 `npx supabase` 時顯示 command not found

**解決方案**：

```bash
# 1. 確認 Node.js 已安裝
node --version

# 2. 清除 npm cache
npx clear-npx-cache

# 3. 重新執行
npx supabase@latest --version
```

### 問題 2：`Project not found` 錯誤

**症狀**：執行 `npx supabase link` 時無法找到專案

**可能原因**：

- ❌ 未登入 Supabase CLI
- ❌ 帳號沒有專案存取權限
- ❌ Project Reference ID 錯誤

**解決方案**：

```bash
# 1. 重新登入
npx supabase login

# 2. 確認登入狀態
npx supabase projects list

# 3. 如果看不到 flourish 專案，聯繫管理員授予權限

# 4. 確認 Project Ref 正確
npx supabase link --project-ref fstcioczrehqtcbdzuij
```

### 問題 3：環境變數未生效

**症狀**：前端無法連線至 Supabase，Console 顯示 `undefined`

**解決方案**：

```bash
# 1. 確認 .env.local 位於正確位置
ls -la .env.local

# 2. 確認環境變數名稱正確（必須有 NEXT_PUBLIC_ 前綴）
cat .env.local | grep NEXT_PUBLIC

# 3. 重啟開發伺服器
# Ctrl+C 停止，然後重新執行
pnpm dev

# 4. 確認沒有多餘的空格或引號
# 錯誤: NEXT_PUBLIC_SUPABASE_URL = "https://..."  # 有空格和引號
# 正確: NEXT_PUBLIC_SUPABASE_URL=https://...      # 無空格和引號
```

### 問題 4：類型生成失敗

**症狀**：執行 `pnpm generate-types` 時出現錯誤

**解決方案**：

```bash
# 1. 確認已連接至專案
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 2. 確認有網路連線
ping supabase.com

# 3. 手動生成類型
cd packages/supabase-client
npx supabase gen types typescript \
  --project-id fstcioczrehqtcbdzuij \
  > src/shared/types/database.ts

# 4. 如果仍失敗，檢查 Supabase 帳號權限
```

### 問題 5：Port 已被佔用

**症狀**：執行 `pnpm dev` 時顯示 `Port 3100 is already in use`

**解決方案**：

```bash
# 1. 查找佔用 port 的程序
lsof -ti:3100

# 2. 終止該程序
kill -9 $(lsof -ti:3100)

# 3. 或更換 port
# 編輯 apps/flow/package.json
# "dev": "next dev -p 3101"

# 4. 重新啟動
pnpm dev
```

---

## 💡 最佳實踐

### 1. 環境變數管理

✅ **推薦做法**：

```bash
# 為不同環境建立不同的環境變數檔案
.env.local          # 本地開發（不提交）
.env.production     # 正式環境（Vercel 自動注入）

# 使用 .gitignore 保護機密資訊
.env*.local
.env
```

❌ **避免做法**：

- 將 `.env.local` 提交至 Git
- 在程式碼中硬編碼 API Key
- 在 Console 中 log 出機密資訊

### 2. Supabase CLI 使用

✅ **推薦做法**：

```bash
# 使用 npx 執行（始終使用最新版本）
npx supabase@latest <command>

# 在執行遷移前先檢視 diff
npx supabase db diff

# 使用描述性的遷移名稱
npx supabase migration new add-user-profile-table
```

❌ **避免做法**：

- 直接在 Supabase Dashboard 手動修改 schema（無法追蹤）
- 跳過遷移，直接執行 SQL
- 在正式環境測試未經驗證的遷移

### 3. 類型安全

✅ **推薦做法**：

```typescript
// 使用自動生成的類型
import type { Database } from '@repo/supabase-client/types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

// 在每次 schema 變更後重新生成類型
// packages/supabase-client/package.json
"scripts": {
  "generate-types": "supabase gen types typescript --linked > src/shared/types/database.ts"
}
```

### 4. 開發工作流程

建議的開發流程：

```bash
# 1. 早上開始工作
git pull origin main
pnpm install  # 如果有新依賴
npx supabase migration list  # 檢查是否有新遷移

# 2. 開發新功能
# 先在 Supabase Dashboard 設計 schema
# 或直接撰寫遷移 SQL

# 3. 建立遷移
npx supabase migration new add-new-feature

# 4. 撰寫遷移 SQL
# 編輯 packages/database/supabase/migrations/XXXXXX_add-new-feature.sql

# 5. 執行遷移
npx supabase db push

# 6. 重新生成類型
cd packages/supabase-client
pnpm generate-types

# 7. 提交變更
git add .
git commit -m "feat: add new feature migration"
```

### 5. 安全性

✅ **推薦做法**：

- 定期輪換 Supabase Access Token（90 天）
- 使用 RLS（Row Level Security）保護資料
- 前端僅使用 `anon` key，絕不使用 `service_role` key
- 在 `.gitignore` 中排除所有 `.env*` 檔案

❌ **避免做法**：

- 在前端暴露 Service Role Key
- 停用 RLS（除非有充分理由）
- 在日誌中打印機密資訊
- 共享個人 Access Token

### 6. 效能優化

✅ **推薦做法**：

```bash
# 使用 pnpm 而非 npm（更快、更節省空間）
pnpm install

# 使用 Turborepo 快取
pnpm build  # Turborepo 會快取建置結果

# 只啟動需要的 app
pnpm dev --filter=flow  # 只啟動 Flow app
```

---

## 🔗 相關文檔

### Flourish 專案文檔

- 📄 [MCP 設定指南](../../guides/mcp-setup.md) - Claude Code 整合
- 📄 [Sprint 9 遷移計劃](../../sprints/release-0-foundation/09-supabase-migration-plan.md) - Supabase 遷移詳情
- 📄 [資料庫遷移指南](./migrations.md) - 遷移工作流程
- 📄 [RLS 策略設計](./rls-policies.md) - 安全策略設計
- 📄 [Supabase 架構總覽](../architecture/overview.md) - 整體架構

### Supabase 官方文檔

- 📄 [Supabase CLI 文檔](https://supabase.com/docs/guides/cli) - CLI 完整指南
- 📄 [環境變數](https://supabase.com/docs/guides/getting-started/environment-variables) - 環境變數最佳實踐
- 📄 [本地開發](https://supabase.com/docs/guides/getting-started/local-development) - 本地開發指南
- 📄 [TypeScript 支援](https://supabase.com/docs/guides/api/typescript-support) - 類型生成

### Next.js 官方文檔

- 📄 [環境變數](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) - Next.js 環境變數
- 📄 [Supabase 整合](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) - Next.js + Supabase

---

## 📞 取得協助

遇到問題或有建議？

- 🐛 **報告問題**：[GitHub Issues](https://github.com/u88803494/flourish/issues)
- 💬 **討論**：聯繫專案管理員

---

**最後更新**: 2025-11-24
**維護者**: Flourish Development Team
**適用於**: Release 0 Foundation 之後的所有開發工作
