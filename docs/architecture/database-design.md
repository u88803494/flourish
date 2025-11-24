# 資料庫設計文檔

## 🔌 連接架構決策

### 為什麼選擇 Session Pooler？

本專案使用 **Supabase PostgreSQL** 搭配 **Session Pooler** 連接方式，原因如下：

| 考量因素                | Direct Connection | Session Pooler | Transaction Pooler |
| ----------------------- | ----------------- | -------------- | ------------------ |
| **IPv4 支援**           | ⚠️ 不穩定         | ✅ 完整支援    | ✅ 完整支援        |
| **Prepared Statements** | ✅ 支援           | ✅ 支援        | ❌ 不支援          |
| **連接複用**            | ❌ 無             | ✅ Session 級  | ✅ Transaction 級  |
| **適合場景**            | 長期服務          | 一般開發/生產  | Serverless 函數    |
| **本地開發**            | ⚠️ 常失敗         | ✅ 推薦        | ⚠️ 遷移會失敗      |

### IPv4/IPv6 連接問題根因分析

**發現時間**: 2025-10-31（首次 Migration 時）

**問題描述**:

```
Error: P1001: Can't reach database server at `db.fstcioczrehqtcbdzuij.supabase.co:5432`
```

**根本原因**:

- Tokyo 區域 Supabase 默認使用 IPv6（`db.xxx.supabase.co`）
- 本地開發機環境是 IPv4
- Direct Connection 無法跨越 IPv4/IPv6 路由邊界

**解決方案**:

- Supabase 提供 Session Pooler URL（`aws-1-ap-northeast-1.pooler.supabase.com`）
- Pooler 本身支援 IPv4/IPv6 代理
- Prisma 遷移引擎依賴 Prepared Statements，所以必須用 Session 或 Direct（不能用 Transaction）

### 連接字符串格式

**不要用**（Direct Connection，容易失敗）:

```env
DATABASE_URL=postgresql://postgres:password@db.fstcioczrehqtcbdzuij.supabase.co:5432/postgres
```

**應該用**（Session Pooler，推薦）:

