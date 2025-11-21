# Sprint 7, Task 3: Corporate Theme (Flow)

**預估時間**: 1 小時
**狀態**: 📋 規劃中
**依賴**: Sprint 7, Task 1 完成

---

## 🎯 目標

將 daisyUI Corporate 主題轉換為 shadcn/ui 格式，並套用到 Flow 應用程式。

---

## 🎨 Corporate Theme 設計理念

**風格**: 專業藍綠系統 (Professional Blue-Teal)

**適用場景**: Flow 財務追蹤工具

- 專業、可信賴感
- 財務相關的穩重色調
- 保留綠色元素（成長、金錢）
- 平衡專業與親和力

---

## 📦 交付成果

- [ ] `packages/ui/styles/themes/corporate.css` 建立完成
- [ ] Flow 使用 Corporate 主題
- [ ] 保留原本的綠色 success indicators
- [ ] 移除舊的 `tailwind.config.ts`
- [ ] Light/dark mode 正常運作
- [ ] 所有 component 顏色正確顯示

---

## 🔄 顏色轉換

### daisyUI Corporate 原始配色 (OKLCH)

```css
/* daisyUI Corporate 來源 */
--color-base-100: oklch(100% 0 0); /* 純白背景 */
--color-base-200: oklch(93% 0 0); /* 淺灰背景 */
--color-base-300: oklch(86% 0 0); /* 灰色邊框 */
--color-base-content: oklch(22.389% 0.031 278.072); /* 深藍文字 */
--color-primary: oklch(58% 0.158 241.966); /* 專業藍 */
--color-secondary: oklch(55% 0.046 257.417); /* 深藍 */
--color-accent: oklch(60% 0.118 184.704); /* Teal */
--color-neutral: oklch(23.282% 0.031 278.072);
--color-success: oklch(64.802% 0.158 160.472); /* 綠色 */
--color-warning: oklch(74.08% 0.151 70.08); /* 黃色 */
--color-error: oklch(54.385% 0.227 21.546); /* 紅色 */
```

### 轉換為 shadcn/ui 格式 (HSL)

**轉換工具**: https://oklch.com

**變數對應表**:

| daisyUI      | shadcn/ui   | HSL 值        | 說明         |
| ------------ | ----------- | ------------- | ------------ |
| base-100     | background  | `0 0% 100%`   | 純白背景     |
| base-200     | muted       | `0 0% 93%`    | 淺灰背景     |
| base-300     | border      | `0 0% 86%`    | 灰色邊框     |
| base-content | foreground  | `240 18% 13%` | 深藍文字     |
| primary      | primary     | `242 89% 51%` | 專業藍       |
| secondary    | secondary   | `257 33% 44%` | 深藍         |
| accent       | accent      | `185 84% 51%` | Teal         |
| success      | (Flow 專屬) | `160 79% 46%` | 綠色（保留） |
| warning      | (保留)      | `45 93% 58%`  | 黃色         |
| error        | destructive | `10 91% 43%`  | 紅色         |

---

## 🔧 實作步驟

### Step 1: 建立 corporate.css

**檔案**: `packages/ui/styles/themes/corporate.css`

