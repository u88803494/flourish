# Functional Requirements

**Last Updated**: 2025-10-30
**Status**: Living Document

---

## Document Purpose

This document lists all functional requirements for Flourish, organized by feature area and prioritized by implementation sprint.

**Priority Levels**:

- **P0 (Must Have)**: Core features for MVP (Sprint 0.5)
- **P1 (Should Have)**: Important features for Sprint 2
- **P2 (Nice to Have)**: Future enhancements (Sprint 3+)

---

## FR-001: PDF Statement Upload Workflow

**Priority**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: Statement Processing

### Description

Enable users to upload monthly credit card PDF statements for batch transaction processing.

### User Stories

**US-001.1**: Upload PDF Statement

```
身為使用者
我想要上傳信用卡 PDF 對帳單
以便系統自動辨識交易明細，省去手動輸入時間
```

**Acceptance Criteria**:

- [ ] User can select a credit card from dropdown
- [ ] User can upload PDF file via file picker or drag-and-drop
- [ ] System validates file format (PDF only)
- [ ] System validates file size (max 10MB)
- [ ] System shows upload progress indicator
- [ ] System stores PDF in Supabase Storage
- [ ] System creates Statement record with status "PENDING"
- [ ] User sees confirmation message with statement ID

**US-001.2**: View Statement History

```
身為使用者
我想要查看已上傳的對帳單歷史
以便追蹤哪些月份已經處理完成
```

**Acceptance Criteria**:

- [ ] User sees list of all uploaded statements
- [ ] List shows: Card name, Statement date, Upload date, Status
- [ ] User can filter by card
- [ ] User can filter by status (PENDING, PROCESSED, ARCHIVED)
- [ ] User can download original PDF
- [ ] User can delete statement (with confirmation dialog)

### Technical Requirements

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

**Validation Rules**:

- File format: PDF only
- File size: 1KB - 10MB
- Statement date: Must be within last 12 months
- Duplicate check: Same card + same statement date

---

## FR-002: AI Transaction Extraction

**Priority**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: Statement Processing

### Description

Automatically extract transaction data from uploaded PDF statements using AI/OCR.

### User Stories

**US-002.1**: Automatic Transaction Extraction

```
身為使用者
我希望系統自動從 PDF 辨識出交易明細
以便快速檢視而不需手動打字
```

**Acceptance Criteria**:

- [ ] System processes PDF after upload
- [ ] System extracts: Transaction date, Merchant name, Amount
- [ ] System calculates confidence score for each field (0-1)
- [ ] System stores raw OCR text for debugging
- [ ] System handles multiple PDF formats (different banks)
- [ ] Processing completes within 30 seconds
- [ ] User sees processing status indicator

**US-002.2**: Review Extracted Transactions

```
身為使用者
我想要在匯入前檢視並修正 AI 辨識結果
以確保資料正確性
```

**Acceptance Criteria**:

- [ ] User sees table of extracted transactions
- [ ] Table shows: Date, Merchant, Amount, Confidence Score
- [ ] Low confidence items (<0.7) highlighted in yellow
- [ ] User can edit any field inline
- [ ] User can delete incorrect extractions
- [ ] User can add missing transactions manually
- [ ] Changes saved as draft
- [ ] User can return later to continue editing

### Technical Requirements

**AI Integration**:

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

## FR-003: Batch Transaction Import

**Priority**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: Statement Processing

### Description

Allow users to review and confirm batch import of extracted transactions.

### User Stories

**US-003.1**: Confirm and Import Transactions

```
身為使用者
我想要一次匯入所有確認過的交易
以便快速完成本月對帳單處理
```

**Acceptance Criteria**:

- [ ] User sees "Import All" button after review
- [ ] Button shows transaction count (e.g., "Import 127 transactions")
- [ ] Clicking shows confirmation dialog with summary
- [ ] System validates no duplicate transactions
- [ ] Import happens in background (async)
- [ ] User sees progress indicator during import
- [ ] Success message shows imported count
- [ ] Statement status updates to "IMPORTED"
- [ ] Budget dashboard auto-updates

### Technical Requirements

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

**Duplicate Detection**:

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

## FR-004: Multi-Card Management

**Priority**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: Card Management

### Description

Manage multiple credit cards with active/inactive status.

### User Stories

**US-004.1**: Add Credit Card

```
身為使用者
我想要新增信用卡到系統
以便追蹤各張卡片的消費記錄
```

**Acceptance Criteria**:

- [ ] User can add new card via form
- [ ] Form fields: Card name, Bank name, Last 4 digits
- [ ] Optional fields: Card color, Display order
- [ ] Default status: Active
- [ ] Validation: No duplicate last 4 digits for same bank
- [ ] Success message shows card added

**US-004.2**: Manage Active Cards

```
身為使用者
我想要標記常用卡片為「啟用」
以便在上傳對帳單時優先顯示這些卡片
```

**Acceptance Criteria**:

- [ ] User sees list of all cards
- [ ] Each card shows: Name, Bank, Last 4, Active status
- [ ] User can toggle active status with switch
- [ ] Active cards appear first in all dropdowns
- [ ] Inactive cards shown in collapsed section
- [ ] User can reorder cards (drag and drop)

### Technical Requirements

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

## FR-005: Pre-Deduction Budget System

**Priority**: P1 (Should Have)
**Sprint**: 2
**Epic**: Budget Management

### Description

Calculate actual available budget by pre-deducting recurring expenses and savings.

### User Stories

**US-005.1**: Define Recurring Monthly Expenses

