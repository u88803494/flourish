# Supabase vs NestJS 架構比較

**狀態**: ✅ 完整

---

## 🎯 比較目的

本文檔詳細比較 **Supabase-first 架構**與傳統 **NestJS + Render 架構**的差異，幫助理解 Sprint 8 的遷移決策（[ADR 001](../../decisions/001-architecture-simplification.md)）。比較涵蓋成本、開發效率、維護負擔、擴展性、安全性等多個面向。

**目標受眾**：

- 評估專案架構的開發者
- 考慮遷移至 Supabase 的團隊
- 需要理解架構權衡的技術決策者

---

## 📊 整體比較表

| 面向         | Supabase                    | NestJS + Render             | 優勢       |
| ------------ | --------------------------- | --------------------------- | ---------- |
| **成本**     | $0/月（免費層）             | $7+/月                      | Supabase   |
| **開發時間** | 快 60%                      | 基準                        | Supabase   |
| **維護工作** | 少 70%                      | 基準                        | Supabase   |
| **學習曲線** | 平緩（SQL + Supabase docs） | 陡峭（NestJS + Prisma）     | Supabase   |
| **擴展性**   | 自動（Supabase 管理）       | 手動配置                    | Supabase   |
| **靈活性**   | 中等（Edge Functions 補充） | 高（完全自訂）              | NestJS     |
| **控制度**   | 低（Supabase 管理）         | 高（完全控制）              | NestJS     |
| **適合場景** | 標準 CRUD + 簡單業務邏輯    | 複雜業務邏輯 + 多步驟工作流 | 取決於需求 |

---

## 🏗️ 架構對比

### Supabase 架構

```
┌──────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                       │
│                       ↓                                   │
│              Supabase JS Client                           │
│            (@repo/supabase-client)                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   Supabase                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │  PostgreSQL + RLS + Triggers + Functions           │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Auto-generated REST API (PostgREST)               │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Supabase Auth (GoTrue)                            │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Storage + Edge Functions (optional)               │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘

部署: Vercel (Frontend) + Supabase (Backend)
成本: $0/月 (免費層級)
```

**優勢**：

- ✅ **零成本**：Supabase 免費層級完全足夠 Release 0-1
- ✅ **自動 API**：PostgreSQL schema 自動生成 REST API
- ✅ **內建認證**：Supabase Auth 處理所有認證邏輯
- ✅ **資料庫層級安全**：RLS policies 強制執行權限控制
- ✅ **快速開發**：無需手寫 Controllers、Services、DTOs
- ✅ **自動類型**：Supabase CLI 自動生成 TypeScript types
- ✅ **Realtime**：內建 WebSocket 支援
- ✅ **簡化部署**：無需管理後端伺服器

**限制**：

- ❌ **業務邏輯限制**：複雜邏輯需放在前端或 Database Functions
- ❌ **第三方整合**：需使用 Edge Functions（未來功能）
- ❌ **控制度較低**：依賴 Supabase 的實作與限制
- ❌ **客製化受限**：API 結構由 schema 決定，無法完全自訂
- ❌ **學習 SQL**：需熟悉 PostgreSQL 和 RLS

---

### NestJS 架構

```
┌──────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                       │
│                       ↓                                   │
│                 NestJS Client                             │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌──────────────────────────────────────────────────────────┐
│                NestJS API (Render)                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Controllers (Endpoints)                           │  │
│  └──────────┬─────────────────────────────────────────┘  │
│             ▼                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                         │  │
│  └──────────┬─────────────────────────────────────────┘  │
│             ▼                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                        │  │
│  └──────────┬─────────────────────────────────────────┘  │
└─────────────┼─────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Supabase)               │
└──────────────────────────────────────────────────────────┘

部署: Vercel (Frontend) + Render (Backend) + Supabase (Database)
成本: $7+/月 (Render Starter + Supabase)
```

**優勢**：

- ✅ **完全控制**：可實作任何業務邏輯
- ✅ **模組化**：Controllers、Services、Modules 清晰分離
- ✅ **企業級**：適合大型、複雜的專案
- ✅ **成熟生態**：豐富的 NestJS 套件與社群支援
- ✅ **自訂 API**：完全控制 endpoint 設計
- ✅ **測試友善**：內建測試框架與 DI 系統
- ✅ **背景任務**：內建 Queue、Scheduler 支援
- ✅ **TypeScript 原生**：完整的型別安全

