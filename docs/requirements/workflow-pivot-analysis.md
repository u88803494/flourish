# Workflow Pivot Analysis

**Date**: 2025-10-30
**Type**: Requirements Discovery
**Impact**: High - Major architecture change

---

## Executive Summary

During Sprint 0.5 planning, a critical discovery was made: the actual user workflow differs significantly from initial planning assumptions. This document analyzes the pivot from **daily manual entry** to **monthly PDF batch processing** and its implications for the Flourish project.

**Key Finding**: User is a credit card power user (20+ cards) who processes monthly statements via PDF upload, not someone who manually enters daily transactions.

---

## Original Assumptions

### Initial Planning (Pre-Sprint 0.5)

**Assumed User Behavior**:

```
每日流程（錯誤假設）：
1. 發生交易
2. 立即手動輸入到系統
3. 即時分類
4. 查看當日預算
```

**Assumed Data Model**:

- Transaction-centric architecture
- Simple Category → Transaction relationship
- Daily transaction creation
- Real-time budget updates
- Single or few credit cards

**Assumed UI Flow**:

```
Primary Action: "Add Transaction" button
↓
Form: Date, Amount, Category, Description
↓
Save to Database
↓
Update Budget Display
```

**Technical Implications**:

- Simple REST API: `POST /api/transactions`
- Real-time validation
- Immediate budget recalculation
- Minimal batch processing needs

---

## Discovered Reality

### Actual User Behavior (2025-10-30 Discovery)

**Monthly Batch Processing**:

```
每月流程（實際需求）：
1. 月底下載信用卡 PDF 對帳單（網路銀行）
2. 上傳 PDF 到系統（批次處理）
3. AI 自動辨識交易明細
4. 檢視、修正錯誤
5. 確認後批次匯入
6. 檢視月度預算使用狀況
```

**Actual Data Volume**:

- 20+ credit cards owned
- 2-5 cards actively used per month
- Hundreds of transactions per month (not handful per day)
- 6 years of historical data (2019-2025) to import

**Actual Pain Points from Previous Solution (Google Sheets)**:

- Complex formulas for annual fee amortization (/12)
- Manual tracking of pre-deductions (subscriptions, auto-savings)
- Time-consuming monthly reconciliation
- Difficult to maintain and rebuild annually
- Unclear data purpose after years of accumulation

**Critical Requirements Not in Original Plan**:

1. **PDF Statement Processing**: Not mentioned in initial docs
2. **AI Transaction Recognition**: Not planned
3. **Pre-Deduction System**: Not in database design
4. **Multi-Card Power User Workflow**: Assumed 1-2 cards
5. **Historical Data Import**: Not considered

---

## Impact Analysis

### 1. Database Architecture Changes

#### Before (Transaction-Centric)

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

**Issues**:

- No link to source statement
- No AI confidence tracking
- No batch processing support
- Missing card management

#### After (Statement-Centric)

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
  statementId   String?  // 🔑 Link to source!
  merchantName  String
  amount        Decimal
  confidence    Float?   // 🔑 AI confidence score
  rawText       String?  // 🔑 Original OCR text
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

**New Capabilities**:

- Track transaction source (PDF statement)
- AI confidence scoring
- Batch import support
- Multi-card management
- Statement lifecycle tracking

### 2. UI/UX Flow Differences

#### Before (Manual Entry Flow)

```
Homepage → "Add Transaction" Button → Form → Save
```

**Screen Priority**:

1. Add Transaction Form
2. Transaction List
3. Budget Summary

#### After (PDF Processing Flow)

```
Homepage → "Upload Statement" → Select Card → Upload PDF →
AI Processing → Review Table → Edit/Confirm → Import → Budget Dashboard
```

**Screen Priority**:

1. Upload Statement Interface
2. Transaction Review Table (batch editing)
3. Budget Dashboard (with pre-deductions)
4. Card Management
5. Manual Entry Form (fallback only)

### 3. Feature Priority Shifts

#### Before

| Feature              | Priority | Sprint |
| -------------------- | -------- | ------ |
| Add Transaction Form | P0       | 0.5    |
| Category Management  | P0       | 0.5    |
| Budget Display       | P1       | 1      |
| Multi-Currency       | P2       | 2      |

#### After

