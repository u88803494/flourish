# Tailwind CSS-first Configuration 指南

**最後更新**: 2025-11-05
**Tailwind 版本**: v4.x
**適用於**: Flow, Apex applications

---

## 目錄

1. [什麼是 CSS-first?](#what-is-css-first)
2. [傳統 vs CSS-first](#traditional-vs-css-first)
3. [核心概念](#core-concepts)
4. [實際範例](#practical-examples)
5. [Monorepo 使用方式](#monorepo-usage)
6. [shadcn/ui 整合](#shadcnui-integration)
7. [最佳實踐](#best-practices)
8. [遷移指南](#migration-guide)

---

## 什麼是 CSS-first?

CSS-first 是 Tailwind v4 的新配置方式，將主題客製化從 JavaScript/TypeScript 配置檔案移到 CSS，使用原生 CSS 功能如 custom properties (CSS variables) 和 `@theme` directive。

### 核心原則

1. **在 CSS 中配置**: Theme tokens 直接在 CSS 檔案中定義
2. **Runtime 靈活性**: CSS variables 可以動態更改
3. **Hot Module Reload**: 變更立即生效，無需重啟 server
4. **Framework 無關**: 適用於任何 frontend framework
5. **Monorepo 友善**: 透過 CSS imports 輕鬆共享

---

## 傳統 vs CSS-first

### 傳統方式 (Tailwind v3 / v4 Legacy)

**配置檔案**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**CSS 檔案**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --font-geist-sans: 'Geist Sans', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
}
```

**特點**:

- ✅ 熟悉的 JavaScript/TypeScript 語法
- ✅ IDE autocomplete 和 type checking
- ✅ 已建立的模式和文檔
- ❌ **靜態編譯** - 值在 build time 鎖定
- ❌ **無 runtime 變更** - 無法動態改變 theme
- ❌ **需要重啟 server** 才能套用配置變更
- ❌ **Monorepo 複雜度** - 共享配置需要額外設定
- ❌ **重複定義** - 顏色在兩個檔案中定義

---

### CSS-first 方式 (Tailwind v4)

**不需要 Config 檔案** - 刪除 `tailwind.config.ts`！

**CSS 檔案**: `app/globals.css`

```css
@import 'tailwindcss';

/* 定義 CSS variables */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
  --font-geist-sans: 'Geist Sans', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.2 0 0);
    --foreground: oklch(0.98 0 0);
  }
}

/* 使用 @theme 註冊到 Tailwind */
@theme inline {
  /* 顏色 */
  --color-primary-50: oklch(0.97 0.01 150);
  --color-primary-100: oklch(0.93 0.03 150);
  --color-primary-200: oklch(0.87 0.06 150);
  --color-primary-300: oklch(0.78 0.11 150);
  --color-primary-400: oklch(0.68 0.17 150);
  --color-primary-500: oklch(0.57 0.22 150);
  --color-primary-600: oklch(0.47 0.19 150);
  --color-primary-700: oklch(0.39 0.15 150);
  --color-primary-800: oklch(0.32 0.12 150);
  --color-primary-900: oklch(0.26 0.09 150);
  --color-primary-950: oklch(0.15 0.05 150);

  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Border radius */
  --radius-lg: 0.5rem;
  --radius-md: 0.375rem;
  --radius-sm: 0.25rem;

  /* 字型 */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

**PostCSS 配置**: `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

**特點**:

- ✅ **Runtime 動態** - CSS variables 可以用 JavaScript 更改
- ✅ **即時 hot reload** - 變更立即生效
- ✅ **單一真相來源** - 所有配置在一個 CSS 檔案
- ✅ **Monorepo 簡單** - 只需 `@import` 共享 CSS
- ✅ **Framework 無關** - CSS variables 到處都能用
- ✅ **官方 v4 方向** - 符合未來趨勢
- ⚠️ 較新方式 - 生態系統仍在演進
- ⚠️ IDE autocomplete 需要手動定義 types（選用）

---

## 核心概念

### 1. `@import` Directive

```css
@import 'tailwindcss';
```

這一行取代了舊的三個 directives:

```css
/* 舊方式 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. `@theme` Directive

將自訂值註冊到 Tailwind 的 utility class 系統。

**兩種變體**:

#### `@theme` (使用外部 CSS variables)

```css
:root {
  --my-color: oklch(0.5 0.2 150);
}

@theme {
  --color-custom: var(--my-color);
}
```

當你需要引用其他地方定義的 CSS variables 時使用。

#### `@theme inline` (inline 定義)

```css
@theme inline {
  --color-custom: oklch(0.5 0.2 150);
}
```

大多數情況更簡單。自動建立 CSS variable。

### 3. Wildcard Patterns

```css
@theme {
  --color-primary-*: var(--color-primary- *);
}
```

註冊所有符合 pattern 的 variables（例如 `--color-primary-50`, `--color-primary-100` 等）。

### 4. OKLCH Color Space

Tailwind v4 推薦使用 OKLCH 色彩空間:

```css
/* OKLCH: oklch(Lightness Chroma Hue) */
--color-primary: oklch(0.5 0.2 150);
/*                      ↑    ↑   ↑
                        |    |   Hue (色相 0-360)
                        |    Chroma (彩度 0-0.4)
                        Lightness (亮度 0-1)
*/
```

**優點**:

- Perceptually uniform（顏色看起來均勻分布）
- 跨色相的一致亮度
- 更適合程式化產生顏色

---

## 實際範例

### 範例 1: 基本 Theme 設定

```css
@import 'tailwindcss';

@theme inline {
  /* 主要品牌色 */
  --color-brand: oklch(0.5 0.2 150);

  /* 語意化顏色 */
  --color-success: oklch(0.6 0.18 145);
  --color-warning: oklch(0.7 0.15 85);
  --color-error: oklch(0.55 0.22 25);

  /* Border radius */
  --radius: 0.5rem;

  /* Spacing (客製化比例) */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}
```

**使用方式**:

```tsx
<div className="bg-brand text-white rounded-[--radius] p-[--spacing-md]">
  Custom themed component
</div>
```

### 範例 2: Dark Mode 實作

```css
@import 'tailwindcss';

:root {
  --bg: oklch(1 0 0);
  --text: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: oklch(0.2 0 0);
    --text: oklch(0.95 0 0);
  }
}

@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--text);
}
```

**使用方式**:

```tsx
<div className="bg-background text-foreground">自動適應系統 theme</div>
```

### 範例 3: 動態 Theme 切換

```css
@import 'tailwindcss';

:root {
  --theme-hue: 150; /* 預設：綠色 */
}

@theme inline {
  --color-primary: oklch(0.5 0.2 var(--theme-hue));
  --color-secondary: oklch(0.6 0.15 calc(var(--theme-hue) + 30));
}
```

**JavaScript**:

```typescript
// 在 runtime 改變 theme 顏色！
function setThemeColor(hue: number) {
  document.documentElement.style.setProperty('--theme-hue', hue.toString());
}

// 綠色 theme
setThemeColor(150);

// 藍色 theme
setThemeColor(220);

// 紫色 theme
setThemeColor(280);
```

**React Component**:

```tsx
function ThemeSwitcher() {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setThemeColor(150)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Green
      </button>
      <button
        onClick={() => setThemeColor(220)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Blue
      </button>
      <button
        onClick={() => setThemeColor(280)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Purple
      </button>
    </div>
  );
}
```

---

## Monorepo 使用方式

### 架構

```
flourish/
├── packages/
│   └── ui/
│       └── styles/
│           └── theme.css          # Shared theme
├── apps/
│   ├── flow/
│   │   └── app/
│   │       └── globals.css        # Flow-specific
│   └── apex/
│       └── app/
│           └── globals.css        # Apex-specific
```

### 共享 Theme (`packages/ui/styles/theme.css`)

```css
/* 所有 apps 共享的基礎 design tokens */
@theme {
  /* Typography */
  --font-sans: 'Geist Sans', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Spacing scale */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* 通用語意化顏色 */
  --color-success: oklch(0.6 0.18 145);
  --color-warning: oklch(0.7 0.15 85);
  --color-error: oklch(0.55 0.22 25);
  --color-info: oklch(0.6 0.18 230);
}
```

### Flow App (`apps/flow/app/globals.css`)

```css
@import 'tailwindcss';
@import '@repo/ui/styles/theme.css';

/* Flow 專屬 theme（財務/綠色） */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.15 0 0);
    --foreground: oklch(0.95 0 0);
  }
}