**限制**：

- ❌ **開發時間長**：需手寫所有 endpoints、services、DTOs
- ❌ **維護負擔重**：需管理 Render 環境、Keep-Alive 監控
- ❌ **成本較高**：$7+/月 + 未來可能增加
- ❌ **學習曲線陡**：需學習 NestJS、Prisma、Dependency Injection
- ❌ **重複性工作**：每個功能都需完整的 CRUD 實作
- ❌ **手動型別維護**：需同步維護 Prisma schema 和 DTOs
- ❌ **部署複雜度**：需管理多個環境（staging + production）

---

## 🔄 功能對應表

| 功能           | Supabase 實作            | NestJS 實作                     | 開發時間比較    |
| -------------- | ------------------------ | ------------------------------- | --------------- |
| **資料庫**     | PostgreSQL (內建)        | Prisma + PostgreSQL             | 相同            |
| **API**        | Auto-generated REST      | 手動實作 Controllers + Services | Supabase 快 90% |
| **認證**       | Supabase Auth (GoTrue)   | Passport.js + JWT               | Supabase 快 80% |
| **授權**       | Row Level Security (RLS) | Guards + Decorators             | Supabase 快 60% |
| **檔案上傳**   | Supabase Storage         | Multer + Cloud Storage (S3/GCS) | Supabase 快 70% |
| **Realtime**   | Supabase Realtime (內建) | WebSocket/Socket.io             | Supabase 快 80% |
| **Serverless** | Edge Functions (Deno)    | Cloud Functions (GCP/AWS)       | 相同            |
| **類型生成**   | Supabase CLI (自動)      | Prisma CLI (自動) + 手動 DTOs   | Supabase 快 50% |
| **Migration**  | SQL 檔案 (Supabase CLI)  | Prisma migrations               | 相同            |

---

## 📈 開發體驗比較

### 範例：新增「交易」CRUD 功能

**Supabase 實作**：

```typescript
// 步驟 1: 建立 migration（30 分鐘）
// supabase/migrations/20241124000000_create_transactions.sql

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EXPENSE', 'INCOME', 'REFUND')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id);

-- 步驟 2: 生成 TypeScript types（1 分鐘）
-- supabase gen types typescript --local > types.ts

-- 步驟 3: 前端使用（15 分鐘）
// Server Action
'use server';

export async function getTransactions(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(data: TransactionInsert) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({ ...data, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return transaction;
}

// 總計：約 45 分鐘
```

**NestJS 實作**：

```typescript
// 步驟 1: 定義 Prisma schema（15 分鐘）
// packages/database/prisma/schema.prisma

model Transaction {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  merchantName  String   @map("merchant_name")
  amount        Decimal  @db.Decimal(10, 2)
  date          DateTime @db.Date
  type          TransactionType
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("transactions")
}

enum TransactionType {
  EXPENSE
  INCOME
  REFUND
}

// 步驟 2: 生成 migration（5 分鐘）
// pnpm prisma migrate dev --name create_transactions

// 步驟 3: 定義 DTO（20 分鐘）
// apps/api/src/transactions/dto/create-transaction.dto.ts

import { IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  merchantName: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(['EXPENSE', 'INCOME', 'REFUND'])
  type: string;
}

// apps/api/src/transactions/dto/query-transaction.dto.ts
export class QueryTransactionDto {
  @IsString()
  userId: string;

  @IsEnum(['EXPENSE', 'INCOME', 'REFUND'])
  @IsOptional()
  type?: string;
}

// 步驟 4: 實作 Service（30 分鐘）
// apps/api/src/transactions/transactions.service.ts

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: QueryTransactionDto) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(query.type && { type: query.type }),
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    // 驗證權限
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    // 驗證權限
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}

// 步驟 5: 實作 Controller（30 分鐘）
// apps/api/src/transactions/transactions.controller.ts

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll(@GetUser('id') userId: string, @Query() query: QueryTransactionDto) {
    return this.service.findAll(userId, query);
  }

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTransactionDto) {
    return this.service.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateTransactionDto
  ) {
    return this.service.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.service.remove(id, userId);
  }
}

// 步驟 6: 註冊 Module（10 分鐘）
// apps/api/src/transactions/transactions.module.ts

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

// 步驟 7: 撰寫測試（60 分鐘）
// apps/api/src/transactions/transactions.service.spec.ts
// apps/api/src/transactions/transactions.controller.spec.ts
// apps/api/src/transactions/transactions.e2e-spec.ts

// 步驟 8: 部署至 Render（15 分鐘）
// git push origin main → 自動部署

// 總計：約 3 小時 5 分鐘 (vs Supabase 45 分鐘)
// 時間節省：約 76%
```