```css
@import '../base-theme.css';

/**
 * Corporate Theme - Professional Blue-Teal System
 *
 * 設計理念: 專業、可信、財務感
 * 適用於: Flow 財務追蹤應用
 *
 * Color System: 藍綠主調 + 財務綠色點綴
 */

:root {
  /* ========================================
     Background & Foreground
     ======================================== */
  --background: 0 0% 100%; /* 純白 */
  --foreground: 240 18% 13%; /* 深藍文字 */

  /* ========================================
     Muted (次要背景與文字)
     ======================================== */
  --muted: 0 0% 93%; /* 淺灰背景 */
  --muted-foreground: 240 8% 45%; /* 中灰藍文字 */

  /* ========================================
     Card
     ======================================== */
  --card: 0 0% 100%; /* 白色卡片 */
  --card-foreground: 240 18% 13%; /* 深藍文字 */

  /* ========================================
     Popover
     ======================================== */
  --popover: 0 0% 100%;
  --popover-foreground: 240 18% 13%;

  /* ========================================
     Border & Input
     ======================================== */
  --border: 0 0% 86%; /* 灰色邊框 */
  --input: 0 0% 86%; /* 輸入框邊框 */

  /* ========================================
     Primary (專業藍)
     ======================================== */
  --primary: 242 89% 51%; /* 專業藍 */
  --primary-foreground: 0 0% 100%; /* 白色文字 */

  /* ========================================
     Secondary (深藍)
     ======================================== */
  --secondary: 257 33% 44%; /* 深藍 */
  --secondary-foreground: 0 0% 100%; /* 白色文字 */

  /* ========================================
     Accent (Teal)
     ======================================== */
  --accent: 185 84% 51%; /* Teal */
  --accent-foreground: 0 0% 100%; /* 白色文字 */

  /* ========================================
     Destructive (錯誤色)
     ======================================== */
  --destructive: 10 91% 43%; /* 紅色 */
  --destructive-foreground: 0 0% 100%;

  /* ========================================
     Success (財務綠 - Flow 專屬)
     ======================================== */
  --success: 160 79% 46%; /* 綠色 */
  --success-foreground: 0 0% 100%;

  /* ========================================
     Warning
     ======================================== */
  --warning: 45 93% 58%; /* 黃色 */
  --warning-foreground: 240 18% 13%;

  /* ========================================
     Ring (focus indicator)
     ======================================== */
  --ring: 242 89% 51%; /* 專業藍 */
}

.dark {
  /* ========================================
     Dark Mode
     ======================================== */
  --background: 240 18% 8%; /* 深藍黑背景 */
  --foreground: 0 0% 98%; /* 接近白文字 */

  --muted: 240 12% 15%; /* 深藍灰背景 */
  --muted-foreground: 0 0% 65%; /* 中灰文字 */

  --card: 240 18% 10%; /* 深藍黑卡片 */
  --card-foreground: 0 0% 98%;

  --popover: 240 18% 10%;
  --popover-foreground: 0 0% 98%;

  --border: 240 12% 20%; /* 深灰邊框 */
  --input: 240 12% 20%;

  --primary: 242 89% 60%; /* 亮藍 */
  --primary-foreground: 0 0% 100%;

  --secondary: 257 33% 55%; /* 亮深藍 */
  --secondary-foreground: 0 0% 100%;

  --accent: 185 84% 55%; /* 亮 Teal */
  --accent-foreground: 0 0% 100%;

  --destructive: 10 91% 50%;
  --destructive-foreground: 0 0% 100%;

  --success: 160 79% 50%; /* 亮綠 */
  --success-foreground: 0 0% 100%;

  --warning: 45 93% 58%;
  --warning-foreground: 240 18% 13%;

  --ring: 242 89% 60%;
}

@theme {
  /* ========================================
     註冊到 Tailwind
     ======================================== */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));
}
```

---

### Step 2: 更新 Flow globals.css

**檔案**: `apps/flow/app/globals.css`

**完全替換為**:

```css
@import '@repo/ui/styles/themes/corporate.css';

/* Flow 專屬增強 */
:root {
  /* 財務成長相關的綠色變體 */
  --color-growth: hsl(160 84% 39%); /* 深綠，用於成長指標 */
  --color-income: hsl(142 76% 36%); /* 收入綠 */
  --color-positive: hsl(160 79% 46%); /* 正數綠（與 success 相同） */
}

.dark {
  --color-growth: hsl(160 84% 45%);
  --color-income: hsl(142 76% 42%);
  --color-positive: hsl(160 79% 50%);
}

@theme {
  --color-growth: var(--color-growth);
  --color-income: var(--color-income);
  --color-positive: var(--color-positive);
}
```

**說明**: 保留 Flow 原本的綠色財務元素，可以用 `text-growth`, `bg-income` 等類別。

---

### Step 3: 移除舊的 Tailwind Config

**檔案**: `apps/flow/tailwind.config.ts`

**動作**: 刪除此檔案（如果存在）

```bash
rm apps/flow/tailwind.config.ts
```

**原因**: Tailwind v4 CSS-first 不需要 config 檔案，所有配置都在 CSS 中。

---