```env
DATABASE_URL=postgresql://postgres.fstcioczrehqtcbdzuij:password@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**不要用**（Transaction Pooler，Prisma Migration 會失敗）:

```env
DATABASE_URL=postgresql://postgres:password@db.fstcioczrehqtcbdzuij.supabase.co:6543/postgres?pgbouncer=true
```

### 區域選擇影響

選擇 **Tokyo (ap-northeast-1)** 而不是其他區域的原因：

- ✅ 最接近開發者地理位置（低延遲）
- ✅ 足夠的冷備份和可靠性（企業級 SLA）
- ✅ Supabase Session Pooler 可用

更多資訊見：[Database Setup Guide - Step 1.2](../guides/database-setup.md#12-建立新專案)

---

## 📊 資料模型概覽

本專案使用 PostgreSQL（透過 Supabase）作為資料庫，Prisma 作為 ORM。

**重要更新 (2025-10-30)**: 基於實際使用者工作流程（PDF 對帳單批次處理），資料庫架構已調整為 **Statement-Centric Model**（對帳單為中心）。本文件包含階段式開發的完整設計，將實作核心 MVP 模型。

---

## 🎯 架構演進與階段式設計

### 需求轉變

**原始假設** (Release 1):

- 使用者每日手動輸入交易
- Transaction 為核心實體
- 簡單的收支追蹤

**實際需求** (2025-10-30 發現):

- 使用者每月上傳信用卡 PDF 對帳單
- AI 自動辨識交易明細
- 批次匯入工作流程
- 20+ 張信用卡管理
- 預扣系統（固定月費、年費分攤、自動儲蓄）

詳細分析見：[Workflow Pivot Analysis](../requirements/workflow-pivot-analysis.md)

### 階段式實作策略

為了在 4-5 週內快速啟動，同時保留未來擴展能力，我們採用階段式設計：

#### Release 1 - MVP Models (Must Have)

核心對帳單處理流程

- ✅ **Statement** (對帳單) - 核心實體
- ✅ **Card** (信用卡) - 多卡管理
- ✅ **Transaction** (交易) - 連結到 Statement
- ✅ **Category** (分類) - 基礎分類
- ✅ **User** (使用者) - Supabase Auth 同步

#### Phase 2 - Budget Enhancement Models (Should Have)

進階預算功能

- 📅 **RecurringExpense** (固定支出) - 月費 + 年費分攤
- 💰 **Income** (收入) - 薪資追蹤
- 💾 **SavingRule** (儲蓄規則) - 自動儲蓄
- 🔗 **TransactionMatch** (交易配對) - 預期 vs 實際
- 📊 **MonthlyBudget** (月度預算) - 計算後總覽

#### Phase 3 - Advanced Features (Nice to Have)

優化與分析

- Historical data import tools
- Advanced statistics
- Multi-currency support
- Receipt attachment

---

## 🗂️ Release 1 MVP Schema

### Statement-Centric Architecture

**核心概念**: 交易來自對帳單，對帳單來自信用卡

```
User → Cards → Statements → Transactions
```

### 完整 MVP Prisma Schema

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// Release 1 MVP Models
// ============================================

// 使用者（同步 Supabase Auth）
model User {
  id        String   @id  // Supabase Auth UUID
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // MVP Relations
  cards        Card[]
  statements   Statement[]
  transactions Transaction[]
  categories   Category[]

  @@map("users")
}

// 信用卡管理
model Card {
  id           String   @id @default(uuid())
  userId       String
  name         String   // User-defined, e.g., "國泰世華 CUBE"
  bank         String   // Bank name
  last4        String   // Last 4 digits
  color        String?  // Hex color for UI
  isActive     Boolean  @default(true)
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  statements Statement[]

  @@unique([userId, bank, last4])
  @@index([userId, isActive])
  @@map("cards")
}

// 對帳單（核心實體）
model Statement {
  id            String          @id @default(uuid())
  userId        String
  cardId        String
  pdfUrl        String          // Supabase Storage URL
  uploadDate    DateTime        @default(now())
  statementDate DateTime        @db.Date  // 帳單月份
  status        StatementStatus @default(PENDING)
  totalAmount   Decimal?        @db.Decimal(12, 2)
  metadata      Json?           // Extra info (e.g., billing cycle)

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  card         Card          @relation(fields: [cardId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, cardId, statementDate])
  @@index([userId, status])
  @@index([cardId, statementDate(sort: Desc)])
  @@map("statements")
}

enum StatementStatus {
  PENDING    // Uploaded, not extracted
  EXTRACTED  // AI extraction complete
  CONFIRMED  // User confirmed, ready to import
  IMPORTED   // Transactions imported
  ARCHIVED   // Archived

  @@map("statement_status")
}

// 交易記錄
model Transaction {
  id              String          @id @default(uuid())
  userId          String
  statementId     String?         // 🔑 Link to source statement!
  merchantName    String
  amount          Decimal         @db.Decimal(12, 2)
  type            TransactionType @default(DEBIT)
  transactionDate DateTime        @db.Date
  categoryId      String?
  description     String?         @db.Text

  // AI Extraction Metadata
  confidence      Float?          // AI confidence score 0-1
  rawText         String?         @db.Text // Original OCR text
  isManualEntry   Boolean         @default(false)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  statement Statement?  @relation(fields: [statementId], references: [id], onDelete: SetNull)
  category  Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId, transactionDate(sort: Desc)])
  @@index([statementId])
  @@index([categoryId])
  @@map("transactions")
}

enum TransactionType {
  DEBIT   // 支出
  CREDIT  // 收入/退款

  @@map("transaction_type")
}

// 分類管理
model Category {
  id        String          @id @default(uuid())
  userId    String?         // null = system default
  name      String
  type      TransactionType
  icon      String?
  color     String?
  parentId  String?         // Support sub-categories
  isDefault Boolean         @default(false)
  createdAt DateTime        @default(now())

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent       Category?     @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children     Category[]    @relation("CategoryHierarchy")
  transactions Transaction[]

  @@unique([userId, name, type])
  @@index([userId, type])
  @@map("categories")
}
```

