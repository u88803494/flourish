# Sprint 7, Task 1: packages/ui 基礎架構

**預估時間**: 1-1.5 小時
**狀態**: 📋 規劃中

---

## 🎯 目標

建立共享 UI 套件 `@repo/ui`，為整個 Flourish 專案的 Design System 打下基礎。

---

## 📦 交付成果

- [ ] `packages/ui` 目錄結構完整
- [ ] `package.json` 正確設定
- [ ] `base-theme.css` 定義共享 design tokens
- [ ] Turbo pipeline 正確配置
- [ ] Flow 和 Apex 可以 import `@repo/ui`

---

## 📁 目錄結構

```
packages/ui/
├── package.json
├── tsconfig.json
├── styles/
│   ├── base-theme.css       # 共享基礎 theme
│   └── themes/              # App-specific themes (0.7.2, 0.7.3 建立)
│       ├── lofi.css         # (Sprint 7, Task 2)
│       └── corporate.css    # (Sprint 7, Task 3)
└── components/              # (未來 Sprint 1 建立)
    └── ui/                  # shadcn/ui components
```

---

## 🔧 實作步驟

### Step 1: 建立目錄結構

```bash
mkdir -p packages/ui/styles/themes
mkdir -p packages/ui/components/ui
```

---

### Step 2: 建立 package.json

**檔案**: `packages/ui/package.json`

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./styles/*": "./styles/*"
  },
  "scripts": {},
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

**說明**:

- `name`: `@repo/ui` 符合 monorepo 命名慣例
- `private: true`: 不發布到 npm
- `exports`: 允許 apps import CSS 檔案

---

### Step 3: 建立 tsconfig.json

**檔案**: `packages/ui/tsconfig.json`

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Step 4: 建立 base-theme.css

**檔案**: `packages/ui/styles/base-theme.css`

```css
@import 'tailwindcss';

/**
 * Flourish Design System - Base Theme
 *
 * 共享的基礎 design tokens，定義整個系統的核心設計語言。
 * App-specific themes 應該 import 此檔案後再覆寫變數。
 */

:root {
  /* ========================================
     Spacing & Sizing
     ======================================== */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* ========================================
     Typography
     ======================================== */
  --font-sans:
    ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;

  /* ========================================
     Shadows
     ======================================== */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* ========================================
     Transitions
     ======================================== */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@theme {
  /* Register Tailwind tokens from CSS variables */

  /* Radius */
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);

  /* Typography */
  --font-family-sans: var(--font-sans);
  --font-family-mono: var(--font-mono);

  /* Shadows */
  --box-shadow-sm: var(--shadow-sm);
  --box-shadow-md: var(--shadow-md);
  --box-shadow-lg: var(--shadow-lg);
  --box-shadow-xl: var(--shadow-xl);

  /* Transitions */
  --transition-timing-function-DEFAULT: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**設計理念**:

- 只定義「真正共享」的 tokens（spacing, typography, shadows）
- 顏色留給 app-specific themes 定義
- 使用 `@theme` 註冊到 Tailwind，可以直接用 class（如 `rounded-lg`, `shadow-md`）

---

### Step 5: 更新 App dependencies

**檔案**: `apps/flow/package.json` 和 `apps/apex/package.json`

在 `dependencies` 加入：

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

---

### Step 6: 安裝 dependencies

```bash
pnpm install
```

---

### Step 7: 測試 import

**測試檔案**: `apps/apex/app/globals.css`

暫時加入測試 import：

```css
@import '@repo/ui/styles/base-theme.css';

/* 如果可以成功 import，表示 workspace 設定正確 */
```

**測試方式**:

```bash
cd apps/apex
pnpm dev
```

如果沒有錯誤訊息，表示設定成功！

---

## ✅ 驗證清單

完成後檢查：

- [ ] `packages/ui` 目錄存在且結構正確
- [ ] `pnpm install` 成功無錯誤
- [ ] Apex 可以 import `@repo/ui/styles/base-theme.css`
- [ ] Flow 可以 import `@repo/ui/styles/base-theme.css`
- [ ] `pnpm dev` 所有 apps 正常啟動（port 3100, 3200, 6888）
- [ ] 沒有 TypeScript 或 build 錯誤

---

## 📝 注意事項

### Turbo Cache

如果遇到 cache 問題，清除 cache：

```bash
pnpm turbo clean
pnpm install
```

### pnpm Workspace

確認 `pnpm-workspace.yaml` 包含 `packages/*`：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Import Path

Apps import 時使用完整路徑：

```css
/* ✅ 正確 */
@import '@repo/ui/styles/base-theme.css';

/* ❌ 錯誤 */
@import '@repo/ui/base-theme.css';
```

---

## 🚀 Next Steps

完成 Sprint 7, Task 1 後：

1. **Sprint 7, Task 2**: 建立 Lofi theme 並套用到 Apex
2. **Sprint 7, Task 3**: 建立 Corporate theme 並套用到 Flow

---

## 🔗 Related Documents

- [Sprint 0.7 Overview](./07-overview.md)
- [Design System Configuration Decision](../../decisions/design-system-configuration.md)
- [Tailwind CSS-first Guide](../../guides/tailwind-css-first.md)

---

**Last Updated**: 2025-11-05