### Step 4: 檢查 Flow 頁面

**檔案**: `apps/flow/app/page.tsx`

確認所有顏色都使用 semantic classes（如果有硬編碼要改掉）：

```tsx
/* ✅ 正確 - 使用 semantic classes */
<div className="bg-background text-foreground">
<h1 className="text-primary">Flow</h1>
<button className="bg-success text-success-foreground">成長 +10%</button>

/* ❌ 錯誤 - 硬編碼顏色 */
<div className="bg-green-50 text-green-600">
```

---

### Step 5: 測試 Flow

```bash
cd apps/flow
pnpm dev
```

開啟 http://localhost:3100

**檢查項目**:

- [ ] 背景是純白色
- [ ] 文字是深藍色
- [ ] Primary 色是專業藍
- [ ] Accent 色是 Teal
- [ ] 綠色元素正常顯示（如果有）
- [ ] 沒有 build 錯誤

---

### Step 6: 測試 Dark Mode

在瀏覽器 console：

```javascript
document.documentElement.classList.add('dark');
```

**檢查項目**:

- [ ] 背景變成深藍黑
- [ ] 文字變成接近白
- [ ] 所有顏色正確調整

---

## ✅ 驗證清單

- [ ] corporate.css 建立完成
- [ ] Flow globals.css 更新完成
- [ ] tailwind.config.ts 已刪除（如果有）
- [ ] Light mode 顯示正確
- [ ] Dark mode 顯示正確
- [ ] 綠色財務元素保留
- [ ] 沒有 console 錯誤
- [ ] 沒有 build 錯誤

---

## 🎨 Tailwind 類別對應

完成後，Flow 可以使用這些 classes：

| Class             | 對應顏色  | 用途                  |
| ----------------- | --------- | --------------------- |
| `bg-background`   | 白/深藍黑 | 頁面背景              |
| `text-foreground` | 深藍/白   | 主要文字              |
| `bg-primary`      | 專業藍    | Primary 按鈕          |
| `text-primary`    | 專業藍    | Primary 文字          |
| `bg-accent`       | Teal      | Accent 元素           |
| `bg-success`      | 綠色      | 成功/成長             |
| `text-growth`     | 深綠      | 成長指標 ⭐ Flow 專屬 |
| `bg-income`       | 收入綠    | 收入相關 ⭐ Flow 專屬 |

---

## 💚 Flow 綠色元素使用指南

Corporate 主題以藍綠為主，但保留綠色用於財務正向指標：

```tsx
/* 成長、收入、正數 */
<div className="text-success">+$1,200</div>
<div className="bg-growth text-white">成長 15%</div>
<span className="text-income">收入 +$500</span>

/* Primary actions 用藍色 */
<button className="bg-primary text-primary-foreground">儲存</button>

/* Accent 用 Teal */
<div className="border-accent">統計圖表</div>
```

---

## 📝 注意事項

### 遷移檢查清單

如果 Flow 之前有用到這些，需要更新：

```tsx
/* 舊的硬編碼綠色 → 新的 semantic classes */
bg-green-50 → bg-success/10
text-green-600 → text-success
border-green-200 → border-success/20

bg-emerald-50 → bg-accent/10
text-emerald-600 → text-accent

bg-teal-100 → bg-accent/20
text-teal-600 → text-accent
```

### 保持一致性

```tsx
/* ✅ 推薦：使用 semantic colors */
<div className="bg-primary text-primary-foreground">

/* ⚠️ 避免：混用硬編碼和 semantic */
<div className="bg-blue-500 text-primary-foreground">
```

---

## 🚀 Next Steps

完成 Sprint 7, Task 3 後：

**Sprint 7 完成！** 🎉

可以開始 Sprint 1 (Authentication)，此時就可以安裝 shadcn/ui components。

---

## 🔗 Related Documents

- [Sprint 7 Overview](./07-overview.md)
- [Sprint 7, Task 1: packages/ui Setup](./07-task-1-packages-ui-setup.md)
- [Sprint 7, Task 2: Lofi Theme](./07-task-2-lofi-theme.md)
- [Design System Configuration](../../decisions/design-system-configuration.md)

---

**Last Updated**: 2025-11-05