### MVP 設計決策

**1. Statement 為何是核心？**

- 使用者工作流程：每月上傳 PDF → 批次處理
- 追溯性：每筆交易都知道來源
- AI 信心度：保留 rawText 供除錯
- 批次操作：一次處理整份對帳單

**2. 為何 Transaction 不直接連 Card？**

```
❌ Transaction → Card (錯誤)
✅ Transaction → Statement → Card (正確)
```

理由：

- Transaction 來自 Statement，不是直接來自 Card
- 可追溯：知道這筆交易出現在哪份對帳單
- 支援手動輸入：statementId 可為 null

**3. isManualEntry 的用途**

- `false`: AI 從 PDF 提取（預設）
- `true`: 使用者手動新增（例外情況）
- 用於後續分析準確度

**4. StatementStatus 生命週期**

```
PENDING → EXTRACTED → CONFIRMED → IMPORTED → ARCHIVED
   ↓          ↓            ↓            ↓         ↓
上傳PDF   AI辨識完成   使用者確認   匯入資料庫   歸檔
```

---

## 🚀 Phase 2+ Enhancement Models

以下模型會在 Phase 2 實作，用於支援預扣系統和進階預算功能。

### 完整 Phase 2+ Schema

```prisma
// ============================================
// Phase 2 - Budget Enhancement Models
// ============================================

// 固定支出（月費 + 年費分攤）
model RecurringExpense {
  id              String    @id @default(uuid())
  userId          String
  name            String    // "Netflix", "信用卡年費"
  amount          Decimal   @db.Decimal(10, 2)
  frequency       Frequency @default(MONTHLY)
  startDate       DateTime  @db.Date
  endDate         DateTime? @db.Date
  categoryId      String?

  // 年費分攤設定
  shouldAmortize  Boolean   @default(false)
  amortizeMonths  Int?      @default(12)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  category         Category?          @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  transactionMatches TransactionMatch[]

  @@index([userId, frequency])
  @@map("recurring_expenses")
}

enum Frequency {
  MONTHLY
  YEARLY

  @@map("frequency")
}

// 收入管理
model Income {
  id          String    @id @default(uuid())
  userId      String
  name        String    // "月薪", "獎金", "被動收入"
  amount      Decimal   @db.Decimal(10, 2)
  frequency   Frequency @default(MONTHLY)
  receiveDate DateTime  @db.Date
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId, isActive])
  @@map("incomes")
}

// 儲蓄規則
model SavingRule {
  id        String     @id @default(uuid())
  userId    String
  name      String     // "緊急預備金 5%", "投資基金"
  type      SavingType
  value     Decimal    @db.Decimal(10, 2) // 5 (%) or 5000 (NT$)
  isActive  Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([userId, isActive])
  @@map("saving_rules")
}

enum SavingType {
  PERCENTAGE    // % of income
  FIXED_AMOUNT  // Fixed amount

  @@map("saving_type")
}

// 交易配對（預期 vs 實際）
model TransactionMatch {
  id                  String            @id @default(uuid())
  transactionId       String            @unique
  recurringExpenseId  String
  matchedAt           DateTime          @default(now())
  matchType           MatchType         @default(AUTOMATIC)

  transaction         Transaction       @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  recurringExpense    RecurringExpense  @relation(fields: [recurringExpenseId], references: [id], onDelete: Cascade)

  @@index([recurringExpenseId])
  @@map("transaction_matches")
}

enum MatchType {
  AUTOMATIC  // System suggested, user confirmed
  MANUAL     // User manually linked
  SUGGESTED  // System suggested, awaiting confirmation

  @@map("match_type")
}

// 月度預算總覽（計算後的結果）
model MonthlyBudget {
  id                  String   @id @default(uuid())
  userId              String
  month               DateTime @db.Date // 2025-10-01

  // Income
  totalIncome         Decimal  @db.Decimal(12, 2)

  // Pre-deductions
  autoSaving          Decimal  @db.Decimal(12, 2)
  recurringExpenses   Decimal  @db.Decimal(12, 2)
  amortizedExpenses   Decimal  @db.Decimal(12, 2)

  // Available Budget
  availableBudget     Decimal  @db.Decimal(12, 2)

  // Actual Spending
  totalSpent          Decimal  @db.Decimal(12, 2)
  remainingBudget     Decimal  @db.Decimal(12, 2)

  calculatedAt        DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@unique([userId, month])
  @@index([userId, month(sort: Desc)])
  @@map("monthly_budgets")
}
```

