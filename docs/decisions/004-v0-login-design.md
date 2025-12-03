---
title: 'ADR 004: v0 生成的登入設計採用'
type: 'adr'
date: '2025-12-01'
status: 'accepted'
decision: '採用 v0 生成的登入頁面設計改進 Flow，為未來多 app 共用預留架構'
---

# ADR 004: v0 生成的登入設計採用

**日期**: 2025-12-01
**狀態**: ✅ 已採用
**決策者**: 開發團隊
**涉及 Sprint**: Sprint 12, Task 12.3

---

## 背景

在開發 Flow 的登入頁面（Sprint 12, Task 12.3）時，我們使用了 v0（AI 設計工具）生成一個完整的登入設計參考（位於 `flourish-kx` 儲存庫）。

現有 `apps/flow/app/login/login-content.tsx` 的設計存在以下問題：

- ❌ 使用發光 emoji 💰 作為 logo，缺乏專業感
- ❌ 卡片頂部有色帶漸變，視覺複雜
- ❌ 雙層陰影（shadow-md），顯得沉悶
- ❌ Google 按鈕使用藍-青漸變色，風格不夠簡潔
- ❌ 缺乏品牌標語或 tagline
- ❌ 安全訊息背景色複雜（漸變 + 邊框）

v0 生成的設計則呈現出：

- ✅ 專業的幾何 SVG logo（柱狀圖 + 趨勢線），代表財務流動與成長
- ✅ 極簡白色卡片風格（無頂部色帶，大圓角）
- ✅ 單層淺陰影，更輕盈
- ✅ 白色按鈕配邊框，更現代簡潔
- ✅ 品牌標語：「當金錢流動、統計上揚，一切都將欣欣向榮。」
- ✅ 簡潔的「安全登入」分隔線
- ✅ 簡化安全訊息（純文字 + 盾牌圖標）

---

## 決策

### 採用 v0 設計改進 Flow 登入頁面

**實作範圍**（第一階段）：

- 直接修改 `apps/flow/app/login/login-content.tsx`
- 保持 Supabase OAuth 認證邏輯不變
- 保留所有 ARIA 無障礙標籤
- 維持 ADR 003 Corporate Theme（藍 #3b82f6 / 青 #06b6d4）

**未來考量**（第二階段，可選）：

- 若 Apex 也需要登入功能，或未來有更多 apps，可提取共用 `LoginCard` 元件至 `packages/ui`
- 支援參數化：app 名稱、description、logo、brand color
- 最小化重複程式碼

---

## 設計對比

### 視覺改進要點

| 項目            | 現有設計              | v0 設計              | 改進理由                   |
| --------------- | --------------------- | -------------------- | -------------------------- |
| **Logo**        | emoji 💰              | SVG 柱狀圖 + 趨勢線  | 專業、代表財務成長         |
| **卡片頂部**    | 藍-青漸變色帶         | 無色帶               | 簡潔、不分散注意力         |
| **卡片圓角**    | `rounded-lg` (0.5rem) | `rounded-2xl` (1rem) | 現代感更強                 |
| **卡片陰影**    | `shadow-md`           | `shadow-sm`          | 輕盈感，不過沉悶           |
| **Google 按鈕** | 藍-青漸變色           | 白色 + 邊框          | 更簡潔、易於區分狀態       |
| **Button 圓角** | `rounded-lg`          | `rounded-xl`         | 與卡片風格統一             |
| **品牌標語**    | 無                    | 「當金錢流動…」      | 品牌傳達、增強使用者認同感 |
| **分隔線**      | 無                    | 「安全登入」中線     | 明確分段結構               |
| **安全訊息**    | 漸變背景 + 邊框       | 純文字 + 盾牌圖標    | 簡潔、易於掃讀             |
| **內距**        | `px-10` (固定)        | `p-6 sm:p-8 md:p-10` | 響應式，手機上留白適當     |

---

## 實作計劃

### 主要改動（七項）

1. **內嵌 FlowLogo SVG**（不建立獨立檔案）
   - 三個漸增的柱狀矩形（藍-青-藍）
   - 上升趨勢線 + 資料點
   - viewBox="0 0 40 40"，靈活縮放

2. **移除頂部色帶**
   - 刪除 `<div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />`

3. **調整卡片樣式**
   - `rounded-lg` → `rounded-2xl`
   - `shadow-md` → `shadow-sm`
   - `px-10` → `p-6 sm:p-8 md:p-10`（響應式）

