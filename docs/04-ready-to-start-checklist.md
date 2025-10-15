# 開始建立專案前的檢查清單

**專案名稱**: flourish
**狀態**: 準備開始 🚀

---

## ✅ 已完成的準備工作

### 1. 需求分析
- [x] 明確專案目標（記帳 + 曲線圖工具）
- [x] 確定技術棧（NestJS + Next.js + Prisma + Supabase）
- [x] 規劃 monorepo 架構（Turborepo）
- [x] 設計資料流程（前後端分離 + Supabase Auth）

### 2. 文檔準備
- [x] 討論記錄（00-discussion-summary.md）
- [x] 技術對比分析（01-tech-comparison.md）
- [x] NestJS 快速參考（02-nestjs-quick-ref.md）
- [x] 專案命名決策（03-project-naming-decision.md）

### 3. 架構設計
- [x] Monorepo 結構規劃
- [x] 前後端架構設計
- [x] 認證流程設計
- [x] 部署策略規劃

### 4. Sprint 規劃
- [x] Sprint 0: 專案設置（1週）
- [x] Sprint 1: 認證系統（1-2週）
- [x] Sprint 2: 交易 CRUD（1-2週）
- [x] Sprint 3: 分類與統計（1-2週）

---

## 📋 接下來要做的事

### Phase 1: 初始化專案（預計 30-60 分鐘）

#### Step 1: 建立 Turborepo Monorepo
```bash
cd /Users/henry_lee/Developer/Personal
npx create-turbo@latest flourish
```

選擇：
- Package manager: `pnpm` (推薦) 或 `npm`
- 是否使用 TypeScript: Yes

#### Step 2: 清理並設定基礎結構
```bash
cd flourish
# 調整目錄結構
# 建立 docs/, packages/ 等目錄
```

#### Step 3: 設定 Next.js 應用（記帳）
```bash
cd apps
npx create-next-app@latest ledger
```

選擇：
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Import alias: @/*

#### Step 4: 設定 NestJS 應用（後端）
```bash
cd apps
npx @nestjs/cli new api
```

選擇：
- Package manager: 與 monorepo 一致

#### Step 5: 設定 Prisma
```bash
cd packages
mkdir database
cd database
npm init -y
npm install prisma @prisma/client
npx prisma init
```

#### Step 6: 設定共享配置
```bash
cd packages
# 建立 typescript-config
# 建立 eslint-config
```

#### Step 7: 調整 turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

#### Step 8: 初始化 Git
```bash
git init
git add .
git commit -m "chore: initial monorepo setup with turborepo"
```

---

## 🔧 需要的環境變數（稍後設定）

### Supabase
```env
# 需要從 Supabase Dashboard 取得
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
```

### Database
```env
# Supabase PostgreSQL 連接字串
DATABASE_URL=
```

### 其他
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

---

## 📦 需要安裝的套件清單

### apps/ledger (Next.js)
```bash
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install zustand  # 如果需要狀態管理
npm install date-fns  # 日期處理
npm install recharts  # 圖表（或其他圖表庫）
```

### apps/api (NestJS)
```bash
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
npm install @nestjs/config
npm install @prisma/client
npm install class-validator class-transformer
```

Dev dependencies:
```bash
npm install -D @types/passport-jwt
```

### packages/database
```bash
npm install prisma @prisma/client
```

---

## 🎯 Sprint 0 任務細項

### 第 1 天：Monorepo 基礎設置
- [ ] 建立 Turborepo
- [ ] 設定目錄結構
- [ ] 建立基礎文檔

### 第 2 天：應用程式初始化
- [ ] 設定 Next.js (ledger)
- [ ] 設定 Next.js (curves) - 或稍後
- [ ] 設定 NestJS (api)

### 第 3 天：共享套件設定
- [ ] 設定 Prisma (packages/database)
- [ ] 設定 TypeScript config
- [ ] 設定 ESLint config

### 第 4 天：開發環境設定
- [ ] 設定 Supabase 專案
- [ ] 配置環境變數
- [ ] 測試所有應用可以啟動

### 第 5 天：文檔與 Git
- [ ] 撰寫 README
- [ ] 撰寫開發指南
- [ ] 設定 Git hooks (optional)
- [ ] 首次 commit

### 第 6-7 天：整合測試與調整
- [ ] 確保 Turbo 指令正常運作
- [ ] 測試熱重載
- [ ] 調整配置
- [ ] 準備進入 Sprint 1

---

## 🚀 啟動指令（完成後）

```bash
# 開發模式（所有應用）
npm run dev

# 只啟動特定應用
npm run dev --filter=ledger
npm run dev --filter=api

# 建置所有
npm run build

# Lint 所有
npm run lint

# Type check
npm run type-check
```

---

## 📊 成功標準

Sprint 0 完成的標準：

1. ✅ Monorepo 結構完整建立
2. ✅ 所有應用可以獨立啟動
3. ✅ Turbo 指令正常運作（dev, build, lint）
4. ✅ Git repository 初始化完成
5. ✅ 基礎文檔撰寫完成
6. ✅ 開發環境配置完成（環境變數等）
7. ✅ Supabase 專案建立並配置
8. ✅ Prisma 初始化完成

---

## ⚠️ 常見問題預防

### 問題 1: Port 衝突
**解決**: 
- Next.js (ledger): 3000
- Next.js (curves): 3002
- NestJS (api): 3001

### 問題 2: 套件版本衝突
**解決**: 使用 workspace 的 package.json 統一管理共享依賴

### 問題 3: Prisma schema 位置
**解決**: 放在 `packages/database/prisma/schema.prisma`

### 問題 4: TypeScript 路徑解析
**解決**: 設定好 `tsconfig.json` 的 `paths`

---

## 📝 備註

- 不用急，一步一步來
- 遇到問題隨時問
- 記得每個階段都 commit
- 保持文檔更新

---

**準備好了就開始吧！** 🎉