### Phase 2 預算計算邏輯

```typescript
async function calculateMonthlyBudget(userId: string, month: Date): Promise<MonthlyBudget> {
  // Step 1: Calculate total income
  const incomes = await prisma.income.findMany({
    where: { userId, isActive: true, frequency: 'MONTHLY' },
  });
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  // Step 2: Calculate auto-savings
  const savingRules = await prisma.savingRule.findMany({
    where: { userId, isActive: true },
  });
  const percentageSaving = savingRules
    .filter((r) => r.type === 'PERCENTAGE')
    .reduce((sum, r) => sum + (totalIncome * r.value) / 100, 0);
  const fixedSaving = savingRules
    .filter((r) => r.type === 'FIXED_AMOUNT')
    .reduce((sum, r) => sum + r.value, 0);
  const autoSaving = percentageSaving + fixedSaving;

  // Step 3: Calculate recurring monthly expenses
  const recurring = await prisma.recurringExpense.findMany({
    where: {
      userId,
      frequency: 'MONTHLY',
      shouldAmortize: false,
      startDate: { lte: month },
      OR: [{ endDate: null }, { endDate: { gte: month } }],
    },
  });
  const recurringExpenses = recurring.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 4: Calculate amortized annual expenses
  const annual = await prisma.recurringExpense.findMany({
    where: {
      userId,
      frequency: 'YEARLY',
      shouldAmortize: true,
      startDate: { lte: month },
      OR: [{ endDate: null }, { endDate: { gte: month } }],
    },
  });
  const amortizedExpenses = annual.reduce(
    (sum, exp) => sum + exp.amount / (exp.amortizeMonths || 12),
    0
  );

  // Step 5: Calculate available budget
  const availableBudget = totalIncome - autoSaving - recurringExpenses - amortizedExpenses;

  // Step 6: Get actual spending
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'DEBIT',
      transactionDate: { gte: startOfMonth, lte: endOfMonth },
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

### 使用範例

```typescript
// 計算本月預算
const budget = await calculateMonthlyBudget(
  userId,
  new Date(2025, 9, 1) // 2025-10-01
);

console.log(`
💰 總收入：NT$${budget.totalIncome}
💾 自動儲蓄：-NT$${budget.autoSaving}
📱 固定月費：-NT$${budget.recurringExpenses}
📅 分攤年費：-NT$${budget.amortizedExpenses}
✅ 實際可用：NT$${budget.availableBudget}
💳 已消費：-NT$${budget.totalSpent}
🎯 剩餘額度：NT$${budget.remainingBudget}
`);