| Feature                     | Priority | Sprint |
| --------------------------- | -------- | ------ |
| PDF Upload                  | P0       | 0.5    |
| AI Transaction Extraction   | P0       | 0.5    |
| Batch Review/Edit Interface | P0       | 0.5    |
| Multi-Card Management       | P0       | 0.5    |
| Pre-Deduction Budget System | P1       | 2      |
| Recurring Expense Tracking  | P1       | 2      |
| Historical Data Import      | P1       | 2      |
| Manual Entry Form           | P2       | 2      |

### 4. Technology Stack Additions

#### New Requirements

- **PDF Storage**: Cloud storage for uploaded statements (Supabase Storage)
- **OCR/AI Service**: Transaction extraction from PDF (OpenAI Vision API?)
- **Batch Processing**: Queue system for async PDF processing
- **CSV Import**: Tool for historical data migration

#### API Endpoints Changed

**Before**:

```
POST   /api/transactions      # Create single transaction
GET    /api/transactions      # List transactions
PATCH  /api/transactions/:id  # Update transaction
DELETE /api/transactions/:id  # Delete transaction
```

**After**:

```
POST   /api/statements/upload         # Upload PDF
GET    /api/statements/:id/extract    # Get extracted transactions
POST   /api/statements/:id/import     # Confirm batch import
GET    /api/cards                     # List user's cards
POST   /api/cards                     # Add new card
PATCH  /api/cards/:id/active          # Toggle active status
POST   /api/import/historical         # Import CSV data
```

---

## Decision Rationale

### Why This Discovery Matters

**User Behavior Research**:

- Real-world credit card power users don't manually enter hundreds of transactions
- Monthly reconciliation is standard practice in personal finance
- Efficiency is valued over real-time tracking

**Efficiency vs Accuracy**:

- Manual entry: High accuracy, low efficiency (hours per month)
- PDF + AI: High efficiency, good accuracy (minutes per month + review)
- User prefers: Fast batch processing with review step

**Competitive Analysis**:

- No existing tools well-suited for multi-card power users
- Most apps assume 1-2 cards with daily manual entry
- Opportunity to build for underserved segment

### MVP Scope Redefinition

**Sprint 0.5 MVP Must Have**:

- ✅ PDF statement upload
- ✅ Basic AI transaction extraction
- ✅ Batch review and edit interface
- ✅ Statement-centric data model
- ✅ Multi-card management

**Sprint 0.5 Nice to Have → Deferred to Sprint 2**:

- ⏸️ Pre-deduction system (important but complex)
- ⏸️ Recurring expense tracking
- ⏸️ Auto-savings rules
- ⏸️ Budget forecasting

**Reasoning**:

- Get PDF workflow working first
- Validate AI extraction accuracy
- Learn from real usage before building complex budget logic

---

## Implementation Phases

### Phase 1: Sprint 0.5 - PDF Processing MVP (2 weeks)

**Goal**: Upload → Extract → Import workflow

**Deliverables**:

- Supabase project setup
- Prisma schema with Statement/Card/Transaction models
- PDF upload API endpoint
- Basic AI extraction (OpenAI Vision API integration)
- Transaction review table UI
- Batch import functionality

**Success Criteria**:

- Can upload PDF statement
- Extract at least 80% of transactions correctly
- Review and edit extracted data
- Import to database
- Link transactions to statements

### Phase 2: Sprint 1 - Polish and Refinement (1 week)

**Goal**: Improve accuracy and UX

**Deliverables**:

- Improve AI extraction accuracy (90%+ target)
- Better error handling
- Card management UI
- Category assignment during review
- Statement history view

### Phase 3: Sprint 2 - Advanced Budget Features (2 weeks)

**Goal**: Pre-deduction system implementation

**Deliverables**:

- RecurringExpense model and CRUD
- Income tracking
- SavingRule model
- Budget calculation engine
- MonthlyBudget dashboard
- Transaction matching (expected vs actual)

### Phase 4: Sprint 3 - Historical Data and Optimization (1 week)

**Goal**: Import legacy data and optimize performance

**Deliverables**:

- CSV import tool
- Bulk data validation
- Performance optimization for large datasets
- Data visualization improvements

---

## Risks and Mitigation

### Identified Risks

**Risk 1: AI Extraction Accuracy**

