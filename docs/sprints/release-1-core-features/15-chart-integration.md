# Sprint 15: 圖表整合

**持續時間**: TBD
**狀態**: 📦 規劃中

---

## 🎯 Sprint 目標

整合圖表庫（待選擇），實作基本的財務資料視覺化功能，為未來的 Apex 統計工具打下基礎。

---

## 📋 規劃的工作（待細化）

### 1. 圖表庫選擇與評估

- [ ] 評估候選圖表庫：
  - Recharts（React 專用）
  - Chart.js + react-chartjs-2
  - Victory（React 專用）
  - Apache ECharts
  - D3.js（進階自訂）
- [ ] 選擇標準：
  - TypeScript 支援
  - Bundle size
  - 客製化能力
  - 文檔品質
  - 社群活躍度

### 2. 圖表元件實作

- [ ] 收支趨勢線圖（Line Chart）
- [ ] 分類支出圓餅圖（Pie Chart）
- [ ] 月度收支柱狀圖（Bar Chart）
- [ ] 響應式設計（RWD）
- [ ] 主題整合（Light/Dark mode）

### 3. 資料處理

- [ ] 從 Supabase 查詢聚合資料
- [ ] 資料轉換與格式化
- [ ] 快取策略
- [ ] Loading 與錯誤狀態處理

### 4. `@repo/chart-engine` 套件

- [ ] 建立共享圖表套件
- [ ] 定義圖表元件 API
- [ ] 提供可重用的圖表元件
- [ ] Flow 與 Apex 共用

### 5. 整合至 Flow App

- [ ] Dashboard 頁面設計
- [ ] 圖表佈局
- [ ] 互動功能（tooltips, filters）
- [ ] 效能最佳化

---

## 🎯 成功標準（待定義）

- [ ] 使用者可以看到收支趨勢圖
- [ ] 使用者可以看到分類支出分布
- [ ] 使用者可以看到月度收支比較
- [ ] 圖表支援響應式設計
- [ ] 圖表 loading 時間 < 500ms
- [ ] 所有測試通過

---

## 🤔 待決策問題

### 圖表庫選擇

**選項**:

1. **Recharts** - React 專用，簡單易用
2. **Chart.js** - 經典選擇，生態系完整
3. **Victory** - React 專用，客製化強
4. **Apache ECharts** - 功能強大，Bundle 較大

**評估因素**:

- Bundle size 影響（目標：< 100KB gzipped）
- TypeScript 支援品質
- 客製化需求（進階互動功能）
- 學習曲線

### 資料查詢策略

- 即時查詢 vs. 預先聚合
- 快取策略（SWR vs. React Query）
- Server-side 聚合（Supabase Functions）vs. Client-side 計算

---

## 📝 備註

此文檔為 placeholder，將在以下時機細化：

1. **Sprint 13（Transaction CRUD）完成後**
2. **圖表庫選擇完成後**
3. **資料量評估後（決定聚合策略）**

此 Sprint 也為 **Apex 統計工具**鋪路，建立的 `@repo/chart-engine` 套件將在 Apex 中重用。

---

## 🔗 相關文檔

- [Release 1 總覽](./README.md)
- [Release 1 需求](./requirements.md)
- [Curves Integration Architecture](../../architecture/curves-integration.md)
- [Apex App 規劃](../../project-overview.md#apex-statistics-tool)

---

**最後更新**: 2025-11-24
**下次審查**: Sprint 13 完成後
