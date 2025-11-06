# Backend Hosting Platform Comparison (2025)

> **Sprint 0.8 研究文件**
> 比較各種免費/低成本的 Node.js/NestJS 後端部署方案

## Executive Summary

| 平台                  | 月費    | Always On        | 資源                 | 推薦度     | 適合情境               |
| --------------------- | ------- | ---------------- | -------------------- | ---------- | ---------------------- |
| **OCI**               | **$0**  | ✅               | **4 CPU + 24GB RAM** | ⭐⭐⭐⭐⭐ | 長期使用、不怕設定     |
| **Fly.io**            | **~$2** | ✅               | 256MB RAM            | ⭐⭐⭐⭐   | 快速上線、願意付小錢   |
| **Render**            | **$0**  | ❌ (15min sleep) | 512MB RAM            | ⭐⭐⭐     | 開發階段、可接受 sleep |
| **Railway**           | **$5**  | ✅               | 512MB RAM            | ⭐⭐⭐     | 願意付費買穩定         |
| **Vercel Serverless** | **$0**  | ⚠️ (cold start)  | 動態                 | ⭐⭐       | 需重構為 serverless    |

---

## Detailed Analysis

### 1. Oracle Cloud Infrastructure (OCI) 🏆

#### Pricing

- **Free Tier**: 永久免費（不是試用期）
- **ARM Ampere A1**: 4 OCPUs + 24 GB RAM + 200 GB storage
- **x86**: 2 VMs (各 1/8 OCPU + 1GB RAM)
- **Network**: 10 TB/月免費流量
- **Cost**: $0/月

#### Pros ✅

- 資源最多（24GB RAM 可跑很多服務）
- 真正永久免費
- 不會 sleep
- 完全掌控 VM
- 適合 Docker、Kubernetes、任何工作負載

#### Cons ❌

- 需要手動配置 VM、網路、防火牆
- ARM 實例資源搶手（可能要等幾天到一個月）
- 需要維護 Linux VM
- 初始設定時間較長（2-4 小時）

#### Setup Complexity

- **難度**: 6/10（有 AWS 經驗降到 3/10）
- **時間**: 首次設定 2-4 小時，後續維護 <10 分鐘/月

#### Best For

- 長期專案（永久免費很划算）
- 有基本 Linux 知識
- 需要大量資源（24GB RAM）
- 不介意花點時間設定

#### Deployment Steps

```bash
# 1. 創建 OCI Account & ARM VM
- Region: 韓國春川/澳洲（較不熱門）
- Shape: VM.Standard.A1.Flex
- OCPU: 4, Memory: 24GB

# 2. 安裝 Docker
curl -fsSL https://get.docker.com | sudo sh

# 3. Docker Compose 部署
docker compose up -d

# 4. 設定防火牆與反向代理
```

#### Estimated Monthly Cost

**$0** (完全免費)

---

### 2. Fly.io 🚀

#### Pricing

- **Free Tier**: 每月 $5 credit（使用量計費）
- **Small VM**: ~$1.94/月（256MB RAM, 24/7 運行）
- **Shared CPU**: $0.0027/小時
- **Storage**: $0.15/GB/月
- **Bandwidth**: $0.02/GB（首 100GB 免費）

#### Pros ✅

- 部署超簡單（`fly launch` 一鍵完成）
- 自動 HTTPS
- 全球 CDN
- 不會 sleep
- 接近免費（$2/月 在免費額度內）
- 良好的 CLI 工具

#### Cons ❌

- 免費額度有限（超過 $5 要付費）
- 資源較少（256MB RAM）
- 需要理解用量計費模式
- 社群反映偶有計費爭議

#### Setup Complexity

- **難度**: 2/10
- **時間**: 15-30 分鐘

#### Best For

- 快速上線
- 小型 API（256MB RAM 夠用）
- 願意付少許費用（<$5/月）
- 想要簡單的部署流程

#### Deployment Steps

```bash
# 1. 安裝 Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. 登入
fly auth login

# 3. 部署（自動偵測 NestJS）
cd apps/api
fly launch

# 4. 設定環境變數
fly secrets set DATABASE_URL=xxx

# 5. 部署更新
fly deploy
```

#### Estimated Monthly Cost

**$1.94 - $2.50/月** (在 $5 免費額度內)

---

### 3. Render 💤

#### Pricing

- **Free Tier**: 750 小時/月
- **RAM**: 512 MB
- **Sleep**: 15 分鐘無活動後 sleep
- **Wake Time**: 30 秒
- **Cost**: $0/月

#### Pros ✅

