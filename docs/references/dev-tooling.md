# 開發工具鏈規劃

本文檔規劃 Flourish 專案的完整開發工具鏈，確保程式碼品質和開發體驗。

---

## 🎯 開發工具鏈目標

1. **程式碼品質保證**: 確保程式碼符合標準
2. **自動化檢查**: 提交前自動檢查和修復
3. **統一風格**: 團隊（或未來）協作時風格一致
4. **減少人為錯誤**: 透過工具自動捕捉問題
5. **學習最佳實踐**: 理解現代化的開發流程

---

## 📦 工具選擇與理由

### 1. Prettier - 程式碼格式化 ⭐⭐⭐⭐⭐

**用途**: 自動格式化程式碼（縮排、引號、分號等）

**為什麼需要**:

- 不用手動調整格式
- 整個 monorepo 格式一致
- 節省 code review 時間
- 與 ESLint 互補（Prettier 管格式，ESLint 管邏輯）

**配置位置**: 根目錄 `.prettierrc`

---

### 2. ESLint - 程式碼品質檢查 ⭐⭐⭐⭐⭐

**用途**: 檢查程式碼邏輯錯誤、潛在 bug、不良寫法

**為什麼需要**:

- 已經由 Turborepo 提供（`packages/eslint-config`）
- 捕捉潛在錯誤
- 強制最佳實踐
- TypeScript 整合

**配置位置**: `packages/eslint-config/` (已存在)

---

### 3. TypeScript - 型別檢查 ⭐⭐⭐⭐⭐

**用途**: 靜態型別檢查

**為什麼需要**:

- 已經由 Turborepo 提供（`packages/typescript-config`）
- 減少執行時錯誤
- 更好的 IDE 支援
- 重構更安全

**配置位置**: `packages/typescript-config/` (已存在)

---

### 4. Husky - Git Hooks 管理 ⭐⭐⭐⭐⭐

**用途**: 在 Git 操作時（commit、push）自動執行腳本

**為什麼需要**:

- 確保不會提交有問題的程式碼
- 自動化檢查流程
- 保護主分支品質

**會用到的 hooks**:

- `pre-commit`: commit 前檢查
- `commit-msg`: 檢查 commit message 格式
- `pre-push`: push 前執行測試（可選）

---

### 5. lint-staged - 只檢查暫存的檔案 ⭐⭐⭐⭐⭐

**用途**: 只對 git staged 的檔案執行 lint/format

**為什麼需要**:

- 速度快（不檢查整個專案）
- 只修復你改動的檔案
- 與 Husky 配合使用

**典型流程**:

```
git add .
→ Husky 觸發 pre-commit hook
→ lint-staged 只檢查 staged 檔案
→ 自動執行 prettier, eslint
→ 如果有問題會中斷 commit
```

---

### 6. commitlint - Commit Message 檢查 ⭐⭐⭐⭐

**用途**: 確保 commit message 遵循規範

**為什麼需要**:

- 統一的 commit message 格式
- 方便生成 CHANGELOG
- 清楚的 git 歷史
- 符合 Conventional Commits 標準

**格式範例**:

```
feat(flow): add transaction list page
fix(apex): resolve chart rendering issue
docs: update README
chore: upgrade dependencies
```

---

### 7. Turbo 內建工具 ⭐⭐⭐⭐⭐

**Turborepo 本身提供**:

- 建置快取
- 並行任務執行
- 依賴關係管理

**已經有了，不需要額外安裝**

---

## 🗓️ 安裝與設定階段規劃

### Sprint 1: 基本 Monorepo（今晚）✅

- [x] 建立 Turborepo
- [x] 基本目錄結構
- [x] 文檔

### Sprint 2: Prettier 設定（第一優先）

**時間**: 15 分鐘

**為什麼優先**:

- 最簡單
- 立即可見效果
- 為其他工具打基礎

**要做**:

1. 安裝 Prettier
2. 建立 `.prettierrc` 配置
3. 建立 `.prettierignore`
4. 加入 npm scripts
5. 格式化現有程式碼

---

### Sprint 3: Husky + lint-staged（第二優先）

**時間**: 20 分鐘

**為什麼第二**:

- 有了 Prettier 後，可以自動格式化
- 建立自動化檢查機制

**要做**:

1. 安裝 Husky
2. 初始化 Husky
3. 安裝 lint-staged
4. 設定 `.lintstagedrc`
5. 建立 `pre-commit` hook
6. 測試提交流程

---

### Sprint 4: commitlint（第三優先）

**時間**: 15 分鐘

**為什麼第三**:

- 有了基本的 commit 流程後再加入
- 規範 commit message

**要做**:

1. 安裝 commitlint
2. 建立 `commitlint.config.js`
3. 建立 `commit-msg` hook
4. 測試 commit message 檢查

---

### Sprint 5: 優化 ESLint 設定（第四優先）

**時間**: 20 分鐘

**為什麼第四**:

- 官方已經提供基本配置
- 可以根據需求客製化

**要做**:

1. 檢查現有的 `packages/eslint-config`
2. 加入專案特定的規則（如果需要）
3. 整合 Prettier（避免衝突）
4. 設定 VS Code 自動修復

---

