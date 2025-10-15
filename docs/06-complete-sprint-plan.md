# 完整的 Sprint 規劃

本文檔整合了專案從零到可開發的完整 Sprint 規劃，包含基礎架構、開發工具鏈和功能開發。

---

## 📋 Sprint 總覽

### Phase 0: 專案基礎建設（預計 1-2 週）

| Sprint | 名稱 | 時間 | 重要性 | 狀態 |
|--------|------|------|--------|------|
| 0.1 | Monorepo 基礎架構 | 20分鐘 | ⭐⭐⭐⭐⭐ | ⏳ 準備執行 |
| 0.2 | Prettier 設定 | 15分鐘 | ⭐⭐⭐⭐⭐ | 📦 待執行 |
| 0.3 | Husky + lint-staged | 20分鐘 | ⭐⭐⭐⭐⭐ | 📦 待執行 |
| 0.4 | commitlint 設定 | 15分鐘 | ⭐⭐⭐⭐ | 📦 待執行 |
| 0.5 | Prisma 設定 | 30分鐘 | ⭐⭐⭐⭐⭐ | 📦 待執行 |
| 0.6 | NestJS 應用建立 | 1小時 | ⭐⭐⭐⭐⭐ | 📦 待執行 |
| 0.7 | Apex 應用建立 | 30分鐘 | ⭐⭐⭐⭐ | 📦 待執行 |

### Phase 1: 核心功能開發（預計 4-6 週）

| Sprint | 名稱 | 時間 | 狀態 |
|--------|------|------|------|
| 1 | 認證系統 | 1-2週 | 📦 待執行 |
| 2 | 記帳 CRUD | 1-2週 | 📦 待執行 |
| 3 | 分類與統計 | 1-2週 | 📦 待執行 |
| 4 | 曲線圖基礎 | 1-2週 | 📦 待執行 |

---

## 🎯 Sprint 0.1: Monorepo 基礎架構

**時間**: 20 分鐘  
**目標**: 建立 Turborepo monorepo 基礎結構，確立專案架構  
**狀態**: ⏳ 準備執行（今晚）

### 任務清單

- [ ] 使用 Turborepo basic 範例建立專案
  ```bash
  cd /Users/henry_lee/Developer/Personal
  pnpm dlx create-turbo@latest flourish
  ```

- [ ] 檢查並理解生成的結構
  - 查看 `turbo.json`
  - 查看 `package.json`
  - 查看 `pnpm-workspace.yaml`
  - 理解 `packages/` 的作用

- [ ] 重新命名 apps/web → apps/flow
  ```bash
  mv apps/web apps/flow
  # 編輯 apps/flow/package.json
  # 將 "name": "web" 改成 "name": "flow"
  ```

- [ ] 建立預留目錄結構
  ```bash
  mkdir -p apps/apex apps/api
  mkdir -p packages/database packages/chart-engine
  mkdir -p docs
  
  # 建立 .gitkeep 讓空目錄可被 git 追蹤
  touch apps/apex/.gitkeep
  touch apps/api/.gitkeep
  touch packages/database/.gitkeep
  touch packages/chart-engine/.gitkeep
  ```

- [ ] 複製文檔到專案
  ```bash
  cp ../project-planning/*.md docs/
  ```

- [ ] 建立專案 README.md
  - 專案簡介（Flourish 是什麼）
  - 專案願景和理念
  - 技術棧
  - 目錄結構說明
  - 開發指南（預留）

- [ ] 測試基本功能
  ```bash
  pnpm dev
  # 訪問 http://localhost:3000 確認 flow app 可運行
  ```

- [ ] Git 初始化與首次提交
  ```bash
  git add .
  git commit -m "chore: initialize flourish monorepo with turborepo

- Set up Turborepo with pnpm workspace
- Rename default web app to flow
- Create directory structure for apex and api apps
- Add comprehensive project documentation
- Establish foundation for future development"
  ```

### 完成標準

- ✅ Turborepo monorepo 成功建立
- ✅ 目錄結構完整（apps/, packages/, docs/）
- ✅ flow app 可以正常啟動
- ✅ 文檔已放入 docs/ 目錄
- ✅ README.md 清楚說明專案
- ✅ Git 已初始化並完成首次提交

### 輸出結果