// Output:
// 💰 總收入：NT$50,000
// 💾 自動儲蓄：-NT$2,500
// 📱 固定月費：-NT$659
// 📅 分攤年費：-NT$1,664
// ✅ 實際可用：NT$45,177
// 💳 已消費：-NT$32,450
// 🎯 剩餘額度：NT$12,727
```

---

## 🗂️ Schema 設計

### 完整的 Prisma Schema

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// 使用者模型
// ============================================

model User {
  id        String   @id  // 使用 Supabase Auth 的 user ID
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  transactions Transaction[]
  categories   Category[]
  accounts     Account[]
  budgets      Budget[]
  statistics   Statistic[]

  @@map("users")
}

// ============================================
// 交易記錄
// ============================================

model Transaction {
  id          String          @id @default(uuid())
  amount      Decimal         @db.Decimal(12, 2)  // 支援到億級，2位小數
  type        TransactionType
  description String?         @db.Text
  date        DateTime        @db.Date
  userId      String
  categoryId  String?
  accountId   String?
  tags        String[]        // PostgreSQL 陣列
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  // 關聯
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  account  Account?  @relation(fields: [accountId], references: [id], onDelete: SetNull)

  // 索引
  @@index([userId, date(sort: Desc)])  // 查詢使用者的交易，按日期降序
  @@index([userId, type])              // 按類型查詢
  @@index([categoryId])                // 按分類查詢
  @@index([accountId])                 // 按帳戶查詢
  @@map("transactions")
}

// ============================================
// 分類管理
// ============================================

model Category {
  id          String          @id @default(uuid())
  name        String
  type        TransactionType
  icon        String?         // 圖示名稱或 emoji
  color       String?         // 顏色代碼（#RRGGBB）
  userId      String
  parentId    String?         // 支援子分類
  isDefault   Boolean         @default(false)  // 是否為預設分類
  createdAt   DateTime        @default(now())

  // 關聯
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent       Category?     @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children     Category[]    @relation("CategoryHierarchy")
  transactions Transaction[]
  budgets      Budget[]

  // 約束
  @@unique([userId, name, type])  // 同一使用者不能有重複的分類名稱（同類型）
  @@index([userId, type])
  @@map("categories")
}

// ============================================
// 帳戶管理（可選功能）
// ============================================

model Account {
  id           String   @id @default(uuid())
  name         String
  type         AccountType
  balance      Decimal  @db.Decimal(12, 2)
  currency     String   @default("TWD")
  icon         String?
  color        String?
  userId       String
  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // 關聯
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
  @@index([userId])
  @@map("accounts")
}

// ============================================
// 預算管理
// ============================================

model Budget {
  id         String      @id @default(uuid())
  name       String
  amount     Decimal     @db.Decimal(12, 2)
  period     BudgetPeriod
  startDate  DateTime    @db.Date
  endDate    DateTime    @db.Date
  categoryId String?
  userId     String
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  // 關聯
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([userId, startDate, endDate])
  @@map("budgets")
}

// ============================================
// 統計數據（供曲線圖工具使用）
// ============================================

model Statistic {
  id        String   @id @default(uuid())
  userId    String
  name      String              // 統計項目名稱（如：daily_income, monthly_expense）
  value     Decimal  @db.Decimal(12, 2)
  date      DateTime @db.Date
  source    StatSource          // 數據來源
  category  String?             // 分類名稱（可選）
  metadata  Json?               // 額外的 metadata
  createdAt DateTime @default(now())

  // 關聯
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name, date, source])  // 同一天同一來源的同一統計項目唯一
  @@index([userId, date])
  @@index([userId, source])
  @@index([userId, name, date(sort: Desc)])
  @@map("statistics")
}

// ============================================
// 列舉型別
// ============================================

enum TransactionType {
  INCOME
  EXPENSE

  @@map("transaction_type")
}

enum AccountType {
  CASH          // 現金
  BANK          // 銀行帳戶
  CREDIT_CARD   // 信用卡
  INVESTMENT    // 投資帳戶
  OTHER         // 其他

  @@map("account_type")
}

enum BudgetPeriod {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
  CUSTOM

  @@map("budget_period")
}

enum StatSource {
  LEDGER        // 從記帳應用自動生成
  MANUAL        // 手動輸入
  IMPORTED      // 匯入的
  CALCULATED    // 計算得出

  @@map("stat_source")
}
```

