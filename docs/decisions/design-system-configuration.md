# Design System 配置決策

**日期**: 2025-11-05
**狀態**: ✅ 已完成決策
**決策者**: 開發團隊
**最後更新**: 2025-11-05

## 背景

在 Sprint 0.7 (Apex Application) 實施過程中，我們發現需要統一的 design system 來支援 Flow 和 Apex 兩個應用程式。如果沒有適當的 component library，我們會面臨：

- 應用程式之間 UI/UX 不一致
- Component 程式碼重複
- Accessibility (a11y) 實作不佳
- 臨時開發 component 產生的技術債
- Sprint 1 (Authentication) 實施延遲

Sprint 1 將需要大量 UI component（表單、輸入欄位、按鈕、提示），現在是建立 design system 基礎的最佳時機。

## 決策要點

### 1. Component 安裝位置

#### 選項 A: 安裝在 `packages/ui` (共享套件) ⭐ 推薦

```
packages/ui/
├── components/
│   └── ui/              # shadcn components
│       ├── button.tsx
│       ├── input.tsx
│       ├── form.tsx
│       └── ...
├── styles/
│   └── theme.css        # 共享 theme 定義
├── package.json
└── README.md
```

**優點**:

- ✅ 所有 component 的唯一真相來源
- ✅ 跨應用程式一致的 design system
- ✅ DRY 原則 (Don't Repeat Yourself)
- ✅ 更容易維護和更新

**缺點**:

- ⚠️ 需要在 package 層級正確設定 Tailwind
- ⚠️ 需要正確配置 exports

#### 選項 B: 各別安裝在每個 App

```
apps/flow/components/ui/
apps/apex/components/ui/
```

**優點**:

- ✅ 每個 app 獨立配置
- ✅ 初始設定較簡單

**缺點**:

- ❌ 程式碼重複
- ❌ 設計分歧的風險
- ❌ 雙倍維護負擔

#### 選項 C: Hybrid 混合方式

```
packages/ui/          # 共享基礎 component
apps/flow/components/ # Flow 專屬 component
apps/apex/components/ # Apex 專屬 component
```

**優點**:

- ✅ 在共享和客製化之間取得平衡

**缺點**:

- ⚠️ 更複雜的心智模型
- ⚠️ 共享/客製 component 界線不清

**決策**: ✅ **採用 Hybrid 優化版本**

**實際架構**:

```
packages/ui/
├── styles/
│   ├── base-theme.css       # 共享 design tokens
│   └── themes/
│       ├── lofi.css         # Apex 主題
│       └── corporate.css    # Flow 主題
└── components/ui/           # shadcn components (Sprint 1)

apps/flow/components/        # Flow 專屬
apps/apex/components/        # Apex 專屬
```

**決策理由**:

- 基礎 themes 共享，確保設計一致性
- App 可以有專屬 components 處理特殊需求
- shadcn/ui components 在 packages/ui，所有 app 共用
- 平衡了共享與彈性

---

### 2. Theme 配置策略

#### 選項 A: 統一 Theme（完全一致）

單一 theme 定義在 `@repo/ui`，所有 app 使用而不修改。

**優點**:

- ✅ 完美的視覺一致性
- ✅ 最簡單維護

**缺點**:

- ❌ 缺乏 app 專屬品牌的彈性
- ❌ Flow 和 Apex 可能需要不同的風格

#### 選項 B: 基礎 Theme + App 覆寫 ⭐ 推薦

```css
/* packages/ui/styles/base-theme.css */
@theme {
  --color-primary-500: oklch(0.5 0.2 150); /* 預設綠色 */
  --radius-lg: 0.5rem;
  /* ... 基礎 tokens ... */
}

/* apps/flow/app/globals.css */
@import '@repo/ui/styles/base-theme.css';
@theme inline {
  --color-primary-500: oklch(0.5 0.2 150); /* Flow 綠色 */
  --color-secondary-500: oklch(0.7 0.15 160); /* Flow 翡翠色 */
}

/* apps/apex/app/globals.css */
@import '@repo/ui/styles/base-theme.css';
@theme inline {
  --color-primary-500: oklch(0.5 0.2 260); /* Apex 藍色？ */
  --color-secondary-500: oklch(0.6 0.18 280); /* Apex 紫色？ */
}
```

**優點**:

- ✅ 共享基礎確保一致性
- ✅ App 可以表達獨特身份
- ✅ 最大彈性
- ✅ 容易更新基礎而不破壞覆寫

**缺點**:

- ⚠️ 需要紀律來維持一致性

**決策**: ✅ **採用選項 B: 基礎 Theme + App 覆寫**

**實際實作**:

- `packages/ui/styles/base-theme.css`: 共享 design tokens (spacing, typography, shadows)
- `packages/ui/styles/themes/lofi.css`: Apex 專屬主題 (黑白極簡)
- `packages/ui/styles/themes/corporate.css`: Flow 專屬主題 (專業藍綠)
- Apps 透過 `@import` 引入對應主題

**決策理由**:

- 共享基礎確保 spacing、typography 一致
- 顏色系統完全分離，符合兩個 app 不同定位
- 容易維護和更新
- 支援快速主題切換測試

---

### 3. 色彩系統設計

#### Flow Application（財務追蹤）

**最終決定**: ✅ **Corporate Theme (daisyUI)**

- **來源**: daisyUI Corporate 主題
- **主色系**: 專業藍綠系統
  - Primary: Professional Blue (HSL 242 89% 51%)
  - Secondary: Deep Blue (HSL 257 33% 44%)
  - Accent: Teal (HSL 185 84% 51%)
- **特殊保留**: 綠色元素用於財務正向指標
  - Success: Green (HSL 160 79% 46%)
  - Growth: Deep Green (自訂)
  - Income: Income Green (自訂)

**理由**:

- 專業、可信賴的財務感
- 藍綠主調穩重
- 綠色點綴保留財務成長意象

#### Apex Application（統計追蹤）

**最終決定**: ✅ **Lofi Theme (daisyUI)**

- **來源**: daisyUI Lofi 主題
- **風格**: 黑白極簡主義 (Minimalist Black & White)
- **色彩系統**:
  - Background: Pure White / Pure Black (HSL 0 0% 100% / 0 0% 0%)
  - Foreground: Pure Black / Pure White (HSL 0 0% 0% / 0 0% 100%)
  - Primary: Deep Gray / White (HSL 0 0% 16% / 0 0% 100%)
  - Accent: Light Gray / Dark Gray (HSL 0 0% 97% / 0 0% 10%)
- **功能色**: Success (Green), Warning (Yellow), Error (Red)

**理由**:

- 專注數據可視化，避免色彩干擾
- 黑白極簡風格，專業精準
- 高對比度，易於閱讀圖表
- 與 Flow 有視覺區別但保持專業感

**決策過程**:
經過實際測試多個主題（Business Blue, Synthwave, Nord 等），
最終選擇 Lofi 因其極簡風格最適合統計數據呈現。

---

### 4. Component 範圍

#### Phase 1: 必要 Component (Sprint 0.7 / 1)

**Authentication & Forms**（Sprint 1 立即需求）:

- ✅ Button (variants: default, destructive, outline, ghost)
- ✅ Input (text, email, password)
- ✅ Label
- ✅ Form (整合 react-hook-form)
- ✅ Card
- ✅ Alert / Toast (錯誤回饋)
- ✅ Dialog (modals)

**預估**: 8-10 個 component

#### Phase 2: 擴充 Component（未來 Sprints）

**資料顯示與互動**:

- Select, Checkbox, RadioGroup
- Tabs, Accordion
- Table, DataTable
- Dropdown Menu
- Badge, Avatar
- Skeleton, Spinner
- Progress, Slider

**預估**: 15-20 個 component

**決策**: 立即安裝 Phase 1 component，Phase 2 按需求安裝

---

### 5. Tailwind 配置方式

#### 傳統 Config（Tailwind v3 / Legacy v4）

```typescript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: { primary: {...} }
    }
  }
}
```

**優點**:

- ✅ 大多數開發者熟悉
- ✅ TypeScript type safety
- ✅ IDE autocomplete

**缺點**:

- ❌ 靜態編譯（無 runtime 變更）
- ❌ 需要重啟 server 才能看到變更
- ❌ Monorepo 複雜度（共享配置）

#### CSS-first（Tailwind v4 推薦）⭐

```css
/* globals.css */
@import 'tailwindcss';

@theme inline {
  --color-primary-500: oklch(0.5 0.2 150);
  --radius-lg: 0.5rem;
}
```

**優點**:

- ✅ **Tailwind v4 官方方向**
- ✅ Runtime 動態主題（CSS variables）
- ✅ Hot reload 不需重啟
- ✅ Monorepo 友善（簡單的 CSS imports）
- ✅ Framework 無關（到處都能用）
- ✅ 完美 shadcn/ui 相容性

**缺點**:

- ⚠️ 較新的方式（較不熟悉）
- ⚠️ 需要手動定義 types 來支援 autocomplete

**決策**: ✅ **已批准並實作 - 使用 CSS-first**

**理由**:

1. Tailwind v4 官方推薦
2. 對 monorepo 架構更好
3. shadcn/ui 是以 CSS variables 設計
4. 未來趨勢的方式
5. 主題更有彈性

**實作狀態**:

- ✅ Flow: 已移除 `tailwind.config.ts`，使用 CSS-first
- ✅ Apex: 從一開始就使用 CSS-first
- ✅ 保留 `postcss.config.mjs`（Tailwind v4 必需）

**參考**: 實作細節見 Sprint 7, Task 1, 0.7.2, 0.7.3 規劃文檔

---

## 實施計畫

### 步驟 1: 配置同步（前置作業）

- 將 Flow 遷移到 CSS-first（移除 tailwind.config.ts）
- 對齊版本（Next.js 16, React 19.2）
- 整合 Apex 使用 workspace packages

### 步驟 2: shadcn/ui 設定

- 在 `@repo/ui` 安裝 shadcn/ui
- 配置 components.json
- 使用 CSS variables 設定基礎 theme

### 步驟 3: Component 整合

- 安裝 Phase 1 component
- 建立 component 文件
- 在 Flow 和 Apex 中測試

### 步驟 4: 文件

- Component 使用指南
- Theme 客製化指南
- Accessibility 指南

---

## 待解決問題

~~1. **Component 位置**: packages/ui vs 各 app vs hybrid？~~ ✅ 已決定：Hybrid
~~2. **Apex 色彩系統**: Apex 應該使用哪個色盤？~~ ✅ 已決定：Lofi
~~3. **Theme 覆寫深度**: App 應該有多少客製化空間？~~ ✅ 已決定：完全分離 4. **Component Export 策略**: Named exports vs default exports？（Sprint 1 決定）5. **Storybook**: 是否應該加入 Storybook 來開發 component？（未來評估）

---

## 時程

- **決策階段**: 2025-11-05（今天）
- **實施**: Sprint 0.7（2-3 天）
- **驗證**: Sprint 0.8 之前
- **正式使用**: Sprint 1 (Authentication)

---

## 參考資料

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [daisyUI Themes](https://daisyui.com/docs/themes/)
- [Sprint 0.7 Overview](../sprints/sprint-0-foundation/07-overview.md)
- [Sprint 7, Task 1: packages/ui Setup](../sprints/sprint-0-foundation/07-task-1-packages-ui-setup.md)
- [Sprint 7, Task 2: Lofi Theme](../sprints/sprint-0-foundation/07-task-2-lofi-theme.md)
- [Sprint 7, Task 3: Corporate Theme](../sprints/sprint-0-foundation/07-task-3-corporate-theme.md)

---

## 決策記錄

### 2025-11-05 (完整決策日)

**上午 - 技術路線決定**:

- ✅ 決定使用 Tailwind CSS v4 CSS-first 配置方式
- ✅ 選擇 shadcn/ui 作為 component collection
- ✅ 確定 Hybrid 架構（packages/ui + app-specific components）

**下午 - 產品定位釐清**:

- 📋 Flow: 個人記帳工具，推廣懶人記帳法
- 📋 Apex: 山達基曲線圖工具，專業統計追蹤
- 📋 關係：有關聯但獨立，Flow 可導入數據到 Apex

**下午 - 配色方案決策**:

- 🎨 測試 shadcn/ui 官方主題 → 數量少、風格不符
- 🎨 測試 Business Blue, Synthwave, Nord → 僅 Business Blue 順眼
- 🎨 發現 daisyUI 主題轉換方案
- ✅ **Apex 最終決定**: Lofi (黑白極簡)
- ✅ **Flow 最終決定**: Corporate (專業藍綠)

**晚上 - 實作準備**:

- ✅ Apex page.tsx 重構為 CSS variables
- ✅ Flow 移除 tailwind.config.ts
- ✅ 建立 Sprint 7, Task 1, 0.7.2, 0.7.3 完整規劃文檔

**決策完成度**: 100%
**待執行**: Sprint 7, Task 1 → 0.7.2 → 0.7.3 實作