```
身為使用者
我想要設定每月固定支出（如 Netflix, YouTube Premium）
以便系統自動從預算中扣除這些費用
```

**Acceptance Criteria**:

- [ ] User can add recurring expense
- [ ] Fields: Name, Amount, Start date
- [ ] Frequency: Monthly
- [ ] Optional: End date, Category
- [ ] User sees list of all recurring expenses
- [ ] Total monthly recurring shown at top
- [ ] User can edit/delete expenses

**US-005.2**: Define Annual Fee Amortization

```
身為使用者
我想要將年度費用分攤到 12 個月
以避免某個月突然被扣大筆費用造成預算混亂
```

**Acceptance Criteria**:

- [ ] User can add annual expense
- [ ] Fields: Name, Annual amount, Due date
- [ ] System calculates: Monthly amortized = Amount / 12
- [ ] Shows both annual and monthly amounts
- [ ] User sees list of all annual expenses
- [ ] Total monthly amortized shown at top

**US-005.3**: Define Auto-Savings Rules

```
身為使用者
我想要設定自動儲蓄規則（如薪水的 5%）
以便系統自動計算並扣除儲蓄金額
```

**Acceptance Criteria**:

- [ ] User can add saving rule
- [ ] Types: Percentage of income, Fixed amount
- [ ] Fields: Name, Type, Value, Target account
- [ ] User sees list of all saving rules
- [ ] Total monthly saving shown at top
- [ ] Preview: "Next month savings: NT$2,500 (5% of NT$50,000)"

**US-005.4**: View Pre-Deduction Budget

```
身為使用者
我想要看到扣除所有預扣項目後的實際可用金額
以便知道真正能花多少錢
```

**Acceptance Criteria**:

- [ ] Budget dashboard shows breakdown:
  - 💰 Total Income: NT$50,000
  - 💾 Auto Savings: -NT$2,500 (5%)
  - 📱 Recurring Monthly: -NT$659
  - 📅 Amortized Annual: -NT$1,664
  - ✅ **Available Budget: NT$45,177**
- [ ] Available budget is most prominent number
- [ ] Each section expandable to show details
- [ ] Comparison with previous month

### Technical Requirements

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

**Budget Calculation Logic**:

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

## FR-006: Transaction Matching

**Priority**: P1 (Should Have)
**Sprint**: 2
**Epic**: Budget Management

### Description

Match expected recurring expenses with actual imported transactions.

### User Stories

**US-006.1**: Automatic Transaction Matching

```
身為使用者
我希望系統自動偵測哪些交易對應到預期的固定支出
以便清楚知道哪些是預期內、哪些是額外消費
```

**Acceptance Criteria**:

- [ ] System suggests matches for recurring expenses
- [ ] Matching criteria: Similar merchant name + expected amount ±10%
- [ ] User sees "Match Suggestion" badge on transactions
- [ ] User can confirm or reject match
- [ ] Matched transactions marked as "Expected"
- [ ] Unmatched transactions marked as "Unexpected"

### Technical Requirements

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

## FR-007: Historical Data Import

**Priority**: P1 (Should Have)
**Sprint**: 2
**Epic**: Data Migration

### Description

Import historical transaction data from Google Sheets CSV export.

### User Stories

**US-007.1**: Import CSV File

```
身為使用者
我想要匯入 Google Sheets 匯出的 CSV 檔案
以便將過去的交易記錄轉移到新系統
```

**Acceptance Criteria**:

- [ ] User can upload CSV file
- [ ] System shows column mapping interface
- [ ] User maps CSV columns to database fields
- [ ] System validates data before import
- [ ] System shows preview of first 10 rows
- [ ] User can fix errors and retry
- [ ] Import runs in background
- [ ] User receives email when complete

### Technical Requirements

**API Endpoints**:

```typescript
POST   /api/import/historical
  Body: { file: File, cardId: string, columnMapping: object }
  Response: { jobId: string, estimatedRows: number }
```

---

## FR-008: Category Management

**Priority**: P0 (Must Have)
**Sprint**: 0.5
**Epic**: Transaction Organization

### Description

Create and manage transaction categories for spending analysis.

### User Stories

**US-008.1**: Manage Categories

```
身為使用者
我想要建立自訂分類（如餐飲、交通、娛樂）
以便追蹤各類別的支出狀況
```

**Acceptance Criteria**:

- [ ] User can create category with name and color
- [ ] User can edit category
- [ ] User can delete category (if no transactions linked)
- [ ] System provides default categories
- [ ] User can set category icon

### Technical Requirements

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

## Summary Table

| Req ID | Feature              | Priority | Sprint | Complexity |
| ------ | -------------------- | -------- | ------ | ---------- |
| FR-001 | PDF Upload           | P0       | 0.5    | Medium     |
| FR-002 | AI Extraction        | P0       | 0.5    | High       |
| FR-003 | Batch Import         | P0       | 0.5    | Medium     |
| FR-004 | Multi-Card Mgmt      | P0       | 0.5    | Low        |
| FR-005 | Pre-Deduction Budget | P1       | 2      | High       |
| FR-006 | Transaction Matching | P1       | 2      | Medium     |
| FR-007 | Historical Import    | P1       | 2      | Medium     |
| FR-008 | Category Mgmt        | P0       | 0.5    | Low        |

---

## Related Documents

- [Vision and Workflow](vision-and-workflow.md)
- [Workflow Pivot Analysis](workflow-pivot-analysis.md)
- [Database Design](../architecture/database-design.md)
