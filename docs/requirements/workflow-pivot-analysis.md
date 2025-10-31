# 工作流程轉向分析

**日期**: 2025-10-30
**類型**: 需求探索
**影響**: 高 - 重大架構變更

---

## 執行摘要

在 Sprint 0.5 規劃期間，發現了一個關鍵事實：實際使用者工作流程與最初的規劃假設有顯著差異。本文件分析從**每日手動輸入**到**每月 PDF 批次處理**的轉向及其對 Flourish 專案的影響。

**關鍵發現**：使用者是信用卡重度使用者（20+ 張卡），透過 PDF 上傳處理每月帳單，而非手動輸入每日交易的人。

---

## 原始假設

### 初始規劃（Sprint 0.5 前）

**假設的使用者行為**:

```
每日流程（錯誤假設）：
1. 發生交易
2. 立即手動輸入到系統
3. 即時分類
4. 查看當日預算
```

**假設的資料模型**:

- 以交易為中心的架構
- 簡單的分類 → 交易關係
- 每日建立交易
- 即時預算更新
- 單一或少數信用卡

**假設的 UI 流程**:

```
主要操作：「新增交易」按鈕
↓
表單：日期、金額、分類、描述
↓
儲存到資料庫
↓
更新預算顯示
```

**技術影響**:

- 簡單的 REST API：`POST /api/transactions`
- 即時驗證
- 立即重新計算預算
- 最少的批次處理需求

---

## 發現的現實

### 實際使用者行為（2025-10-30 發現）

**每月批次處理**:

```
每月流程（實際需求）：
1. 月底下載信用卡 PDF 對帳單（網路銀行）
2. 上傳 PDF 到系統（批次處理）
3. AI 自動辨識交易明細
4. 檢視、修正錯誤
5. 確認後批次匯入
6. 檢視月度預算使用狀況
```

**實際資料量**:

- 擁有 20+ 張信用卡
- 每月積極使用 2-5 張卡片
- 每月數百筆交易（非每日少數幾筆）
- 6 年歷史資料 (2019-2025) 需要匯入

**從先前解決方案（Google Sheets）的實際痛點**:

- 年費分攤的複雜公式（/12）
- 訂閱服務的手動預扣追蹤
- 每月對帳耗時
- 維護困難，每年需要重建
- 經過多年累積後資料用途不明確

**原始計畫中未包含的關鍵需求**:

1. **PDF 帳單處理**：初始文件中未提及
2. **AI 交易辨識**：未規劃
3. **預扣系統**：不在資料庫設計中
4. **多卡重度使用者工作流程**：假設只有 1-2 張卡
5. **歷史資料匯入**：未考慮

---

## 影響分析

### 1. 資料庫架構變更

#### 之前（以交易為中心）

```prisma
model Transaction {
  id          String   @id @default(uuid())
  amount      Decimal
  type        TransactionType
  description String?
  date        DateTime
  userId      String
  categoryId  String?
}
```

**問題**:

- 無法連結至來源帳單
- 無 AI 信心度追蹤
- 無批次處理支援
- 缺少卡片管理

#### 之後（以帳單為中心）

```prisma
model Statement {
  id           String          @id @default(uuid())
  userId       String
  cardId       String
  pdfUrl       String
  uploadDate   DateTime
  statementDate DateTime
  status       StatementStatus // PENDING, PROCESSED, ARCHIVED

  card         Card            @relation(...)
  transactions Transaction[]
}

model Transaction {
  id            String   @id @default(uuid())
  statementId   String?  // 🔑 連結至來源！
  merchantName  String
  amount        Decimal
  confidence    Float?   // 🔑 AI 信心分數
  rawText       String?  // 🔑 原始 OCR 文字
  isManualEntry Boolean  @default(false)

  statement     Statement? @relation(...)
}

model Card {
  id        String   @id @default(uuid())
  userId    String
  name      String
  bank      String
  last4     String
  isActive  Boolean  @default(true)

  statements Statement[]
}
```

**新功能**:

- 追蹤交易來源（PDF 帳單）
- AI 信心度評分
- 批次匯入支援
- 多卡管理
- 帳單生命週期追蹤

### 2. UI/UX 流程差異

#### 之前（手動輸入流程）

```
首頁 → 「新增交易」按鈕 → 表單 → 儲存
```

**畫面優先級**:

1. 新增交易表單
2. 交易清單
3. 預算摘要

#### 之後（PDF 處理流程）

```
首頁 → 「上傳帳單」 → 選擇卡片 → 上傳 PDF →
AI 處理 → 檢視表格 → 編輯/確認 → 匯入 → 預算儀表板
```

**畫面優先級**:

1. 上傳帳單介面
2. 交易檢視表格（批次編輯）
3. 預算儀表板（含預扣）
4. 卡片管理
5. 手動輸入表單（僅作為備用）

