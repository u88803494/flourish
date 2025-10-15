# 技術選型對比分析

本文檔記錄了各種技術方案的對比，幫助理解為什麼做出特定的技術決策。

---

## 後端框架選擇

### Express.js vs NestJS

#### Express.js + TypeScript (之前的痛苦經驗)

**優點**:
- 輕量級，學習曲線平緩
- 社群龐大，資源豐富
- 靈活性高，可以自由組織程式碼

**缺點**:
- 不是為 TypeScript 原生設計，型別定義不完善
- 缺乏結構化，容易變成義大利麵條式程式碼
- 需要手動處理大量重複邏輯：
  - JWT 驗證
  - 錯誤處理
  - 請求驗證
  - 依賴管理
- 維護困難，尤其是大型專案

**程式碼對比**:
```typescript
// Express.js - 需要大量手動處理
app.get('/transactions', async (req: Request, res: Response) => {
  try {
    // 手動提取和驗證 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const userId = decoded.sub;
    
    // 手動驗證請求參數
    const { limit, offset } = req.query;
    if (limit && (typeof limit !== 'string' || isNaN(Number(limit)))) {
      return res.status(400).json({ error: 'Invalid limit' });
    }
    
    // 終於可以寫商業邏輯
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: limit ? Number(limit) : 10,
      skip: offset ? Number(offset) : 0
    });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### NestJS (選用方案)

**優點**:
- 原生 TypeScript 支援，型別安全
- 內建依賴注入（DI），程式碼解耦
- 裝飾器語法清晰易讀
- 自動請求驗證（class-validator）
- 統一的錯誤處理機制
- 模組化架構，易於維護和擴展
- 內建支援多種功能（WebSocket, GraphQL, Microservices 等）
- 企業級應用標準

**缺點**:
- 學習曲線較陡峭（需要理解 DI、裝飾器、模組系統）
- 較重量級，初期設定較複雜
- 對小型專案可能過度設計

**程式碼對比**:
```typescript
// NestJS - 優雅且簡潔
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(AuthGuard)  // 一行搞定驗證
  async findAll(
    @User() user: UserPayload,  // 自動提取 user
    @Query() query: PaginationDto  // 自動驗證查詢參數
  ) {
    return this.transactionsService.findAll(user.id, query);
  }
}

// DTO 自動驗證
class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
```

**結論**: 雖然學習曲線較陡，但 NestJS 的優勢遠超過缺點，特別適合：
- 想學習正確全端架構的開發者
- 有過 Express 痛苦經驗的人
- 想要長期可維護的程式碼
- 對職涯發展有幫助

---

## ORM 選擇

### TypeORM vs Prisma

#### TypeORM

**優點**:
- 功能完整，支援多種資料庫
- Active Record 和 Data Mapper 兩種模式
- 社群成熟

**缺點**:
- TypeScript 型別支援不夠好
- 需要手動維護 Entity 和資料庫的同步
- Migration 系統較複雜
- 查詢建構器不夠直觀

```typescript
// TypeORM
@Entity()
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => User)
  user: User;
}

// 查詢
const transactions = await transactionRepo.find({
  where: { user: { id: userId } },
  relations: ['user', 'category']
});
```

#### Prisma (選用方案)

**優點**:
- 完整的 TypeScript 型別生成
- 直觀的 schema 定義
- 強大的 migration 系統
- 自動完成和型別檢查
- 查詢語法簡潔
- 效能優異

**缺點**:
- 較新的工具，某些進階功能可能受限
- 必須透過 Prisma Client，無法直接寫 SQL（雖然有 raw query）

```typescript
// Prisma Schema
model Transaction {
  id        String   @id @default(uuid())
  amount    Decimal
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  category  Category?
}