```
flourish/
├── apps/
│   ├── flow/          # ✅ Next.js app (已運行)
│   ├── apex/          # 📦 預留
│   └── api/           # 📦 預留
├── packages/
│   ├── ui/            # ✅ 官方共享 UI
│   ├── typescript-config/ # ✅ TS 設定
│   ├── eslint-config/ # ✅ ESLint 設定
│   ├── database/      # 📦 預留
│   └── chart-engine/  # 📦 預留
├── docs/              # ✅ 完整文檔
├── turbo.json         # ✅ 已配置
├── package.json       # ✅ Workspace 設定
├── pnpm-workspace.yaml
└── README.md          # ✅ 專案說明
```

---

## 🎨 Sprint 0.2: Prettier 設定

**時間**: 15 分鐘  
**目標**: 設定 Prettier 自動格式化，統一程式碼風格  
**優先級**: P1（高優先）  
**前置需求**: Sprint 0.1 完成

### 任務清單

- [ ] 安裝 Prettier
  ```bash
  pnpm add -D -w prettier
  ```

- [ ] 建立 `.prettierrc` 配置檔
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false,
    "arrowParens": "always",
    "endOfLine": "lf"
  }
  ```

- [ ] 建立 `.prettierignore`
  ```
  node_modules/
  .pnpm-store/
  dist/
  build/
  .next/
  .turbo/
  *.generated.*
  .prisma/
  *.log
  .DS_Store
  ```

- [ ] 在根目錄 package.json 加入 scripts
  ```json
  {
    "scripts": {
      "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
      "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
    }
  }
  ```

- [ ] 執行首次格式化
  ```bash
  pnpm format
  ```

- [ ] 測試格式檢查
  ```bash
  pnpm format:check
  ```

- [ ] Git commit
  ```bash
  git add .
  git commit -m "chore: add prettier for code formatting"
  ```

### 學習重點

- 理解 Prettier 的作用（格式化 vs linting）
- 理解配置選項的意義
- 體驗自動格式化的便利性

### 完成標準

- ✅ Prettier 已安裝
- ✅ 配置檔已建立
- ✅ 所有現有程式碼已格式化
- ✅ 可以執行 `pnpm format` 指令

---

## 🪝 Sprint 0.3: Husky + lint-staged 設定

**時間**: 20 分鐘  
**目標**: 設定 Git hooks，在 commit 前自動檢查和格式化程式碼  
**優先級**: P1（高優先）  
**前置需求**: Sprint 0.2 完成

### 任務清單

- [ ] 安裝 Husky 和 lint-staged
  ```bash
  pnpm add -D -w husky lint-staged
  ```

- [ ] 初始化 Husky
  ```bash
  npx husky install
  ```

- [ ] 在 package.json 加入 prepare script
  ```json
  {
    "scripts": {
      "prepare": "husky install"
    }
  }
  ```

- [ ] 建立 `.lintstagedrc` 配置
  ```json
  {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
  ```

- [ ] 建立 pre-commit hook
  ```bash
  npx husky add .husky/pre-commit "npx lint-staged"
  ```

- [ ] 測試 pre-commit hook
  - 修改一個檔案
  - 嘗試 commit
  - 確認自動執行格式化和 lint

- [ ] Git commit
  ```bash
  git add .
  git commit -m "chore: add husky and lint-staged for pre-commit checks"
  ```

### 學習重點

- 理解 Git hooks 的運作原理
- 理解 lint-staged 只檢查 staged 檔案的優勢
- 體驗自動化檢查的流程

### 完成標準

- ✅ Husky 已安裝並初始化
- ✅ lint-staged 已配置
- ✅ pre-commit hook 正常運作
- ✅ commit 前會自動格式化和 lint

---

## 📝 Sprint 0.4: commitlint 設定

**時間**: 15 分鐘  
**目標**: 規範 commit message 格式，遵循 Conventional Commits  
**優先級**: P2（中優先）  
**前置需求**: Sprint 0.3 完成

### 任務清單

- [ ] 安裝 commitlint
  ```bash
  pnpm add -D -w @commitlint/cli @commitlint/config-conventional
  ```

- [ ] 建立 `commitlint.config.js`
  ```javascript
  module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',     // 新功能
          'fix',      // 修復 bug
          'docs',     // 文檔變更
          'style',    // 格式調整
          'refactor', // 重構
          'perf',     // 效能優化
          'test',     // 測試
          'chore',    // 建置或工具變更
          'revert',   // 撤銷
          'wip',      // 進行中
        ],
      ],
      'subject-case': [0],
    },
  };
  ```

- [ ] 建立 commit-msg hook
  ```bash
  npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
  ```

- [ ] 測試 commit message 檢查
  - 嘗試不符合規範的 commit（應該失敗）
  - 嘗試符合規範的 commit（應該成功）

- [ ] Git commit
  ```bash
  git add .
  git commit -m "chore: add commitlint for commit message validation"
  ```

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**範例**:
```
feat(flow): add transaction list page
fix(apex): resolve chart rendering issue
docs: update README with setup instructions
chore(deps): upgrade next.js to 15.0.0
```

### 學習重點

- 理解 Conventional Commits 規範
- 理解規範化 commit 的好處（生成 CHANGELOG、語義化版本等）
- 養成良好的 commit 習慣

### 完成標準

- ✅ commitlint 已安裝
- ✅ commit-msg hook 正常運作
- ✅ 不符合規範的 commit 會被拒絕
- ✅ 理解 commit 格式規範

---

## 🗄️ Sprint 0.5: Prisma 設定

**時間**: 30 分鐘  
**目標**: 在 monorepo 中設定 Prisma，建立共享的 database package  
**優先級**: P0（最高優先，開發必需）  
**前置需求**: Sprint 0.1 完成

### 任務清單

- [ ] 初始化 database package
  ```bash
  cd packages/database
  pnpm init
  ```

- [ ] 安裝 Prisma
  ```bash
  cd packages/database
  pnpm add @prisma/client
  pnpm add -D prisma
  ```

- [ ] 初始化 Prisma
  ```bash
  npx prisma init
  ```

- [ ] 建立基本的 schema
  ```prisma
  // packages/database/prisma/schema.prisma
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
  }
  ```

- [ ] 建立 database package 的 index.ts
  ```typescript
  // packages/database/src/index.ts
  export * from '@prisma/client';
  export { PrismaClient } from '@prisma/client';
  ```

- [ ] 設定 package.json
  ```json
  {
    "name": "@repo/database",
    "version": "0.0.0",
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "scripts": {
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:studio": "prisma studio"
    }
  }
  ```

- [ ] 更新 turbo.json 加入 Prisma 任務
  ```json
  {
    "pipeline": {
      "db:generate": {
        "cache": false
      },
      "dev": {
        "dependsOn": ["^db:generate"]
      },
      "build": {
        "dependsOn": ["^db:generate", "^build"]
      }
    }
  }
  ```

- [ ] 建立 Supabase 專案（或本地 PostgreSQL）
  - 訪問 https://supabase.com
  - 建立新專案
  - 取得連接字串

- [ ] 設定環境變數
  ```bash
  # packages/database/.env
  DATABASE_URL="postgresql://..."
  ```

- [ ] 執行首次 migration
  ```bash
  cd packages/database
  pnpm db:push
  ```

- [ ] 測試 Prisma Studio
  ```bash
  pnpm db:studio
  ```

- [ ] 讓 flow app 使用 database package
  ```bash
  cd apps/flow
  pnpm add @repo/database
  ```

- [ ] Git commit
  ```bash
  git add .
  git commit -m "feat(database): set up prisma with shared database package"
  ```

### 學習重點

- 理解 Prisma 在 monorepo 中的架構
- 理解如何共享 Prisma Client
- 理解 workspace dependencies
- 學習 Prisma schema 語法
- 學習 migration 流程

### 完成標準

- ✅ Prisma 已設定在 packages/database
- ✅ 基本 schema 已建立
- ✅ 可以執行 Prisma generate
- ✅ database package 可被其他 apps 使用
- ✅ Turbo 的 pipeline 已更新

---

## 🔧 Sprint 0.6: NestJS 應用建立

**時間**: 1 小時  
**目標**: 建立 NestJS API 應用，整合 Prisma  
**優先級**: P0（最高優先，開發必需）  
**前置需求**: Sprint 0.5 完成

### 任務清單

- [ ] 使用 NestJS CLI 建立應用
  ```bash
  cd apps
  npx @nestjs/cli new api
  # 選擇 pnpm
  ```

- [ ] 調整 package.json
  ```json
  {
    "name": "api",
    "version": "0.0.0",
    "scripts": {
      "dev": "nest start --watch",
      "build": "nest build",
      "start": "node dist/main"
    }
  }
  ```

- [ ] 安裝必要套件
  ```bash
  cd apps/api
  pnpm add @repo/database
  pnpm add @nestjs/config @nestjs/passport passport passport-jwt @nestjs/jwt
  pnpm add class-validator class-transformer
  pnpm add -D @types/passport-jwt
  ```

- [ ] 建立 Prisma Module
  ```typescript
  // apps/api/src/prisma/prisma.module.ts
  // apps/api/src/prisma/prisma.service.ts
  ```

- [ ] 設定環境變數
  ```bash
  # apps/api/.env
  DATABASE_URL="postgresql://..."
  PORT=3001
  ```

- [ ] 測試 NestJS 啟動
  ```bash
  pnpm dev
  # 訪問 http://localhost:3001
  ```

- [ ] 更新根目錄的 turbo.json
  ```json
  {
    "pipeline": {
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }
  ```

- [ ] 測試從根目錄啟動所有 apps
  ```bash
  pnpm dev
  # flow (3000), api (3001) 應該都啟動
  ```

- [ ] Git commit
  ```bash
  git add .
  git commit -m "feat(api): set up nestjs backend with prisma integration"
  ```

### 學習重點

- 理解 NestJS 的專案結構
- 理解如何在 NestJS 中使用 Prisma
- 理解 monorepo 中多個 dev server 的管理
- 學習 NestJS 的基本概念（Module, Controller, Service）

### 完成標準

- ✅ NestJS 應用已建立在 apps/api
- ✅ Prisma 已整合
- ✅ 可以從根目錄啟動所有應用
- ✅ API 在 http://localhost:3001 運行
- ✅ 基本的健康檢查 endpoint 可用

---

## 📈 Sprint 0.7: Apex 應用建立

**時間**: 30 分鐘  
**目標**: 建立第二個 Next.js 應用（曲線圖工具）  
**優先級**: P1（中高優先）  
**前置需求**: Sprint 0.1 完成

### 任務清單

- [ ] 複製 flow 的設定或使用 create-next-app
  ```bash
  cd apps
  pnpm create next-app@latest apex
  # TypeScript: Yes
  # ESLint: Yes
  # Tailwind: Yes
  # App Router: Yes
  # Import alias: @/*
  ```

- [ ] 調整 package.json
  ```json
  {
    "name": "apex",
    "version": "0.0.0",
    "scripts": {
      "dev": "next dev -p 3002",
      "build": "next build",
      "start": "next start -p 3002"
    }
  }
  ```

- [ ] 加入共享 packages
  ```bash
  cd apps/apex
  pnpm add @repo/ui @repo/database
  ```

- [ ] 測試啟動
  ```bash
  pnpm dev
  # 訪問 http://localhost:3002
  ```

- [ ] 從根目錄測試所有應用
  ```bash
  pnpm dev
  # flow (3000), apex (3002), api (3001)
  ```

- [ ] Git commit
  ```bash
  git add .
  git commit -m "feat(apex): set up apex app for statistics tracking"
  ```

### 學習重點

- 理解如何在 monorepo 中管理多個相似應用
- 理解 port 配置
- 體驗共享 packages 的好處

### 完成標準

- ✅ Apex 應用已建立
- ✅ 在 port 3002 運行
- ✅ 可以與 flow 和 api 同時運行
- ✅ 已使用共享 packages

---

## 🔐 Sprint 1: 認證系統

**時間**: 1-2 週  
**目標**: 實現完整的使用者認證流程（Supabase Auth + NestJS JWT 驗證）  
**優先級**: P0（最高優先，功能基礎）  
**前置需求**: Sprint 0.1-0.7 完成

### 主要任務

#### 1.1 Supabase Auth 設定
- [ ] 建立 Supabase 專案
- [ ] 取得 API keys
- [ ] 設定環境變數

#### 1.2 前端整合 Supabase Auth
- [ ] 在 flow app 安裝 `@supabase/supabase-js`
- [ ] 建立 Supabase client
- [ ] 實作註冊頁面
- [ ] 實作登入頁面
- [ ] 實作登出功能
- [ ] 實作 protected routes

#### 1.3 後端 JWT 驗證
- [ ] 在 NestJS 設定 Passport JWT Strategy
- [ ] 建立 SupabaseAuthGuard
- [ ] 建立 User decorator
- [ ] 實作測試 endpoint

#### 1.4 測試與文檔
- [ ] 測試完整認證流程
- [ ] 撰寫 API 文檔
- [ ] 撰寫認證流程文檔

### 完成標準

- ✅ 使用者可以註冊
- ✅ 使用者可以登入
- ✅ 使用者可以登出
- ✅ JWT token 正確傳遞和驗證
- ✅ Protected routes 正常運作
- ✅ NestJS API 正確驗證請求

---

## 💰 Sprint 2: 記帳 CRUD

**時間**: 1-2 週  
**目標**: 實現交易記錄的完整 CRUD 功能  
**優先級**: P0（最高優先，核心功能）  
**前置需求**: Sprint 1 完成

### 主要任務

#### 2.1 資料模型設計
- [ ] 設計 Transaction schema
- [ ] 設計 Category schema
- [ ] 執行 Prisma migration

#### 2.2 後端 API
- [ ] 建立 TransactionModule
- [ ] 實作 CRUD endpoints
- [ ] 加入驗證和權限檢查
- [ ] 實作分頁和篩選

#### 2.3 前端介面
- [ ] 實作交易列表頁面
- [ ] 實作新增交易表單
- [ ] 實作編輯交易功能
- [ ] 實作刪除交易功能
- [ ] 加入表單驗證

#### 2.4 測試與優化
- [ ] 測試所有 CRUD 操作
- [ ] 優化 UI/UX
- [ ] 撰寫 API 文檔

### 完成標準

- ✅ 使用者可以新增交易
- ✅ 使用者可以查看交易列表
- ✅ 使用者可以編輯交易
- ✅ 使用者可以刪除交易
- ✅ 只能操作自己的交易
- ✅ 表單驗證正常運作

---

## 📊 Sprint 3: 分類與統計

**時間**: 1-2 週  
**目標**: 實現分類管理和基本統計報表  
**優先級**: P0（高優先，核心功能）  
**前置需求**: Sprint 2 完成

### 主要任務

#### 3.1 分類管理
- [ ] 實作分類 CRUD API
- [ ] 實作分類管理介面
- [ ] 交易與分類關聯

#### 3.2 基本統計
- [ ] 實作統計 API（總收入、總支出等）
- [ ] 實作統計數據顯示
- [ ] 實作日期範圍篩選

#### 3.3 圖表整合
- [ ] 安裝圖表庫（recharts 或其他）
- [ ] 整合 chart-engine package（基礎）
- [ ] 實作基本圖表顯示

### 完成標準

- ✅ 使用者可以管理分類
- ✅ 交易可以關聯分類
- ✅ 顯示基本統計數據
- ✅ 顯示基本圖表

---

## 📈 Sprint 4: 曲線圖基礎

**時間**: 1-2 週  
**目標**: 建立 apex 應用的基礎功能  
**優先級**: P1（中優先）  
**前置需求**: Sprint 3 完成

### 主要任務

#### 4.1 chart-engine package
- [ ] 建立曲線計算邏輯
- [ ] 實作狀況公式計算
- [ ] 實作趨勢分析

#### 4.2 Apex 應用
- [ ] 資料輸入介面
- [ ] 曲線繪製功能
- [ ] 狀況公式顯示

#### 4.3 整合
- [ ] flow 和 apex 的資料整合
- [ ] 資料匯入/匯出功能

### 完成標準

- ✅ 可以繪製統計曲線
- ✅ 可以計算狀況公式
- ✅ flow 的數據可以導向 apex

---

## 🎓 學習重點總結

### Phase 0 學習重點
- **Monorepo 架構**: 理解 workspace、共享 packages
- **開發工具鏈**: 自動化、程式碼品質
- **資料庫設計**: Prisma schema、migrations
- **後端架構**: NestJS 模組化設計

### Phase 1 學習重點
- **認證流程**: OAuth、JWT
- **前後端分離**: API 設計、狀態管理
- **CRUD 操作**: RESTful API、資料驗證
- **使用者體驗**: 表單設計、錯誤處理

---

## 📅 時間估算總結

### Phase 0（基礎建設）
- Sprint 0.1-0.4: 約 1.5 小時（可分多次）
- Sprint 0.5-0.7: 約 2 小時
- **總計**: 約 3.5 小時

### Phase 1（核心功能）
- Sprint 1-4: 約 4-6 週
- 依個人時間彈性調整

---

## 💡 執行建議

1. **不要急**: 每個 Sprint 都花時間理解，不只是完成任務
2. **記錄學習**: 遇到問題記錄下來，解決後更新文檔
3. **循序漸進**: 一次只專注一個 Sprint
4. **測試驗證**: 每個階段都要測試，確保功能正常
5. **享受過程**: 這是學習之旅，不是趕工

---

這份規劃確保你從零開始，一步步建立一個專業的全端應用！