### 3. 功能優先級轉變

#### 之前

| 功能         | 優先級 | Sprint |
| ------------ | ------ | ------ |
| 新增交易表單 | P0     | 0.5    |
| 分類管理     | P0     | 0.5    |
| 預算顯示     | P1     | 1      |
| 多幣別       | P2     | 2      |

#### 之後

| 功能              | 優先級 | Sprint |
| ----------------- | ------ | ------ |
| PDF 上傳          | P0     | 0.5    |
| AI 交易提取       | P0     | 0.5    |
| 批次檢視/編輯介面 | P0     | 0.5    |
| 多卡管理          | P0     | 0.5    |
| 預扣預算系統      | P1     | 2      |
| 週期性支出追蹤    | P1     | 2      |
| 歷史資料匯入      | P1     | 2      |
| 手動輸入表單      | P2     | 2      |

### 4. 技術堆疊新增

#### 新需求

- **PDF 儲存**：已上傳帳單的雲端儲存（Supabase Storage）
- **OCR/AI 服務**：從 PDF 提取交易（OpenAI Vision API？）
- **批次處理**：非同步 PDF 處理的佇列系統
- **CSV 匯入**：歷史資料遷移工具

#### API 端點變更

**之前**:

```
POST   /api/transactions      # 建立單筆交易
GET    /api/transactions      # 列出交易
PATCH  /api/transactions/:id  # 更新交易
DELETE /api/transactions/:id  # 刪除交易
```

**之後**:

```
POST   /api/statements/upload         # 上傳 PDF
GET    /api/statements/:id/extract    # 取得提取的交易
POST   /api/statements/:id/import     # 確認批次匯入
GET    /api/cards                     # 列出使用者的卡片
POST   /api/cards                     # 新增卡片
PATCH  /api/cards/:id/active          # 切換使用中狀態
POST   /api/import/historical         # 匯入 CSV 資料
```

---

## 決策理由

### 為什麼這個發現很重要

**使用者行為研究**:

- 現實世界的信用卡重度使用者不會手動輸入數百筆交易
- 每月對帳是個人理財的標準做法
- 效率比即時追蹤更有價值

**效率 vs 準確度**:

- 手動輸入：高準確度、低效率（每月數小時）
- PDF + AI：高效率、良好準確度（每月數分鐘 + 檢視）
- 使用者偏好：快速批次處理加上檢視步驟

**競爭分析**:

- 現有工具都不太適合多卡重度使用者
- 大多數應用程式假設 1-2 張卡並每日手動輸入
- 有機會為服務不足的族群打造產品

### MVP 範圍重新定義

**Sprint 0.5 MVP 必須擁有**:

- ✅ PDF 帳單上傳
- ✅ 基本 AI 交易提取
- ✅ 批次檢視和編輯介面
- ✅ 以帳單為中心的資料模型
- ✅ 多卡管理

**Sprint 0.5 Nice to Have → 延後至 Sprint 2**:

- ⏸️ 預扣系統（重要但複雜）
- ⏸️ 週期性支出追蹤
- ⏸️ 自動儲蓄規則
- ⏸️ 預算預測

**理由**:

- 先讓 PDF 工作流程運作
- 驗證 AI 提取準確度
- 從實際使用中學習後再建構複雜的預算邏輯

---

## 實作階段

### 階段 1：Sprint 0.5 - PDF 處理 MVP（2 週）

**目標**：上傳 → 提取 → 匯入工作流程

**交付項目**:

- Supabase 專案設置
- 含 Statement/Card/Transaction 模型的 Prisma schema
- PDF 上傳 API 端點
- 基本 AI 提取（OpenAI Vision API 整合）
- 交易檢視表格 UI
- 批次匯入功能

**成功標準**:

- 可上傳 PDF 帳單
- 至少正確提取 80% 的交易
- 檢視並編輯提取的資料
- 匯入到資料庫
- 將交易連結至帳單

### 階段 2：Sprint 1 - 優化與改進（1 週）

**目標**：提高準確度和使用者體驗

**交付項目**:

- 提高 AI 提取準確度（目標 90%+）
- 更好的錯誤處理
- 卡片管理 UI
- 檢視期間的分類指定
- 帳單歷史檢視

### 階段 3：Sprint 2 - 進階預算功能（2 週）

**目標**：預扣系統實作

**交付項目**:

- RecurringExpense 模型和 CRUD
- 收入追蹤
- SavingRule 模型
- 預算計算引擎
- MonthlyBudget 儀表板
- 交易匹配（預期 vs 實際）

### 階段 4：Sprint 3 - 歷史資料與最佳化（1 週）

**目標**：匯入舊資料並最佳化效能

**交付項目**:

- CSV 匯入工具
- 批量資料驗證
- 大型資料集的效能最佳化
- 資料視覺化改進