---

## 📐 資料模型關係圖

```
┌────────────────┐
│     User       │
│  (Supabase)    │
└───────┬────────┘
        │
        │ 1:N
        │
    ┌───┴──────────────────────────────────────┐
    │                                           │
    v                                           v
┌──────────────┐                       ┌──────────────┐
│ Transaction  │                       │  Category    │
│              │ N:1                   │              │
│ - amount     ├──────────────────────>│  - name      │
│ - type       │                       │  - type      │
│ - date       │                       │  - icon      │
│ - description│                       └──────────────┘
└──────┬───────┘                               │
       │                                       │ 1:N
       │ N:1                                   │ (parent/children)
       │                                       v
       v                               ┌──────────────┐
┌──────────────┐                       │  Category    │
│   Account    │                       │  (sub-cat)   │
│              │                       └──────────────┘
│ - name       │
│ - type       │                       ┌──────────────┐
│ - balance    │                       │   Budget     │
└──────────────┘                       │              │
                                       │ - amount     │
┌──────────────┐                       │ - period     │
│  Statistic   │                       │ - startDate  │
│              │                       │ - endDate    │
│ - name       │                       └──────────────┘
│ - value      │
│ - date       │
│ - source     │
└──────────────┘
```

---

## 🎯 設計決策

### 1. User 模型的設計

**問題**：Supabase 已經有 `auth.users` 表，我們需要在 Prisma 中再建一個 User 表嗎？

**答案**：是的，建議建立。

**理由**：

1. **關聯完整性**：Prisma 需要外鍵關係才能有完整的類型推導
2. **擴展性**：可以儲存額外的使用者資料（profile, preferences 等）
3. **資料一致性**：使用 `onDelete: Cascade` 確保刪除使用者時清除所有相關資料

**實作方式**：

```typescript
// 在第一次認證後，自動建立 User 記錄
@Post('transactions')
@UseGuards(SupabaseAuthGuard)
async create(@User() user, @Body() dto: CreateTransactionDto) {
  // Upsert：確保 User 記錄存在
  await this.prisma.user.upsert({
    where: { id: user.id },
    create: { id: user.id, email: user.email },
    update: { email: user.email },  // 更新 email（以防改變）
  });

  // 建立 transaction
  return this.prisma.transaction.create({
    data: { ...dto, userId: user.id }
  });
}
```

### 2. Transaction 的 amount 欄位

**決策**：使用 `Decimal` 而非 `Float`

**理由**：

- Float 有精度問題（0.1 + 0.2 ≠ 0.3）
- Decimal 精確儲存金額
- PostgreSQL 的 `DECIMAL(12, 2)` 支援到 9,999,999,999.99（百億級）

**範例**：

```typescript
// ✅ 正確
const transaction = await prisma.transaction.create({
  data: {
    amount: new Prisma.Decimal(100.5),
    // 或
    amount: 100.5, // Prisma 會自動轉換
  },
});

// 計算時使用 Decimal
import { Decimal } from '@prisma/client/runtime';
const total = transactions.reduce((sum, t) => sum.add(t.amount), new Decimal(0));
```

### 3. 軟刪除 vs 硬刪除

**決策**：硬刪除（onDelete: Cascade）

**理由**：

- 記帳應用通常不需要恢復已刪除的資料
- 簡化程式碼邏輯
- 符合 GDPR（使用者要求刪除資料時真的刪除）

**如果需要軟刪除**：

```prisma
model Transaction {
  id        String    @id @default(uuid())
  // ... 其他欄位
  deletedAt DateTime?  // null = 未刪除

  @@index([userId, deletedAt])
}
```