// 查詢 - 型別安全且直觀
const transactions = await prisma.transaction.findMany({
  where: { userId },
  include: { user: true, category: true }
});
```

**結論**: Prisma 的型別安全和開發體驗明顯優於 TypeORM，特別適合 TypeScript 專案。

---

## 身份驗證方案

### 自己實作 JWT vs Supabase Auth vs Auth0

#### 自己實作 JWT

**優點**:
- 完全掌控
- 無外部依賴
- 學習價值高

**缺點**:
- 需要處理大量安全細節：
  - 密碼加密（bcrypt）
  - Token 刷新機制
  - Email 驗證
  - 密碼重設流程
  - 防止暴力破解
- 開發時間長
- 容易出現安全漏洞

#### Auth0

**優點**:
- 功能非常完整
- 企業級安全標準
- 支援多種認證方式（OAuth, SAML 等）
- 詳細的使用者分析

**缺點**:
- 免費方案限制多
- 設定較複雜
- 對學習專案來說可能過度

#### Supabase Auth (選用方案)

**優點**:
- 免費方案慷慨
- 與 Supabase 資料庫整合良好
- 簡單易用的 API
- 內建 Email 驗證、密碼重設等功能
- 支援 OAuth (Google, GitHub 等)
- 開源，可自部署

**缺點**:
- 功能不如 Auth0 完整
- 某種程度的 vendor lock-in

**架構優勢**:
```
前端 → Supabase Auth (處理登入/註冊) → 簽發 JWT
前端 → 後端 API (帶 JWT) → 驗證 JWT → 商業邏輯
```

這種架構實現了關注點分離：
- Supabase 專門處理認證
- 後端專注於商業邏輯
- 減少開發時間和維護成本

**結論**: 對學習專案來說，Supabase Auth 提供了最佳的平衡點。

---

## 前端架構選擇

### Next.js App Router vs Pages Router vs 純 React

#### 純 React (Create React App / Vite)

**優點**:
- 純前端，簡單
- 完全的 SPA 體驗

**缺點**:
- 沒有 SSR/SSG
- SEO 不友善
- 需要額外設定路由（React Router）
- 缺少後端整合能力

#### Next.js Pages Router

**優點**:
- SSR/SSG 支援
- 檔案系統路由
- API Routes
- 成熟穩定

**缺點**:
- 舊架構，逐漸被 App Router 取代
- 缺少新功能（Server Components, Server Actions）

#### Next.js App Router (選用方案)

**優點**:
- React Server Components
- Server Actions（可以減少或取代傳統 API）
- 改進的路由系統
- 更好的資料獲取模式
- 內建 loading 和 error 處理
- 更好的效能
- 未來的標準

**缺點**:
- 較新，某些第三方套件可能不完全支援
- 學習曲線較陡
- 心智模型轉換（Server vs Client Components）

**為什麼選擇 App Router**:
1. 未來的標準，值得投資學習
2. Server Actions 可以簡化某些場景的開發
3. 更好的開發體驗
4. 雖然有 NestJS 後端，但某些簡單操作可以用 Server Actions

**結論**: 雖然有學習成本，但 App Router 是未來趨勢，值得投資。

---

## Monorepo 工具選擇

### Turborepo vs Nx vs Lerna vs pnpm workspaces

#### Lerna

**優點**:
- 老牌工具，社群大
- 功能成熟

**缺點**:
- 維護活躍度降低
- 效能不如新工具
- 配置較複雜

#### pnpm workspaces

**優點**:
- 內建於 pnpm
- 節省磁碟空間
- 快速

**缺點**:
- 只處理依賴管理
- 沒有建置快取和編排功能
- 需要手動管理建置順序

#### Nx

**優點**:
- 功能最強大
- 完整的建置快取和分散式任務執行
- 內建程式碼生成器
- 視覺化依賴圖
- 支援多種框架

**缺點**:
- 學習曲線陡峭
- 配置複雜
- 對簡單專案來說過度設計

#### Turborepo (選用方案)

**優點**:
- 簡單易用
- 智慧快取（本地和遠端）
- 並行任務執行
- 設定簡單（主要是 `turbo.json`）
- 效能優異
- Vercel 支援

**缺點**:
- 功能不如 Nx 完整
- 較新的工具

**為什麼選擇 Turborepo**:
1. 簡單夠用，不過度複雜
2. 配置清晰
3. 效能好
4. 與 Vercel 整合良好
5. 學習曲線平緩

**結論**: 對我們的需求來說，Turborepo 提供了最佳平衡。

---

## 部署方案對比

### 前端部署

#### Vercel vs Netlify vs AWS Amplify

| 特性 | Vercel | Netlify | AWS Amplify |
|------|--------|---------|-------------|
| Next.js 支援 | ⭐⭐⭐⭐⭐ (原生) | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 免費額度 | 慷慨 | 慷慨 | 有限 |
| 自動部署 | ✅ | ✅ | ✅ |
| Edge Functions | ✅ | ✅ | ✅ |
| 學習曲線 | 簡單 | 簡單 | 中等 |
| 價格 | 合理 | 合理 | 較貴 |

**結論**: Vercel 是 Next.js 的最佳選擇（Vercel 就是 Next.js 的開發公司）。

---

### 後端部署

#### Railway vs Render vs Fly.io vs Heroku vs VPS

| 特性 | Railway | Render | Fly.io | Heroku | VPS |
|------|---------|--------|---------|--------|-----|
| 免費額度 | $5 credit | 750h/月（會睡眠） | 有限 | ❌ 已取消 | ❌ |
| 部署難度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| 冷啟動 | 無 | 有（免費版） | 無 | - | 無 |
| 資料庫 | 內建 | 內建 | 需額外設定 | 附加元件 | 自己安裝 |
| 學習曲線 | 簡單 | 簡單 | 中等 | 簡單 | 困難 |
| 適合小專案 | ✅ | ✅ | ✅ | ✅ | ❌ |

**結論**: Railway 提供最佳的開發體驗和免費額度平衡。

---

## 技術棧總結

### 最終選擇

```
Frontend:  Next.js 15 (App Router) + TypeScript
Backend:   NestJS + TypeScript
Database:  Supabase PostgreSQL
ORM:       Prisma
Auth:      Supabase Auth
Monorepo:  Turborepo
Deploy:    Vercel (前端) + Railway (後端)
```

### 為什麼這個組合好？

1. **全 TypeScript 棧**: 前後端共享類型，減少錯誤
2. **現代化**: 都是目前最新最好的工具
3. **學習價值**: 企業級架構，對職涯有幫助
4. **開發體驗**: 工具鏈成熟，開發效率高
5. **部署簡單**: 都支援 Git push 自動部署
6. **成本低**: 開發階段幾乎免費
7. **社群支援**: 都有活躍的社群和豐富的資源

### 學習路徑

```
階段 1: 熟悉基礎工具
→ TypeScript
→ React/Next.js 基礎
→ Node.js 基礎

階段 2: 學習框架特性
→ NestJS 核心概念（DI, Modules, Guards）
→ Next.js App Router 特性
→ Prisma 使用

階段 3: 整合與實踐
→ Supabase Auth 整合
→ 前後端通訊
→ 部署流程

階段 4: 進階優化
→ 效能優化
→ 測試
→ CI/CD
```

---

## 對比表格總結

### 複雜度 vs 價值

| 技術 | 學習成本 | 開發效率 | 維護性 | 職涯價值 | 推薦度 |
|------|---------|---------|--------|---------|--------|
| NestJS | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Express | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Prisma | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| TypeORM | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Supabase Auth | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 自建 Auth | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |

---

這份文檔提供了完整的技術選型理由和對比，幫助未來回顧當初的決策邏輯。