- 完全免費
- 一鍵部署
- 自動 HTTPS
- GitHub 整合好
- 750 小時足夠全月運行

#### Cons ❌

- 15 分鐘 sleep（最大痛點）
- 冷啟動需 30 秒
- 免費版資源有限

#### Setup Complexity

- **難度**: 1/10
- **時間**: 10 分鐘

#### Best For

- 開發階段
- 可以接受偶爾 sleep
- 預算為 0
- 暫時性專案

#### Workaround for Sleep

```bash
# 使用 Cron-Job.org 每 10 分鐘 ping 一次
# 設定 HTTP GET: https://your-api.onrender.com/api/health
# Interval: */10 * * * *
```

#### Estimated Monthly Cost

**$0** (完全免費)

---

### 4. Railway 🚂

#### Pricing

- **Trial**: $5 一次性額度（30 天）
- **Hobby Plan**: $5/月訂閱費 + $5 使用額度
- **RAM**: ~512 MB
- **Note**: 即使用不到 $5，也要付 $5/月訂閱費

#### Pros ✅

- 部署超簡單
- 不會 sleep
- 穩定可靠
- GitHub 整合完美
- 支援 long-running process

#### Cons ❌

- 不再免費（最低 $5/月）
- 比 Fly.io 貴但資源差不多

#### Setup Complexity

- **難度**: 1/10
- **時間**: 10-15 分鐘

#### Best For

- 願意付費買穩定
- 不想處理 DevOps
- 需要 24/7 運行

#### Estimated Monthly Cost

**$5/月** (NT$150)

---

### 5. Vercel Serverless Functions ⚡

#### Pricing

- **Free Tier**: 無限 serverless function 執行
- **Bandwidth**: 100 GB/月
- **Execution Time**: 10 秒/request (Hobby), 60秒 (Pro)
- **Cost**: $0/月

#### Pros ✅

- 完全免費
- 自動擴展
- 與前端同平台（Flow/Apex 已在 Vercel）
- 不會 sleep（但有 cold start 1-2 秒）

#### Cons ❌

- 需要重構 NestJS 為 API Routes 格式
- 不適合 long-running tasks
- 有執行時間限制（10 秒）
- Database connection pooling 需要特別處理

#### Setup Complexity

- **難度**: 7/10（需要重構代碼）
- **時間**: 首次重構 3-5 小時

#### Best For

- 簡單的 REST API
- 無狀態操作
- 與 Vercel 前端高度整合

#### Architecture Changes Required

```typescript
// Before: NestJS Controller
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// After: Vercel API Route
// api/users.ts
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await findAll();
    res.json(users);
  }
}
```

#### Estimated Monthly Cost

**$0** (完全免費)

---

## Cost Comparison (1 Year)

| Platform    | Monthly | Yearly  | Notes        |
| ----------- | ------- | ------- | ------------ |
| **OCI**     | **$0**  | **$0**  | 永久免費     |
| **Fly.io**  | **$2**  | **$24** | 在免費額度內 |
| **Render**  | **$0**  | **$0**  | 有 sleep     |
| **Railway** | **$5**  | **$60** | 已無免費     |
| **Vercel**  | **$0**  | **$0**  | 需重構       |

---

## Recommendation by Use Case

### For This Project (Flourish - Flow/Apex)

#### Phase 0 - Sprint 0.8 (現在)

**推薦: Render 免費版**

```
理由:
- 快速上線（10 分鐘）
- 完全免費
- Sleep 對開發階段影響不大
- 可用 Cron-Job 保持喚醒

成本: $0
時間: 10 分鐘
```

#### Phase 1 - 功能開發 (3-6 個月後)

**推薦: 升級到 Fly.io 或開始設定 OCI**

```
選擇 A: Fly.io
- 簡單升級（15 分鐘）
- 不會 sleep
- 成本低（$2/月）

選擇 B: OCI
- 開始申請 ARM VM（可能要等）
- 設定好後永久免費
- 資源充足支援未來擴展
```

#### Phase 2 - Production (有真實用戶)

**推薦: OCI**

```
理由:
- 永久免費
- 24GB RAM 足夠擴展
- 可以跑多個服務（API + Redis + 監控等）
- 完全掌控

成本: $0
值得花時間設定
```

---

## Quick Decision Matrix

**選 OCI 如果:**

- ✅ 願意花 2-4 小時初次設定
- ✅ 有基本 Linux/Docker 知識
- ✅ 需要大量資源
- ✅ 長期專案（1 年以上）

**選 Fly.io 如果:**

