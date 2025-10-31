# 功能需求

**最後更新**: 2025-10-30
**狀態**: 持續更新文檔

---

## 文件目的

本文件列出 Flourish 的所有功能需求，按功能領域組織並按實作 sprint 排定優先級。

**優先級**:

- **P0 (Must Have)**：MVP 核心功能 (Sprint 0.5)
- **P1 (Should Have)**：Sprint 2 重要功能
- **P2 (Nice to Have)**：未來增強功能 (Sprint 3+)

---

## FR-001: PDF 帳單上傳工作流程

**優先級**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: 帳單處理

### 描述

讓使用者能夠上傳每月信用卡 PDF 帳單進行批次交易處理。

### 使用者故事

**US-001.1**: 上傳 PDF 帳單

```
身為使用者
我想要上傳信用卡 PDF 對帳單
以便系統自動辨識交易明細，省去手動輸入時間
```

**驗收標準**:

- [ ] 使用者可從下拉選單選擇信用卡
- [ ] 使用者可透過檔案選擇器或拖放上傳 PDF 檔案
- [ ] 系統驗證檔案格式（僅限 PDF）
- [ ] 系統驗證檔案大小（最大 10MB）
- [ ] 系統顯示上傳進度指示器
- [ ] 系統將 PDF 儲存至 Supabase Storage
- [ ] 系統建立狀態為 "PENDING" 的 Statement 記錄
- [ ] 使用者看到包含帳單 ID 的確認訊息

**US-001.2**: 查看帳單歷史

```
身為使用者
我想要查看已上傳的對帳單歷史
以便追蹤哪些月份已經處理完成
```

**驗收標準**:

- [ ] 使用者看到所有已上傳帳單的清單
- [ ] 清單顯示：卡片名稱、帳單日期、上傳日期、狀態
- [ ] 使用者可依卡片篩選
- [ ] 使用者可依狀態篩選（PENDING、PROCESSED、ARCHIVED）
- [ ] 使用者可下載原始 PDF
- [ ] 使用者可刪除帳單（含確認對話框）

### 技術需求

**API Endpoints**:

```typescript
POST   /api/statements/upload
  Body: { cardId: string, file: File }
  Response: { statementId: string, uploadUrl: string }

GET    /api/statements
  Query: { cardId?: string, status?: StatementStatus }
  Response: { statements: Statement[] }

GET    /api/statements/:id
  Response: { statement: Statement }

DELETE /api/statements/:id
  Response: { success: boolean }
```

**Database Schema**:

```prisma
model Statement {
  id            String          @id @default(uuid())
  userId        String
  cardId        String
  pdfUrl        String
  uploadDate    DateTime        @default(now())
  statementDate DateTime        @db.Date
  status        StatementStatus @default(PENDING)
  totalAmount   Decimal?        @db.Decimal(12, 2)

  card          Card            @relation(...)
  transactions  Transaction[]
}

enum StatementStatus {
  PENDING    // Uploaded, not yet extracted
  EXTRACTED  // AI extraction complete, awaiting review
  CONFIRMED  // User confirmed, ready to import
  IMPORTED   // Transactions imported to database
  ARCHIVED   // Archived for historical reference
}
```

**驗證規則**:

- 檔案格式：僅限 PDF
- 檔案大小：1KB - 10MB
- 帳單日期：必須在過去 12 個月內
- 重複檢查：相同卡片 + 相同帳單日期

---

## FR-002: AI 交易提取

**優先級**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: 帳單處理

### 描述

使用 AI/OCR 從上傳的 PDF 帳單自動提取交易資料。

### 使用者故事

**US-002.1**: 自動交易提取

```
身為使用者
我希望系統自動從 PDF 辨識出交易明細
以便快速檢視而不需手動打字
```

**驗收標準**:

- [ ] 系統在上傳後處理 PDF
- [ ] 系統提取：交易日期、商家名稱、金額
- [ ] 系統為每個欄位計算信心分數（0-1）
- [ ] 系統儲存原始 OCR 文字供除錯
- [ ] 系統處理多種 PDF 格式（不同銀行）
- [ ] 處理在 30 秒內完成
- [ ] 使用者看到處理狀態指示器

**US-002.2**: 檢視提取的交易