- **Concern**: Different bank PDF formats may confuse AI
- **Impact**: High - core feature depends on this
- **Mitigation**:
  - Start with most common bank formats (user's current cards)
  - Build format templates for each bank
  - Allow manual correction during review
  - Collect feedback to improve prompts

**Risk 2: Complex Budget Logic**

- **Concern**: Pre-deduction calculation is complex
- **Impact**: Medium - deferring to Sprint 2 reduces Sprint 0.5 risk
- **Mitigation**:
  - Validate logic with user before implementing
  - Build incrementally (subscriptions → amortization → savings)
  - Extensive testing with real scenarios

**Risk 3: Historical Data Quality**

- **Concern**: Google Sheets data may have inconsistencies
- **Impact**: Low - not blocking MVP
- **Mitigation**:
  - Validation rules during import
  - Flag suspicious transactions for review
  - Allow manual cleanup post-import

**Risk 4: Scope Creep**

- **Concern**: User may request more features during development
- **Impact**: Medium - could delay launch
- **Mitigation**:
  - Clear Sprint boundaries documented
  - Feature request tracking for post-MVP
  - Focus on 4-5 week launch goal

---

## Lessons Learned

### Requirements Discovery Process

**What Went Well**:

- ✅ Asked clarifying questions during Sprint 0.5 planning
- ✅ User provided detailed context about actual workflow
- ✅ Discovered real pain points (Google Sheets complexity)
- ✅ Uncovered data volume realities (20+ cards, 6 years data)

**What Could Be Improved**:

- ⚠️ Should have asked about workflow earlier (Sprint 0.1)
- ⚠️ Initial assumptions not validated with user scenarios
- ⚠️ Database design created before understanding workflow

**Best Practices for Future**:

- 🎯 Always ask: "Walk me through your typical day/week/month"
- 🎯 Validate assumptions before designing architecture
- 🎯 Review existing solutions user has tried
- 🎯 Ask about data volume and edge cases early

---

## Alignment with Project Vision

### Flow App Purpose (from project-overview.md)

**Original Description**:

> "Transaction recording (income/expenses), category management, budget tracking, financial statistics and reports, export/import capabilities"

**Interpretation Shift**:

- ❌ "Transaction recording" ≠ Manual entry form
- ✅ "Transaction recording" = PDF upload + AI extraction
- ❌ "Budget tracking" ≠ Simple sum of income/expenses
- ✅ "Budget tracking" = Pre-deduction calculation system
- ✅ "Export/import" = Critical for historical data migration

**Still Aligned**: Core vision unchanged, execution method adjusted to match real user behavior

---

## Next Steps

### Immediate Actions (This Week)

1. ✅ Document requirements (this file)
2. ⏳ Update database-design.md with phased architecture
3. ⏳ Create functional-requirements.md with detailed features
4. ⏳ Plan Sprint 0.5 execution with new scope

### Sprint 0.5 Execution (Next 2 Weeks)

1. Set up Supabase project and authentication
2. Define Prisma schema (Statement-centric model)
3. Implement PDF upload API
4. Integrate OpenAI Vision API for extraction
5. Build transaction review table UI
6. Implement batch import functionality
7. Test with real bank statements

### Sprint 2 Planning (After MVP Launch)

1. Design pre-deduction system architecture
2. Define RecurringExpense, Income, SavingRule models
3. Build budget calculation engine
4. Create MonthlyBudget dashboard
5. Implement transaction matching logic

---

## Conclusion

This requirements pivot is a **positive discovery** that aligns the product with real user needs. While it requires architectural changes, the new direction creates a more valuable and differentiated product.

**Key Takeaway**: Understanding actual user workflow is more important than sticking to initial plans. The pivot from manual entry to PDF batch processing fundamentally improves user experience and positions Flourish for credit card power users.

**Project Timeline Impact**: Minimal - Sprint 0.5 scope adjusted but still achievable in 2 weeks. Advanced features deferred to Sprint 2 reduces risk and allows faster launch.

---

## Related Documents

- [Vision and Workflow](vision-and-workflow.md) - Detailed requirements post-pivot
- [Database Design](../architecture/database-design.md) - Updated data model
- [Functional Requirements](functional-requirements.md) - Feature specifications
- [Sprint 0.5 Tasks](../sprints/sprint-0-foundation/tasks.md) - Implementation plan
