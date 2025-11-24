# Supabase vs NestJS 架構比較

**狀態**: 📝 框架（Task 3 將填充詳細內容）

---

## 🎯 比較目的

比較 Supabase-first 架構與傳統 NestJS + Render 架構的差異，幫助理解遷移決策。

---

## 📊 整體比較表

| 面向         | Supabase        | NestJS + Render |
| ------------ | --------------- | --------------- |
| **成本**     | $0/月（免費層） | $7+/月          |
| **開發時間** | -60%            | 基準            |
| **維護工作** | -70%            | 基準            |
| **學習曲線** | 中等            | 陡峭            |
| **擴展性**   | 自動            | 手動配置        |
| **靈活性**   | 中等            | 高              |

_(Task 3 將補充更詳細的比較)_

---

## 🏗️ 架構對比

### Supabase 架構

```
Frontend → Supabase Client → Supabase (DB + Auth + API)
```

**優勢**:

- (Task 3 補充)

**限制**:

- (Task 3 補充)

---

### NestJS 架構

```
Frontend → NestJS API → Prisma → PostgreSQL
         → Render Deploy → $7+/月
```

**優勢**:

- (Task 3 補充)

**限制**:

- (Task 3 補充)

---

## 🔄 功能對應表

| 功能           | Supabase 實作       | NestJS 實作            |
| -------------- | ------------------- | ---------------------- |
| **資料庫**     | PostgreSQL (內建)   | Prisma + PostgreSQL    |
| **API**        | Auto-generated REST | 手動實作 Controllers   |
| **認證**       | Supabase Auth       | Passport.js + JWT      |
| **授權**       | Row Level Security  | Guards + Decorators    |
| **檔案上傳**   | Supabase Storage    | Multer + Cloud Storage |
| **Realtime**   | Supabase Realtime   | WebSocket/Socket.io    |
| **Serverless** | Edge Functions      | Cloud Functions        |

_(Task 3 將補充詳細說明)_

---

## 📈 開發體驗比較

### 新增 CRUD 端點

**Supabase**:

```typescript
// 1. 定義 RLS policy（SQL）
// 2. 使用 auto-generated API
const { data } = await supabase.from('transactions').select('*');
```

**NestJS**:

```typescript
// 1. Controller
// 2. Service
// 3. DTO
// 4. Prisma schema
// 5. Migration
// 6. 測試
```

_(Task 3 將補充實際程式碼範例)_

---

## 💰 成本比較

### 免費層級

- Supabase: 500MB DB, 1GB Storage, 50K MAU
- Render: 無免費方案（Web Service）

### 付費方案

- (Task 3 補充詳細費用分析)

---

## 🎓 學習曲線

- (Task 3 補充學習資源與時間估計)

---

## 🔗 相關文檔

- [架構總覽](./overview.md)
- [架構決策](./decisions.md)
- [Sprint 8 評估](../../sprints/release-0-foundation/08-deployment-evaluation.md)

---

**最後更新**: 2025-11-24
**Task 3 將補充**: 詳細比較、程式碼範例、成本分析
