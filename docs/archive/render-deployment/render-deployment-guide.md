# Render.com 部署指南

> **專案**: Flourish (Flow + Apex)
> **Sprint**: 8 - CI/CD & Deployment
> **目標**: 部署 NestJS API 到 Render.com 免費版
> **成本**: $0/月（永久免費）

## 📋 目錄

- [前置條件](#前置條件)
- [Release 1: 準備 Render 帳號](#release-1-準備-render-帳號)
- [Phase 2: 創建 Web Service](#phase-2-創建-web-service)
- [Phase 3: 驗證部署](#phase-3-驗證部署)
- [Phase 4: 設定 Cron-Job 保持喚醒](#phase-4-設定-cron-job-保持喚醒)
- [Phase 5: 更新前端 API URL](#phase-5-更新前端-api-url)
- [Phase 6: 完整測試](#phase-6-完整測試)
- [常見問題排查](#常見問題排查)
- [監控與維護](#監控與維護)

---

## 前置條件

在開始部署之前，請確認以下項目已完成：

### ✅ 程式碼準備

- [x] `render.yaml` 已更新並推送到 GitHub
- [x] API 能在本地成功建置 (`pnpm build --filter @flourish/api`)
- [x] 所有測試通過
- [x] 程式碼已推送到 `main` 分支

### ✅ 環境資訊準備

您需要準備以下資訊（從 Supabase Dashboard 取得）：

1. **DATABASE_URL**
   - 位置: Supabase Dashboard → Settings → Database → Connection string
   - 使用: **Session pooler** (port 6543)
   - 格式: `postgresql://postgres.xxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres`

2. **SUPABASE_JWT_SECRET**
   - 位置: Supabase Dashboard → Settings → API → JWT Settings
   - 找到: "JWT Secret"

3. **SUPABASE_SERVICE_ROLE_KEY**
   - 位置: Supabase Dashboard → Settings → API
   - 找到: "service_role" (secret key)
   - ⚠️ **注意**: 這是敏感資訊，不要洩漏

---

## Release 1: 準備 Render 帳號

**預計時間**: 2 分鐘

### 步驟 1.1: 註冊 Render

1. 前往 [https://render.com](https://render.com)
2. 點擊右上角 **"Get Started for Free"**
3. 選擇 **"Sign up with GitHub"**
4. 授權 Render 存取你的 GitHub 帳號
5. 完成註冊

### 步驟 1.2: 連接 GitHub Repository

1. 在 Render Dashboard，點擊右上角頭像
2. 選擇 **"Account Settings"**
3. 左側選擇 **"GitHub"**
4. 點擊 **"Connect GitHub"**
5. 授權 Render 存取 `flourish` repository

---

## Phase 2: 創建 Web Service

**預計時間**: 5 分鐘

### 步驟 2.1: 使用 Blueprint 部署

1. 回到 Render Dashboard 首頁
2. 點擊 **"New +"** → **"Blueprint"**
3. 選擇 `flourish` repository
4. Render 會自動偵測根目錄的 `render.yaml`
5. 檢查 Blueprint 預覽（應該顯示 1 個 Web Service: `flourish-api`）
6. 點擊 **"Apply"**

### 步驟 2.2: 設定環境變數

部署創建後，需要手動設定環境變數：

1. 在 Render Dashboard，點擊剛創建的 **flourish-api** service
2. 左側選擇 **"Environment"**
3. 新增以下環境變數（點擊 "Add Environment Variable"）：

   ```bash
   # 資料庫連接
   DATABASE_URL=postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres

   # Supabase JWT Secret
   SUPABASE_JWT_SECRET=your_jwt_secret_from_supabase_dashboard

   # Supabase Service Role Key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_dashboard
   ```

4. 點擊 **"Save Changes"**

> **💡 提示**: 環境變數欄位右側有「眼睛」圖示可以切換顯示/隱藏密碼

### 步驟 2.3: 觸發首次部署

1. 設定完環境變數後，Render 會自動開始部署
2. 或手動觸發: 點擊右上角 **"Manual Deploy"** → **"Deploy latest commit"**
3. 等待建置完成（約 5-10 分鐘）

### 步驟 2.4: 監控建置過程

1. 點擊 **"Logs"** 查看即時日誌
2. 確認看到以下訊息：

   ```
   🚀 Starting Flourish API build for Render...
   📦 Installing dependencies with pnpm...
   🗄️  Generating Prisma Client...
   🔄 Running database migrations...
   🏗️  Building NestJS API...
   ✅ Build completed successfully!
   ```

3. 最後應該看到:

   ```
   🚀 API is running on: http://0.0.0.0:10000
   ```

---

## Phase 3: 驗證部署

**預計時間**: 3 分鐘

### 步驟 3.1: 取得 Render URL

1. 在 Service 頁面頂部，找到你的 URL
2. 格式: `https://flourish-api.onrender.com`（或類似）
3. 複製這個 URL

### 步驟 3.2: 測試 Health Endpoints

使用 curl 或瀏覽器測試：

```bash
# 測試 Liveness（基本存活檢查）
curl https://flourish-api.onrender.com/health/liveness

# 預期回應:
{"status":"alive"}

# 測試 Readiness（就緒檢查，含資料庫）
curl https://flourish-api.onrender.com/health/readiness

# 預期回應:
{"status":"ready","ready":true}

# 測試完整健康狀態
curl https://flourish-api.onrender.com/health

# 預期回應:
{
  "status":"healthy",
  "timestamp":"2025-11-06T...",
  "uptime":123,
  "database":{
    "status":"connected",
    "connected":true
  }
}
```

### 步驟 3.3: 檢查部署狀態

在 Render Dashboard:

1. Service 頁面頂部應顯示 **"Live"** 綠色狀態
2. **"Logs"** 無異常錯誤
3. **"Events"** 顯示 "Deploy live"

---

## Phase 4: 設定 Cron-Job 保持喚醒

**預計時間**: 5 分鐘

Render 免費版會在 15 分鐘無活動後進入 sleep 狀態。使用 Cron-Job.org 每 10 分鐘 ping 一次，保持 API 喚醒。

### 步驟 4.1: 註冊 Cron-Job.org

1. 前往 [https://cron-job.org](https://cron-job.org)
2. 點擊 **"Sign up"**
3. 使用 Email 註冊（或 GitHub OAuth）
4. 驗證 Email 並登入

### 步驟 4.2: 創建 Cronjob

1. 登入後，點擊 **"Create cronjob"**
2. 填寫以下資訊：

   | 欄位              | 值                                                  |
   | ----------------- | --------------------------------------------------- |
   | **Title**         | Keep Flourish API Alive                             |
   | **Address (URL)** | `https://flourish-api.onrender.com/health/liveness` |
   | **Schedule**      | 選擇 "Every 10 minutes"                             |
   | 或手動輸入        | `*/10 * * * *`                                      |
   | **Enabled**       | ✅ Yes                                              |

3. 點擊 **"Create"**

### 步驟 4.3: 測試 Cronjob

1. 在 Cronjob 列表中，找到剛創建的任務
2. 點擊 **"Execute now"** 立即執行一次
3. 等待幾秒後，點擊任務查看詳情
4. 確認 **"Last execution"** 顯示成功（200 OK）

### 步驟 4.4: 驗證不會 Sleep

1. 等待 15 分鐘不訪問 API
2. 再次訪問 health endpoint
3. 應該立即回應（<2 秒），不會有 30 秒冷啟動

---

## Phase 5: 更新前端 API URL

**預計時間**: 10 分鐘

### 步驟 5.1: 更新 Flow App (Vercel)

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到 `flourish-flow` project（或實際的專案名稱）
3. 進入 **Settings** → **Environment Variables**
4. 新增或更新以下變數：

   | Key                   | Value                               | Environment                      |
   | --------------------- | ----------------------------------- | -------------------------------- |
   | `NEXT_PUBLIC_API_URL` | `https://flourish-api.onrender.com` | Production, Preview, Development |

5. 點擊 **"Save"**
6. 前往 **"Deployments"** → 點擊最新的 deployment 右側的 **"..."** → **"Redeploy"**

### 步驟 5.2: 更新 Apex App (Vercel)

重複步驟 5.1，但選擇 `flourish-apex` project

### 步驟 5.3: 更新 API CORS 設定

1. 取得 Vercel 部署後的實際 URLs（可能會是自動生成的）
2. 回到 Render Dashboard → flourish-api
3. 進入 **"Environment"**
4. 找到 `CORS_ORIGIN` 變數
5. 更新為實際的前端 URLs:

   ```
   https://flourish-flow.vercel.app,https://flourish-apex.vercel.app,http://localhost:3100,http://localhost:3200
   ```

6. 點擊 **"Save Changes"**（會自動觸發重新部署）

---

## Phase 6: 完整測試

**預計時間**: 10 分鐘

### 測試清單

- [ ] **API Health Check**
  - 訪問 `https://flourish-api.onrender.com/health`
  - 確認回應 `"status":"healthy"`
  - 確認 `"database":{"connected":true}`

- [ ] **Flow App 連接測試**
  - 開啟 `https://flourish-flow.vercel.app`
  - 打開瀏覽器 DevTools (F12) → Network
  - 執行任何 API 操作
  - 確認請求發送到 `flourish-api.onrender.com`
  - 確認無 CORS 錯誤

- [ ] **Apex App 連接測試**
  - 開啟 `https://flourish-apex.vercel.app`
  - 重複上述測試

- [ ] **Cron-Job 測試**
  - 回到 Cron-Job.org Dashboard
  - 查看 "Execution history"
  - 確認最近幾次執行都成功（綠色勾勾）

- [ ] **Sleep 測試**
  - 等待 20 分鐘不訪問 API
  - 再次訪問 health endpoint
  - 確認回應時間 <2 秒（沒有冷啟動）

---

## 常見問題排查

### ❌ 問題 1: Build 失敗 - "Cannot find module @flourish/database"

**症狀**: 建置日誌顯示找不到 `@flourish/database` 模組

**原因**: Workspace 依賴解析失敗

**解決方案**:

1. 確認 `render.yaml` 沒有設定 `rootDir`
2. 確認 `buildCommand` 從 repo root 執行
3. 檢查 `pnpm-workspace.yaml` 配置正確
4. 確認使用 `pnpm install --frozen-lockfile`

### ❌ 問題 2: Prisma Client 錯誤

**症狀**:

```
Error: @prisma/client did not initialize yet
```

**原因**: Prisma Client 未生成或版本不匹配

**解決方案**:

1. 確認 `render.yaml` 的 buildCommand 包含:

   ```bash
   pnpm --filter @flourish/database prisma:generate
   ```

2. 或在 Render Dashboard → **"Manual Deploy"** → **"Clear build cache & deploy"**

### ❌ 問題 3: Database Connection Failed

**症狀**: Health endpoint 顯示 `"database":{"connected":false}`

**原因**: DATABASE_URL 配置錯誤或 Supabase 連接問題

**檢查清單**:

- [ ] DATABASE_URL 使用 **Session pooler** (port 6543)
- [ ] 密碼正確且已 URL encode（如果包含特殊字元）
- [ ] Supabase 專案狀態正常（檢查 Supabase Dashboard）
- [ ] 網路連接正常

**測試連接** (本地):

```bash
# 設定環境變數
export DATABASE_URL="your_database_url_here"

# 測試連接
cd packages/database
pnpm prisma db pull
```

### ❌ 問題 4: CORS 錯誤

**症狀**: 前端 console 顯示:

```
Access to fetch at 'https://flourish-api.onrender.com/...' from origin 'https://flourish-flow.vercel.app' has been blocked by CORS policy
```

**原因**: API 的 CORS 配置不包含前端 URL

**解決方案**:

1. 確認 Render 環境變數 `CORS_ORIGIN` 包含前端 URL
2. 確認前端 URL 沒有多餘的 `/` (trailing slash)
3. 更新後需要重新部署 API
4. 清除瀏覽器快取 (Ctrl+Shift+R 或 Cmd+Shift+R)

**檢查方法**:

```bash
# 使用 curl 測試 CORS
curl -X OPTIONS \
  -H "Origin: https://flourish-flow.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v \
  https://flourish-api.onrender.com/health

# 查看 Access-Control-Allow-Origin header
```

### ❌ 問題 5: API 回應很慢（>30 秒）

**症狀**: 首次訪問 API 需要 30 秒以上

**原因**: Render 免費版 sleep 後的冷啟動

**解決方案**:

1. 確認 Cron-Job 已正確設定並執行
2. 檢查 Cron-Job.org 的執行歷史
3. 確認間隔設定為 10 分鐘（`*/10 * * * *`）
4. 如果 Cron-Job 正常但仍然 sleep，可能需要聯絡 Render 客服

---

## 監控與維護

### 📊 日誌查看

#### Render Logs

1. Render Dashboard → flourish-api
2. 左側選擇 **"Logs"**
3. 即時查看應用程式日誌
4. 可以按時間範圍過濾

**關注的日誌**:

- ✅ `🚀 API is running on: http://0.0.0.0:10000`
- ✅ `✅ Database connected`
- ⚠️ 任何 `ERROR` 或 `WARN` 訊息

#### Cron-Job Logs

1. Cron-Job.org Dashboard
2. 點擊任務查看 "Execution history"
3. 確認最近執行都成功（綠色）

**警示**:

- ⚠️ 連續 3 次失敗 → 檢查 API 是否正常
- ⚠️ HTTP 5xx 錯誤 → API 內部錯誤
- ⚠️ Timeout → API 回應太慢

### 📈 效能監控

**檢查項目**:

- [ ] API 回應時間 <2 秒（熱啟動）
- [ ] Cron-Job 成功率 >95%
- [ ] Health check 持續回傳 `"status":"healthy"`
- [ ] 無頻繁的 sleep/wake 循環
- [ ] 記憶體使用 <400MB（Render 限制 512MB）

**查看效能**:

1. Render Dashboard → flourish-api
2. 上方有 "Metrics" 圖表（免費版功能有限）
3. 查看 CPU、Memory 使用狀況

### 💰 成本監控

**Render 免費版限制**:

- ✅ 512MB RAM
- ✅ 750 小時/月 (31 天 = 744 小時，剛好)
- ✅ 100GB bandwidth/月
- ✅ 單一 web service

**使用 Cron-Job 後**:

- 基本不會 sleep
- 實際使用 ~744 小時/月
- 完全在免費額度內
- **成本: $0/月**

**監控方法**:

1. Render Dashboard → Account Settings
2. 左側選擇 "Usage"
3. 查看當月使用量

---

## 未來升級路徑

### 何時考慮升級？

#### Render Starter ($7/月)

**升級觸發條件**:

- API 經常 OOM (Out of Memory，>512MB)
- 需要保證不 sleep（不依賴 Cron-Job）
- 需要更多 instances（負載均衡）
- 需要更好的 SLA (Service Level Agreement)

**獲得的好處**:

- 不會 sleep（即使無流量）
- 更多記憶體和 CPU
- 更好的效能保證
- 更長的日誌保留期限

#### 其他選項

**如果需要更多資源**:

- **OCI (Oracle Cloud)**: 永久免費 4 CPU + 24GB RAM（需學習 Docker）
- **Fly.io**: ~$2/月，256MB RAM（有計費風險）
- **自架 VPS**: DigitalOcean $6/月（完全控制）

### 升級決策流程

```
評估指標:
├── 流量 >1000 req/day？
│   ├── Yes → 考慮升級
│   └── No → 繼續免費版
├── 記憶體經常 >400MB？
│   ├── Yes → 升級或優化
│   └── No → 繼續免費版
└── Cron-Job 方案不穩定？
    ├── Yes → 升級到付費版（保證不 sleep）
    └── No → 繼續免費版
```

---

## 回滾計畫

### 如果部署失敗或出現重大問題

#### 選項 1: 回滾到上一個成功的 Deployment

1. Render Dashboard → flourish-api
2. 左側選擇 **"Deployments"**
3. 找到上一個成功的 deployment（綠色勾勾）
4. 點擊右側 **"..."** → **"Redeploy"**
5. 確認回滾

#### 選項 2: 使用 Git Revert

```bash
# 回滾最後一次 commit
git revert HEAD

# 推送
git push origin main

# Render 會自動重新部署舊版本
```

#### 選項 3: 暫時停用 Render，本地運行

```bash
# 前端暫時改回本地 API
# Vercel 環境變數:
NEXT_PUBLIC_API_URL=http://localhost:6888

# 本地運行 API
cd apps/api
pnpm dev
```

---

## 成功指標

### 部署成功的標誌

技術指標:

- [x] Render Dashboard 顯示 **"Live"** 綠色狀態
- [x] `/health/liveness` 回應 `200 OK`
- [x] `/health/readiness` 顯示 `ready: true`
- [x] `/health` 顯示資料庫已連接
- [x] Cron-Job 執行成功率 >95%
- [x] 前端能成功呼叫 API
- [x] 無 CORS 錯誤
- [x] API 日誌無異常錯誤

業務指標:

- [x] 可以展示給他人使用
- [x] 成本為 $0/月
- [x] 回應時間 <2 秒
- [x] 可用性 >99%

---

## 額外資源

### 官方文檔

- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Render Monorepo Deployment](https://render.com/docs/deploy-monorepo)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Web Services](https://render.com/docs/web-services)

### 社群支援

- [Render Community Forum](https://community.render.com/)
- [Render Discord](https://render.com/discord)
- [Render Status Page](https://status.render.com/)

### 疑難排解

- [Common Build Issues](https://render.com/docs/troubleshooting-deploys)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)

---

## 總結

### 完整流程回顧

| Phase    | 任務                            | 時間        | 成本      |
| -------- | ------------------------------- | ----------- | --------- |
| 1        | 註冊 Render 帳號                | 2 分鐘      | $0        |
| 2        | 創建 Web Service & 設定環境變數 | 5 分鐘      | $0        |
| 3        | 驗證部署                        | 3 分鐘      | $0        |
| 4        | 設定 Cron-Job 保持喚醒          | 5 分鐘      | $0        |
| 5        | 更新前端 API URL                | 10 分鐘     | $0        |
| 6        | 完整測試                        | 10 分鐘     | $0        |
| **總計** | **完整部署**                    | **35 分鐘** | **$0/月** |

### 部署後的好處

**技術收穫**:

- ✅ 實戰 CI/CD 經驗
- ✅ Monorepo 部署技能
- ✅ 雲端平台運維經驗
- ✅ Production 環境除錯能力

**業務價值**:

- ✅ 可以展示給他人（Portfolio）
- ✅ 面試作品集加分項
- ✅ 真實使用者測試環境
- ✅ 完全免費運行

### 下一步

部署成功後，你可以：

1. **Sprint 8 完成標記**
   - 更新 `docs/sprints/sprint-0-foundation/tasks.md`
   - 標記 Sprint 8 為完成

2. **創建 Git Tag**

   ```bash
   git tag -a v0.8.0 -m "feat: complete Render.com deployment"
   git push origin v0.8.0
   ```

3. **開始 Sprint 9 或 Release 1**
   - Flow 功能開發
   - Apex 功能開發
   - 或繼續優化基礎設施

---

**祝部署順利！🚀**

**最後更新**: 2025-11-06
**作者**: Claude (AI Assistant)
**專案**: Flourish
**狀態**: Ready for deployment