```
身為使用者
我想要在匯入前檢視並修正 AI 辨識結果
以確保資料正確性
```

**驗收標準**:

- [ ] 使用者看到提取交易的表格
- [ ] 表格顯示：日期、商家、金額、信心分數
- [ ] 低信心項目（<0.7）以黃色強調顯示
- [ ] 使用者可內嵌編輯任何欄位
- [ ] 使用者可刪除錯誤的提取結果
- [ ] 使用者可手動新增遺漏的交易
- [ ] 變更儲存為草稿
- [ ] 使用者可稍後返回繼續編輯

### 技術需求

**AI 整合**:

```typescript
// Option 1: OpenAI Vision API
async function extractTransactions(pdfUrl: string): Promise<Transaction[]> {
  const pdfBuffer = await downloadPdf(pdfUrl);
  const images = await convertPdfToImages(pdfBuffer);

  const prompt = `
    Extract all credit card transactions from this statement image.
    For each transaction, provide:
    - Date (YYYY-MM-DD format)
    - Merchant name
    - Amount (positive number)
    - Transaction type (DEBIT or CREDIT)

    Return as JSON array.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: images[0] } },
        ],
      },
    ],
  });

  return parseResponse(response);
}
```

**API Endpoints**:

```typescript
POST   /api/statements/:id/extract
  Response: {
    transactions: ExtractedTransaction[],
    confidence: number,
    rawText: string
  }

GET    /api/statements/:id/transactions
  Response: { transactions: Transaction[] }

PATCH  /api/statements/:id/transactions/:txnId
  Body: { date?, merchantName?, amount? }
  Response: { transaction: Transaction }

DELETE /api/statements/:id/transactions/:txnId
  Response: { success: boolean }
```

**Database Schema**:

```prisma
model Transaction {
  id            String          @id @default(uuid())
  statementId   String?
  userId        String
  merchantName  String
  amount        Decimal         @db.Decimal(12, 2)
  type          TransactionType @default(DEBIT)
  transactionDate DateTime      @db.Date
  categoryId    String?
  confidence    Float?          // AI confidence 0-1
  rawText       String?         // Original OCR text
  isManualEntry Boolean         @default(false)

  statement     Statement?      @relation(...)
  category      Category?       @relation(...)
}
```

---

## FR-003: 批次交易匯入

**優先級**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: 帳單處理

### 描述

允許使用者檢視並確認批次匯入提取的交易。

### 使用者故事

**US-003.1**: 確認並匯入交易

```
身為使用者
我想要一次匯入所有確認過的交易
以便快速完成本月對帳單處理
```

**驗收標準**:

- [ ] 使用者在檢視後看到「全部匯入」按鈕
- [ ] 按鈕顯示交易數量（例如「匯入 127 筆交易」）
- [ ] 點擊後顯示包含摘要的確認對話框
- [ ] 系統驗證無重複交易
- [ ] 匯入在背景執行（非同步）
- [ ] 使用者在匯入期間看到進度指示器
- [ ] 成功訊息顯示匯入數量
- [ ] 帳單狀態更新為 "IMPORTED"
- [ ] 預算儀表板自動更新

### 技術需求

**API Endpoints**:

```typescript
POST   /api/statements/:id/import
  Body: { transactionIds: string[] }
  Response: {
    jobId: string,
    totalCount: number
  }

GET    /api/import-jobs/:jobId
  Response: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
    progress: number,
    importedCount: number,
    errorCount: number,
    errors?: string[]
  }