4. **新增品牌標語**
   - 位置：副標題後、錯誤訊息前
   - 文字：「當金錢流動、統計上揚，一切都將欣欣向榮。」
   - 樣式：`text-slate-600 text-sm sm:text-base`

5. **改進 Google 按鈕**
   - `bg-gradient-to-r from-blue-600 to-cyan-600` → `bg-white`
   - 新增 `border border-slate-200`
   - `text-white` → `text-slate-900`
   - Hover: `hover:opacity-90` → `hover:bg-slate-50 hover:border-slate-300`
   - 新增 `active:scale-[0.98]`
   - `rounded-lg` → `rounded-xl`

6. **新增分隔線**
   - 位置：Google 按鈕後、安全訊息前
   - 樣式：相對定位的中線 + 「安全登入」文字

7. **改進安全訊息**
   - 移除漸變背景與邊框
   - 改為純文字 + 盾牌 SVG 圖標
   - 圖標顏色：青色（`text-cyan-500`）

### 約束條件

**必須保持**：

- ✅ Supabase Google OAuth 認證邏輯
- ✅ 所有 ARIA 無障礙標籤（role, aria-label, aria-live 等）
- ✅ 錯誤處理 + loading 狀態
- ✅ 響應式設計（mobile/tablet/desktop）
- ✅ ADR 003 Corporate Theme 配色（#3b82f6 / #06b6d4）
- ✅ Traditional Chinese 繁體中文文本

---

## 未來共用架構（第二階段）

### 時機判斷

**何時提取共用元件**（`packages/ui/login-card.tsx`）：

- ✅ Apex 也實作登入功能
- ✅ 兩個 app 登入 UI 完全一致（僅 logo、名稱、description 不同）
- ✅ 有 3+ 個 apps 需要統一登入體驗

**何時保持獨立**：

- ❌ 目前 Apex 無登入頁面計劃
- ❌ 未來 Apex 可能需要完全不同的認證流程（email/password 等）
- ❌ 提取成本 > 重複成本

### 提取方案（範例）

如果未來需要，遷移路徑：

```typescript
// packages/ui/src/components/ui/login-card.tsx
export interface LoginCardProps {
  appName: 'Flow' | 'Apex';
  appDescription: string;
  logo: React.ReactNode;
  brandColor: 'blue-cyan' | 'lofi' | 'custom';
  onGoogleSignIn: () => Promise<void>;
  callbackUrl?: string;
}

export function LoginCard(props: LoginCardProps) {
  // 共用的登入 UI
}
```

使用時：

```typescript
// apps/flow/app/login/login-content.tsx
<LoginCard
  appName="Flow"
  appDescription="您的個人財務追蹤助手"
  logo={<FlowLogo />}
  brandColor="blue-cyan"
  onGoogleSignIn={handleGoogleSignIn}
/>
```

---

## 設計參考來源

- **v0 生成專案**: `../flourish-kx`（位於 flourish 同層）
- **核心組件**:
  - `components/login-card.tsx` - 完整登入卡片實作（參考）
  - `components/flow-logo.tsx` - FlowLogo SVG（參考）
  - `components/google-icon.tsx` - Google 官方 logo

**使用方式**: 這些檔案為「設計參考」，不直接複製程式碼，而是模仿其視覺風格和交互邏輯。

---

## 相關文件

- **Sprint 12**: `docs/sprints/release-1-core-features/12-authentication.md`（任務 12.3）
- **ADR 003**: `docs/decisions/003-authentication-strategy.md`（Corporate Theme 配色）
- **GitHub Issue**: #46（登入 UI 頁面）
- **設計系統**: `docs/decisions/design-system-configuration.md`

---

## 決策記錄

### 2025-12-01（決策日）

**上午 - v0 設計評估**:

- ✅ 檢視 flourish-kx 的 v0 生成設計
- ✅ 對比現有 Flow 登入設計
- ✅ 確認 v0 設計在品牌感、現代感上的優勢

**下午 - 架構決策**:

- ✅ 決定採用 v0 設計改進 Flow
- ✅ 確定單檔修改策略（不建立新 package）
- ✅ 保留未來共用的擴展性

**決策完成度**: 100%
**待執行**: Sprint 12, Task 12.3 實作

---

## 後續追蹤

- [ ] 完成 login-content.tsx 修改
- [ ] 測試響應式設計與 ARIA 無障礙
- [ ] 通過 pnpm check-types 與 pnpm lint
- [ ] 建立 PR 供 code review
- [ ] 監視未來 Apex 登入需求

---

**決策狀態**: ✅ **已採用**
**最後更新**: 2025-12-01
