# Prisma 完整指南

## 📚 什麼是 Prisma？

Prisma 是一個現代化的 **TypeScript/JavaScript 資料庫工具套件（ORM - Object-Relational Mapping）**，它讓你能夠用更直觀、類型安全的方式與資料庫互動。

### 為什麼需要 ORM？

傳統上，如果你要從資料庫讀取資料，你需要寫原生 SQL：

```sql
SELECT * FROM transactions
WHERE userId = '123'
ORDER BY date DESC;
```

這有幾個問題：

- ❌ 容易出錯（拼字錯誤、SQL 注入風險）
- ❌ 沒有型別檢查
- ❌ 需要手動解析結果
- ❌ 難以維護和重構

用 Prisma，你可以這樣寫：

```typescript
const transactions = await prisma.transaction.findMany({
  where: { userId: '123' },
  orderBy: { date: 'desc' },
});
```

優點：

- ✅ 類型安全，開發時就能發現錯誤
- ✅ IDE 自動補全
- ✅ 自動解析成 TypeScript 物件
- ✅ 易於維護和重構

---

## 🏗️ Prisma 的三大核心組成

### 1. Prisma Schema

**檔案位置**：`schema.prisma`

這是一個聲明式的檔案，用來定義你的資料庫結構：

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  transactions Transaction[]
}

model Transaction {
  id          String          @id @default(uuid())
  amount      Decimal         @db.Decimal(10, 2)
  type        TransactionType
  description String?
  date        DateTime
  userId      String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

**關鍵特性**：

- 清晰易讀的語法
- 定義資料模型、關聯關係、索引等
- 支援列舉（enums）
- 自動產生型別定義

### 2. Prisma Client

**自動生成的資料庫客戶端**，具有完整的 TypeScript 類型支援。

#### 生成 Client

```bash
npx prisma generate
```

執行後，Prisma 會：

1. 讀取 `schema.prisma`
2. 生成完整的型別安全的客戶端
3. 放在 `node_modules/.prisma/client` 或 `node_modules/@prisma/client`

#### 使用 Client

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 新增
const newTransaction = await prisma.transaction.create({
  data: {
    amount: 100.5,
    type: 'EXPENSE',
    description: '午餐',
    userId: user.id,
    date: new Date(),
  },
});

// 查詢
const transactions = await prisma.transaction.findMany({
  where: {
    userId: user.id,
    type: 'EXPENSE',
    date: {
      gte: new Date('2025-01-01'), // 大於等於
      lte: new Date('2025-12-31'), // 小於等於
    },
  },
  include: {
    category: true, // 包含關聯的 category
  },
  orderBy: {
    date: 'desc',
  },
  take: 10, // 限制 10 筆
});

// 更新
const updated = await prisma.transaction.update({
  where: { id: transactionId },
  data: { amount: 150.0 },
});

// 刪除
await prisma.transaction.delete({
  where: { id: transactionId },
});

// 聚合查詢
const stats = await prisma.transaction.aggregate({
  where: { userId: user.id },
  _sum: { amount: true },
  _avg: { amount: true },
  _count: true,
});
```

**自動補全範例**：

當你輸入 `prisma.transaction.` 時，IDE 會自動提示：

- `create()`
- `findMany()`
- `findUnique()`
- `update()`
- `delete()`
- `count()`
- `aggregate()`
- 等等...

而且每個方法的參數都有完整的型別提示！

### 3. Prisma Migrate

**資料庫遷移工具**，幫你管理資料庫結構的變更歷史。

#### 開發環境的 Migration

```bash
# 建立並執行 migration
npx prisma migrate dev --name add_category_model
```

這個指令會：

1. 比較 schema 和資料庫的差異
2. 生成 SQL migration 檔案
3. 執行 migration
4. 重新生成 Prisma Client

生成的 migration 檔案範例：

```sql
-- migrations/20251015120000_add_category_model/migration.sql

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_type_key" ON "Category"("userId", "name", "type");
```

#### 生產環境的 Migration

```bash
# 只執行已存在的 migrations，不建立新的
npx prisma migrate deploy
```

用於 CI/CD 流程或生產環境部署。

#### 其他有用的指令

```bash
# 查看 migration 狀態
npx prisma migrate status

# 重設資料庫（開發用，會刪除所有資料！）
npx prisma migrate reset

# 產生 migration 但不執行
npx prisma migrate dev --create-only
```

---

## 🔗 與 Supabase PostgreSQL 的整合

### 設定連接

1. **取得 Supabase 連接字串**

到 Supabase Dashboard → Project Settings → Database

你會看到兩種連接字串：

**Direct Connection**（開發環境）：

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Connection Pooling**（生產環境，建議用於 serverless）：

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

1. **設定環境變數**

```bash
# .env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

1. **初始化 Prisma**

```bash
# 初始化（如果還沒有）
npx prisma init

# 這會建立：
# - prisma/schema.prisma
# - .env 檔案
```

1. **設定 schema.prisma**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

1. **測試連接**

```bash
npx prisma db pull  # 從資料庫拉取現有結構（如果有）
npx prisma db push  # 推送 schema 到資料庫（開發用）
```

### Supabase 特殊考量

#### 1. Row Level Security (RLS)

Supabase 預設啟用 RLS。如果你透過 Prisma 連接（使用 service role key），可以繞過 RLS。

```prisma
// 如果你想在應用層面控制權限，可以關閉 RLS
// 或使用 Supabase 的 service_role key
```

#### 2. Supabase Auth 的 User 表

Supabase 有內建的 `auth.users` 表（在 `auth` schema 中）。

你的選擇：

**選項 A：不在 Prisma 中定義 User 表**

- 只在其他表中使用 `userId: String`
- 不建立外鍵關係到 `auth.users`
- 簡單，但缺少資料完整性檢查

```prisma
model Transaction {
  id     String @id @default(uuid())
  userId String  // 只是一個字串，不是外鍵
  // ...
}
```

**選項 B：在 Prisma 中同步 User 表（推薦）**

- 在 `public` schema 建立自己的 `User` 表
- 使用 Supabase Auth 的 user ID 作為主鍵
- 可以加入額外的使用者資料（profile, settings 等）

```prisma
model User {
  id        String   @id  // 使用 Supabase Auth 的 user ID
  email     String   @unique
  createdAt DateTime @default(now())

  transactions Transaction[]
}

model Transaction {
  id     String @id @default(uuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ...
}
```

**實作方式**：

```typescript
// 在 NestJS 的 AuthGuard 驗證後
@Post('transactions')
@UseGuards(SupabaseAuthGuard)
async create(@User() user, @Body() dto: CreateTransactionDto) {
  // 1. 確保 User 記錄存在
  await this.prisma.user.upsert({
    where: { id: user.id },
    create: { id: user.id, email: user.email },
    update: {}
  });

  // 2. 建立 transaction
  return this.prisma.transaction.create({
    data: {
      ...dto,
      userId: user.id
    }
  });
}
```

---

## 🎯 在 NestJS 中使用 Prisma

### 建立 PrismaService

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 建立 PrismaModule

```typescript
// prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 讓 PrismaService 在整個應用中可用
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 在 Service 中使用

```typescript
// transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.transaction.findFirst({
      where: { id, userId }, // 確保使用者只能存取自己的資料
    });
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    // 先檢查權限
    const transaction = await this.findOne(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  // 統計查詢
  async getStats(userId: string) {
    const [income, expense, count] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      totalIncome: income._sum.amount || 0,
      totalExpense: expense._sum.amount || 0,
      netIncome: (income._sum.amount || 0) - (expense._sum.amount || 0),
      transactionCount: count,
    };
  }
}
```

---

## 🎨 在 Monorepo 中使用 Prisma

### 放置位置：`packages/database`

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── ...
├── src/
│   └── index.ts           # 匯出 PrismaClient
├── package.json
└── tsconfig.json
```