@theme inline {
  /* Flow 品牌色（綠色/翡翠/藍綠） */
  --color-primary-500: oklch(0.57 0.22 150); /* Green */
  --color-secondary-500: oklch(0.62 0.19 160); /* Emerald */
  --color-accent-500: oklch(0.61 0.17 180); /* Teal */

  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

### Apex App (`apps/apex/app/globals.css`)

```css
@import 'tailwindcss';
@import '@repo/ui/styles/theme.css';

/* Apex 專屬 theme（分析/藍色） */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.15 0 0);
    --foreground: oklch(0.95 0 0);
  }
}

@theme inline {
  /* Apex 品牌色（藍色/靛藍/紫羅蘭） */
  --color-primary-500: oklch(0.55 0.2 260); /* Blue */
  --color-secondary-500: oklch(0.5 0.18 280); /* Indigo */
  --color-accent-500: oklch(0.6 0.22 300); /* Violet */

  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

**結果**:

- ✅ 共享 spacing, typography, shadows
- ✅ 每個 app 有獨特的品牌色
- ✅ 一致的語意化顏色（success, error 等）
- ✅ 單一 import，無配置重複

---

## shadcn/ui 整合

shadcn/ui **完美相容** CSS-first 配置。

### 標準 shadcn/ui 設定

執行 `npx shadcn@latest init` 時，會建立：

```json
// components.json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts", // ← 我們會改這個
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### CSS-first 調整

**步驟 1**: 刪除 `tailwind.config.ts`

**步驟 2**: 更新 `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "config": "", // ← 留空！不需要 config 檔案
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

**步驟 3**: 在 CSS 中定義 shadcn variables:

```css
@import 'tailwindcss';

:root {
  /* shadcn/ui 必要的 variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode 值 ... */
}

@theme {
  /* 將 shadcn variables 註冊到 Tailwind */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --radius: var(--radius);
}
```

**步驟 4**: shadcn components 完美運作！

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>;
// ✅ 使用 --color-primary 和 --color-primary-foreground
```

---

## 最佳實踐

### 1. 使用語意化命名

```css
/* ✅ 好：語意化名稱 */
@theme inline {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.2 0 0);
  --color-primary: oklch(0.5 0.2 150);
  --color-destructive: oklch(0.55 0.22 25);
}

/* ❌ 不好：通用名稱 */
@theme inline {
  --color-white: oklch(1 0 0);
  --color-black: oklch(0 0 0);
  --color-green: oklch(0.5 0.2 150);
  --color-red: oklch(0.55 0.22 25);
}
```

### 2. 將相關 Variables 分組

```css
@theme inline {
  /* Typography */
  --font-sans: 'Geist Sans', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;

  /* Colors */
  --color-primary: oklch(0.5 0.2 150);
  --color-secondary: oklch(0.6 0.15 160);
}
```

### 3. 使用一致的命名規則

遵循 Tailwind 的模式:

- Colors: `--color-{name}-{shade}`
- Spacing: `--spacing-{size}`
- Radius: `--radius-{size}`
- Fonts: `--font-{family}`

### 4. 為你的 Theme 加上文檔

```css
@theme inline {
  /**
   * Primary brand color - 用於 CTAs, 連結, active 狀態
   * 在 Flow app 中代表成長和財務健康
   */
  --color-primary: oklch(0.57 0.22 150);

  /**
   * Destructive actions - 用於刪除按鈕, error 狀態
   * 高對比度以確保 accessibility
   */
  --color-destructive: oklch(0.55 0.22 25);
}
```

### 5. 提早測試 Dark Mode

總是定義 light 和 dark 變體:

```css
:root {
  --bg: oklch(1 0 0);
  --text: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: oklch(0.2 0 0);
    --text: oklch(0.95 0 0);
  }
}
```

### 6. 使用 calc() 處理相關值

```css
@theme inline {
  --color-primary: oklch(0.5 0.2 150);
  --color-primary-hover: oklch(calc(0.5 - 0.1) 0.2 150); /* 較深 */
  --color-primary-active: oklch(calc(0.5 - 0.2) 0.2 150); /* 更深 */
}
```

---

## 遷移指南

### 從傳統 Config 到 CSS-first

**之前** (`tailwind.config.ts`):

```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: '#22c55e',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
};
```

**之後** (`app/globals.css`):

```css
@import 'tailwindcss';

@theme inline {
  --color-brand: oklch(0.57 0.22 150);
  --spacing-18: 4.5rem;
}
```

**步驟**:

1. 在 `globals.css` 建立 CSS variable 定義
2. 加入 `@theme inline` block
3. 轉換顏色值到 OKLCH（使用 [oklch.com](https://oklch.com)）
4. 刪除 `tailwind.config.ts`
5. 測試所有 components
6. 驗證 build 成功

---

## 疑難排解

### 問題: Classes 沒有產生

**解決方法**: 確保 `@import "tailwindcss"` 在你的 CSS 檔案最上方。

### 問題: Dark mode 無法運作

**解決方法**: 檢查你正確使用 CSS variables:

```css
:root {
  --bg: oklch(1 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: oklch(0.2 0 0); /* 更新同一個 variable */
  }
}

@theme inline {
  --color-background: var(--bg); /* 引用它 */
}
```

### 問題: 顏色看起來不同

**解決方法**: OKLCH 是 perceptually uniform。Hex colors 需要轉換。使用 [oklch.com](https://oklch.com) 以獲得精確轉換。

### 問題: IDE autocomplete 無法運作

**解決方法**: 產生 TypeScript types（選用）:

```typescript
// types/tailwind.d.ts
declare module 'tailwindcss/lib/util/flattenColorPalette' {
  export default function flattenColorPalette(colors: any): any;
}
```

---

## 延伸資源

- [Tailwind CSS v4 Alpha](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [OKLCH Color Picker](https://oklch.com)
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

---

## 結論

CSS-first 配置代表 Tailwind CSS 的未來。它提供：

- 動態 theming 更大的靈活性
- 更簡單的 monorepo 管理
- 更好的 hot reload 體驗
- Framework 無關的方式

對於 Flourish monorepo，CSS-first 讓 Flow 和 Apex 之間輕鬆共享 theme，同時允許每個 app 保持獨特的視覺識別。
