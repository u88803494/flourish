# 專案討論記錄

**日期**: 2025年1月（實際日期根據系統時間）
**參與者**: Henry Lee
**目的**: 規劃並建立一個 monorepo 全端應用專案

---

## 專案背景與目標

### 核心需求
1. **記帳應用**: 個人財務管理工具，支援收支記錄、分類管理、統計報表
2. **曲線圖工具**: 基於山達基概念的統計曲線工具，用於狀況公式分析
3. **工具整合**: 記帳數據可導向曲線圖工具進行深度分析

### 學習目標
- 深入理解現代化全端架構（前後端分離）
- 學習 monorepo 管理與最佳實踐
- 採用敏捷開發流程（SDLC）
- 實踐規格書驅動開發（Specification-Driven Development）

### 技術背景
- 第一份工作：全端開發，使用 Express.js + TypeScript（體驗不佳）
- 最後一份工作：後端使用 NestJS（看過程式碼但未實際開發）
- 有 FastAPI、React、Next.js 相關經驗
- 熟悉現代前端開發工具鏈

---

## 技術架構決策

### Monorepo 管理
- **工具**: Turborepo
- **理由**: 
  - 維護單一程式碼來源
  - 共享設定檔（ESLint, TypeScript）
  - 簡化開發流程
  - 支援多應用和套件管理

### 前端技術棧
- **框架**: Next.js (App Router)
- **語言**: TypeScript
- **UI**: 待定（可能使用 Tailwind CSS + DaisyUI）
- **狀態管理**: 待定（可能使用 React Query 或 Zustand）

### 後端技術棧
- **框架**: NestJS
- **選擇理由**:
  - 原生 TypeScript 支援，解決 Express + TS 的痛點
  - 內建依賴注入（DI）
  - 裝飾器語法讓程式碼更清晰
  - 自動請求驗證和錯誤處理
  - 強制良好的架構模式（模組化、關注點分離）
  - 適合學習企業級架構

### 資料庫與 ORM
- **資料庫**: Supabase PostgreSQL
- **ORM**: Prisma
- **選擇理由**:
  - Prisma 提供完整的 TypeScript 類型支援
  - 自動生成的 client，類型安全
  - 易於維護的 schema 定義
  - 內建 migration 工具

### 身份驗證
- **服務**: Supabase Auth
- **整合方式**:
  - **前端 (Next.js)**: 使用 `@supabase/supabase-js` 處理註冊/登入
  - **後端 (NestJS)**: 只負責驗證 JWT token，不簽發 token
  - **流程**: 
    1. 使用者在 Next.js 前端登入 → Supabase Auth 簽發 JWT
    2. 前端請求帶上 JWT → NestJS 驗證 token 有效性
    3. NestJS 透過 Passport JWT Strategy 自動處理驗證

### 部署策略
- **Next.js 前端**: Vercel（免費，自動部署，最佳化）
- **NestJS 後端**: Railway（免費額度，不睡眠，簡單部署）
- **Supabase**: 使用官方雲端服務（免費方案）
- **預估成本**: 開發階段 $0/月，上線後 $5-35/月

---

## 專案結構設計

