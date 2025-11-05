# Design System 配置決策

**日期**: 2025-11-05
**狀態**: 討論中
**決策者**: 開發團隊

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

**決策**: **[待定 - 需要決定]**

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

**決策**: **[待定 - 需要決定]**

---

### 3. 色彩系統設計

#### Flow Application（財務追蹤）

**目前實作**:

- Primary: Green (#22c55e 系列)
- Secondary: Emerald (#10b981 系列)
- Accent: Teal (#14b8a6 系列)

**理由**: 綠色代表成長、金錢和財務健康

**狀態**: ✅ 已定義

#### Apex Application（數據分析）

**考慮中的選項**:

1. **與 Flow 相同（統一品牌）**
   - 整個生態系統單一品牌識別
   - 使用者更容易識別 Flourish apps

2. **藍色系統（專業分析）**
   - Primary: Blue (#3b82f6)
   - 傳達專業、信任、數據
   - 分析工具中常見

3. **紫色系統（科技/創新）**
   - Primary: Purple (#a855f7)
   - 現代、科技前瞻感
   - 與 Flow 區別

4. **與 Flow 互補（綠 + 藍）**
   - 使用綠色作為基礎，加入藍色點綴
   - 視覺連結同時保持區別

**決策**: **[待定 - 需要利害關係人意見]**

**決策問題**: Apex 應該有自己的色彩識別，還是共享 Flow 的品牌？

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

**決策**: ✅ **已批准 - 使用 CSS-first**

**理由**:

1. Tailwind v4 官方推薦
2. 對 monorepo 架構更好
3. shadcn/ui 是以 CSS variables 設計
4. 未來趨勢的方式
5. 主題更有彈性

**參考**: 詳細說明見 `docs/guides/tailwind-css-first.md`

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

1. **Component 位置**: packages/ui vs 各 app vs hybrid？
2. **Apex 色彩系統**: Apex 應該使用哪個色盤？
3. **Theme 覆寫深度**: App 應該有多少客製化空間？
4. **Component Export 策略**: Named exports vs default exports？
5. **Storybook**: 是否應該加入 Storybook 來開發 component？

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
- [Tailwind CSS-first Guide](../guides/tailwind-css-first.md)
- [Sprint 0.7 Overview](../sprints/sprint-0-foundation/overview.md)

---

## 決策記錄

_隨著決策制定而填入_

**2025-11-05**:

- ✅ 決定使用 CSS-first 配置方式
- ⏳ Component 位置待討論
- ⏳ Apex 色彩系統待決定
- ⏳ Theme 策略待最終確定