```typescript
// 查詢時過濾已刪除的
await prisma.transaction.findMany({
  where: {
    userId: user.id,
    deletedAt: null, // 只取未刪除的
  },
});

// 軟刪除
await prisma.transaction.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

### 4. 索引策略

**原則**：為常見查詢建立索引

**已建立的索引**：

1. `[userId, date]`：使用者查詢自己的交易，按日期排序（最常見）
2. `[userId, type]`：查詢某類型的交易（收入或支出）
3. `[categoryId]`：查詢某分類的所有交易
4. `[userId, name, type]` (unique)：防止重複分類名稱

**何時需要更多索引**：

- 如果查詢速度慢（> 100ms）
- 如果資料量大（> 10萬筆）
- 使用 `EXPLAIN ANALYZE` 檢查查詢計畫

### 5. Tags 使用陣列 vs 關聯表

**決策**：使用 PostgreSQL 陣列（`String[]`）

**優點**：

- 簡單直觀
- 適合標籤數量不多的情況
- 查詢方便

**缺點**：

- 無法統計每個標籤的使用次數（需要額外處理）
- 無法為標籤加 metadata

**查詢範例**：

```typescript
// 查詢包含特定標籤的交易
await prisma.transaction.findMany({
  where: {
    userId: user.id,
    tags: { has: '食物' }, // PostgreSQL 陣列查詢
  },
});

// 查詢包含任一標籤
await prisma.transaction.findMany({
  where: {
    userId: user.id,
    tags: { hasSome: ['食物', '娛樂'] },
  },
});
```

**如果需要複雜的標籤管理**，使用關聯表：

```prisma
model Tag {
  id           String @id @default(uuid())
  name         String
  userId       String
  transactions TransactionTag[]

  @@unique([userId, name])
}

model TransactionTag {
  transactionId String
  tagId         String

  transaction Transaction @relation(...)
  tag         Tag         @relation(...)

  @@id([transactionId, tagId])
}
```

---

## 🔄 資料遷移策略

### 開發環境

```bash
# 修改 schema 後
npx prisma migrate dev --name add_accounts_table

# 重設資料庫（會刪除所有資料！）
npx prisma migrate reset
```

### 生產環境

```bash
# 部署前
npx prisma migrate deploy

# 或在 CI/CD 中
- run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Migration 範例

假設要新增 `tags` 欄位到 Transaction：

1. 修改 schema.prisma：

```prisma
model Transaction {
  // ...
  tags String[]  // 新增
}
```

2. 建立 migration：

```bash
npx prisma migrate dev --name add_tags_to_transactions
```

3. 生成的 SQL：

```sql
-- migrations/20251015120000_add_tags_to_transactions/migration.sql
ALTER TABLE "transactions" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT '{}';
```

---

## 📊 常見查詢範例

### 1. 取得使用者的交易列表（分頁）

```typescript
async findAll(userId: string, page: number = 1, perPage: number = 20) {
  const [transactions, total] = await Promise.all([
    this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: { select: { name: true, icon: true, color: true } },
        account: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    this.prisma.transaction.count({ where: { userId } }),
  ]);

  return {
    data: transactions,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}
```

### 2. 統計查詢

```typescript
async getStats(userId: string, startDate: Date, endDate: Date) {
  const stats = await this.prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
    _count: true,
  });

  const income = stats.find(s => s.type === 'INCOME')?._sum.amount || 0;
  const expense = stats.find(s => s.type === 'EXPENSE')?._sum.amount || 0;

  return {
    totalIncome: income,
    totalExpense: expense,
    netIncome: Number(income) - Number(expense),
    transactionCount: stats.reduce((sum, s) => sum + s._count, 0),
  };
}
```

### 3. 按分類統計

```typescript
async getStatsByCategory(userId: string, type: TransactionType) {
  return this.prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type },
    _sum: { amount: true },
    _count: true,
  }).then(async (results) => {
    // 取得分類名稱
    const categoryIds = results.map(r => r.categoryId).filter(Boolean);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, color: true },
    });

    return results.map(r => ({
      category: categories.find(c => c.id === r.categoryId),
      total: r._sum.amount,
      count: r._count,
    }));
  });
}
```