### Monorepo 結構
```
flowmetrics/  (暫定名稱，或其他待決定)
├── docs/                          # 📚 所有文檔
│   ├── 00-project-overview.md     # 專案總覽
│   ├── 01-architecture/           # 架構文檔
│   │   ├── system-design.md
│   │   ├── tech-stack.md
│   │   ├── data-flow.md
│   │   └── deployment.md
│   ├── 02-specifications/         # 規格書（核心）
│   │   ├── user-stories.md
│   │   ├── api-specs.md
│   │   ├── database-schema.md
│   │   └── auth-flow.md
│   ├── 03-sprints/                # 敏捷 Sprint 規劃
│   │   ├── sprint-0.md
│   │   ├── sprint-1.md
│   │   └── ...
│   ├── 04-development/            # 開發文檔
│   │   ├── setup-guide.md
│   │   ├── coding-standards.md
│   │   └── git-workflow.md
│   └── 05-decisions/              # 技術決策記錄 (ADR)
│       ├── 001-use-nestjs.md
│       ├── 002-supabase-auth.md
│       ├── 003-monorepo-structure.md
│       └── ...
├── apps/
│   ├── ledger/                    # 💰 記帳應用 (Next.js)
│   ├── curves/                    # 📈 曲線圖工具 (Next.js)
│   ├── web-portal/                # 🏠 主入口網站（可選）
│   └── api/                       # 🔧 共享後端 (NestJS)
├── packages/
│   ├── database/                  # 🗄️ Prisma schemas & client
│   ├── auth/                      # 🔐 Supabase auth wrapper
│   ├── chart-engine/              # 📊 曲線圖核心邏輯
│   ├── ui/                        # 🎨 共享 UI 元件
│   ├── types/                     # 📝 共享 TypeScript 類型
│   ├── typescript-config/         # ⚙️ 共享 TS 設定
│   └── eslint-config/             # ⚙️ 共享 ESLint 設定
├── .gitignore
├── turbo.json
├── package.json
└── README.md
```

### 模組化設計重點

#### `packages/chart-engine`
- 曲線圖的核心邏輯，可被多個應用使用
- 包含狀況公式計算、曲線繪製、趨勢分析等功能
- `apps/curves` 完整使用所有功能
- `apps/ledger` 使用部分功能（如基本圖表顯示）

#### `packages/database`
- 集中管理 Prisma schema
- 生成的 Prisma Client 供所有應用使用
- Migration 統一管理

#### `packages/auth`
- 封裝 Supabase Auth 相關邏輯
- 提供統一的認證介面給前後端使用

---

## 資料流設計

### 記帳應用 ↔ 曲線圖工具整合

**方式 1: 嵌入式整合（推薦用於基本功能）**
```
記帳 App 內嵌 chart-engine package
→ 直接顯示基本圖表（收支趨勢、分類統計等）
→ 如需完整分析，提供「進階分析」按鈕跳轉到曲線圖 App
```

**方式 2: 資料匯出/匯入**
```
記帳 App → 匯出數據 API → 曲線圖 App 接收並分析
```

**方式 3: 共享資料庫（如果需要即時同步）**
```
記帳 App 寫入 → 共享資料庫 ← 曲線圖 App 讀取
→ 需要考慮資料隔離和權限控制
```

---

## Sprint 規劃

### Sprint 0: 專案設置（預計 1 週）
**目標**: 建立完整的 monorepo 基礎架構

**任務**:
- [ ] 建立 Turborepo monorepo 結構
- [ ] 設定 Next.js 前端應用 (ledger, curves)
- [ ] 設定 NestJS 後端應用
- [ ] 設定 Prisma + Supabase 連接
- [ ] 設定共享的 TypeScript 和 ESLint 配置
- [ ] 撰寫基礎文檔（README, 開發指南）
- [ ] 建立 Git repository 並進行首次提交

**完成標準**:
- 所有應用可以在本地啟動
- Turbo 指令可以正常運行（build, dev, lint）
- 文檔完整且清晰

### Sprint 1: 認證系統（預計 1-2 週）
**目標**: 實現完整的使用者認證流程

**任務**:
- [ ] Supabase 專案設定與配置
- [ ] Next.js 整合 Supabase Auth
- [ ] 實作註冊頁面
- [ ] 實作登入頁面
- [ ] NestJS 實作 JWT 驗證 (Passport Strategy)
- [ ] 實作 SupabaseAuthGuard
- [ ] 前端實作 Protected Routes
- [ ] 撰寫認證流程文檔

**完成標準**:
- 使用者可以註冊和登入
- JWT token 正確傳遞和驗證
- 未登入使用者無法存取受保護頁面
- NestJS API 正確驗證請求

### Sprint 2: 記帳應用 - 交易 CRUD（預計 1-2 週）
**目標**: 實現基本的交易記錄功能

