# Vision and Workflow

**Last Updated**: 2025-10-30
**Status**: Living Document

## Overview

Flourish is a personal finance management system designed for credit card power users who need efficient monthly statement processing and intelligent budget management with pre-deduction capabilities.

---

## User Profile and Context

### Target User

**Power Credit Card User**

- Owns 20+ credit cards for various rewards and benefits
- Actively uses 2-5 cards per month depending on promotions
- Processes statements monthly (not daily transaction entry)
- Values efficiency and automation over manual data entry
- Needs clear visibility of actual available budget after pre-deductions

### Historical Context

**Previous Solution**: Google Sheets (2019-2025)

- **Pain Points**:
  - Complex formulas for annual fee amortization (divide by 12)
  - Manual pre-deduction tracking for subscriptions
  - Difficult to maintain and rebuild annually
  - Unclear data purpose after several years
  - Time-consuming monthly reconciliation

**Data Volume**:

- 6 years of historical transaction data (2019-2025)
- Priority: Recent data (2024-2025) for immediate import
- Full history: Import when time permits

---

## Primary Workflow: PDF Statement Processing

### Monthly Cadence

```
每月固定流程：
1. 下載信用卡 PDF 對帳單（網路銀行）
2. 上傳 PDF 到 Flourish
3. AI 自動辨識交易明細
4. 檢視並確認交易（修正錯誤）
5. 批次匯入到資料庫
6. 檢視當月預算使用狀況
```

### Workflow Details

#### Step 1: Statement Download

- Source: Online banking portals
- Format: PDF files (各家銀行格式不同)
- Frequency: Monthly, after statement date
- Cards: Only download for actively used cards (2-5 cards/month)

#### Step 2: PDF Upload

- **User Action**: Select card, upload PDF file
- **System Action**: Store PDF in cloud storage, create Statement record
- **UI Requirements**:
  - Card selection dropdown (show active cards first)
  - File upload with progress indicator
  - Support drag-and-drop
  - File size limit: 10MB per PDF

#### Step 3: AI Transaction Recognition

- **System Action**:
  - Extract transaction data using OCR/AI
  - Parse: date, merchant name, amount, transaction type
  - Calculate confidence score for each transaction
  - Link transactions to statement
- **Technology**: OpenAI Vision API (proposed)
- **Data Quality**: Store raw OCR text for verification

#### Step 4: Review and Validation

- **User Action**:
  - Review extracted transactions in table view
  - Edit merchant names (standardize naming)
  - Assign categories
  - Remove incorrect extractions
  - Flag suspicious transactions
- **UI Requirements**:
  - Editable table with inline editing
  - Show confidence score indicator
  - Bulk category assignment
  - Quick delete for incorrect items

#### Step 5: Batch Import

- **User Action**: Click "Confirm Import" button
- **System Action**:
  - Save all validated transactions to database
  - Mark statement as processed
  - Update monthly budget calculations
  - Trigger category statistics update
- **Validation**: Ensure no duplicate transactions

#### Step 6: Budget Review

- **User Action**: View monthly budget dashboard
- **Display Requirements**:
  - Total income for the month
  - Pre-deducted amounts (subscriptions, amortized fees, auto-savings)
  - Total spending from statements
  - **Actual available balance** (most important metric)
  - Category breakdown
  - Comparison with previous months

---

## Multi-Card Management

### Card Inventory

**Total Cards**: 20+ credit cards
**Active Cards**: 2-5 cards used per month
**Rotation Strategy**: Use different cards based on:

- Current promotions (cashback, points)
- Spending category bonuses
- Annual fee justification

### Card Management Requirements

#### Card Information

- Card name (user-defined, e.g., "國泰世華 CUBE")
- Bank name
- Last 4 digits
- Card color (for visual identification)
- Active/Inactive status

#### Active Card Management

- **Mark as Active**: Cards currently in wallet/use
- **Mark as Inactive**: Cards stored away, not in current rotation
- **Display Priority**: Show active cards first in all dropdowns