### package.json

```json
{
  "name": "@workspace/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.x.x"
  },
  "devDependencies": {
    "prisma": "^5.x.x"
  }
}
```

### src/index.ts

```typescript
export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';
```

### 在其他應用中使用

```typescript
// apps/api/src/prisma/prisma.service.ts
import { PrismaClient } from '@workspace/database';

// 照常使用
```

### Turbo 配置

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

---

## 🚀 常用操作速查

### 查詢操作

```typescript
// 查詢所有
await prisma.transaction.findMany();

// 條件查詢
await prisma.transaction.findMany({
  where: {
    userId: 'xxx',
    amount: { gte: 100 }, // 大於等於
    type: 'EXPENSE',
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
});

// 查詢單筆（如果沒找到回傳 null）
await prisma.transaction.findUnique({
  where: { id: 'xxx' },
});

// 查詢第一筆符合的（findFirst）
await prisma.transaction.findFirst({
  where: { userId: 'xxx' },
  orderBy: { date: 'desc' },
});

// 包含關聯資料
await prisma.transaction.findMany({
  include: {
    category: true,
    user: true,
  },
});

// 選擇特定欄位
await prisma.transaction.findMany({
  select: {
    id: true,
    amount: true,
    date: true,
  },
});

// 分頁
await prisma.transaction.findMany({
  skip: 10,
  take: 10,
});
```

### 建立操作

