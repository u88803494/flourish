# Render Staging 環境設置指南

## 概述

本指南將引導你在 Render 上設置 **Flourish API 的 Staging 測試環境**。

**帳號**：你的 Staging Render 帳號
**分支**：`staging`
**用途**：在正式部署到生產環境之前進行測試

---

## 前置條件

- [ ] GitHub repository 已連接到 Render 帳號
- [ ] `staging` 分支已存在並推送到 GitHub
- [ ] Supabase 資料庫憑證已準備好（從 `apps/api/.env.local` 取得）

---

## 步驟 1：建立新的 Web Service

1. 登入你的 **Staging Render 帳號**
2. 點擊 **"New +"** → **"Web Service"**
3. 連接你的 GitHub repository：`u88803494/flourish`
   - 如果尚未連接，點擊 "Configure Account" 並授權存取

---

## 步驟 2：設定基本配置

### Service Name（服務名稱）

```
flourish-api-staging
```

### Region（區域）

```
Singapore
```

### Branch（分支）

```
staging
```

⚠️ **重要**：確保選擇 `staging` 分支，不是 `main`

### Runtime（執行環境）

```
Node
```

### Build Command（建置指令）

**複製並貼上整段指令**：

```bash
echo "🚀 Starting Flourish API build for Render (STAGING)..." && \
echo "📦 Installing dependencies with pnpm..." && \
NODE_ENV=development pnpm install --frozen-lockfile && \
echo "🗄️  Generating Prisma Client..." && \
pnpm --filter @flourish/database prisma:generate && \
echo "🔄 Running database migrations..." && \
pnpm --filter @flourish/database migrate:prod && \
echo "🏗️  Building NestJS API..." && \
pnpm --filter @flourish/api build && \
echo "✅ Staging build completed successfully!"
```

### Start Command（啟動指令）

```bash
cd apps/api && pnpm start:prod
```

### Plan（方案）

```
Free
```

---

## 步驟 3：設定環境變數

點擊 "Advanced" → "Add Environment Variable" 並新增以下變數：

### 必要的環境變數

#### 1. NODE_ENV

```
Key: NODE_ENV
Value: staging
```

#### 2. PORT

```
Key: PORT
Value: 10000
```

#### 3. DATABASE_URL

```
Key: DATABASE_URL
Value: postgresql://postgres.fstcioczrehqtcbdzuij:YbYkJd2EILWNCt3@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

⚠️ **注意**：這個值來自你的 `apps/api/.env.local` 檔案

#### 4. SUPABASE_JWT_SECRET

```
Key: SUPABASE_JWT_SECRET
Value: IsStG+ZJKxE7jWomyCHp4tEyhheDdWGXkZ1jINjWlIFPUeislODBTlecZ6tDOYoSg6YDMfcL/gOQjAx8P5kqWA==
```

#### 5. SUPABASE_SERVICE_ROLE_KEY

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdGNpb2N6cmVocXRjYmR6dWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgyMTY0NywiZXhwIjoyMDc3Mzk3NjQ3fQ.Nmt7Sk8cTxowrh02iDlFjbpEmM60PYT7ayq4bQ1behA
```

#### 6. CORS_ORIGIN

```
Key: CORS_ORIGIN
Value: https://flourish-flow-*.vercel.app,https://flourish-apex-*.vercel.app,http://localhost:3100,http://localhost:3200
```

💡 **說明**：萬用字元模式允許所有 Vercel preview 部署訪問

---

## 步驟 4：設定健康檢查

向下捲動到 **"Health Check Path"**：

```
/health/liveness
```

---

## 步驟 5：自動部署設定

確保啟用以下設定：

- ✅ **Auto-Deploy**：ON（當 `staging` 分支更新時自動部署）

---

## 步驟 6：建立服務

1. 檢查所有設定
2. 點擊 **"Create Web Service"**
3. 等待初次部署完成（3-5 分鐘）

---

## 步驟 7：驗證部署

部署完成後，你會看到類似這樣的 URL：

```
https://flourish-api-staging.onrender.com
```

### 測試健康檢查端點

```bash
curl https://flourish-api-staging.onrender.com/health/liveness
```

**預期回應**：

```json
{ "status": "ok" }
```

### 測試就緒狀態端點

```bash
curl https://flourish-api-staging.onrender.com/health/readiness
```

**預期回應**：

```json
{ "status": "ok", "database": "connected" }
```

---

## 步驟 8：記錄服務 URL

**保存這個 URL** - 你在設定 Vercel 環境變數時會用到：

```
STAGING_API_URL=https://flourish-api-staging.onrender.com
```

---

## 疑難排解

### 建置失敗："pnpm: command not found"

**解決方法**：Render 應該會從 `package.json` 自動偵測 pnpm。如果沒有：

1. 前往 Service Settings
2. 新增環境變數：

   ```
   ENABLE_PNPM=true
   ```

3. 重新部署

### 建置失敗："Prisma Client not generated"

**解決方法**：確保建置指令包含：

```bash
pnpm --filter @flourish/database prisma:generate
```

### 健康檢查失敗

**解決方法**：

1. 檢查 Render Dashboard 中的 logs
2. 驗證 `PORT=10000` 環境變數
3. 確保 `/health/liveness` 端點存在於 NestJS app 中

### 來自 Vercel 的 CORS 錯誤

**解決方法**：

1. 驗證 `CORS_ORIGIN` 包含萬用字元模式
2. 檢查 `apps/api/src/main.ts` 實作了基於正則表達式的 CORS 驗證
3. 測試：

   ```bash
   curl -H "Origin: https://flourish-flow-abc123.vercel.app" \
     https://flourish-api-staging.onrender.com/health/liveness
   ```

### 服務在 15 分鐘後進入休眠

**解決方法**：這是 Free Plan 的預期行為。選項：

1. 設定 Keep-Alive 服務（參見 `keep-alive-setup.md`）
2. 接受 staging 環境的冷啟動
3. 升級到 Starter Plan（$7/月）

---

## 下一步

✅ Staging API 部署成功！

現在繼續：

1. **[Production 設置](./render-production-setup.md)** - 設定生產環境
2. **[Vercel 設定](../README.md#vercel-environment-variables)** - 設定前端應用
3. **[Keep-Alive 設置](./keep-alive-setup.md)** - 防止服務休眠

---

## 維護

### 更新環境變數

1. 前往 Service Settings → Environment Variables
2. 編輯變數
3. 點擊 "Save Changes"
4. 服務會自動重新部署

### 手動重新部署

1. 前往 Service → Deploys
2. 找到成功的部署
3. 點擊 "..." → "Redeploy"

### 查看 Logs

1. 前往 Service → Logs
2. 即時 logs 會顯示
3. 使用搜尋/過濾功能查找特定錯誤

---

## 重要注意事項

⚠️ **安全性**：

- 永遠不要將環境變數提交到 git
- 保持 `SUPABASE_SERVICE_ROLE_KEY` 機密
- 如果洩漏，請輪換金鑰

💰 **Free Tier 限制**：

- 750 建置小時/月
- 15 分鐘無活動後服務休眠
- 與其他 free services 共享資源

🔄 **自動部署**：

- 每次推送到 `staging` 分支都會觸發部署
- 檢查 "Events" 標籤查看部署歷史
- 失敗的部署不會替換目前版本

---

**最後更新**：2025-11-07
**狀態**：Active
**服務 URL**：`https://flourish-api-staging.onrender.com`（建立後更新）
