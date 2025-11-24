# Sprint 13: 交易 CRUD 功能

**持續時間**: TBD
**狀態**: 📦 規劃中

---

## 🎯 Sprint 目標

實作完整的交易（Transaction）CRUD 功能，包括手動新增、編輯、刪除交易，以及基本的篩選與搜尋功能。

---

## 📋 規劃的工作（待細化）

### 1. 資料模型驗證

- [ ] 確認 Supabase `transactions` 表 schema
- [ ] 驗證 RLS policies
- [ ] 確認與 `categories` 和 `cards` 的關聯

### 2. Backend API（Supabase）

- [ ] 利用 Supabase auto-generated REST API
- [ ] 或實作 Edge Functions（若需要複雜邏輯）
- [ ] 測試 CRUD 操作與權限

### 3. Frontend 功能

- [ ] 交易列表頁面（含分頁）
- [ ] 新增交易表單
- [ ] 編輯交易功能
- [ ] 刪除交易功能（含確認對話框）
- [ ] 篩選功能（日期範圍、分類、卡片）
- [ ] 搜尋功能

### 4. UI/UX

- [ ] 交易卡片/列表設計
- [ ] 表單驗證與錯誤處理
- [ ] Loading 狀態
- [ ] 空白狀態設計

### 5. 測試

- [ ] 單元測試（表單驗證邏輯）
- [ ] 整合測試（API 操作）
- [ ] E2E 測試（關鍵流程）

---

## 🎯 成功標準（待定義）

- [ ] 使用者可以新增交易
- [ ] 使用者可以編輯交易
- [ ] 使用者可以刪除交易
- [ ] 使用者可以依日期範圍篩選
- [ ] 使用者可以依分類篩選
- [ ] 使用者可以搜尋交易
- [ ] 所有測試通過

---

## 📝 備註

此文檔為 placeholder，將在以下時機細化：

1. **Sprint 12（Authentication）完成後**
2. **產品需求確認後**
3. **與 Flow app 設計整合後**

---

## 🔗 相關文檔

- [Release 1 總覽](./README.md)
- [Release 1 需求](./requirements.md)
- [功能需求](../../requirements/functional-requirements.md)
- [資料庫設計](../../architecture/database-design.md)

---

**最後更新**: 2025-11-24
**下次審查**: Sprint 12 完成後