### 4. 趨勢查詢（每日統計）

```typescript
async getDailyTrend(userId: string, startDate: Date, endDate: Date) {
  const transactions = await this.prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    select: { date: true, amount: true, type: true },
    orderBy: { date: 'asc' },
  });

  // 按日期分組
  const dailyStats = transactions.reduce((acc, t) => {
    const dateKey = t.date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'INCOME') {
      acc[dateKey].income += Number(t.amount);
    } else {
      acc[dateKey].expense += Number(t.amount);
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  return Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    income: stats.income,
    expense: stats.expense,
    net: stats.income - stats.expense,
  }));
}
```

---

## 🔒 資料安全

### Row Level Security (RLS)

雖然我們在 NestJS 中控制權限，Supabase 的 RLS 可以作為額外的安全層。

**在 Supabase Dashboard 中設定**：

```sql
-- 啟用 RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: 使用者只能看到自己的交易
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: 使用者只能插入自己的交易
CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: 使用者只能更新自己的交易
CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Policy: 使用者只能刪除自己的交易
CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid()::text = user_id);
```

**注意**：

- 如果使用 Prisma 連接（service role key），會繞過 RLS
- RLS 主要用於前端直接存取資料庫的情況
- 在我們的架構中，NestJS 已經做了權限控制，RLS 是額外的保險

---

## 📈 效能優化

### 1. 使用 Connection Pooling

```env
# 生產環境使用 Supabase 的 connection pooling
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
```

### 2. 批次操作

```typescript
// ❌ N次查詢
for (const t of transactions) {
  await prisma.transaction.create({ data: t });
}

// ✅ 1次查詢
await prisma.transaction.createMany({
  data: transactions,
});
```

### 3. Select 只需要的欄位

```typescript
// ❌ 取得所有欄位
const transactions = await prisma.transaction.findMany();

// ✅ 只取需要的欄位
const transactions = await prisma.transaction.findMany({
  select: {
    id: true,
    amount: true,
    date: true,
    description: true,
  },
});
```

### 4. 使用 Transaction（資料庫交易）

```typescript
// 確保多個操作原子性
await prisma.$transaction(async (tx) => {
  // 建立交易記錄
  const transaction = await tx.transaction.create({
    data: { ...transactionData },
  });

  // 更新帳戶餘額
  await tx.account.update({
    where: { id: accountId },
    data: {
      balance: { increment: transaction.amount },
    },
  });

  // 更新統計數據
  await tx.statistic.upsert({
    where: {
      /* ... */
    },
    create: {
      /* ... */
    },
    update: {
      /* ... */
    },
  });
});
```

---

## 📋 資料庫設定檢查清單

- [ ] 建立 Supabase 專案
- [ ] 取得 DATABASE_URL
- [ ] 設定環境變數
- [ ] 初始化 Prisma (`npx prisma init`)
- [ ] 撰寫 schema.prisma
- [ ] 執行第一次 migration (`npx prisma migrate dev --name init`)
- [ ] 產生 Prisma Client (`npx prisma generate`)
- [ ] 測試連接 (`npx prisma studio`)
- [ ] 設定 RLS policies（可選）
- [ ] 建立索引
- [ ] 效能測試

---

## 🎯 總結

**資料庫設計的核心原則**：

1. ✅ 使用 Decimal 處理金額
2. ✅ 為常見查詢建立索引
3. ✅ 使用外鍵確保資料完整性
4. ✅ 在應用層和資料庫層都做權限控制
5. ✅ 使用 Migration 管理 schema 變更
6. ✅ 為擴展性預留空間（如：tags, metadata）

**在本專案中**：

- User 表同步 Supabase Auth
- Transaction 是核心表
- Category 支援階層結構
- Account 和 Budget 是可選功能
- Statistic 供曲線圖工具使用