#### Statement Organization

- Link each statement to specific card
- Filter statements by card
- View card usage history
- Track spending patterns per card

---

## Pre-Deduction System

### Purpose

**Calculate actual available money** by pre-deducting expected future expenses from current income.

### Formula

```
實際可用金額 = 總收入 - 自動儲蓄 - 固定月費 - 分攤年費
```

### Pre-Deduction Categories

#### 1. Fixed Monthly Subscriptions

**Examples**:

- YouTube Premium: NT$179/月
- Netflix: NT$390/月
- iCloud Storage: NT$90/月

**Behavior**:

- Auto-deduct from available budget
- Track actual vs expected transactions
- Alert if subscription amount changes
- Show in monthly budget projection

#### 2. Annual Fee Amortization

**Purpose**: Avoid budget shock from large annual charges

**Examples**:

- Credit card annual fee: NT$10,000/年 → NT$833/月
- Domain renewal: NT$500/年 → NT$42/月
- Professional membership: NT$5,000/年 → NT$417/月

**Calculation**:

```
每月分攤金額 = 年度費用總額 ÷ 12
```

**Behavior**:

- Display as monthly "reserved amount"
- When actual annual charge occurs, match against reserved amount
- Prevent double-counting (reserve vs actual)

#### 3. Automatic Savings Rules

**Purpose**: Enforce consistent saving behavior

**Examples**:

- Emergency fund: 5% of monthly income
- Investment fund: NT$5,000 fixed amount
- Retirement savings: 10% of income

**Types**:

- **Percentage-based**: % of income
- **Fixed amount**: Specific NT$ amount

**Calculation**:

```
儲蓄金額 =
  (收入 × 百分比規則總和) + 固定金額規則總和
```

---

## Budget Calculation and Display

### Monthly Budget Formula

```typescript
// 步驟 1: 計算總收入
const totalIncome = sumOfAllIncomeTransactions;

// 步驟 2: 計算自動儲蓄
const autoSaving = totalIncome * savingPercentage + fixedSavingAmount;

// 步驟 3: 計算固定月費總額
const monthlySubscriptions = sumOfRecurringMonthlyExpenses;

// 步驟 4: 計算分攤年費總額
const amortizedAnnualFees = sumOfAnnualExpenses / 12;

// 步驟 5: 計算實際可用金額
const availableBudget = totalIncome - autoSaving - monthlySubscriptions - amortizedAnnualFees;

// 步驟 6: 計算已花費金額
const totalSpent = sumOfActualTransactions;

// 步驟 7: 計算剩餘金額
const remainingBudget = availableBudget - totalSpent;
```

### Display Requirements

**Budget Dashboard Must Show**:

1. **Income Section**
   - 💰 本月收入：NT$50,000
   - 📊 收入明細：薪資、獎金、其他

2. **Pre-Deduction Section** (Most Important)
   - 💾 自動儲蓄：NT$2,500 (5%)
   - 📱 固定月費：NT$659
   - 📅 分攤年費：NT$1,664
   - ➖ 預扣總額：NT$4,823

3. **Available Budget** (Key Metric)
   - ✅ **實際可用：NT$45,177**
   - 這是使用者最關心的數字

4. **Spending Section**
   - 💳 已消費：NT$32,450
   - 📊 分類明細：餐飲、交通、購物等
   - 🎯 剩餘額度：NT$12,727

5. **Comparison**
   - 📈 較上月：+5% / -5%
   - 🎯 預算達成率：72%

---

## Historical Data Import

### Source: Google Sheets (2019-2025)

#### Data Structure

```
Columns:
- Date: 交易日期
- Card: 信用卡名稱
- Merchant: 商家名稱
- Amount: 金額
- Category: 分類
- Note: 備註
```

#### Import Strategy

**Phase 1: Recent Data (Priority)**

