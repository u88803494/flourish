# Supabase 文檔

本目錄包含 Flourish 專案的完整 Supabase 整合文檔，涵蓋架構設計、開發指南、API 參考與最佳實踐。

**文檔特色**：

- ✅ **完整涵蓋**：從架構決策到實作細節
- ✅ **實戰導向**：所有範例來自 Flourish 實際程式碼
- ✅ **持續更新**：與專案開發同步維護
- ✅ **中英對照**：繁體中文說明 + 英文技術術語

---

## 📖 目錄

- [📚 文檔結構](#-文檔結構)
- [🚀 快速開始](#-快速開始)
- [🎯 使用場景導航](#-使用場景導航)
- [📋 文檔索引](#-文檔索引)
- [🔗 相關資源](#-相關資源)
- [📝 貢獻指南](#-貢獻指南)

---

## 📚 文檔結構

### 架構文檔（Architecture）

深入了解 Flourish 的 Supabase-first 架構設計原理與決策過程。

| 文檔                                            | 描述                                                                                                                                                                  | 適用對象                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [**架構總覽**](./architecture/overview.md)      | Supabase-first 架構的完整設計<br/>- 7 層架構模型<br/>- 資料流程圖<br/>- 核心設計原則<br/>- 技術選型理由                                                               | 🏗️ 架構師<br/>👨‍💻 開發者<br/>📊 專案經理 |
| [**架構決策記錄**](./architecture/decisions.md) | 所有重大技術決策的完整記錄<br/>- ADR 001: 架構簡化（NestJS → Supabase）<br/>- ADR 002: Imperative Migrations<br/>- ADR 003: Design System 配置<br/>- 決策樹與遷移路徑 | 🏗️ 架構師<br/>👨‍💼 技術主管<br/>📚 新成員 |
| [**架構比較**](./architecture/comparison.md)    | Supabase vs 其他方案的深度對比<br/>- 開發效率分析（75% 提升）<br/>- 成本比較（$0 vs $7+/月）<br/>- 學習曲線評估<br/>- 適用場景建議                                    | 🤔 決策者<br/>💼 創業者<br/>🔍 評估階段 |

### 使用指南（Guides）

逐步指導如何在 Flourish 專案中使用 Supabase 的各項功能。

| 文檔                                              | 描述                                                                                                                                                 | 適用對象                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [**本地開發設定**](./guides/local-development.md) | 完整的本地開發環境配置<br/>- Supabase CLI 安裝<br/>- Docker 本地實例<br/>- 環境變數設定<br/>- 本地測試工作流程                                       | 🆕 新成員<br/>👨‍💻 前端開發<br/>🔧 DevOps      |
| [**資料庫遷移**](./guides/migrations.md)          | Imperative Migrations 工作流程<br/>- 4 個完整遷移範例<br/>- 遷移腳本編寫指南<br/>- 本地/遠端遷移流程<br/>- 回滾與除錯技巧                            | 👨‍💻 後端開發<br/>🗄️ 資料庫管理<br/>🔧 DevOps  |
| [**RLS 策略設計**](./guides/rls-policies.md)      | Row Level Security 完整指南<br/>- 7 個核心 RLS 模式<br/>- Flourish 實際策略範例<br/>- 效能優化技巧<br/>- 測試與除錯方法                              | 🔒 安全專家<br/>👨‍💻 後端開發<br/>🏗️ 架構師    |
| [**Auth 整合**](./guides/authentication.md)       | Supabase Auth 完整整合指南<br/>- Email/Password 認證流程<br/>- OAuth 整合（Google、GitHub）<br/>- Next.js Middleware 整合<br/>- Session 管理與安全性 | 👨‍💻 全端開發<br/>🔐 認證專家<br/>🆕 新成員    |
| [**Edge Functions**](./guides/edge-functions.md)  | Serverless Functions 使用指南<br/>- 4 個 Flourish 使用案例<br/>- PDF 解析、AI 建議、銀行 API、Cron<br/>- 開發與部署流程<br/>- 效能優化與成本管理     | 👨‍💻 後端開發<br/>☁️ Serverless<br/>🤖 AI 整合 |

### API 參考（API Reference）

詳細的 API 使用文檔與範例，包含 TypeScript 類型定義。

| 文檔                                              | 描述                                                                                                                | 適用對象                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [**TypeScript 類型**](./api-reference/types.md)   | 自動生成的完整類型系統<br/>- Database 類型定義<br/>- 類型生成工作流程<br/>- 類型安全最佳實踐<br/>- 常見類型問題解決 | 👨‍💻 TypeScript 開發<br/>🔧 工具配置<br/>📚 類型安全 |
| [**React Hooks**](./api-reference/hooks.md)       | 自訂 Supabase Hooks 完整 API<br/>- 12 個實用 Hooks<br/>- 使用範例與模式<br/>- 錯誤處理與載入狀態<br/>- 效能優化技巧 | ⚛️ React 開發<br/>🎨 前端開發<br/>🆕 新成員        |
| [**查詢模式**](./api-reference/query-patterns.md) | 常用資料查詢模式與範例<br/>- 15+ 實戰查詢範例<br/>- 複雜關聯查詢<br/>- 效能優化技巧<br/>- 分頁與排序實作            | 👨‍💻 後端開發<br/>🗄️ 資料庫查詢<br/>⚡ 效能優化      |
| [**錯誤處理**](./api-reference/error-handling.md) | 完整的錯誤處理最佳實踐<br/>- Supabase 錯誤類型<br/>- 統一錯誤處理模式<br/>- 使用者友善錯誤訊息<br/>- 錯誤監控與日誌 | 👨‍💻 全端開發<br/>🐛 除錯專家<br/>📊 監控分析        |

---

## 🚀 快速開始

### 新成員入門（3 步驟）

如果你是第一次接觸 Flourish 的 Supabase 架構：

1. **了解架構** → [架構總覽](./architecture/overview.md)
   - 閱讀時間：15 分鐘
   - 了解為何選擇 Supabase-first 架構
   - 理解 7 層架構模型與資料流程

2. **配置開發環境** → [本地開發設定](./guides/local-development.md)
   - 配置時間：30 分鐘
   - 安裝 Supabase CLI
   - 設定本地開發實例
   - 連結遠端專案

3. **開始開發** → [React Hooks API](./api-reference/hooks.md)
   - 學習時間：20 分鐘
   - 使用 `useSupabase` 與 `useUser`
   - 實作第一個 CRUD 功能
   - 套用錯誤處理模式

**預計總時間**：約 1 小時即可開始貢獻程式碼 🎉

### 常見開發任務

| 任務             | 參考文檔                                                                                | 預估時間    |
| ---------------- | --------------------------------------------------------------------------------------- | ----------- |
| 🆕 新增資料表    | [資料庫遷移](./guides/migrations.md)                                                    | 15-30 分鐘  |
| 🔒 設定權限      | [RLS 策略設計](./guides/rls-policies.md)                                                | 20-45 分鐘  |
| ⚛️ 實作 CRUD     | [React Hooks](./api-reference/hooks.md) + [查詢模式](./api-reference/query-patterns.md) | 30-60 分鐘  |
| 🔐 整合認證      | [Auth 整合](./guides/authentication.md)                                                 | 45-90 分鐘  |
| ☁️ 建立 Function | [Edge Functions](./guides/edge-functions.md)                                            | 60-120 分鐘 |

---

## 🎯 使用場景導航

根據你的角色與目標，快速找到需要的文檔：

### 👨‍💻 我是前端開發者

**優先閱讀**：

1. [React Hooks API](./api-reference/hooks.md) - 學習如何在元件中使用 Supabase
2. [查詢模式](./api-reference/query-patterns.md) - 了解常用查詢範例
3. [錯誤處理](./api-reference/error-handling.md) - 實作統一錯誤處理
4. [TypeScript 類型](./api-reference/types.md) - 確保類型安全

**可選閱讀**：

- [架構總覽](./architecture/overview.md) - 了解整體架構
- [Auth 整合](./guides/authentication.md) - 實作認證流程

### 🗄️ 我是後端開發者

**優先閱讀**：

1. [資料庫遷移](./guides/migrations.md) - 管理 Schema 變更
2. [RLS 策略設計](./guides/rls-policies.md) - 設定資料權限
3. [查詢模式](./api-reference/query-patterns.md) - 優化資料查詢
4. [Edge Functions](./guides/edge-functions.md) - 實作複雜業務邏輯

**可選閱讀**：

- [架構總覽](./architecture/overview.md) - 了解整體架構
- [Auth 整合](./guides/authentication.md) - 了解認證機制

### 🏗️ 我是架構師/技術主管

**優先閱讀**：

1. [架構總覽](./architecture/overview.md) - 完整架構設計
2. [架構決策記錄](./architecture/decisions.md) - 所有重大決策
3. [架構比較](./architecture/comparison.md) - 方案對比分析
4. [RLS 策略設計](./guides/rls-policies.md) - 安全架構

**可選閱讀**：

- [Edge Functions](./guides/edge-functions.md) - Serverless 架構
- [錯誤處理](./api-reference/error-handling.md) - 系統穩定性

### 🆕 我是新成員

**第一天**：

1. [架構總覽](./architecture/overview.md) - 了解專案架構
2. [本地開發設定](./guides/local-development.md) - 配置開發環境

**第一週**：3. [React Hooks API](./api-reference/hooks.md) - 學習前端整合 4. [資料庫遷移](./guides/migrations.md) - 了解 Schema 管理 5. [查詢模式](./api-reference/query-patterns.md) - 學習資料查詢

**第二週**：6. [RLS 策略設計](./guides/rls-policies.md) - 了解安全機制 7. [Auth 整合](./guides/authentication.md) - 學習認證流程 8. [錯誤處理](./api-reference/error-handling.md) - 實作錯誤處理

### 🤔 我正在評估 Supabase

**評估階段**：

1. [架構比較](./architecture/comparison.md) - 與其他方案對比
2. [架構決策記錄](./architecture/decisions.md) - 了解決策原因
3. [架構總覽](./architecture/overview.md) - 評估架構設計

**技術驗證**：4. [本地開發設定](./guides/local-development.md) - 快速試用 5. [React Hooks API](./api-reference/hooks.md) - 評估開發體驗 6. [RLS 策略設計](./guides/rls-policies.md) - 評估安全能力

---

## 📋 文檔索引

### 按優先級分類

#### 🔴 高優先級（必讀）

新成員必須閱讀的核心文檔：

- [本地開發設定](./guides/local-development.md)
- [React Hooks API](./api-reference/hooks.md)
- [查詢模式](./api-reference/query-patterns.md)
- [錯誤處理](./api-reference/error-handling.md)
- [資料庫遷移](./guides/migrations.md)

#### 🟡 中優先級（重要）

深入開發時需要的文檔：

- [架構總覽](./architecture/overview.md)
- [RLS 策略設計](./guides/rls-policies.md)
- [Auth 整合](./guides/authentication.md)
- [TypeScript 類型](./api-reference/types.md)

#### 🟢 低優先級（進階）

特定場景或進階主題：

- [架構決策記錄](./architecture/decisions.md)
- [架構比較](./architecture/comparison.md)
- [Edge Functions](./guides/edge-functions.md)

### 按文檔類型分類

#### 📖 教學導向（Tutorial）

逐步指導，適合學習：

- [本地開發設定](./guides/local-development.md)
- [資料庫遷移](./guides/migrations.md)
- [Auth 整合](./guides/authentication.md)

#### 🎯 目標導向（How-to Guide）

解決特定問題：

- [RLS 策略設計](./guides/rls-policies.md)
- [查詢模式](./api-reference/query-patterns.md)
- [錯誤處理](./api-reference/error-handling.md)
- [Edge Functions](./guides/edge-functions.md)

#### 📚 資訊導向（Reference）

技術規格查詢：

- [TypeScript 類型](./api-reference/types.md)
- [React Hooks API](./api-reference/hooks.md)

#### 💡 理解導向（Explanation）

概念與原理解釋：

- [架構總覽](./architecture/overview.md)
- [架構決策記錄](./architecture/decisions.md)
- [架構比較](./architecture/comparison.md)

### 按主題分類

#### 🏗️ 架構與設計

- [架構總覽](./architecture/overview.md)
- [架構決策記錄](./architecture/decisions.md)
- [架構比較](./architecture/comparison.md)

#### 🔧 開發工具

- [本地開發設定](./guides/local-development.md)
- [TypeScript 類型](./api-reference/types.md)

#### 🗄️ 資料庫管理

- [資料庫遷移](./guides/migrations.md)
- [查詢模式](./api-reference/query-patterns.md)
- [RLS 策略設計](./guides/rls-policies.md)

#### 🔐 認證與安全

- [Auth 整合](./guides/authentication.md)
- [RLS 策略設計](./guides/rls-policies.md)

#### ⚛️ 前端整合

- [React Hooks API](./api-reference/hooks.md)
- [錯誤處理](./api-reference/error-handling.md)
- [TypeScript 類型](./api-reference/types.md)

#### ☁️ 後端服務

- [Edge Functions](./guides/edge-functions.md)

---

## ❓ 常見問題 (FAQ)

### 基礎問題

<details>
<summary><strong>Q1: Supabase 和傳統後端（如 NestJS）有什麼差別？</strong></summary>

**簡答**: Supabase 是 Backend-as-a-Service (BaaS)，提供資料庫 + 認證 + API + 儲存的完整後端服務；NestJS 是後端框架，需要自己實作所有功能。

**詳細比較**: [架構比較文檔](./architecture/comparison.md)

**關鍵差異**:

- **開發速度**: Supabase 快 60-75%
- **成本**: Supabase $0/月 vs NestJS + Render $7+/月
- **維護負擔**: Supabase 減少 70%
- **適用場景**: Supabase 適合標準 CRUD，NestJS 適合複雜業務邏輯

</details>

<details>
<summary><strong>Q2: 為什麼 Flourish 選擇 Supabase？</strong></summary>

**主要原因**:

1. **零成本**: 免費層級完全足夠 Release 0-1（vs $7+/月）
2. **開發效率**: 開發速度快 60%，維護負擔減少 70%
3. **功能匹配**: Flourish 主要是 CRUD 操作，完美符合 Supabase 優勢
4. **學習曲線**: 比 NestJS 平緩 50%

**完整決策過程**: [ADR 001 - 架構簡化](./architecture/decisions.md#adr-001-為何選擇-supabase)

</details>

<details>
<summary><strong>Q3: Supabase 的資料安全嗎？</strong></summary>

**安全性保證**:

- ✅ Row Level Security (RLS) 強制資料隔離
- ✅ JWT token 認證機制
- ✅ HTTPS 加密傳輸
- ✅ 定期自動備份
- ✅ 符合 GDPR、SOC 2 標準

**如何保護資料**:

1. 為每個資料表啟用 RLS
2. 設定嚴格的 RLS policies
3. 前端僅使用 anon key（不要使用 service_role key）
4. 定期審查權限設定

**詳細指南**: [RLS 策略設計](./guides/rls-policies.md)

</details>

### 開發問題

<details>
<summary><strong>Q4: 如何開始本地開發？</strong></summary>

**3 步驟快速開始**:

```bash
# 1. 安裝 Supabase CLI
npx supabase login

# 2. 連結遠端專案
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 3. 設定環境變數
# 建立 .env.local 並添加:
# NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**完整指南**: [本地開發設定](./guides/local-development.md)

</details>

<details>
<summary><strong>Q5: 如何新增資料表？</strong></summary>

**標準流程**:

```bash
# 1. 建立遷移檔案
npx supabase migration new add_new_table

# 2. 編輯 SQL 檔案
# packages/database/supabase/migrations/XXXXXX_add_new_table.sql

# 3. 執行遷移
npx supabase db push

# 4. 重新生成 TypeScript 類型
cd packages/supabase-client
pnpm generate-types
```

**完整指南**: [資料庫遷移](./guides/migrations.md)

</details>

<details>
<summary><strong>Q6: 如何設定資料權限？</strong></summary>

**RLS Policy 基本模式**:

```sql
-- 啟用 RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- 使用者只能存取自己的資料
CREATE POLICY "Users can manage own data"
  ON your_table
  FOR ALL
  USING (auth.uid() = user_id);
```

**7 種核心模式**: [RLS 策略設計](./guides/rls-policies.md)

</details>

<details>
<summary><strong>Q7: 如何處理資料查詢？</strong></summary>

**基本查詢範例**:

```typescript
import { createBrowserClient } from '@repo/supabase-client/client';

// 查詢資料
const supabase = createBrowserClient();
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false });
```

**15+ 實戰範例**: [查詢模式](./api-reference/query-patterns.md)

</details>

### 效能問題

<details>
<summary><strong>Q8: Supabase 查詢速度快嗎？</strong></summary>

**實際性能數據**（基於 10,000 筆交易）:

| 操作                   | 平均時間 | 說明                                       |
| ---------------------- | -------- | ------------------------------------------ |
| **簡單查詢（有索引）** | 42ms     | WHERE user_id = ? AND date BETWEEN ? AND ? |
| **複雜 JOIN**          | 78ms     | 關聯 3 個資料表                            |
| **RPC 聚合**           | 18ms     | 資料庫端計算總和                           |

**優化技巧**:

1. 使用索引（可提升 95%）
2. 只查詢需要的欄位（減少 50% 資料傳輸）
3. 使用 JOIN 而非 N+1 查詢（減少 94% 時間）
4. React Query 快取（減少 99% 重複請求）

**性能基準**: [查詢模式 - 性能基準測試](./api-reference/query-patterns.md#性能基準測試)

</details>

<details>
<summary><strong>Q9: 如何優化查詢效能？</strong></summary>

**5 個關鍵優化**:

1. **使用索引**:

   ```sql
   CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
   ```

2. **選擇性查詢欄位**:

   ```typescript
   .select('id, name, amount') // 而非 .select('*')
   ```

3. **避免 N+1 查詢**:

   ```typescript
   .select('*, category:categories(*)') // 使用 JOIN
   ```

4. **使用 RPC 函數聚合**:

   ```typescript
   await supabase.rpc('get_monthly_spending', { ... })
   ```

5. **React Query 快取**:

   ```typescript
   useQuery({ queryKey: [...], staleTime: 5 * 60 * 1000 })
   ```

**完整優化指南**: [查詢模式 - 效能最佳化](./api-reference/query-patterns.md#⚡-效能最佳化)

</details>

### 進階問題

<details>
<summary><strong>Q10: 何時需要使用 Edge Functions？</strong></summary>

**應該使用的情境**:

- ✅ 需要保護 API Keys（如 OpenAI、Stripe）
- ✅ 第三方 API 整合（銀行 API、支付服務）
- ✅ 複雜業務邏輯（PDF 解析、批次處理）
- ✅ 背景任務（Cron jobs、Webhooks）

**不需要使用的情境**:

- ❌ 簡單 CRUD 操作（直接使用 Supabase Client + RLS）
- ❌ 使用者認證（Supabase Auth 已處理）
- ❌ 即時 UI 更新（使用 Realtime Subscriptions）

**完整指南**: [Edge Functions](./guides/edge-functions.md)

</details>

<details>
<summary><strong>Q11: 如何處理複雜的認證需求？</strong></summary>

**Supabase Auth 支援**:

- ✅ Email/Password 認證
- ✅ Magic Link (無密碼登入)
- ✅ OAuth (Google, GitHub, etc.)
- ✅ SSO (企業單一登入)
- ✅ MFA (多因素認證)

**Next.js 整合範例**:

```typescript
// Server Component
import { createServerClient } from '@repo/supabase-client/server';

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  return <Dashboard user={user} />;
}
```

**完整整合指南**: [Auth 整合](./guides/authentication.md)

</details>

<details>
<summary><strong>Q12: Supabase 免費層級的限制是什麼？</strong></summary>

**免費層級額度**:

| 資源               | 免費額度  | Flourish 使用 | 是否足夠 |
| ------------------ | --------- | ------------- | -------- |
| **資料庫儲存**     | 500 MB    | ~100 MB       | ✅ 充足  |
| **檔案儲存**       | 1 GB      | ~500 MB       | ✅ 充足  |
| **月活躍使用者**   | 50,000    | <1,000        | ✅ 充足  |
| **資料庫頻寬**     | 5 GB      | ~2 GB         | ✅ 充足  |
| **Edge Functions** | 500K 請求 | 未使用        | ✅ 充足  |

**何時需要升級**:

- 使用者量突破 10K MAU
- 資料庫儲存 > 400 MB
- 需要更多 Edge Functions 請求
- 需要進階功能（如優先支援）

**成本比較**: [架構比較 - 成本比較](./architecture/comparison.md#💰-成本比較)

</details>

<details>
<summary><strong>Q13: 如何回滾資料庫變更？</strong></summary>

**Supabase 不支援自動回滾**，但可以手動處理：

```bash
# 方法 1: 撰寫反向遷移（推薦）
npx supabase migration new rollback_add_column

# 在遷移檔案中撰寫反向 SQL
# ALTER TABLE your_table DROP COLUMN new_column;

npx supabase db push

# 方法 2: 使用備份恢復（危險）
# 僅在重大錯誤時使用
```

**最佳實踐**:

1. 在本地/staging 環境先測試遷移
2. 為重要遷移撰寫反向遷移腳本
3. 生產環境執行前建立手動備份
4. 使用 `npx supabase db diff` 檢查變更

**完整指南**: [資料庫遷移 - 回滾策略](./guides/migrations.md)

</details>

<details>
<summary><strong>Q14: 如何監控 Supabase 應用的效能？</strong></summary>

**內建監控**:

- Supabase Dashboard > Reports
  - API 請求統計
  - 資料庫效能指標
  - 儲存使用量
  - Edge Functions 執行次數

**React Query Devtools**:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**建議工具**:

- **錯誤監控**: Sentry
- **效能監控**: Vercel Analytics
- **日誌管理**: Supabase Logs (Dashboard)

**錯誤處理**: [錯誤處理文檔](./api-reference/error-handling.md)

</details>

<details>
<summary><strong>Q15: Supabase 有哪些最佳實踐？</strong></summary>

**安全性**:

- ✅ 所有資料表啟用 RLS
- ✅ 前端只使用 anon key
- ✅ 定期輪換 Access Tokens
- ❌ 絕不在前端暴露 service_role key

**效能**:

- ✅ 為常用查詢建立索引
- ✅ 使用 React Query 快取
- ✅ 只查詢需要的欄位
- ❌ 避免 N+1 查詢問題

**開發**:

- ✅ 使用 Imperative Migrations
- ✅ 自動生成 TypeScript 類型
- ✅ 遵循統一錯誤處理模式
- ❌ 不要直接在 Dashboard 修改 Schema

**完整最佳實踐**:

- [查詢模式 - 最佳實踐](./api-reference/query-patterns.md#💡-最佳實踐總結)
- [RLS 策略 - 最佳實踐](./guides/rls-policies.md)

</details>

---

## 🔗 相關資源

### 專案文檔

- [Sprint 9 - Supabase Migration](../sprints/release-0-foundation/09-supabase-migration-plan.md) - Supabase 遷移完整計劃
- [Sprint 14 - Documentation](../sprints/release-0-foundation/14-overview.md) - 本文檔專案的規劃與執行
- [資料庫設計](../architecture/database-design.md) - Flourish 資料庫 Schema 設計

### 架構決策記錄（ADR）

- [ADR 001 - Architecture Simplification](../decisions/001-architecture-simplification.md) - 從 NestJS 遷移到 Supabase 的決策
- [ADR 002 - Imperative Migrations](../decisions/002-imperative-migrations.md) - 使用 SQL 遷移檔案的決策
- [ADR 003 - Design System Configuration](../decisions/design-system-configuration.md) - Design System 配置決策

### 外部資源

- [Supabase 官方文檔](https://supabase.com/docs) - 官方完整文檔
- [Supabase GitHub](https://github.com/supabase/supabase) - 開源專案與範例
- [Supabase Discord](https://discord.supabase.com/) - 社群支援

---

## 📝 貢獻指南

### 如何更新文檔

1. **識別需求**：發現文檔遺漏或過時資訊
2. **創建 Issue**：在 GitHub 建立 issue 描述問題
3. **編輯文檔**：直接編輯 Markdown 檔案
4. **測試範例**：確保所有程式碼範例可執行
5. **提交 PR**：提交 Pull Request 並描述變更

### 文檔風格指南

- **語言**：使用繁體中文，保留英文技術術語
- **範例**：使用 Flourish 實際程式碼，避免簡化範例
- **結構**：遵循 [Diataxis Framework](https://diataxis.fr/)
- **格式**：使用 Markdown，保持一致的標題層級
- **連結**：使用相對路徑，確保跨文檔連結正確

### 文檔維護

- **定期審查**：每個 Sprint 檢查文檔是否需要更新
- **程式碼同步**：程式碼變更時同步更新相關文檔
- **範例測試**：確保所有範例程式碼可執行
- **連結檢查**：定期檢查內部與外部連結有效性

---

## 📊 文檔統計

- **總文檔數**：13 個
- **總行數**：約 13,000+ 行
- **程式碼範例**：150+ 個
- **涵蓋主題**：架構、開發、API、安全、部署
- **最後更新**：2025-11-24

---

## 🎉 文檔完成度

| 類別     | 完成度      | 文檔數量  |
| -------- | ----------- | --------- |
| 架構文檔 | ✅ 100%     | 3/3       |
| 使用指南 | ✅ 100%     | 5/5       |
| API 參考 | ✅ 100%     | 4/4       |
| 索引文檔 | ✅ 100%     | 1/1       |
| **總計** | **✅ 100%** | **13/13** |

---

**最後更新**: 2025-11-24
**文檔版本**: v1.0.0
**維護團隊**: Flourish Development Team