## 📋 完整的配置檔案規劃

### 根目錄檔案結構（完成後）

```
flourish/
├── .husky/                    # Husky Git hooks
│   ├── pre-commit            # commit 前執行
│   ├── commit-msg            # 檢查 commit message
│   └── pre-push              # push 前執行（可選）
│
├── .vscode/                   # VS Code 設定（可選但推薦）
│   ├── settings.json         # 編輯器設定
│   └── extensions.json       # 推薦的擴充套件
│
├── apps/
├── packages/
├── docs/
│
├── .gitignore                 # Git 忽略檔案
├── .prettierrc                # Prettier 配置
├── .prettierignore            # Prettier 忽略檔案
├── .lintstagedrc              # lint-staged 配置
├── commitlint.config.js       # commitlint 配置
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 🔧 詳細配置內容

### 1. `.prettierrc`

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

**說明**:

- `semi: true` - 使用分號
- `singleQuote: true` - 使用單引號
- `printWidth: 100` - 每行最多 100 字元
- `trailingComma: "es5"` - ES5 支援的地方加逗號

---

### 2. `.prettierignore`

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.turbo/

# Generated files
*.generated.*
.prisma/

# Logs
*.log

# OS
.DS_Store
```

---

### 3. `.lintstagedrc`

```json
{
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

**說明**:

- TypeScript/JavaScript 檔案：先 Prettier 格式化，再 ESLint 修復
- JSON/Markdown 等：只用 Prettier 格式化

---

### 4. `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修復 bug
        'docs', // 文檔變更
        'style', // 格式調整（不影響程式碼運作）
        'refactor', // 重構
        'perf', // 效能優化
        'test', // 測試
        'chore', // 建置或工具變更
        'revert', // 撤銷
        'wip', // 進行中（開發階段可用）
      ],
    ],
    'subject-case': [0], // 不限制 subject 的大小寫
  },
};
```

---

### 5. `.vscode/settings.json` (推薦)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**說明**:

- 儲存時自動格式化
- 儲存時自動執行 ESLint 修復
- 使用 workspace 的 TypeScript 版本

---

### 6. `.vscode/extensions.json` (推薦)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

**說明**:

- 團隊成員打開專案時會提示安裝這些擴充套件

---

### 7. 根目錄 `package.json` scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules",
    "prepare": "husky install"
  }
}
```

**說明**:

- `format`: 格式化所有檔案
- `format:check`: 檢查格式（CI 用）
- `prepare`: npm install 後自動安裝 Husky

---

## 🚀 安裝指令摘要

### Sprint 2: Prettier

```bash
pnpm add -D -w prettier
```

### Sprint 3: Husky + lint-staged

```bash
pnpm add -D -w husky lint-staged
npx husky install
```

### Sprint 4: commitlint

```bash
pnpm add -D -w @commitlint/cli @commitlint/config-conventional
```

**說明**:

- `-D`: devDependencies
- `-w`: workspace root（安裝在根目錄）

---

## 📊 工具鏈優先級總結

| 優先級 | 工具                | 時間 | 重要性     | 立即效益       |
| ------ | ------------------- | ---- | ---------- | -------------- |
| 🥇 P0  | Turborepo (基本)    | -    | ⭐⭐⭐⭐⭐ | 已完成         |
| 🥈 P1  | Prettier            | 15分 | ⭐⭐⭐⭐⭐ | 立即改善程式碼 |
| 🥉 P2  | Husky + lint-staged | 20分 | ⭐⭐⭐⭐⭐ | 自動化檢查     |
| 4️⃣ P3  | commitlint          | 15分 | ⭐⭐⭐⭐   | 規範提交       |
| 5️⃣ P4  | ESLint 優化         | 20分 | ⭐⭐⭐⭐   | 提升品質       |
| 6️⃣ P5  | VS Code 設定        | 10分 | ⭐⭐⭐     | 開發體驗       |

---

## 🎓 學習價值

透過設定這些工具，你會學到：

1. **現代前端工作流**: 了解專業團隊如何確保程式碼品質
2. **Git Hooks**: 理解如何在 Git 操作時自動執行任務
3. **自動化思維**: 減少人為錯誤，提升效率
4. **工具整合**: 理解不同工具如何協同工作
5. **最佳實踐**: 符合業界標準的開發流程

---

## 📅 實施時間表

### 今晚（Sprint 1）

- ✅ 建立基本 Turborepo
- ✅ 目錄結構
- ✅ 文檔

### 明天或之後（Sprint 2-0.5）

- [ ] 安裝 Prettier（15 分鐘）
- [ ] 安裝 Husky + lint-staged（20 分鐘）
- [ ] 安裝 commitlint（15 分鐘）
- [ ] 優化 ESLint（20 分鐘）
- [ ] VS Code 設定（10 分鐘）

**總時間**: 約 1.5 小時（可分多次完成）

---

## 💡 建議

1. **今晚**: 只做基本 monorepo，不要一次做太多
2. **明天**: 先做 Prettier，立即看到效果
3. **之後**: 一次加一個工具，理解每個工具的作用
4. **循序漸進**: 不要急，每個工具都花時間理解

---

這份規劃確保你的專案從一開始就有專業級的開發工具鏈！