- Focus: 2024-2025 data
- Reason: Most relevant for current budget analysis
- Approach: Manual CSV upload via admin interface

**Phase 2: Complete History (Optional)**

- Timeframe: 2019-2023 data
- Approach: Bulk import script
- Purpose: Historical trend analysis

#### Data Validation

- ✅ Check for duplicate transactions (by date + amount + merchant)
- ✅ Validate card names against existing cards
- ✅ Auto-create categories if missing
- ✅ Flag large amounts for review (>NT$10,000)
- ✅ Mark all imported data as "Manual Entry" source

#### Import UI Requirements

- CSV file upload
- Column mapping interface (map CSV columns to database fields)
- Preview before import (show first 10 rows)
- Progress indicator for large files
- Import summary report (success/error counts)
- Error log for failed rows

---

## Future Enhancements (Sprint 2+)

### Transaction Matching

**Purpose**: Match expected recurring expenses with actual transactions

**Workflow**:

1. System detects transaction similar to recurring expense
2. Suggest automatic matching
3. User confirms or adjusts
4. Link transaction to recurring expense
5. Remove from "unexpected spending" calculation

### Budget Forecasting

**Purpose**: Predict next month's budget based on patterns

**Features**:

- Seasonal spending patterns
- Recurring expense predictions
- Income stability analysis
- Savings goal tracking

### Multi-Currency Support

**Purpose**: Handle foreign transaction fees and exchange rates

**Requirements**:

- Store original currency and amount
- Track exchange rate at transaction time
- Calculate TWD equivalent
- Display both currencies

### Receipt Attachment

**Purpose**: Store receipt images for tax and warranty purposes

**Features**:

- Attach multiple images per transaction
- OCR receipt data
- Search by receipt content
- Export receipts for tax filing

### Apex Integration

**Purpose**: Export transaction data for statistical analysis

**Data Flow**:

```
Flourish (transactions) → Apex (condition formulas) → Charts/Insights
```

**Use Cases**:

- Financial health scoring
- Spending trend analysis
- Category optimization suggestions
- Savings goal progress tracking

---

## Key Differences from Original Plan

### Original Assumption

- ❌ Daily manual transaction entry
- ❌ Real-time categorization
- ❌ Simple income/expense tracking

### Actual Requirements

- ✅ Monthly PDF statement batch processing
- ✅ AI-powered transaction recognition
- ✅ Pre-deduction budget calculation
- ✅ Multi-card power user workflow
- ✅ Historical data migration

### Architecture Impact

- **Database**: Statement-centric model (not transaction-centric)
- **UI Flow**: Upload → Review → Import (not Add Transaction form)
- **Budget Calculation**: Pre-deduction system (not simple sum)
- **Card Management**: Active/Inactive states (not single card assumption)

---

## Success Metrics

### Sprint 0.5 MVP Success

- ✅ Upload PDF statement
- ✅ Extract basic transaction data (date, amount, merchant)
- ✅ Review and edit extracted data
- ✅ Import transactions to database
- ✅ Link transactions to statements
- ✅ Manage multiple credit cards

### Sprint 2+ Success

- ✅ Pre-deduction budget calculation
- ✅ Recurring expense management
- ✅ Auto-savings rules
- ✅ Historical data imported
- ✅ Transaction matching
- ✅ Budget forecasting

### Long-term Success

- ⏱️ **Time Savings**: 30 minutes/month → 5 minutes/month
- 📊 **Accuracy**: 95%+ transaction recognition
- 💰 **Budget Clarity**: Always know actual available money
- 📈 **Financial Insights**: Clear spending patterns and trends
- 🎯 **Savings Goals**: Automatic enforcement of savings rules

---

## Related Documents

- [Database Design](../architecture/database-design.md)
- [Workflow Pivot Analysis](workflow-pivot-analysis.md)
- [Functional Requirements](functional-requirements.md)
- [Sprint 0.5 Requirements](../sprints/sprint-0.5-mvp/requirements.md)