```

**重複偵測**:

```typescript
// Check for duplicates before import
async function findDuplicates(transaction: Transaction): Promise<boolean> {
  const existing = await prisma.transaction.findFirst({
    where: {
      userId: transaction.userId,
      transactionDate: transaction.transactionDate,
      amount: transaction.amount,
      merchantName: transaction.merchantName,
    },
  });

  return existing !== null;
}
```

---

## FR-004: 多卡管理

**優先級**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: 卡片管理

### 描述

管理多張信用卡及其使用中/停用狀態。

### 使用者故事

**US-004.1**: 新增信用卡

```
身為使用者
我想要新增信用卡到系統
以便追蹤各張卡片的消費記錄
```

**驗收標準**:

- [ ] 使用者可透過表單新增卡片
- [ ] 表單欄位：卡片名稱、銀行名稱、卡號末 4 碼
- [ ] 選填欄位：卡片顏色、顯示順序
- [ ] 預設狀態：使用中
- [ ] 驗證：同一銀行不可有重複的末 4 碼
- [ ] 成功訊息顯示卡片已新增

**US-004.2**: 管理使用中卡片

```
身為使用者
我想要標記常用卡片為「啟用」
以便在上傳對帳單時優先顯示這些卡片
```

**驗收標準**:

- [ ] 使用者看到所有卡片清單
- [ ] 每張卡片顯示：名稱、銀行、末 4 碼、使用中狀態
- [ ] 使用者可用開關切換使用中狀態
- [ ] 使用中卡片在所有下拉選單中優先顯示
- [ ] 停用卡片顯示在收合區塊
- [ ] 使用者可重新排序卡片（拖放）

### 技術需求

**API Endpoints**:

```typescript
POST   /api/cards
  Body: { name: string, bank: string, last4: string, color?: string }
  Response: { card: Card }

GET    /api/cards
  Query: { includeInactive?: boolean }
  Response: { cards: Card[] }

PATCH  /api/cards/:id
  Body: { name?, bank?, isActive?, displayOrder? }
  Response: { card: Card }

DELETE /api/cards/:id
  Response: { success: boolean }
```

**Database Schema**:

```prisma
model Card {
  id           String      @id @default(uuid())
  userId       String
  name         String      // User-defined name, e.g., "國泰世華 CUBE"
  bank         String      // Bank name, e.g., "Cathay United Bank"
  last4        String      // Last 4 digits, e.g., "1234"
  color        String?     // Hex color for UI, e.g., "#FF5733"
  isActive     Boolean     @default(true)
  displayOrder Int         @default(0)
  createdAt    DateTime    @default(now())

  statements   Statement[]

  @@unique([userId, bank, last4])
}
```

---

## FR-005: 預扣預算系統

**優先級**: P1 (Should Have)
**Sprint**: 2
**Epic**: 預算管理

### 描述

透過預先扣除週期性支出和儲蓄來計算實際可用預算。

### 使用者故事

**US-005.1**: 定義每月週期性支出

```
身為使用者
我想要設定每月固定支出（如 Netflix, YouTube Premium）
以便系統自動從預算中扣除這些費用
```

**驗收標準**:

- [ ] 使用者可新增週期性支出
- [ ] 欄位：名稱、金額、開始日期
- [ ] 頻率：每月
- [ ] 選填：結束日期、分類
- [ ] 使用者看到所有週期性支出清單
- [ ] 頂部顯示每月週期性總額
- [ ] 使用者可編輯/刪除支出

**US-005.2**: 定義年費分攤

```
身為使用者
我想要將年度費用分攤到 12 個月
以避免某個月突然被扣大筆費用造成預算混亂
```

**驗收標準**:

- [ ] 使用者可新增年度支出
- [ ] 欄位：名稱、年度金額、到期日
- [ ] 系統計算：每月分攤 = 金額 / 12
- [ ] 同時顯示年度和每月金額
- [ ] 使用者看到所有年度支出清單
- [ ] 頂部顯示每月分攤總額

**US-005.3**: 定義自動儲蓄規則

```
身為使用者
我想要設定自動儲蓄規則（如薪水的 5%）
以便系統自動計算並扣除儲蓄金額
```

**驗收標準**:

- [ ] 使用者可新增儲蓄規則
- [ ] 類型：收入百分比、固定金額
- [ ] 欄位：名稱、類型、數值、目標帳戶
- [ ] 使用者看到所有儲蓄規則清單
- [ ] 頂部顯示每月儲蓄總額
- [ ] 預覽：「下個月儲蓄：NT$2,500（5% of NT$50,000）」

**US-005.4**: 查看預扣預算

```
身為使用者
我想要看到扣除所有預扣項目後的實際可用金額
以便知道真正能花多少錢
```

**驗收標準**:

- [ ] 預算儀表板顯示明細：
  - 💰 總收入：NT$50,000
  - 💾 自動儲蓄：-NT$2,500 (5%)
  - 📱 每月週期性：-NT$659
  - 📅 分攤年費：-NT$1,664
  - ✅ **可用預算：NT$45,177**
- [ ] 可用預算是最顯眼的數字
- [ ] 每個區塊可展開顯示細節
- [ ] 與上個月的比較

### 技術需求

**Database Schema**:

```prisma
model RecurringExpense {
  id              String    @id @default(uuid())
  userId          String
  name            String    // "Netflix Premium"
  amount          Decimal   @db.Decimal(10, 2)
  frequency       Frequency @default(MONTHLY)
  startDate       DateTime  @db.Date
  endDate         DateTime? @db.Date
  categoryId      String?
  shouldAmortize  Boolean   @default(false) // For annual expenses
  amortizeMonths  Int?      @default(12)

  category        Category? @relation(...)
}

