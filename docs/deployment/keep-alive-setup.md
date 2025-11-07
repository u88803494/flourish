# Keep-Alive 服務設置指南

## 概述

Render Free Plan 服務在閒置 15 分鐘後會休眠。本指南說明如何設定 UptimeRobot 來防止你的服務休眠。

**服務**：UptimeRobot（Free Plan）
**功能**：50 個監控器，5 分鐘間隔
**涵蓋**：Staging + Production APIs

---

## 為什麼需要 Keep-Alive？

### 問題

**Render Free Plan 行為**：

- 服務在無請求 15 分鐘後休眠
- 冷啟動需要 30-60 秒
- 第一個使用者請求會超時或非常慢

**影響**：

- 使用者體驗差
- 健康檢查失敗
- 前端 API 超時

### 解決方案

**UptimeRobot**：

- 每 5 分鐘 ping 你的 API
- 讓服務保持 24/7 運作
- 同時提供運行時間監控
- 免費最多 50 個監控器

---

## 步驟 1：註冊 UptimeRobot

1. 前往 [https://uptimerobot.com](https://uptimerobot.com)
2. 點擊 "Register for FREE"
3. 填寫：
   - Email
   - Password
   - Full Name
4. 驗證 email

---

## 步驟 2：建立 Staging API 監控器

### 2.1 新增監控器

1. 登入 UptimeRobot Dashboard
2. 點擊 "+ Add New Monitor"

### 2.2 設定監控器

**Monitor Type（監控類型）**：

```
HTTP(s)
```

**Friendly Name（友善名稱）**：

```
Flourish API - Staging
```

**URL (or IP)**：

```
https://flourish-api-staging.onrender.com/health/liveness
```

⚠️ **注意**：替換成你實際的 Render staging URL

**Monitoring Interval（監控間隔）**：

```
5 minutes
```

💡 Free plan 最短允許 5 分鐘間隔

**Monitor Timeout（監控超時）**：

```
30 seconds
```

**HTTP Method**：

```
GET (default)
```

**Alert Contacts（告警聯絡人）**：

- 選擇你的 email（自動建立）
- 或新增聯絡人（Slack、Discord、Telegram 等）

### 2.3 進階設定（選用）

**Custom HTTP Headers**（如需要）：

```
（除非需要認證，否則留空）
```

**POST Value**（如需要）：

```
（健康檢查不需要）
```

**HTTP Auth**：

```
（公開健康端點不需要）
```

### 2.4 建立監控器

點擊 "Create Monitor"

---

## 步驟 3：建立 Production API 監控器

使用 production 設定重複步驟 2：

**Friendly Name**：

```
Flourish API - Production
```

**URL (or IP)**：

```
https://flourish-api-production.onrender.com/health/liveness
```

⚠️ **注意**：替換成你實際的 Render production URL

**Monitoring Interval**：

```
5 minutes
```

**Monitor Timeout**：

```
30 seconds
```

**Alert Contacts**：

- 你的 email
- 考慮為 production 新增 SMS（付費功能）

點擊 "Create Monitor"

---

## 步驟 4：驗證監控器

### 檢查 Dashboard

你應該看到：

```
✅ Flourish API - Staging (Up)
✅ Flourish API - Production (Up)
```

### 監控器狀態說明

| 狀態      | 意義                 |
| --------- | -------------------- |
| Up ✅     | 服務在超時時間內回應 |
| Down ❌   | 服務未回應或錯誤     |
| Paused ⏸️ | 監控暫時停用         |

### 查看詳細資訊

點擊監控器名稱可以看到：

- 回應時間圖表
- 運行時間百分比
- 回應時間 logs
- 告警歷史

---

## 步驟 5：設定告警聯絡人

### Email 告警（預設）

已使用你的註冊 email 配置

### Slack 整合（建議）

1. 前往 "My Settings" → "Alert Contacts"
2. 點擊 "+ Add Alert Contact"
3. 選擇 "Slack"
4. 依照指示建立 Slack webhook
5. 測試整合

### Discord 整合

1. 在你的伺服器中建立 Discord webhook
2. 前往 UptimeRobot → Alert Contacts
3. 選擇 "Webhook"
4. 貼上 Discord webhook URL
5. 測試

### SMS 告警（付費功能）

- Pro plan 提供（$7/月）
- 建議用於關鍵的 production 監控

---

## 步驟 6：測試 Keep-Alive

### 等待 15 分鐘

讓你的 Render 服務閒置 15 分鐘

### 檢查 Render Dashboard

1. 前往 Render Dashboard
2. 你的服務應該仍然是 "Live"
3. 不顯示 "Sleeping" 狀態

### 使用手動請求驗證

```bash
# 應該快速回應（不是冷啟動）
time curl https://flourish-api-staging.onrender.com/health/liveness

# 預期：< 1 秒回應時間
```

---

## 監控 Dashboard

### UptimeRobot Dashboard

**關鍵指標**：

- **Uptime %**：正確配置的監控器應該 >99%
- **Response Time**：健康檢查的平均回應時間
- **24h Stats**：過去 24 小時的運行時間
- **7d Stats**：過去 7 天的運行時間
- **30d Stats**：過去 30 天的運行時間

### 預期值

**良好效能**：

```
Uptime: 99.9%+
Average Response Time: 200-500ms
```

**效能不佳**（需調查）：

```
Uptime: <95%
Average Response Time: >2000ms
```

### Public Status Page（選用）

建立公開狀態頁面：

1. 前往 "My Settings" → "Public Status Pages"
2. 點擊 "Add Public Status Page"
3. 選擇要包含的監控器
4. 自訂設計
5. 取得可分享的 URL

**範例**：`https://stats.uptimerobot.com/your-custom-slug`

---

## 告警配置

### 告警門檻設定

**For Staging**：

- Alert when down for: `5 minutes`（容錯）
- Re-alert every: `30 minutes`
- Alert via: Email

**For Production**：

- Alert when down for: `2 minutes`（敏感）
- Re-alert every: `15 minutes`
- Alert via: Email + Slack

### 自訂告警訊息

前往 Monitor Settings → Advanced Settings：

**Custom DOWN Alert Message**：

```
⚠️ {monitorFriendlyName} is DOWN!

URL: {monitorURL}
Reason: {alertDetails}
Duration: {alertDuration}

Action: Check Render dashboard immediately
```

**Custom UP Alert Message**：

```
✅ {monitorFriendlyName} is UP again!

Duration of downtime: {alertDuration}
```

---

## 最佳實踐

### ✅ 該做

- 監控 staging 和 production
- 設定適當的告警門檻
- 建立後測試監控器
- 定期檢查狀態頁面
- 為團隊設定 Slack/Discord 告警
- 檢視每月運行時間報告

### ❌ 不該做

- 不要比 5 分鐘更頻繁地監控（free plan 不允許）
- 不要忽略停機告警
- 不要監控不必要的端點（節省監控器配額）
- 不要忘記在 URLs 變更時更新
- 不要無故停用監控器

---

## 疑難排解

### 監控器顯示 "Down" 但服務實際上在運作

**原因**：

- Render 服務正在休眠（冷啟動 > 30 秒超時）
- 網路問題
- 健康端點配置不正確

**解決方法**：

```bash
# 手動測試
curl https://your-service.onrender.com/health/liveness

# 檢查 Render logs
# 驗證端點在 NestJS app 中存在
```

### 回應時間非常高（>2000ms）

**原因**：

- Render 服務休眠
- 資料庫連接慢
- 健康檢查中的大量運算

**解決方法**：

- 確保 keep-alive 運作（不應該休眠）
- 優化健康檢查端點（應該輕量）
- 檢查資料庫連接池

### 太多告警

**原因**：

- 服務實際上不穩定
- 告警門檻太敏感

**解決方法**：

- 在 Render 調查服務 logs
- 增加 "Alert when down for" 持續時間
- 檢查 Render 服務狀態

### 監控器意外暫停

**原因**：

- UptimeRobot free plan 限制
- 太多失敗檢查

**解決方法**：

- 檢查 UptimeRobot 帳號狀態
- 驗證服務實際上在運作
- 聯絡 UptimeRobot 支援

---

## 費用和限制

### Free Plan

**包含**：

- 50 個監控器
- 5 分鐘檢查間隔
- Email 告警
- 無限告警聯絡人
- 2 個月的 log 保留

**限制**：

- 不能比 5 分鐘更頻繁地檢查
- 無 SMS 告警
- 無自訂 HTTP headers（進階用途）

### Pro Plan（$7/月）

**額外功能**：

- 1 分鐘檢查間隔
- SMS 告警
- 進階 HTTP 選項
- 1 年 log 保留
- 優先支援

**建議**：Free plan 目前足夠，在以下情況升級：

- 需要更快檢測（<5 分鐘）
- 需要 SMS 告警
- 需要 > 50 個監控器

---

## 替代方案

### 選項 1：Cron-Job.org

**Free Plan**：

- 100 次執行/天 = ~10 分鐘間隔
- 足夠單一服務
- **問題**：不足以支援雙環境（需要 200/天）

**不建議**用於我們的使用情境

### 選項 2：Better Uptime（Free Tier）

**Free Plan**：

- 10 個監控器
- 3 分鐘間隔
- 比 UptimeRobot 快
- 如需要可作為替代方案

### 選項 3：GitHub Actions Cron

建立 `.github/workflows/keep-alive.yml`：

```yaml
name: Keep Services Alive

on:
  schedule:
    - cron: '*/10 * * * *' # 每 10 分鐘

jobs:
  ping-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Staging API
        run: curl https://flourish-api-staging.onrender.com/health/liveness

  ping-production:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Production API
        run: curl https://flourish-api-production.onrender.com/health/liveness
```

**優點**：免費，與 GitHub 整合
**缺點**：監控功能較少，無運行時間 dashboard

---

## 遷移計畫（如需要）

### 從 Cron-Job.org 到 UptimeRobot

1. 設定 UptimeRobot 監控器（如上所述）
2. 驗證兩個監控器運作 24 小時
3. 停用 Cron-Job.org 任務
4. 再監控 24 小時
5. 刪除 Cron-Job.org 帳號（選用）

### 升級到付費方案（UptimeRobot Pro）

**何時升級**：

- 需要 <5 分鐘檢測
- 需要 SMS 告警
- 需要進階 HTTP 功能

**如何升級**：

1. 前往 UptimeRobot Billing
2. 選擇 Pro plan（$7/月）
3. 輸入付款資訊
4. 現有監控器自動升級

---

## Checklist

完成設定後：

- [ ] UptimeRobot 帳號已建立
- [ ] Staging 監控器已建立並啟用
- [ ] Production 監控器已建立並啟用
- [ ] 告警聯絡人已配置
- [ ] 測試停機告警（暫停監控器，驗證收到告警）
- [ ] 測試恢復告警（取消暫停監控器，驗證收到告警）
- [ ] 建立公開狀態頁面（選用）
- [ ] 設定 Slack/Discord 整合（選用）
- [ ] 為團隊記錄監控器 URLs

---

## 下一步

✅ Keep-Alive 配置成功！

現在繼續：

1. 監控運行時間 48 小時
2. 如需要調整告警門檻
3. 設定公開狀態頁面（選用）
4. 與團隊聊天整合（Slack/Discord）

---

## 重要注意事項

⏰ **5 分鐘間隔**：

- Render 服務 15 分鐘後休眠
- 5 分鐘 pings 確保服務每 5 分鐘喚醒
- 服務永遠不會達到 15 分鐘休眠門檻

📊 **監控價值**：

- 不只是 keep-alive，還提供運行時間監控
- 在實際 production 問題時告警
- 用於事件分析的歷史資料

💰 **費用**：

- 最多 50 個監控器永遠免費
- 適合小到中型專案
- 只在需要時升級

---

**最後更新**：2025-11-07
**服務**：UptimeRobot Free Plan
**狀態**：Active Monitoring
