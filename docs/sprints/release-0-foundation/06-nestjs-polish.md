---
title: 'Sprint 6: NestJS 應用程式與最佳化'
type: 'sprint'
release: 'Release 0'
sprint_number: 6
duration: '1.5 小時'
start_date: '2025-11-04'
completed_date: '2025-11-04'
status: 'completed'
priority: 'P1'
tags: ['nestjs', 'backend', 'archived']
---

# Sprint 6: NestJS 應用程式與最佳化

**持續時間**: 1.5 小時
**完成日期**: 2025-11-04
**狀態**: ✅ 已完成 → ⚠️ 已封存（2025-11-21）

---

## ⚠️ 封存說明

此 Sprint 的成果（NestJS API）已在 **Sprint 9, Task 4** 封存，原因：

- 專案在 Sprint 8 決定採用 **Supabase-first 架構**（ADR 001）
- NestJS + Render 部署被 Supabase 完全取代
- 程式碼已移至 `docs/archive/nestjs-api/`

詳見：

- [ADR 001 - Architecture Simplification](../../decisions/001-architecture-simplification.md)
- [Sprint 8 - Deployment Evaluation](./08-deployment-evaluation.md)
- [Sprint 9 - Supabase Migration Plan](./09-supabase-migration-plan.md)

---

## 🎯 Sprint 目標

建立 NestJS API 應用程式，整合 Prisma，並實作基本模組與健康檢查端點。

---

## 📋 完成的工作

### 1. NestJS 應用程式建立

- ✅ 在 `apps/api` 建立 NestJS app
- ✅ 配置專案結構
- ✅ 設定 TypeScript strict mode
- ✅ 新增 ESLint 配置

### 2. Prisma 整合

- ✅ 整合 `@repo/database` 套件
- ✅ 建立 Prisma service
- ✅ 測試資料庫連接

### 3. 基本模組設定

- ✅ App module 配置
- ✅ Health module 建立
- ✅ 環境變數管理（ConfigModule）

### 4. API 功能實作

- ✅ 健康檢查端點實作
  - `GET /health` - 基本健康檢查
  - `GET /health/liveness` - 存活檢查
  - `GET /health/readiness` - 就緒檢查
- ✅ Response compression 啟用
- ✅ CORS 配置

### 5. 測試修復

- ✅ 修復 unit tests
- ✅ 修復 E2E tests
- ✅ 確保所有測試通過

---

## 🎯 關鍵成就

### 技術成果

- ✅ NestJS API 成功執行於 <http://localhost:3000>
- ✅ 所有測試（unit + E2E）通過
- ✅ Prisma 整合完成
- ✅ TypeScript strict mode 啟用

### 架構成果

- ✅ 健康檢查端點實作（3 個端點）
- ✅ Response compression 最佳化
- ✅ 環境變數管理

---

## 📚 健康檢查端點

### 基本健康檢查

```
GET /health
Response: { "status": "ok" }
```

### 存活檢查（Liveness Probe）

```
GET /health/liveness
Response: { "status": "ok" }
用途: K8s liveness probe，應用程式是否存活
```

### 就緒檢查（Readiness Probe）

```
GET /health/readiness
Response: {
  "status": "ok",
  "database": "up",
  "uptime": 123.45
}
用途: K8s readiness probe，應用程式是否準備好接收流量
```

---

## 🔄 封存後的替代方案

**NestJS 功能** → **Supabase 對應方案**:

| NestJS 功能 | Supabase 替代方案                |
| ----------- | -------------------------------- |
| REST API    | Supabase Auto-generated REST API |
| Prisma ORM  | Supabase JavaScript Client       |
| 健康檢查    | Supabase Dashboard 監控          |
| 認證        | Supabase Auth                    |
| 授權        | Row Level Security (RLS)         |
| 資料庫遷移  | Supabase Migrations (SQL)        |

---

## 📚 學到的經驗

### 技術技能

1. **NestJS 架構**: 模組化設計與依賴注入
2. **Prisma 整合**: ORM 在 NestJS 中的使用
3. **健康檢查**: Liveness vs Readiness 的區別
4. **測試**: NestJS 的 unit 和 E2E 測試方式

### 架構決策經驗

1. **過度設計的代價**: NestJS 對當前需求來說太重
2. **成本效益分析**: Supabase 免費 vs Render $7+/月
3. **YAGNI 原則**: 只建立目前需要的功能

---

## 🔗 相關文檔

- [Sprint 8 - Deployment Evaluation](./08-deployment-evaluation.md) - 導致封存的評估
- [ADR 001 - Architecture Simplification](../../decisions/001-architecture-simplification.md) - 架構決策
- [NestJS Archive](../../archive/nestjs-api/README.md) - 封存的程式碼與文檔
- [Release 0 總覽](./README.md)

---

**最後更新**: 2025-11-24
**封存日期**: 2025-11-21（Sprint 9, Task 4）