**任務**:
- [ ] 設計 Prisma schema (Transaction, Category)
- [ ] 執行資料庫 migration
- [ ] NestJS 實作 TransactionModule (Controller, Service)
- [ ] 實作交易 CRUD API
- [ ] Next.js 實作交易列表頁面
- [ ] 實作新增交易表單
- [ ] 實作編輯/刪除功能
- [ ] 加入基本的表單驗證
- [ ] 撰寫 API 規格文檔

**完成標準**:
- 使用者可以新增、查看、編輯、刪除交易記錄
- 資料正確儲存到資料庫
- 表單驗證正常運作
- API 文檔完整

### Sprint 3: 分類管理與基本統計（預計 1-2 週）
**目標**: 實現分類管理和基本報表功能

**任務**:
- [ ] 實作分類 CRUD API
- [ ] 前端實作分類管理介面
- [ ] 實作交易分類功能
- [ ] 實作基本統計 API (總收入、總支出、淨收入)
- [ ] 前端顯示統計數據
- [ ] 整合 chart-engine 顯示基本圖表
- [ ] 實作日期範圍篩選

**完成標準**:
- 使用者可以管理自己的分類
- 交易可以關聯到分類
- 顯示基本的統計數據和圖表

### Sprint 4+: 待規劃
- 曲線圖工具整合
- 進階報表與分析
- 預算管理
- 多帳戶支援
- 定期交易
- 匯出/匯入功能

---

## 技術決策記錄 (ADR)

### ADR-001: 選擇 NestJS 作為後端框架

**決策**: 使用 NestJS 而非 Express.js

**理由**:
1. **治癒 Express + TS 的痛苦經驗**
   - Express 不是為 TypeScript 原生設計
   - 需要大量手動型別標註
   - 缺乏結構化，容易變成義大利麵條式程式碼

2. **NestJS 的優勢**
   - 原生 TypeScript 支援
   - 內建依賴注入
   - 裝飾器語法清晰（`@Get()`, `@Post()`, `@UseGuards()` 等）
   - 自動請求驗證和錯誤處理
   - 強制良好的架構模式

3. **學習價值**
   - 企業級應用常用框架
   - 學習依賴注入和模組化設計
   - 對職涯發展有幫助

4. **已有相關經驗**
   - 在上一份工作看過 NestJS 程式碼
   - 有基本概念，學習曲線相對平緩

**替代方案**:
- Express.js: 太痛苦，不考慮
- Next.js Server Actions: 簡單但缺乏後端架構學習價值
- FastAPI (Python): 不符合全 TypeScript 技術棧的目標

**後果**:
- 需要學習依賴注入和裝飾器概念
- 初期設定可能比 Express 複雜
- 長期維護性和可擴展性更好

---

### ADR-002: 使用 Supabase Auth 處理身份驗證

**決策**: 使用 Supabase Auth，NestJS 只負責驗證 JWT

**理由**:
1. **關注點分離**
   - Supabase Auth 專門處理使用者管理（註冊、登入、密碼重設）
   - NestJS 專注於商業邏輯
   - 前端直接與 Supabase Auth 互動，減少後端負擔

2. **減少開發時間**
   - 不需要自己實作使用者管理系統
   - 不需要處理密碼加密、Email 驗證等細節
   - Supabase 提供完整的 Auth UI 元件

3. **安全性**
   - Supabase 是專業的 Auth 服務
   - 定期更新和安全性修補
   - 符合業界標準

4. **與 Supabase PostgreSQL 整合**
   - 已經使用 Supabase 作為資料庫
   - Auth 和資料庫在同一個平台，方便管理

**架構**:
```
使用者 → Next.js → Supabase Auth (登入/註冊) → 取得 JWT
使用者 → Next.js → NestJS API (帶 JWT) → 驗證 JWT → 處理商業邏輯
```

**NestJS 的角色**:
- 不簽發 token
- 只驗證 token 的有效性
- 從 token 提取使用者資訊
- 作為「資源伺服器」(Resource Server)

**替代方案**:
- 自己實作 JWT 認證: 太複雜，容易出錯
- Passport Local Strategy: 需要自己管理使用者密碼
- Auth0: 功能強大但可能過度