enum Frequency {
  MONTHLY
  YEARLY
}

model Income {
  id          String    @id @default(uuid())
  userId      String
  name        String    // "月薪", "獎金"
  amount      Decimal   @db.Decimal(10, 2)
  frequency   Frequency @default(MONTHLY)
  receiveDate DateTime  @db.Date
}

model SavingRule {
  id     String     @id @default(uuid())
  userId String
  name   String     // "緊急預備金", "投資基金"
  type   SavingType
  value  Decimal    @db.Decimal(10, 2) // 5 (%) or 5000 (元)

  @@index([userId])
}

enum SavingType {
  PERCENTAGE    // % of income
  FIXED_AMOUNT  // Fixed NT$
}

model MonthlyBudget {
  id                  String   @id @default(uuid())
  userId              String
  month               DateTime @db.Date // 2025-10-01
  totalIncome         Decimal  @db.Decimal(12, 2)
  autoSaving          Decimal  @db.Decimal(12, 2)
  recurringExpenses   Decimal  @db.Decimal(12, 2)
  amortizedExpenses   Decimal  @db.Decimal(12, 2)
  availableBudget     Decimal  @db.Decimal(12, 2)
  totalSpent          Decimal  @db.Decimal(12, 2)
  remainingBudget     Decimal  @db.Decimal(12, 2)

  @@unique([userId, month])
}
```

**預算計算邏輯**:

```typescript
async function calculateMonthlyBudget(userId: string, month: Date): Promise<MonthlyBudget> {
  // Step 1: Calculate total income
  const incomes = await prisma.income.findMany({
    where: { userId, frequency: 'MONTHLY' },
  });
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  // Step 2: Calculate auto-savings
  const savingRules = await prisma.savingRule.findMany({ where: { userId } });
  const percentageSaving = savingRules
    .filter((r) => r.type === 'PERCENTAGE')
    .reduce((sum, r) => sum + (totalIncome * r.value) / 100, 0);
  const fixedSaving = savingRules
    .filter((r) => r.type === 'FIXED_AMOUNT')
    .reduce((sum, r) => sum + r.value, 0);
  const autoSaving = percentageSaving + fixedSaving;

  // Step 3: Calculate recurring monthly expenses
  const recurring = await prisma.recurringExpense.findMany({
    where: { userId, frequency: 'MONTHLY', shouldAmortize: false },
  });
  const recurringExpenses = recurring.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 4: Calculate amortized annual expenses
  const annual = await prisma.recurringExpense.findMany({
    where: { userId, frequency: 'YEARLY', shouldAmortize: true },
  });
  const amortizedExpenses = annual.reduce((sum, exp) => {
    return sum + exp.amount / (exp.amortizeMonths || 12);
  }, 0);

  // Step 5: Calculate available budget
  const availableBudget = totalIncome - autoSaving - recurringExpenses - amortizedExpenses;

  // Step 6: Get actual spending
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: {
        gte: startOfMonth(month),
        lt: endOfMonth(month),
      },
      type: 'DEBIT',
    },
  });
  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Step 7: Calculate remaining
  const remainingBudget = availableBudget - totalSpent;

  return {
    userId,
    month,
    totalIncome,
    autoSaving,
    recurringExpenses,
    amortizedExpenses,
    availableBudget,
    totalSpent,
    remainingBudget,
  };
}
```

---

## FR-006: 交易匹配

**優先級**: P1 (Should Have)
**Sprint**: 2
**Epic**: 預算管理

### 描述

將預期的週期性支出與實際匯入的交易進行匹配。

### 使用者故事

**US-006.1**: 自動交易匹配

```
身為使用者
我希望系統自動偵測哪些交易對應到預期的固定支出
以便清楚知道哪些是預期內、哪些是額外消費
```

**驗收標準**:

- [ ] 系統為週期性支出建議匹配
- [ ] 匹配條件：類似商家名稱 + 預期金額 ±10%
- [ ] 使用者在交易上看到「匹配建議」標記
- [ ] 使用者可確認或拒絕匹配
- [ ] 已匹配的交易標記為「預期內」
- [ ] 未匹配的交易標記為「意外」

### 技術需求

**Database Schema**:

```prisma
model TransactionMatch {
  id                  String            @id @default(uuid())
  transactionId       String            @unique
  recurringExpenseId  String
  matchedAt           DateTime          @default(now())
  matchType           MatchType         @default(AUTOMATIC)

  transaction         Transaction       @relation(...)
  recurringExpense    RecurringExpense  @relation(...)
}

