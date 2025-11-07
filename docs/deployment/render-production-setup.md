# Render Production 環境設置指南

## 概述

本指南將引導你在 Render 上設置 **Flourish API 的 Production 生產環境**。

**帳號**：你的 Production Render 帳號
**分支**：`main`
**用途**：正式上線的生產環境

---

## 前置條件

- [ ] GitHub repository 已連接到 Render 帳號
- [ ] `main` 分支存在且包含已測試的程式碼
- [ ] Supabase 資料庫憑證已準備好（從 `apps/api/.env.local` 取得）
- [ ] Staging 環境已成功測試

---

## 步驟 1：建立新的 Web Service

1. 登入你的 **Production Render 帳號**
2. 點擊 **"New +"** → **"Web Service"**
3. 連接你的 GitHub repository：`u88803494/flourish`
   - 如果尚未連接，點擊 "Configure Account" 並授權存取

---

## 步驟 2：設定基本配置

### Service Name（服務名稱）

```
flourish-api-production
```

### Region（區域）

```
Singapore
```

### Branch（分支）

```
main
```

⚠️ **重要**：務必選擇 `main` 分支作為生產環境

### Runtime（執行環境）

```
Node
```

### Build Command（建置指令）

**複製並貼上整段指令**：

```bash
echo "🚀 Starting Flourish API build for Render (PRODUCTION)..." && \
echo "📦 Installing dependencies with pnpm..." && \
NODE_ENV=development pnpm install --frozen-lockfile && \
echo "🗄️  Generating Prisma Client..." && \
pnpm --filter @flourish/database prisma:generate && \
echo "🔄 Running database migrations..." && \
pnpm --filter @flourish/database migrate:prod && \
echo "🏗️  Building NestJS API..." && \
pnpm --filter @flourish/api build && \
echo "✅ Production build completed successfully!"
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
Value: production
```

⚠️ **注意**：生產環境使用 `production`（不是 `staging`）

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

⚠️ **注意**：目前與 staging 使用相同資料庫。Phase 1 時考慮使用獨立資料庫。

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
Value: https://flourish-flow.vercel.app,https://flourish-apex.vercel.app
```

🔒 **安全性**：生產環境只允許官方 Vercel production URLs（無萬用字元、無 localhost）

---

## 步驟 4：設定健康檢查

向下捲動到 **"Health Check Path"**：

```
/health/liveness
```

---

## 步驟 5：自動部署設定

謹慎設定：

- ✅ **Auto-Deploy**：ON（當 `main` 分支更新時自動部署）
- ⚠️ **Branch Protection**：確保 `main` 分支在 GitHub 上需要 PR 審查

---

## 步驟 6：建立服務

1. 仔細檢查所有設定
2. 再次確認選擇的是 `main` 分支
3. 驗證 CORS_ORIGIN **不包含**萬用字元
4. 點擊 **"Create Web Service"**
5. 等待初次部署完成（3-5 分鐘）

---

## 步驟 7：驗證部署

部署完成後，你會看到類似這樣的 URL：

```
https://flourish-api-production.onrender.com
```

### 測試健康檢查端點

```bash
curl https://flourish-api-production.onrender.com/health/liveness
```

**預期回應**：

```json
{ "status": "ok" }
```

### 測試就緒狀態端點

```bash
curl https://flourish-api-production.onrender.com/health/readiness
```

**預期回應**：

```json
{ "status": "ok", "database": "connected" }
```

### 測試 CORS（應拒絕 preview URLs）

```bash
# 這應該失敗（preview URL 在 production 中不被允許）
curl -H "Origin: https://flourish-flow-abc123.vercel.app" \
  https://flourish-api-production.onrender.com/health/liveness
```

**預期**：CORS 錯誤（這是 production 的正確行為）

### 測試 CORS（應允許 production URLs）

```bash
# 這應該成功
curl -H "Origin: https://flourish-flow.vercel.app" \
  https://flourish-api-production.onrender.com/health/liveness