**後果**:
- 依賴 Supabase 服務（vendor lock-in 風險）
- 需要理解 JWT 驗證流程
- 無法完全客製化認證邏輯

---

### ADR-003: 採用 Monorepo 架構

**決策**: 使用 Turborepo 管理 monorepo

**理由**:
1. **多應用管理**
   - 記帳應用和曲線圖工具需要共享程式碼
   - 未來可能有更多工具加入

2. **程式碼共享**
   - 共享 TypeScript 類型定義
   - 共享 UI 元件
   - 共享驗證邏輯和工具函式

3. **統一開發體驗**
   - 單一 ESLint 和 TypeScript 配置
   - 統一的建置和測試流程
   - 簡化依賴管理

4. **Turborepo 的優勢**
   - 智慧快取，加速建置
   - 並行執行任務
   - 簡單的配置

**替代方案**:
- 多個獨立 repo: 難以共享程式碼，重複工作多
- Lerna: 功能類似但較舊，社群活躍度降低
- Nx: 功能更強大但學習曲線陡峭，可能過度

**後果**:
- 初期設定較複雜
- 需要學習 Turborepo 的概念
- 長期維護成本更低

---

## 專案命名討論

### 候選名稱與評估

#### `ledger-app`
- ✅ 簡潔專業
- ✅ 清楚表達用途
- ❌ 只適合記帳應用，不涵蓋曲線圖工具

#### `cashflow`
- ✅ 一個詞，簡潔
- ✅ 財務領域常見術語
- ❌ 也是只適合記帳

#### `flowmetrics`
- ✅ 涵蓋兩個工具（flow = 金流，metrics = 統計指標）
- ✅ 專業且有延展性
- ✅ 一個詞，好記
- ⚠️ 可能稍微抽象

#### `stat-tools` / `data-studio`
- ✅ 通用平台名稱
- ⚠️ 過於泛用，缺乏特色

#### `henry-tools` / `personal-toolkit`
- ✅ 非常通用，未來加什麼工具都合理
- ⚠️ 較不專業（如果要給別人看）

### 最終決定
**待定** - 在開始建立專案時確認

---

## NestJS 核心概念速查

### 裝飾器的魔法

**Controller 裝飾器**:
```typescript
@Controller('transactions')  // 定義路由前綴
@UseGuards(AuthGuard)        // 整個 Controller 都需要驗證
export class TransactionsController {
  
  @Get()                     // GET /transactions
  @UseGuards(AuthGuard)      // 只這個方法需要驗證
  findAll(@User() user) { }  // 自訂裝飾器提取 user
  
  @Post()                    // POST /transactions
  create(@Body() dto: CreateDto) { }  // 自動驗證 body
  
  @Get(':id')                // GET /transactions/:id
  findOne(@Param('id') id: string) { }  // 提取路由參數
}
```

**相比 Express 的優勢**:
- 不需要手動提取 token
- 不需要每個 route 寫 try-catch
- 不需要手動驗證請求資料
- 型別安全，IDE 自動提示

### 依賴注入範例

```typescript
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}  // 自動注入
  
  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId }
    });
  }
}

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionsService) {}  // 自動注入
  
  @Get()
  findAll(@User() user) {
    return this.service.findAll(user.id);
  }
}
```

---

## 開發流程規範

### Git Workflow
- 主分支: `main`
- 開發分支: `develop`
- 功能分支: `feature/sprint-X-feature-name`
- 修復分支: `fix/bug-description`

### Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文檔更新
- `style`: 格式調整（不影響程式碼邏輯）
- `refactor`: 重構
- `test`: 測試
- `chore`: 建置或工具調整

**範例**:
```
feat(ledger): add transaction creation API

- Implement TransactionController and TransactionService
- Add Prisma schema for Transaction model
- Add validation using class-validator

Closes #12
```

### 文檔維護
- 每個 Sprint 開始前更新 Sprint 文檔
- 技術決策必須記錄 ADR
- API 變更必須更新 API 規格文檔
- 重要討論和決策記錄在相應的 markdown 文件中