enum MatchType {
  AUTOMATIC  // System suggested and user confirmed
  MANUAL     // User manually linked
  SUGGESTED  // System suggested, awaiting confirmation
}
```

---

## FR-007: 歷史資料匯入

**優先級**: P1 (Should Have)
**Sprint**: 2
**Epic**: 資料遷移

### 描述

從 Google Sheets CSV 匯出檔匯入歷史交易資料。

### 使用者故事

**US-007.1**: 匯入 CSV 檔案

```
身為使用者
我想要匯入 Google Sheets 匯出的 CSV 檔案
以便將過去的交易記錄轉移到新系統
```

**驗收標準**:

- [ ] 使用者可上傳 CSV 檔案
- [ ] 系統顯示欄位對應介面
- [ ] 使用者將 CSV 欄位對應到資料庫欄位
- [ ] 系統在匯入前驗證資料
- [ ] 系統顯示前 10 列的預覽
- [ ] 使用者可修正錯誤並重試
- [ ] 匯入在背景執行
- [ ] 完成時使用者收到電子郵件

### 技術需求

**API Endpoints**:

```typescript
POST   /api/import/historical
  Body: { file: File, cardId: string, columnMapping: object }
  Response: { jobId: string, estimatedRows: number }
```

---

## FR-008: 分類管理

**優先級**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: 交易組織

### 描述

建立並管理交易分類以進行支出分析。

### 使用者故事

**US-008.1**: 管理分類

```
身為使用者
我想要建立自訂分類（如餐飲、交通、娛樂）
以便追蹤各類別的支出狀況
```

**驗收標準**:

- [ ] 使用者可建立帶名稱和顏色的分類
- [ ] 使用者可編輯分類
- [ ] 使用者可刪除分類（如無交易連結）
- [ ] 系統提供預設分類
- [ ] 使用者可設定分類圖示

### 技術需求

**Database Schema**:

```prisma
model Category {
  id           String        @id @default(uuid())
  userId       String?       // null = system default
  name         String
  color        String        // Hex color
  icon         String?       // Icon identifier
  isDefault    Boolean       @default(false)

  transactions Transaction[]

  @@unique([userId, name])
}
```

---

## 摘要表格

| Req ID | 功能     | 優先級 | Sprint | 複雜度 |
| ------ | -------- | ------ | ------ | ------ |
| FR-001 | PDF 上傳 | P0     | 0.5    | 中     |
| FR-002 | AI 提取  | P0     | 0.5    | 高     |
| FR-003 | 批次匯入 | P0     | 0.5    | 中     |
| FR-004 | 多卡管理 | P0     | 0.5    | 低     |
| FR-005 | 預扣預算 | P1     | 2      | 高     |
| FR-006 | 交易匹配 | P1     | 2      | 中     |
| FR-007 | 歷史匯入 | P1     | 2      | 中     |
| FR-008 | 分類管理 | P0     | 0.5    | 低     |

---

## 相關文件

- [Vision and Workflow](vision-and-workflow.md)
- [Workflow Pivot Analysis](workflow-pivot-analysis.md)
- [Database Design](../architecture/database-design.md)
