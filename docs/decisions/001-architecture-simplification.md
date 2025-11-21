# ADR 001: 架構簡化 - 從 NestJS 遷移到 Supabase

## 狀態

✅ **已採納** - 2025-11-07

## 背景

在 Sprint 8 期間，原計劃使用 NestJS + Render 部署後端 API。經過完整的技術評估和部署測試後，決定簡化架構為純 Supabase 方案。

### 原始計劃

**架構**：

```
Frontend (Flow/Apex) → NestJS API → Supabase Database
         ↓                ↓
     Vercel           Render
```

**部署方案**：

- Staging: Render Free Tier (branch: `staging`)
- Production: Render Starter Plan ($7/月，branch: `main`)
- Keep-Alive: UptimeRobot 或內建 ping

### 評估過程

在做出決策前，完成了以下評估工作：

1. **部署測試**
   - ✅ 成功部署 Render Staging 環境
   - ✅ 測試環境變數配置
   - ✅ 驗證健康檢查端點
   - ✅ 修復 TypeScript 編譯錯誤
   - ✅ 調整環境驗證 schema

2. **文檔撰寫**
   - ✅ 完整的 Render 部署指南（繁體中文）
   - ✅ Staging 環境設置文檔
   - ✅ Production 環境設置文檔
   - ✅ Keep-Alive 監控指南
   - ✅ Git 工作流程文檔

3. **問題識別**
   - 成本考量：Free tier 會休眠，Starter Plan $7/月
   - 維護複雜度：需管理 staging + production 雙環境
   - 開發負擔：每個功能需手寫 API endpoints
   - 過度設計：當前需求不需要完整的 API layer

## 決策

**採用純 Supabase 架構**，移除獨立的 NestJS API layer。

**新架構**：

```
Frontend (Flow/Apex) → Supabase (Database + Auth + API)
         ↓
     Vercel
```

## 理由

### 1. 項目需求分析

**Flourish 核心功能**：

- 記帳數據記錄（標準 CRUD）
- 統計值追蹤（數據存取）
- 數據視覺化展示（查詢 + 圖表）

**結論**：這些都是 Supabase 原生支援的標準操作。

### 2. 成本考量

| 方案                | 月費用             |
| ------------------- | ------------------ |
| **NestJS + Render** | $7+ (Starter Plan) |
| **Supabase**        | $0 (Free tier)     |

**節省**：100% 部署成本

**Supabase Free Tier** 包含：

- 500MB 資料庫儲存
- 1GB 檔案儲存
- 50,000 月活躍用戶
- 社交 OAuth providers

對 Phase 0-1 完全足夠。

### 3. 維護簡化

**NestJS 方案需要維護**：

- Render Staging 環境
- Render Production 環境
- 環境變數同步（6+ 變數 × 2 環境）
- 服務監控和 Keep-Alive
- API 版本管理

**Supabase 方案需要維護**：

- Supabase 專案設定（一次性）
- Row Level Security policies
- 前端環境變數（2 個變數）

**減少**：~70% 維護工作量

### 4. 開發效率

**NestJS 開發流程**：

```
1. 設計 API endpoint
2. 撰寫 Controller
3. 撰寫 Service
4. 撰寫 DTO 驗證
5. 撰寫測試
6. 部署
```

**Supabase 開發流程**：

```
1. 使用自動生成的 REST API
2. 前端直接調用
```

**加速**：~60% 開發時間

### 5. 技術適配性

**Supabase 完美適合的場景**（✅ Flourish 符合）：

- ✅ 標準 CRUD 操作為主
- ✅ 使用 Supabase Auth
- ✅ 簡單到中等權限需求（RLS 可處理）
- ✅ Realtime 更新需求（可選）
- ✅ 快速原型驗證

**需要 NestJS 的場景**（❌ Flourish 不符合）：

- ❌ 複雜業務邏輯處理
- ❌ 大量第三方服務整合
- ❌ 複雜的背景任務
- ❌ 多步驟工作流程

## 正面影響

### 1. 成本降低

- **部署成本**：$0/月（vs $7+/月）
- **開發時間**：減少 60%
- **維護時間**：減少 70%