**總結**：

| 步驟            | Supabase 時間 | NestJS 時間 |
| --------------- | ------------- | ----------- |
| Schema 定義     | 30 分鐘       | 15 分鐘     |
| Migration       | 包含在 schema | 5 分鐘      |
| RLS/Auth 設定   | 包含在 schema | N/A         |
| DTO 定義        | 自動生成      | 20 分鐘     |
| Service 實作    | N/A           | 30 分鐘     |
| Controller 實作 | N/A           | 30 分鐘     |
| Module 註冊     | N/A           | 10 分鐘     |
| 權限驗證        | RLS 自動      | 20 分鐘     |
| 前端整合        | 15 分鐘       | 20 分鐘     |
| 測試撰寫        | N/A           | 60 分鐘     |
| 部署            | N/A           | 15 分鐘     |
| **總計**        | **45 分鐘**   | **3 小時**  |
| **節省時間**    | **-**         | **-75%**    |

---

## 💰 成本比較

### 免費層級

**Supabase Free**：

| 資源               | 免費額度         | Flourish 使用 | 是否足夠 |
| ------------------ | ---------------- | ------------- | -------- |
| 資料庫儲存         | 500 MB           | ~100 MB       | ✅ 充足  |
| 檔案儲存           | 1 GB             | ~500 MB       | ✅ 充足  |
| 月活躍使用者 (MAU) | 50,000           | <1,000        | ✅ 充足  |
| 資料庫頻寬         | 5 GB             | ~2 GB         | ✅ 充足  |
| Edge Functions     | 500K invocations | 未使用        | ✅ 充足  |

**Render Free**：

- ❌ **無免費方案**：Web Service 必須付費
- ⚠️ **Free tier 已移除**：2023 年後不再提供免費 Web Service

**NestJS + Render 最低成本**：

- Render Starter Plan: $7/月
- Supabase Free: $0/月
- **總計**: $7/月

### 付費方案

| 方案              | Supabase               | NestJS + Render            |
| ----------------- | ---------------------- | -------------------------- |
| **免費**          | $0/月                  | ❌ 無                      |
| **入門**          | Pro $25/月             | Starter $7/月              |
| **進階**          | Team $599/月           | Standard $25/月            |
| **企業**          | Enterprise (客製)      | Pro $85/月                 |
| **Flourish 選擇** | **Free** (Release 0-1) | ~~Starter $7/月~~ (已棄用) |

**成本節省**：

- Release 0-1: $7/月 → $0/月 = **100% 節省**
- Release 1 (假設升級 Pro): $25/月 vs $7/月 = **額外 $18/月**
  - 但獲得：8GB 儲存、100GB 檔案、100K MAU、2M Edge Functions
  - 價值遠超過 Render Starter Plan

---

## 🎓 學習曲線

### Supabase

**必學知識**：

1. **PostgreSQL 基礎**（⭐⭐⭐）
   - SQL 查詢語法（SELECT、INSERT、UPDATE、DELETE）
   - JOIN、聚合函數（SUM、COUNT、AVG）
   - 索引與效能優化
   - 學習時間：1-2 週

2. **Row Level Security (RLS)**（⭐⭐⭐⭐）
   - RLS policy 語法
   - `auth.uid()` 使用方式
   - Policy 除錯技巧
   - 學習時間：3-5 天

3. **Supabase Client API**（⭐⭐）
   - `.from()`, `.select()`, `.insert()` 等 API
   - 查詢建構器語法
   - 錯誤處理
   - 學習時間：2-3 天

4. **Next.js + Supabase 整合**（⭐⭐⭐）
   - Server Components vs Client Components
   - Server Actions
   - Middleware 認證
   - 學習時間：1 週

**總學習時間**：約 3-4 週

**學習資源**：

- ✅ Supabase 官方文檔（完善）
- ✅ 社群活躍（Discord、GitHub Discussions）
- ✅ 範例專案豐富
- ✅ Video Tutorials（YouTube）

---

### NestJS

**必學知識**：

1. **NestJS 核心概念**（⭐⭐⭐⭐⭐）
   - Modules、Controllers、Services
   - Dependency Injection
   - Providers、Guards、Interceptors
   - Decorators
   - 學習時間：2-3 週