```

**預期**：`{"status":"ok"}`

---

## 步驟 8：記錄服務 URL

**保存這個 URL** - 你在設定 Vercel 環境變數時會用到：

```
PRODUCTION_API_URL=https://flourish-api-production.onrender.com
```

---

## Production 專屬配置

### GitHub Branch Protection

**重要**：保護 `main` 分支以防止意外部署

1. 前往 GitHub repository settings
2. Branches → Add rule for `main`
3. 啟用：
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators（所有人都必須遵守規則）

### 部署通知

考慮設定 Slack/Discord webhooks：

1. Render Dashboard → Service → Settings
2. 捲動到 "Deploy Notifications"
3. 新增 webhook URL

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

**解決方法**：驗證建置指令包含：

```bash
pnpm --filter @flourish/database prisma:generate
```

### 健康檢查失敗

**解決方法**：

1. 檢查 Render Dashboard 中的 logs
2. 驗證 `PORT=10000` 環境變數
3. 確保 `/health/liveness` 端點存在

### CORS 拒絕合法的 Production URLs

**解決方法**：

1. 在 Vercel dashboard 中驗證確切的 production URLs
2. 如果 URLs 變更，更新 `CORS_ORIGIN`
3. 檢查 `apps/api/src/main.ts` 的 CORS 實作
4. 使用確切的 URL 測試：
   ```bash
   curl -H "Origin: https://flourish-flow.vercel.app" \
     https://flourish-api-production.onrender.com/health/liveness
   ```

### 從錯誤分支意外部署

**預防**：

- 設定 GitHub branch protection
- 要求 PR 審查
- 永遠不要 force-push 到 `main`

**復原**：

1. 在 Render Dashboard 中找到最後一個良好的部署
2. 點擊 "..." → "Redeploy"
3. 或在 git 中回退 commit 並推送

---

## 監控與告警

### 設定 UptimeRobot

**重要**：Production 應該有可靠的 keep-alive 監控

詳細步驟請參見 [Keep-Alive 設置指南](./keep-alive-setup.md)。

### Log 監控

**定期檢查 logs**：

1. Render Dashboard → Service → Logs
2. 尋找錯誤、警告
3. 監控效能指標

### 設定錯誤追蹤（未來）

考慮整合：

- **Sentry**：錯誤追蹤和效能監控
- **LogRocket**：Session replay
- **New Relic**：APM 和監控

---

## 維護

### 更新環境變數

1. 前往 Service Settings → Environment Variables
2. 編輯變數
3. 點擊 "Save Changes"
4. 服務會自動重新部署

⚠️ **Production 警告**：環境變數變更會觸發部署

### 手動重新部署

1. 前往 Service → Deploys
2. 找到成功的部署
3. 點擊 "..." → "Redeploy"

### 緊急回滾

**如果 production 部署失敗**：

1. **快速修復**：重新部署先前版本
   - Render Dashboard → Deploys
   - 找到最後一個成功的部署
   - 點擊 "..." → "Redeploy"

2. **Git Revert**：如果問題在程式碼中

   ```bash
   git checkout main
   git revert <bad-commit-hash>
   git push origin main
   ```

   - Render 會自動部署回退

3. **預期時間**：總共 5-10 分鐘

### 查看 Logs

1. 前往 Service → Logs
2. 即時 logs 會顯示
3. 使用搜尋/過濾功能除錯

---

## 安全性最佳實踐

🔒 **環境變數**：

- 永遠不要提交到 git
- 定期輪換金鑰
- 為 production 使用獨立憑證（未來）

🔒 **CORS 配置**：

- 只允許已知的 production domains
- Production 中無萬用字元
- 無 localhost URLs

🔒 **Branch Protection**：

- `main` 需要 PR 審查
- 防止 force pushes
- 需要 status checks

🔒 **存取控制**：

- 限制誰能存取 Render dashboard
- 使用獨立的 production 帳號
- 在 Render 帳號上啟用 2FA

---

## Production Checklist

上線前：

- [ ] 所有測試在 staging 通過
- [ ] CORS 正確配置（無萬用字元）
- [ ] 環境變數正確設定
- [ ] 健康檢查運作正常
- [ ] GitHub branch protection 已啟用
- [ ] Keep-alive 監控已設定
- [ ] 錯誤追蹤已配置（如適用）
- [ ] 部署通知已配置
- [ ] 回滾程序已測試
- [ ] 文件已更新

---

## 下一步

✅ Production API 部署成功！

現在繼續：

1. **[Vercel 設定](../README.md#vercel-environment-variables)** - 為 production 配置前端
2. **[Keep-Alive 設置](./keep-alive-setup.md)** - 防止服務休眠
3. **[Git 工作流程](./git-workflow.md)** - 遵循正確的部署流程

---

## 重要注意事項

⚠️ **Production 安全**：

- 每次推送到 `main` 都會部署到 production
- 總是先在 staging 測試
- 使用 PR 審查流程
- 永遠不要跳過 branch protection

💰 **Free Tier 限制**：

- 750 建置小時/月
- 15 分鐘無活動後服務休眠
- 考慮為 production workloads 升級

🔄 **自動部署**：

- 僅從 `main` 分支
- 由 git push 觸發
- 檢查 "Events" 標籤查看歷史
- 失敗的部署不會替換目前版本

📊 **監控**：

- 設定 UptimeRobot keep-alive
- 每日監控錯誤 logs
- 追蹤效能指標
- 為關鍵問題設定告警

---

**最後更新**：2025-11-07
**狀態**：Active
**服務 URL**：`https://flourish-api-production.onrender.com`（建立後更新）
