# Render 部署文檔存檔

## 📦 存檔原因

本目錄包含 **NestJS + Render 部署方案** 的完整文檔，已於 **2025-11-07** 存檔。

### 為何存檔？

在 Sprint 8 期間，我們完成了以下評估工作：

1. ✅ 成功部署 Render Staging 環境
2. ✅ 完成環境配置和健康檢查驗證
3. ✅ 修復 TypeScript 編譯錯誤
4. ✅ 撰寫完整的部署文檔

**經過完整評估後**，我們決定採用 **純 Supabase 架構**，理由如下：

- **成本**：Supabase Free Tier ($0) vs Render Starter Plan ($7+/月)
- **維護**：減少 ~70% 維護工作量（無需管理 staging + production 環境）
- **開發效率**：加速 ~60% 開發時間（自動生成的 REST API）
- **技術適配**：Flourish 核心功能（記帳 + 統計 + 展示）完美適合 Supabase

### 決策文檔

📄 **完整決策分析請見**：[ADR 001 - 架構簡化](../../decisions/001-architecture-simplification.md)

---

## 📚 存檔文件清單

本目錄保留以下文檔作為歷史記錄：

### 部署指南

- **`render-staging-setup.md`** - Render Staging 環境完整設置指南
  - 環境變數配置
  - 建置和啟動指令
  - 健康檢查設定
  - 疑難排解

- **`render-production-setup.md`** - Render Production 環境設置指南
  - 生產環境配置
  - CORS 安全設定
  - Branch Protection 策略
  - 監控與告警

### 技術文檔

- **`keep-alive-setup.md`** - Keep-Alive 監控設置（UptimeRobot）
  - Free Tier 休眠解決方案
  - 監控配置步驟

- **`render-deployment-guide.md`** - Render 部署總覽
  - 部署流程說明
  - Git 工作流程

- **`backend-hosting-comparison.md`** - 後端託管方案比較
  - Render vs Railway vs Fly.io
  - 成本和功能分析

---

## 🎯 為何保留這些文檔？

1. **決策歷史**：展示我們評估過 NestJS + Render 方案
2. **專業流程**：顯示完整的技術評估和決策過程
3. **未來參考**：如需回到 NestJS 架構，這些文檔可快速恢復
4. **學習資源**：完整的 Render 部署經驗可供未來專案參考

---

## 🔄 遷移路徑

如未來需要獨立 API server，可參考這些文檔快速恢復。

**可能的情境**：

### 情境 1：少數複雜邏輯

**解決方案**：Supabase Edge Functions（優先）

### 情境 2：大量複雜後端處理

**解決方案**：回到 NestJS + Render

- 已有完整部署文檔（本目錄）
- 已有設置經驗
- 可快速恢復

### 情境 3：混合架構

**解決方案**：Supabase + 選擇性 API

```
大部分功能 → Supabase 直連
複雜功能 → NestJS API
```

---

## 📊 評估成果

### 成功完成的工作

- ✅ Render Staging 部署：https://flourish-api-v35o.onrender.com
- ✅ 健康檢查驗證：`/health/liveness` 和 `/health/readiness`
- ✅ 環境變數配置：6 個變數正確設定
- ✅ CORS 配置：支援萬用字元模式
- ✅ TypeScript 編譯：修復所有類型錯誤
- ✅ 環境驗證：支援 4 種環境 (development, staging, production, test)

### 識別的問題

- ❌ 成本：Free tier 會休眠，Starter Plan $7/月
- ❌ 維護複雜度：需管理 staging + production 雙環境
- ❌ 開發負擔：每個功能需手寫 API endpoints
- ❌ 過度設計：當前需求不需要完整的 API layer

---

## 🚀 下一步

**當前架構**（Sprint 9 起）：

```
Frontend (Flow/Apex) → Supabase (Database + Auth + API)
         ↓
     Vercel
```

**部署文檔**：

- Supabase 設置指南（待建立）
- Vercel 環境變數配置（待更新）
- Row Level Security 設定（待建立）

---

**存檔日期**：2025-11-07
**存檔原因**：架構簡化決策（ADR 001）
**狀態**：完整評估後存檔，保留作為歷史記錄

**最後部署 URL**：https://flourish-api-v35o.onrender.com（Staging）
**部署狀態**：成功運行，待停用