---

## 風險與緩解

### 已識別的風險

**風險 1：AI 提取準確度**

- **關注點**：不同銀行的 PDF 格式可能混淆 AI
- **影響**：高 - 核心功能依賴此項
- **緩解**:
  - 從最常見的銀行格式開始（使用者當前的卡片）
  - 為每家銀行建構格式範本
  - 在檢視期間允許手動修正
  - 收集回饋以改進提示

**風險 2：複雜的預算邏輯**

- **關注點**：預扣計算複雜
- **影響**：中等 - 延後至 Sprint 2 降低 Sprint 0.5 風險
- **緩解**:
  - 實作前先與使用者驗證邏輯
  - 逐步建構（訂閱 → 分攤 → 儲蓄）
  - 用真實場景進行廣泛測試

**風險 3：歷史資料品質**

- **關注點**：Google Sheets 資料可能不一致
- **影響**：低 - 不會阻礙 MVP
- **緩解**:
  - 匯入期間的驗證規則
  - 標記可疑交易供檢視
  - 允許匯入後手動清理

**風險 4：範圍蔓延**

- **關注點**：使用者在開發期間可能要求更多功能
- **影響**：中等 - 可能延遲發布
- **緩解**:
  - 文件化明確的 Sprint 界線
  - MVP 後的功能請求追蹤
  - 專注於 4-5 週發布目標

---

## 經驗教訓

### 需求探索流程

**做得好的地方**:

- ✅ 在 Sprint 0.5 規劃期間詢問了釐清問題
- ✅ 使用者提供了實際工作流程的詳細情境
- ✅ 發現了真實痛點（Google Sheets 複雜度）
- ✅ 揭露了資料量實況（20+ 張卡、6 年資料）

**可以改進的地方**:

- ⚠️ 應該更早詢問工作流程（Sprint 0.1）
- ⚠️ 初始假設未與使用者場景驗證
- ⚠️ 在理解工作流程前就建立了資料庫設計

**未來的最佳實踐**:

- 🎯 總是詢問：「帶我走過你典型的一天/週/月」
- 🎯 在設計架構前驗證假設
- 🎯 檢視使用者嘗試過的現有解決方案
- 🎯 及早詢問資料量和邊界情況

---

## 與專案願景的對齊

### Flow App 目的（來自 project-overview.md）

**原始描述**:

> "交易記錄（收入/支出）、分類管理、預算追蹤、財務統計與報告、匯出/匯入功能"

**詮釋轉變**:

- ❌ 「交易記錄」 ≠ 手動輸入表單
- ✅ 「交易記錄」 = PDF 上傳 + AI 提取
- ❌ 「預算追蹤」 ≠ 簡單的收支加總
- ✅ 「預算追蹤」 = 預扣計算系統
- ✅ 「匯出/匯入」 = 歷史資料遷移的關鍵

**仍然對齊**：核心願景未變，執行方法調整以配合真實使用者行為

---

## 後續步驟

### 立即行動（本週）

1. ✅ 文件化需求（本文件）
2. ⏳ 以階段式架構更新 database-design.md
3. ⏳ 建立包含詳細功能的 functional-requirements.md
4. ⏳ 以新範圍規劃 Sprint 0.5 執行

### Sprint 0.5 執行（接下來 2 週）

1. 設置 Supabase 專案和認證
2. 定義 Prisma schema（以帳單為中心的模型）
3. 實作 PDF 上傳 API
4. 整合 OpenAI Vision API 進行提取
5. 建構交易檢視表格 UI
6. 實作批次匯入功能
7. 用真實銀行帳單測試

### Sprint 2 規劃（MVP 發布後）

1. 設計預扣系統架構
2. 定義 RecurringExpense、Income、SavingRule 模型
3. 建構預算計算引擎
4. 建立 MonthlyBudget 儀表板
5. 實作交易匹配邏輯

---

## 結論

這次需求轉向是一個**正面的發現**，使產品與真實使用者需求對齊。雖然需要架構變更，但新方向創造了更有價值且更具差異化的產品。

**關鍵要點**：理解實際使用者工作流程比堅持初始計畫更重要。從手動輸入轉向 PDF 批次處理從根本上改善了使用者體驗，並為信用卡重度使用者定位了 Flourish。

**專案時程影響**：最小 - Sprint 0.5 範圍已調整但仍可在 2 週內達成。進階功能延後至 Sprint 2 降低風險並允許更快發布。

---

## 相關文件

- [Vision and Workflow](vision-and-workflow.md) - 轉向後的詳細需求
- [Database Design](../architecture/database-design.md) - 更新的資料模型
- [Functional Requirements](functional-requirements.md) - 功能規格
- [Sprint 0.5 Tasks](../sprints/sprint-0-foundation/tasks.md) - 實作計畫
