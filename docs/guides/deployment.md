# 部署完整指南

## 🚀 部署策略總覽

本專案採用「服務分離」的部署策略：

| 服務 | 平台 | 成本 | 特性 |
|------|------|------|------|
| **Next.js 前端** | Vercel | $0 | 自動部署、全球 CDN、最佳化 |
| **NestJS 後端** | Railway | $0-10/月 | Long-running、不睡眠、簡單設定 |
| **資料庫** | Supabase | $0 | 500MB、認證、API、Dashboard |

**總成本**：開發階段 $0/月，上線後 $5-35/月

---

## 📦 部署前準備

### 1. 環境變數整理

建立一個環境變數清單，確保所有敏感資訊都不會提交到 Git：

```bash
# .env.example（提交到 Git）
# Next.js 前端
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_nestjs_api_url

# NestJS 後端
DATABASE_URL=your_database_url
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
NODE_ENV=production

# .env（不提交到 Git，加入 .gitignore）
# 包含實際的值
```

### 2. .gitignore 設定

```
# .gitignore
.env
.env*.local
node_modules
dist
build
.next
.turbo

# Prisma
prisma/*.db
prisma/*.db-journal

# OS
.DS_Store
Thumbs.db
```

---

## 🌐 部署 Supabase（資料庫 + 認證）

### Step 1: 建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com)
2. 註冊/登入
3. 點擊「New Project」
4. 填寫：
   - Project name：`flowmetrics` 或你的專案名稱
   - Database Password：設定一個強密碼（儲存好！）
   - Region：選擇離你最近的（如 `Northeast Asia (Seoul)`）
5. 點擊「Create new project」
6. 等待 2-3 分鐘完成建立

### Step 2: 取得必要的 Keys 和 URLs

前往專案的 **Settings → API**

需要記錄的資訊：
```
Project URL:
https://xxxxxxxxxxxxx.supabase.co

anon/public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

service_role key (secret):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (不要外洩！)
```

前往 **Settings → API → JWT Settings**

```
JWT Secret:
your-super-secret-jwt-token-with-at-least-32-characters-long
```

前往 **Settings → Database**

```
Connection string (Direct):
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

Connection string (Connection pooling):
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
```

### Step 3: 執行資料庫 Migration

```bash
# 本地開發時
cd packages/database
DATABASE_URL="postgresql://postgres:..." npx prisma migrate dev

# 或設定 .env 後
npx prisma migrate deploy
```

### Step 4: 測試連接

```bash
npx prisma studio
# 開啟 http://localhost:5555
# 可以看到資料庫表格
```

---

## 🚂 部署 NestJS 到 Railway

### Step 1: 註冊 Railway