2. **Prisma ORM**（⭐⭐⭐⭐）
   - Schema 定義
   - Migration 管理
   - Query 語法
   - Relations 處理
   - 學習時間：1-2 週

3. **Authentication & Authorization**（⭐⭐⭐⭐）
   - Passport.js 整合
   - JWT 策略
   - Guards 實作
   - Role-based access control
   - 學習時間：1 週

4. **Testing**（⭐⭐⭐）
   - Jest 單元測試
   - Supertest E2E 測試
   - Mocking strategies
   - 學習時間：1 週

5. **Deployment**（⭐⭐⭐）
   - Render 設定
   - 環境變數管理
   - Keep-Alive 監控
   - CI/CD pipeline
   - 學習時間：3-5 天

**總學習時間**：約 6-8 週

**學習資源**：

- ✅ NestJS 官方文檔（詳細）
- ⚠️ 學習曲線陡峭
- ✅ 範例專案多
- ⚠️ 需同時學習多個技術（NestJS + Prisma + Passport + Jest）

---

### 學習曲線比較

```
難度曲線（1-10）:

Supabase:
Week 1: ██████ 6/10 (SQL 基礎)
Week 2: ████ 4/10 (RLS 理解)
Week 3: ███ 3/10 (Client API)
Week 4: ██ 2/10 (實戰應用)

NestJS:
Week 1-2: █████████ 9/10 (核心概念)
Week 3-4: ████████ 8/10 (Prisma + Auth)
Week 5-6: ███████ 7/10 (Testing + Deployment)
Week 7-8: █████ 5/10 (實戰應用)

結論: Supabase 學習曲線平緩約 50%
```

---

## 🔐 安全性比較

| 安全面向          | Supabase                | NestJS                        |
| ----------------- | ----------------------- | ----------------------------- |
| **資料隔離**      | RLS 強制執行            | Guards + Service 層驗證       |
| **認證**          | Supabase Auth (內建)    | 需自行實作 (Passport.js)      |
| **Token 管理**    | 自動 (Access + Refresh) | 需手動實作 refresh 機制       |
| **密碼安全**      | Bcrypt (內建)           | 需自行實作 (Bcrypt/Argon2)    |
| **SQL Injection** | Parameterized queries   | Prisma 防護 (Parameterized)   |
| **CSRF**          | 無需擔心 (API 架構)     | 需設定 CSRF protection        |
| **Rate Limiting** | 內建                    | 需自行實作 (Throttler)        |
| **Secrets 管理**  | Environment Variables   | Environment Variables + Vault |
| **Audit Log**     | Database logs           | 需自行實作                    |
| **安全更新**      | Supabase 管理           | 需手動更新套件                |

**結論**：

- ✅ Supabase：安全性由平台管理，減少人為錯誤
- ⚠️ NestJS：需要開發者主動實作與維護安全措施

---

## 🚀 效能比較

### 查詢效能

**Supabase**：

- ✅ 直接查詢 PostgreSQL（PostgREST）
- ✅ RLS policy 使用索引欄位時效能優秀
- ⚠️ 複雜 JOIN 可能效能較差
- ✅ Database Functions 處理複雜計算

**NestJS**：

- ✅ Prisma 查詢優化良好
- ✅ 可自訂快取策略（Redis）
- ✅ 完全控制查詢邏輯
- ⚠️ 需額外一層 API 調用（網路延遲）

### 冷啟動

**Supabase**：

- ✅ 無冷啟動問題（持續運行）
- ✅ PostgreSQL 連線池管理

**NestJS + Render**：

- ⚠️ Free tier 有冷啟動（15 分鐘閒置後休眠）
- ✅ Paid tier 無冷啟動
- ⚠️ 需 Keep-Alive 服務監控

### 總結

| 效能面向     | Supabase | NestJS + Render  |
| ------------ | -------- | ---------------- |
| **查詢效能** | 優秀     | 優秀             |
| **冷啟動**   | 無       | 有 (Free tier)   |
| **擴展性**   | 自動     | 需手動配置       |
| **快取**     | 有限     | 完全控制 (Redis) |

---

## 📦 維護負擔比較

### Supabase

**日常維護**：

- ✅ 無需管理伺服器
- ✅ 自動備份（每日）
- ✅ 自動安全更新
- ⚠️ 需監控免費層級用量