```typescript
// 建立單筆
await prisma.transaction.create({
  data: {
    amount: 100,
    type: 'EXPENSE',
    userId: 'xxx',
  },
});

// 建立多筆
await prisma.transaction.createMany({
  data: [
    { amount: 100, type: 'EXPENSE', userId: 'xxx' },
    { amount: 200, type: 'INCOME', userId: 'xxx' },
  ],
});

// 建立並包含關聯
await prisma.transaction.create({
  data: {
    amount: 100,
    type: 'EXPENSE',
    category: {
      connect: { id: 'category-id' }, // 連接現有的
    },
  },
});

// 或同時建立關聯
await prisma.transaction.create({
  data: {
    amount: 100,
    type: 'EXPENSE',
    category: {
      create: { name: '食物', type: 'EXPENSE' }, // 建立新的
    },
  },
});
```

### 更新操作

```typescript
// 更新單筆
await prisma.transaction.update({
  where: { id: 'xxx' },
  data: { amount: 150 },
});

// 更新多筆
await prisma.transaction.updateMany({
  where: { userId: 'xxx' },
  data: { description: 'Updated' },
});

// Upsert (如果存在就更新，不存在就建立)
await prisma.user.upsert({
  where: { id: 'xxx' },
  create: { id: 'xxx', email: 'user@example.com' },
  update: { email: 'newemail@example.com' },
});
```

### 刪除操作

```typescript
// 刪除單筆
await prisma.transaction.delete({
  where: { id: 'xxx' },
});

// 刪除多筆
await prisma.transaction.deleteMany({
  where: { userId: 'xxx' },
});
```

### 聚合查詢

```typescript
// 計數
const count = await prisma.transaction.count({
  where: { userId: 'xxx' },
});

// 聚合
const result = await prisma.transaction.aggregate({
  where: { userId: 'xxx' },
  _sum: { amount: true },
  _avg: { amount: true },
  _min: { amount: true },
  _max: { amount: true },
  _count: true,
});

// 分組聚合
const groupBy = await prisma.transaction.groupBy({
  by: ['type'],
  _sum: { amount: true },
  _count: true,
});
```

---

## 💡 最佳實踐

### 1. 使用 Transaction（交易）處理多個操作

```typescript
// 確保多個操作全部成功或全部失敗
await prisma.$transaction(async (tx) => {
  // 扣除餘額
  await tx.account.update({
    where: { id: 'account-1' },
    data: { balance: { decrement: 100 } },
  });

  // 建立交易記錄
  await tx.transaction.create({
    data: {
      amount: -100,
      accountId: 'account-1',
    },
  });
});
```

### 2. 錯誤處理

```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.transaction.create({ data: {...} });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new ConflictException('Record already exists');
    }
    if (error.code === 'P2025') {
      // Record not found
      throw new NotFoundException('Record not found');
    }
  }
  throw error;
}
```

### 3. 效能優化

```typescript
// ❌ N+1 查詢問題
const transactions = await prisma.transaction.findMany();
for (const t of transactions) {
  const category = await prisma.category.findUnique({ where: { id: t.categoryId } });
}

// ✅ 使用 include 一次查詢
const transactions = await prisma.transaction.findMany({
  include: { category: true },
});
```

### 4. 型別安全

```typescript
// 使用 Prisma 生成的型別
import { Transaction, Prisma } from '@prisma/client';

// 完整的 Transaction 型別
const transaction: Transaction = await prisma.transaction.findUnique({...});

// CreateInput 型別
const data: Prisma.TransactionCreateInput = {
  amount: 100,
  type: 'EXPENSE',
  user: { connect: { id: 'user-id' } }
};

// 部分欄位
type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true }
}>;
```

---

## 🔧 實用工具

### Prisma Studio

視覺化的資料庫管理介面：

```bash
npx prisma studio
```

會開啟 `http://localhost:5555`，可以直接在瀏覽器中：

- 查看資料
- 編輯資料
- 建立新記錄
- 刪除記錄

非常適合開發時快速檢查資料！

### Prisma 格式化

```bash
npx prisma format
```

自動格式化 `schema.prisma` 檔案。

---

## 📚 總結

**Prisma 的優勢**：

- ✅ 類型安全的資料庫操作
- ✅ 自動補全和 IDE 支援
- ✅ 清晰的 schema 定義
- ✅ 強大的 migration 系統
- ✅ 優秀的開發體驗
- ✅ 與 Supabase PostgreSQL 無縫整合

**在本專案中的角色**：

- 放置在 `packages/database/` 作為共享套件
- NestJS 透過 PrismaService 使用
- 提供完整的型別定義給整個 monorepo
- 管理資料庫 schema 和 migrations

**學習資源**：

- [Prisma 官方文檔](https://www.prisma.io/docs)
- [Prisma Examples](https://github.com/prisma/prisma-examples)
- [Prisma + NestJS](https://docs.nestjs.com/recipes/prisma)