1. 前往 [Railway.app](https://railway.app)
2. 使用 GitHub 登入
3. 授權 Railway 存取你的 GitHub

### Step 2: 建立專案

1. 點擊「New Project」
2. 選擇「Deploy from GitHub repo」
3. 如果是第一次，需要「Configure GitHub App」授權特定 repo
4. 選擇你的 monorepo

### Step 3: 設定 Service

因為是 monorepo，需要特別設定：

1. 在 Railway Dashboard，點擊剛建立的專案
2. 點擊「Settings」
3. 設定 **Root Directory**：`apps/api`（NestJS 後端的位置）
4. 設定 **Build Command**：
   ```bash
   npm install && npm run build
   ```
5. 設定 **Start Command**：
   ```bash
   npm run start:prod
   ```

### Step 4: 設定環境變數

在 Railway Dashboard → Variables，加入：

```
DATABASE_URL=postgresql://postgres:...（Supabase Connection Pooling URL）
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
PORT=3001
```

### Step 5: 部署

1. Railway 會自動偵測到環境變數變更並重新部署
2. 等待部署完成（約 2-3 分鐘）
3. 部署成功後，會獲得一個 URL：
   ```
   https://your-app-production.up.railway.app
   ```

### Step 6: 測試 API

```bash
# 測試健康檢查（如果有實作）
curl https://your-app-production.up.railway.app/health

# 或測試一個公開的 endpoint
curl https://your-app-production.up.railway.app/api/version
```

### Railway 特殊設定

#### 使用自訂網域（可選）

1. Railway Dashboard → Settings → Domains
2. 點擊「Generate Domain」或「Add Custom Domain」
3. 如果使用自訂網域，設定 DNS：
   ```
   CNAME api.yourdomain.com → your-app-production.up.railway.app
   ```

#### 自動部署設定

Railway 預設會在 Git push 時自動部署。

如果想要手動控制：
1. Settings → Deployments
2. 關閉「Auto Deploy」
3. 需要部署時手動點擊「Deploy」

---

## ▲ 部署 Next.js 到 Vercel

### Step 1: 註冊 Vercel

1. 前往 [Vercel.com](https://vercel.com)
2. 使用 GitHub 登入
3. 授權 Vercel 存取你的 GitHub

### Step 2: 匯入專案

1. 點擊「Add New...」→「Project」
2. 選擇你的 GitHub repo
3. Vercel 會自動偵測到 Next.js

### Step 3: 設定 Monorepo

因為是 Turborepo：

1. **Root Directory**：選擇 `apps/ledger`（記帳應用）
2. **Framework Preset**：Next.js（自動偵測）
3. **Build Command**：
   ```bash
   cd ../.. && npx turbo run build --filter=ledger
   ```
4. **Output Directory**：`.next`（預設）
5. **Install Command**：
   ```bash
   npm install
   ```

### Step 4: 環境變數

在 Vercel Dashboard → Settings → Environment Variables

加入以下變數：

**Production**：
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://your-app-production.up.railway.app
```

**Preview & Development**（可選）：
- 可以設定不同的值給 preview 和 development 環境

### Step 5: 部署

1. 點擊「Deploy」
2. 等待部署完成（約 2-3 分鐘）
3. 部署成功後，獲得 URL：
   ```
   https://your-app.vercel.app
   ```

### Step 6: 設定自訂網域（可選）

1. Vercel Dashboard → Settings → Domains
2. 輸入你的網域：`yourdomain.com`
3. Vercel 會提供 DNS 設定指示：
   ```
   A Record:    @ → 76.76.21.21
   CNAME:       www → cname.vercel-dns.com
   ```
4. 到你的網域註冊商設定 DNS
5. 等待 DNS 生效（可能需要 24-48 小時）

### Vercel 自動部署

Vercel 會自動：
- `main` 分支 → Production
- 其他分支 → Preview deployment（每個 PR 都有獨立的預覽 URL）

---

## 🔗 CORS 設定

### NestJS 的 CORS 設定

```typescript
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 設定
  app.enableCors({
    origin: [
      'http://localhost:3000',                    // 本地開發
      'https://your-app.vercel.app',             // Vercel Production
      'https://*.vercel.app',                     // Vercel Preview
      'https://yourdomain.com',                   // 自訂網域
      'https://www.yourdomain.com',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API running on port ${port}`);
}
bootstrap();
```

---

## 🔄 CI/CD 設定（可選但推薦）

### GitHub Actions 範例

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build

  deploy-database:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Prisma migrations
        run: |
          cd packages/database
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**設定 GitHub Secrets**：
1. GitHub repo → Settings → Secrets and variables → Actions
2. 新增 `DATABASE_URL`

---

## 📊 監控和日誌

### Railway 日誌

1. Railway Dashboard → 你的專案
2. 點擊「Deployments」→ 最新的 deployment
3. 點擊「View Logs」
4. 即時查看應用程式日誌

### Vercel 日誌

1. Vercel Dashboard → 你的專案
2. 點擊「Deployments」→ 選擇一個 deployment
3. 點擊「Functions」查看 Function logs
4. 或點擊「Runtime Logs」

### 在程式碼中加入日誌

```typescript
// NestJS
import { Logger } from '@nestjs/common';

export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  @Get()
  async findAll(@User() user) {
    this.logger.log(`User ${user.id} fetching transactions`);
    // ...
  }
}
```

---

## 🐛 常見問題排查

### 問題 1：API 回傳 CORS 錯誤

**症狀**：
```
Access to fetch at 'https://api.railway.app/transactions' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**解決方案**：
1. 確認 NestJS 的 CORS origin 包含前端的 URL
2. 確認 Railway 的環境變數已設定
3. 重新部署 Railway

### 問題 2：Prisma 連接資料庫失敗

**症狀**：
```
PrismaClientInitializationError: Can't reach database server
```

**檢查清單**：
- [ ] DATABASE_URL 是否正確？
- [ ] 使用 Connection Pooling URL（port 6543）？
- [ ] Supabase 專案是否正常運行？
- [ ] Railway 的環境變數是否已設定？

**測試連接**：
```bash
# 本地測試
DATABASE_URL="..." npx prisma db pull
```

### 問題 3：JWT 驗證失敗

**症狀**：
```
401 Unauthorized
```

**檢查清單**：
- [ ] SUPABASE_JWT_SECRET 是否正確？
- [ ] 前端是否正確傳送 Authorization header？
- [ ] Token 是否已過期？

**除錯方法**：
```typescript
// 在 SupabaseJwtStrategy 加入日誌
async validate(payload: any) {
  console.log('JWT Payload:', payload);
  return { id: payload.sub, email: payload.email };
}
```

### 問題 4：環境變數沒有生效

**Railway**：
- 修改環境變數後需要重新部署
- 點擊「Redeploy」

**Vercel**：
- 修改環境變數後自動重新部署
- 或手動觸發「Redeploy」

---

## 🔐 安全性檢查清單

部署前的安全檢查：

- [ ] 所有 `.env` 檔案都在 `.gitignore` 中
- [ ] 沒有在程式碼中寫死敏感資訊
- [ ] Supabase service_role key 只在後端使用
- [ ] 啟用 HTTPS（Vercel 和 Railway 預設啟用）
- [ ] 設定正確的 CORS origin
- [ ] 資料庫查詢都有 `userId` 過濾
- [ ] API 路由都有適當的 Guard 保護
- [ ] 密碼強度足夠（Supabase 資料庫密碼）

---

## 📋 部署檢查清單

### 部署前

- [ ] 程式碼 lint 通過
- [ ] 測試通過
- [ ] 建置成功
- [ ] 環境變數清單已準備
- [ ] .gitignore 已設定

### Supabase

- [ ] 專案建立完成
- [ ] 資料庫密碼已儲存
- [ ] API keys 已取得
- [ ] JWT Secret 已取得
- [ ] Migration 已執行
- [ ] 可以用 Prisma Studio 連接

### Railway (NestJS)

- [ ] 專案建立並連接 GitHub
- [ ] Root Directory 設定為 `apps/api`
- [ ] 環境變數已設定
- [ ] 部署成功
- [ ] 可以存取 API URL
- [ ] 日誌正常

### Vercel (Next.js)

- [ ] 專案建立並連接 GitHub
- [ ] Root Directory 設定為 `apps/ledger`
- [ ] 環境變數已設定
- [ ] 部署成功
- [ ] 可以存取網站
- [ ] API 呼叫正常

### 整合測試

- [ ] 可以註冊新使用者
- [ ] 可以登入
- [ ] 可以建立交易
- [ ] 可以查看交易列表
- [ ] 可以更新交易
- [ ] 可以刪除交易
- [ ] 可以登出

---

## 🚀 後續優化

部署完成後，可以考慮的優化：

### 效能優化
- [ ] 啟用 Vercel 的 Analytics
- [ ] 設定 CDN caching
- [ ] 壓縮圖片
- [ ] 使用 Next.js Image Optimization

### 監控
- [ ] 設定 Sentry 錯誤追蹤
- [ ] 設定 Uptime 監控（如 UptimeRobot）
- [ ] 設定 Performance 監控

### 自動化
- [ ] 設定 GitHub Actions CI/CD
- [ ] 自動化測試
- [ ] 自動化備份

### 擴展
- [ ] 設定 Railway 的 Auto-scaling
- [ ] 考慮使用 Redis 快取
- [ ] 考慮使用 Queue（如 Bull）處理背景任務

---

## 💰 成本估算

### 免費額度

**Supabase 免費方案**：
- 500MB 資料庫
- 無限 API 請求
- 50,000 月活躍使用者
- 50GB bandwidth

**Railway 免費額度**：
- $5/月 credit
- 足夠小型應用使用

**Vercel 免費方案**：
- 100GB bandwidth
- 無限部署
- 自動 HTTPS

### 付費升級時機

**Supabase Pro ($25/月)**：
- 當資料庫超過 8GB
- 需要每日自動備份
- 需要更多並發連接

**Railway ($5-20/月)**：
- 當免費額度用完
- 需要更多 CPU/RAM
- 需要更多 bandwidth

**Vercel Pro ($20/月)**：
- 當 bandwidth 超過 100GB
- 需要團隊協作功能
- 需要密碼保護的預覽

---

## 🎯 總結

**部署流程回顧**：
1. ✅ Supabase：資料庫 + 認證（2 分鐘設定）
2. ✅ Railway：NestJS 後端（5 分鐘設定）
3. ✅ Vercel：Next.js 前端（3 分鐘設定）

**總設定時間**：約 10-15 分鐘

**維護成本**：
- 時間：自動部署，幾乎零維護
- 金錢：開發階段免費，上線後 $5-35/月

**部署的好處**：
- ✅ 真實環境測試
- ✅ 可以展示給別人看
- ✅ 學習 DevOps 經驗
- ✅ 面試時的作品集

恭喜你完成部署！🎉
