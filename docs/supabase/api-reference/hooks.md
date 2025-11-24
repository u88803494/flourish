# React Hooks API 參考

**狀態**: 📝 框架（Task 3 將填充詳細內容）

---

## 🎯 目標

提供 `@repo/supabase-client` 套件中自訂 React Hooks 的 API 參考。

---

## 🎣 認證 Hooks（待詳細說明）

### `useAuth`

```typescript
// (Task 3 補充 API 說明)
```

**用途**: 管理使用者認證狀態

**API**:

- `user` - 當前使用者
- `session` - 當前 session
- `signIn()` - 登入
- `signOut()` - 登出
- `signUp()` - 註冊

**範例**:

```typescript
// (Task 3 補充範例)
```

---

## 📊 資料查詢 Hooks（待詳細說明）

### `useTransactions`

```typescript
// (Task 3 補充 API 說明)
```

**用途**: 查詢與管理交易資料

**API**:

- `transactions` - 交易列表
- `isLoading` - 載入狀態
- `error` - 錯誤訊息
- `refetch()` - 重新查詢

---

### `useCategories`

```typescript
// (Task 3 補充)
```

---

### `useCards`

```typescript
// (Task 3 補充)
```

---

## ✏️ 資料修改 Hooks（待詳細說明）

### `useCreateTransaction`

```typescript
// (Task 3 補充)
```

### `useUpdateTransaction`

```typescript
// (Task 3 補充)
```

### `useDeleteTransaction`

```typescript
// (Task 3 補充)
```

---

## 💡 進階 Hooks（待補充）

### `useRealtimeSubscription`

```typescript
// (Task 3 補充 realtime 訂閱)
```

---

## 🔗 相關文檔

- [Sprint 9, Task 3](../../sprints/release-0-foundation/09-supabase-migration-plan.md#task-3)
- [查詢模式](./query-patterns.md)

---

**最後更新**: 2025-11-24
**Task 3 將補充**: 完整 API 定義、使用範例、最佳實踐