**開發維護**：

- RLS policies 設計與測試
- Database migrations 管理
- TypeScript types 重新生成（schema 變更時）

**總維護時間**：約 2-3 小時/週

---

### NestJS + Render

**日常維護**：

- ⚠️ Render 環境監控（Staging + Production）
- ⚠️ Keep-Alive 服務運行
- ⚠️ 環境變數同步（6+ 變數 × 2 環境）
- ⚠️ 依賴套件更新（Security patches）
- ⚠️ API 版本管理

**開發維護**：

- Controllers、Services 維護
- DTOs 與 Prisma schema 同步
- 測試維護（單元 + E2E）
- API 文檔更新
- Prisma migrations 管理

**總維護時間**：約 6-8 小時/週

**維護減少**：Supabase 減少約 **70% 維護工作**

---

## 🎯 適合場景

### 選擇 Supabase 的情境

✅ **標準 CRUD 操作為主**

- 記帳應用（Flourish）
- 部落格系統
- 任務管理工具
- 簡單的 SaaS 產品

✅ **快速原型驗證**

- MVP 開發
- Hackathon 專案
- 概念驗證 (PoC)

✅ **小型團隊/獨立開發者**

- 減少維護負擔
- 專注於業務邏輯
- 降低基礎設施成本

✅ **成本敏感專案**

- Bootstrap startup
- Side project
- Open source 專案

---

### 選擇 NestJS 的情境

✅ **複雜業務邏輯**

- 多步驟工作流程
- 複雜計算與規則引擎
- 金融交易系統

✅ **大量第三方整合**

- 需隱藏多個 API keys
- 複雜的 webhook 處理
- 第三方服務編排

✅ **企業級需求**

- 複雜權限系統
- 多租戶架構
- 客製化需求高

✅ **團隊規模較大**

- 明確的職責分工
- 需要完整的測試覆蓋
- 標準化 API 設計

---

## 🔄 遷移路徑

### 從 Supabase 遷移至 NestJS（如未來需要）

**觸發條件**：

1. 業務邏輯變得過於複雜
2. 需要大量第三方 API 整合
3. Edge Functions 不足以處理需求
4. 需要完全控制 API 設計

**遷移步驟**：

1. **保留 Supabase Database**
   - 繼續使用 PostgreSQL
   - 使用 Prisma 連接 Supabase DB

2. **逐步遷移 API**
   - 先遷移複雜邏輯的 endpoints
   - 保留簡單 CRUD 使用 Supabase

3. **混合架構**

   ```
   Frontend
     ├─ 簡單 CRUD → Supabase 直連
     └─ 複雜邏輯 → NestJS API → Supabase DB
   ```

4. **完全遷移**（可選）
   - 所有 API 統一由 NestJS 處理
   - 關閉 Supabase API（僅使用 Database）

**遷移成本**：

- 時間：2-4 週（取決於功能複雜度）
- 成本：+$7/月（Render Starter）
- 維護：+70% 維護工作

---

## 📚 相關文檔

**架構設計**：

- [架構總覽](./overview.md) - Supabase 架構詳細說明
- [架構決策](./decisions.md) - 所有架構決策記錄
- [ADR 001](../../decisions/001-architecture-simplification.md) - 遷移至 Supabase 的決策過程

**實作指南**：

- [本地開發環境](../guides/local-development.md) - Supabase 環境設定
- [認證指南](../guides/authentication.md) - Supabase Auth 實作
- [RLS 策略設計](../guides/rls-policies.md) - 權限控制指南

**部署文檔（封存）**：

- [NestJS + Render 部署](../../archive/render-deployment/) - 封存的部署文檔供參考

---

## 🎯 總結

### Flourish 選擇 Supabase 的原因

1. **成本**：$0/月 vs $7+/月（100% 節省）
2. **開發速度**：快 60-75%
3. **維護負擔**：減少 70%
4. **功能完全符合**：標準 CRUD + 簡單業務邏輯
5. **學習曲線**：平緩 50%

### 何時重新評估

- ✅ Release 1 完成後（評估開發體驗）
- ✅ 使用者量突破 10K MAU（評估效能）
- ✅ 需要複雜業務邏輯時（評估 Edge Functions 是否足夠）
- ✅ 免費層級用量接近上限時（評估升級方案）

---

**最後更新**: 2025-11-24
**Task 3 已完成**: 詳細比較、程式碼範例、成本分析、學習曲線