- ✅ 想要快速上線（<30 分鐘）
- ✅ 可接受 $2/月成本
- ✅ 不想管 DevOps
- ✅ 256MB RAM 夠用

**選 Render 如果:**

- ✅ 開發階段暫時部署
- ✅ 預算為 0
- ✅ 可接受偶爾 30 秒延遲
- ✅ 可設定 cron 保持喚醒

**選 Railway 如果:**

- ✅ 願意付 $5/月
- ✅ 要最簡單的部署
- ✅ 需要絕對穩定

**選 Vercel 如果:**

- ✅ API 很簡單
- ✅ 願意重構代碼
- ✅ 無狀態操作為主
- ✅ 與前端高度整合

---

## Action Plan for Sprint 0.8

### Immediate (本週)

```bash
1. 部署到 Render 免費版
   - 時間: 30 分鐘
   - 成本: $0
   - 目的: 立刻有可用的 API

2. 註冊 OCI 並開始申請 ARM VM
   - 時間: 20 分鐘註冊，等待 3-30 天
   - 成本: $0
   - 目的: 為未來做準備
```

### Near Future (1-2 個月後)

```bash
當 OCI ARM VM 成功創建:
1. 準備 Docker Compose 配置
2. 部署到 OCI
3. 從 Render 遷移
4. 設定 GitHub Actions 自動部署

或者

如果 OCI 一直搶不到:
1. 升級到 Fly.io ($2/月)
2. 繼續嘗試 OCI
```

---

## Database Strategy

### Development

```
Option A: 共用一個 Supabase project
- 簡單
- 本地與線上用同一個 DB
- 小心 migration

Option B: 分開 dev 與 prod Supabase projects（推薦）
- Dev project: 隨便玩
- Prod project: 真實資料
- Supabase 免費可開 2 個 projects
```

### Preview/Staging

```
不建議在 Phase 0-1 設定
- 增加複雜度
- PR preview 可以共用 prod DB（小心 migration）
- Phase 2 有真實用戶再考慮
```

---

## Monitoring & Observability

### Phase 0-1: 內建工具就夠

```
✅ Vercel Analytics (Flow/Apex)
✅ Platform logs (Render/Fly.io/OCI)
✅ Supabase Dashboard (DB metrics)

不需要:
❌ Sentry
❌ Datadog
❌ Prometheus/Grafana
```

### Phase 2: 升級監控

```
當有真實用戶後考慮:
- Sentry (error tracking)
- Uptime monitoring
- APM tools
```

---

## GitHub Actions Strategy

### Phase 0-1: 不需要

```
理由:
- Vercel 自動監聽 GitHub
- Render/Fly.io/Railway 自動部署
- 推 main branch 就自動部署

省去寫 workflow 的時間
```

### Phase 2: 可選加入

```yaml
# 如果想要 PR 自動測試
name: CI
on: [pull_request]
jobs:
  test:
    - run: pnpm lint
    - run: pnpm test
```

---

## Final Recommendation

**立即行動（今天）:**

```bash
1. 部署 Flow 到 Vercel（5 分鐘）
2. 部署 Apex 到 Vercel（5 分鐘）
3. 部署 API 到 Render（20 分鐘）
4. 註冊 OCI 開始排隊 ARM VM（20 分鐘）
```

**短期（1 週內）:**

```bash
1. 測試 Render API 是否穩定
2. 設定 Cron-Job.org 保持喚醒（可選）
3. 確認 Flow/Apex 能連到 Render API
```

**中期（1-3 個月）:**

```bash
如果 OCI ARM VM 成功:
  → 遷移到 OCI（永久免費）

如果一直搶不到:
  → 升級到 Fly.io（$2/月）
  → 繼續嘗試 OCI
```

---

## References

- [Fly.io Pricing](https://fly.io/pricing/)
- [Fly.io Calculator](https://fly.io/calculator)
- [Render Free Tier](https://render.com/pricing)
- [Railway Pricing](https://railway.app/pricing)
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [Vercel Pricing](https://vercel.com/pricing)

---

## 決策記錄

**最終決定**: 基於本研究，我們選擇了以下方案：

- **前端**: Vercel（已在使用，DX 優秀）
- **後端**: Render + Cron-Job（$0 成本，基本不 sleep）
- **總成本**: $0/月

詳細決策過程和理由請參考：[Sprint 0.8 Deployment Decision](./sprint-0.8-deployment-decision.md)

---

**Last Updated**: 2025-01-06
**Research By**: Claude
**Project**: Flourish (Flow + Apex)
**Sprint**: 0.8 - CI/CD Planning