---

## 最終命名決策

### Monorepo 名稱: `flourish` 🌱
**含義**: 興盛繁榮  
**理念**: 基於山達基的核心概念「Flourishing」，代表透過正確的追蹤和分析，讓生活各方面都能興盛發展

### 應用程式命名

#### `flow` 💰
**含義**: 流動  
**用途**: 記帳應用  
**理念**: 金錢就是流動（山達基概念），透過記帳讓財務健康流動，創造富足

#### `apex` 📈
**含義**: 頂點、巔峰  
**用途**: 曲線圖統計工具  
**理念**: 追蹤統計曲線的頂點，幫助達到權勢狀況（Power Condition），實現最高表現

#### `api` 🔧
**用途**: 後端 API 服務（NestJS）  
**理念**: 保持實用主義，清楚明瞭的技術名稱

### 品牌故事
> **Flourish** 是一個整合式的個人成長平台，致力於幫助你在財務和表現上達到真正的興盛繁榮。
> 
> 透過 **Flow**，你可以追蹤和管理財務，讓金錢健康地流動，創造富足。
> 
> 透過 **Apex**，你可以繪製統計曲線，追蹤表現的頂點，持續向上攀升。
> 
> 當金錢流動、統計上升，一切都將 **Flourish**（興盛繁榮）。

---

## 開發工具鏈決策

### 已確定要使用的工具

1. **Prettier** - 程式碼格式化
   - 統一格式，不用手動調整
   - 整個 monorepo 一致性

2. **ESLint** - 程式碼品質檢查
   - Turborepo 已提供基礎配置
   - 捕捉潛在錯誤和不良寫法

3. **TypeScript** - 靜態型別檢查
   - Turborepo 已提供基礎配置
   - 減少執行時錯誤

4. **Husky** - Git Hooks 管理
   - 自動化檢查流程
   - commit 前自動執行檢查

5. **lint-staged** - 只檢查暫存檔案
   - 提升檢查速度
   - 只修復改動的檔案

6. **commitlint** - Commit Message 規範
   - 統一提交訊息格式
   - 遵循 Conventional Commits
   - 方便生成 CHANGELOG

### 保留的官方 Packages

- `packages/typescript-config/` - 共享 TypeScript 設定
- `packages/eslint-config/` - 共享 ESLint 規則
- `packages/ui/` - 共享 UI 元件

### 新增的 Packages

- `packages/database/` - Prisma schema 和 client
- `packages/chart-engine/` - 曲線圖核心邏輯

詳細的開發工具鏈規劃請參考：`05-dev-tooling-plan.md`

---

## 下一步行動

1. ✅ 完成討論記錄文檔
2. ✅ 確定最終專案名稱（flourish）
3. ✅ 確定應用程式命名（flow, apex, api）
4. ✅ 規劃開發工具鏈（Prettier, Husky, lint-staged, commitlint）
5. ⏳ 建立 Turborepo monorepo 結構（Sprint 0.1 - 今晚）
6. ⏳ 設定開發工具鏈（Sprint 0.2-0.4 - 之後）
7. ⏳ 設定 Prisma（Sprint 0.5）
8. ⏳ 建立 NestJS 應用（Sprint 0.6）
9. ⏳ 建立 apex 應用（Sprint 0.7）
10. ⏳ 開始 Sprint 1: 認證系統

---

## 附註

這份文檔記錄了專案從概念到架構設計的完整討論過程。所有的技術決策都有清楚的理由和權衡考量。

**重要提醒**:
- 這是一個學習導向的專案，重點在於理解架構和最佳實踐
- 採用敏捷開發，可以根據實際情況調整計畫
- 規格書驅動開發，確保每個功能都有清楚的定義
- 所有討論和決策都應該記錄在文檔中

**專案哲學**:
> "從痛苦的 Express + TS 經驗中學習，透過 NestJS 的優雅設計獲得治癒，最終建立一個自己真正理解和掌控的全端應用。"