### 2. 開發體驗提升

- 自動生成的 TypeScript types
- 即時的 API 更新（無需重新部署）
- 內建的 Realtime subscriptions
- 完善的開發者工具

### 3. 安全性

- Row Level Security (RLS) 強制執行
- 資料庫層級的權限控制
- Supabase 管理基礎設施安全

### 4. 擴展性

- Supabase 可無縫擴展到付費方案
- Edge Functions 可處理複雜邏輯（如未來需要）
- 支援 Realtime、Storage、Edge Functions 等進階功能

## 負面影響與緩解

### 1. 業務邏輯分散在前端

**影響**：複雜邏輯可能重複或難以維護

**緩解**：

- 使用 Row Level Security (RLS) policies
- 複雜計算用 Supabase Database Functions
- 未來如需要可用 Edge Functions
- 建立統一的 data access layer

### 2. 第三方整合挑戰

**影響**：API keys 暴露、CORS 問題

**緩解**：

- Phase 0-1 無第三方整合需求
- 未來可用 Supabase Edge Functions
- 或回退到獨立 API server

### 3. 離線 Supabase 專家

**影響**：團隊（目前只有你）需要學習 Supabase

**緩解**：

- Supabase 文檔完善
- 社群活躍（Discord、GitHub Discussions）
- 學習曲線較 NestJS 平緩

## 遷移路徑（如未來需要）

### 情境 1：需要少數複雜邏輯

**解決方案**：Supabase Edge Functions

```typescript
// Supabase Edge Function 範例
export async function handler(req: Request) {
  // 複雜業務邏輯
  // 第三方 API 調用
  // 保護 API keys
  return new Response(JSON.stringify(result));
}
```

### 情境 2：需要大量複雜後端處理

**解決方案**：回到 NestJS + Render

- 已有完整的部署文檔（存檔）
- 已有 NestJS 設置經驗
- 可快速恢復

### 情境 3：混合架構

**解決方案**：Supabase + 選擇性 API

```
大部分功能 → Supabase 直連
複雜功能 → NestJS API
```

## 實施計劃

### Sprint 8（當前）- 文檔與決策

- [x] 評估 NestJS + Render 方案
- [x] 識別成本和複雜度問題
- [x] 創建此 ADR 文檔
- [x] 存檔 Render 部署文檔
- [x] 更新 Sprint 8 文檔

### Sprint 9 - 實現 Supabase

- [ ] 創建 `packages/supabase-client`
- [ ] 移除 `apps/api`
- [ ] 前端整合 Supabase
- [ ] 設置基礎 RLS policies
- [ ] 更新開發環境設定

### Sprint 10（可選）- 安全加強

- [ ] 完善 RLS policies
- [ ] 前端表單驗證
- [ ] 錯誤處理標準化

### Sprint 1 - Authentication（簡化）

- [ ] 使用 Supabase Auth（非從零實作）
- [ ] Email/Password 登入
- [ ] Social OAuth（可選）

## 參考資料

### 內部文檔

- [Render Staging 設置](../archive/render-deployment/render-staging-setup.md)（存檔）
- [Render Production 設置](../archive/render-deployment/render-production-setup.md)（存檔）
- [Backend Hosting 比較](../archive/render-deployment/backend-hosting-comparison.md)（存檔）
- [Sprint 8 評估文檔](../sprints/sprint-0-foundation/08-deployment-evaluation.md)

### 外部資源

- [Supabase 官方文檔](https://supabase.com/docs)
- [Supabase Auth 指南](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

## 決策者

- **提議者**：Henry Lee
- **日期**：2025-11-07
- **背景**：Sprint 8 部署評估

## 審查與更新

### 下次審查時機

- Sprint 1 完成後（評估 Authentication 實作經驗）
- Phase 1 完成後（評估整體開發體驗）
- 需要複雜業務邏輯時（重新評估架構需求）

### 預期調整

此決策預期在 Phase 0-1 期間保持穩定。Phase 2 後可能需要重新評估。

---

**最後更新**：2025-11-07
**狀態**：已採納並實施中
