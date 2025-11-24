# 常用查詢模式參考

**狀態**: ✅ 完整（Task 3 已完成）

---

## 🎯 目標

提供 Supabase 常用查詢模式與最佳實踐的參考指南，涵蓋從基本 CRUD 到進階查詢技巧。

---

## 📋 基本 CRUD 模式

### Create（新增）

#### 單筆新增

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { TransactionInsert } from '@/shared/types';

async function createTransaction(transaction: TransactionInsert) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select() // 返回新建的資料
    .single();

  if (error) throw error;
  return data;
}

// 使用
const newTransaction: TransactionInsert = {
  user_id: userId,
  type: 'EXPENSE',
  merchant_name: '7-11',
  amount: 150,
  date: new Date().toISOString(),
};

const result = await createTransaction(newTransaction);
console.log(result.id); // UUID of new transaction
```

#### 批次新增

```typescript
async function createTransactions(transactions: TransactionInsert[]) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').insert(transactions).select();

  if (error) throw error;
  return data;
}

// 使用
const transactions: TransactionInsert[] = [
  {
    user_id: userId,
    type: 'EXPENSE',
    merchant_name: 'Store A',
    amount: 100,
    date: new Date().toISOString(),
  },
  {
    user_id: userId,
    type: 'EXPENSE',
    merchant_name: 'Store B',
    amount: 200,
    date: new Date().toISOString(),
  },
];

const results = await createTransactions(transactions);
console.log(`Created ${results.length} transactions`);
```

#### Upsert（更新或插入）

```typescript
async function upsertCard(card: CardInsert) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('cards')
    .upsert(card, {
      onConflict: 'user_id,last4', // 唯一約束
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 使用：如果 user_id + last4 已存在則更新，否則插入
const card: CardInsert = {
  user_id: userId,
  name: '主要信用卡',
  bank: '玉山銀行',
  last4: '1234',
};

const result = await upsertCard(card);
```

### Read（查詢）

#### 查詢所有資料

```typescript
async function getAllTransactions(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);

  if (error) throw error;
  return data;
}
```

#### 查詢單筆資料

```typescript
async function getTransaction(id: string, userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single(); // 確保只返回一筆，否則拋出錯誤

  if (error) throw error;
  return data;
}
```

#### 查詢特定欄位

```typescript
async function getTransactionSummaries(userId: string) {
  const supabase = createBrowserClient();

  // 只查詢需要的欄位
  const { data, error } = await supabase
    .from('transactions')
    .select('id, merchant_name, amount, date, type')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}
```

#### 查詢計數

```typescript
async function getTransactionCount(userId: string) {
  const supabase = createBrowserClient();

  const { count, error } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true }) // head: true 不返回資料
    .eq('user_id', userId);

  if (error) throw error;
  return count;
}
```

### Update（更新）

#### 更新單筆資料

```typescript
async function updateTransactionCategory(
  transactionId: string,
  categoryId: string,
  userId: string
) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .update({
      category_id: categoryId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .eq('user_id', userId) // RLS 也會確保權限
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

#### 批次更新

```typescript
async function bulkUpdateTransactionCategory(
  transactionIds: string[],
  categoryId: string,
  userId: string
) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .update({
      category_id: categoryId,
      updated_at: new Date().toISOString(),
    })
    .in('id', transactionIds)
    .eq('user_id', userId)
    .select();

  if (error) throw error;
  return data;
}
```

#### 條件更新

```typescript
async function archiveOldStatements(userId: string) {
  const supabase = createBrowserClient();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data, error } = await supabase
    .from('statements')
    .update({ status: 'ARCHIVED' })
    .eq('user_id', userId)
    .lt('statement_date', oneYearAgo.toISOString()) // 小於一年前
    .neq('status', 'ARCHIVED') // 尚未封存
    .select();

  if (error) throw error;
  return data;
}
```

### Delete（刪除）

#### 刪除單筆資料

```typescript
async function deleteTransaction(transactionId: string, userId: string) {
  const supabase = createBrowserClient();

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId);

  if (error) throw error;
}
```

#### 批次刪除

```typescript
async function deleteTransactions(transactionIds: string[], userId: string) {
  const supabase = createBrowserClient();

  const { error } = await supabase
    .from('transactions')
    .delete()
    .in('id', transactionIds)
    .eq('user_id', userId);

  if (error) throw error;
}
```

#### 條件刪除

```typescript
async function deleteOldArchivedStatements(userId: string) {
  const supabase = createBrowserClient();

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const { error } = await supabase
    .from('statements')
    .delete()
    .eq('user_id', userId)
    .eq('status', 'ARCHIVED')
    .lt('statement_date', twoYearsAgo.toISOString());

  if (error) throw error;
}
```

---

## 🔍 進階查詢模式

### 篩選與排序

#### 多條件篩選

```typescript
async function getFilteredTransactions(
  userId: string,
  options: {
    type?: 'EXPENSE' | 'INCOME' | 'REFUND';
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }
) {
  const supabase = createBrowserClient();

  let query = supabase.from('transactions').select('*').eq('user_id', userId);

  // 動態添加篩選條件
  if (options.type) {
    query = query.eq('type', options.type);
  }
  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options.startDate) {
    query = query.gte('date', options.startDate);
  }
  if (options.endDate) {
    query = query.lte('date', options.endDate);
  }
  if (options.minAmount !== undefined) {
    query = query.gte('amount', options.minAmount);
  }
  if (options.maxAmount !== undefined) {
    query = query.lte('amount', options.maxAmount);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// 使用
const transactions = await getFilteredTransactions(userId, {
  type: 'EXPENSE',
  categoryId: 'category-123',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  minAmount: 100,
});
```

#### 排序

```typescript
async function getTransactionsSorted(
  userId: string,
  sortBy: 'date' | 'amount' | 'merchant_name',
  ascending: boolean = false
) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order(sortBy, { ascending });

  if (error) throw error;
  return data;
}

// 多欄位排序
async function getTransactionsMultiSort(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false }) // 先按日期降序
    .order('amount', { ascending: false }); // 再按金額降序

  if (error) throw error;
  return data;
}
```

#### 文字搜尋

```typescript
async function searchTransactions(userId: string, searchTerm: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .or(`merchant_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

  if (error) throw error;
  return data;
}

// 使用：搜尋商家名稱或描述包含 "coffee" 的交易（不分大小寫）
const results = await searchTransactions(userId, 'coffee');
```

### 分頁

#### Offset-based 分頁

```typescript
async function getTransactionsPaginated(userId: string, page: number = 1, pageSize: number = 20) {
  const supabase = createBrowserClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data,
    page,
    pageSize,
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// 使用
const result = await getTransactionsPaginated(userId, 1, 20);
console.log(`Page ${result.page} of ${result.totalPages}`);
console.log(`Showing ${result.data.length} of ${result.totalCount} total`);
```

#### Cursor-based 分頁（更適合即時資料）

```typescript
async function getTransactionsCursor(userId: string, cursor?: string, pageSize: number = 20) {
  const supabase = createBrowserClient();

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('id', { ascending: false }) // 確保排序穩定
    .limit(pageSize);

  // 如果有 cursor，從該位置繼續
  if (cursor) {
    query = query.lt('date', cursor); // 查詢日期小於 cursor 的資料
  }

  const { data, error } = await query;
  if (error) throw error;

  // 返回下一頁的 cursor（最後一筆的日期）
  const nextCursor = data.length > 0 ? data[data.length - 1].date : null;

  return {
    data,
    nextCursor,
    hasMore: data.length === pageSize,
  };
}

// 使用（無限滾動）
let cursor = undefined;
while (true) {
  const result = await getTransactionsCursor(userId, cursor, 20);
  console.log(`Loaded ${result.data.length} transactions`);

  if (!result.hasMore) break;
  cursor = result.nextCursor;
}
```

### 關聯查詢（Joins）

#### 一對一關聯

```typescript
async function getTransactionsWithCategory(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq('user_id', userId);

  if (error) throw error;
  return data; // 類型為 TransactionWithRelations[]
}

// 結果格式：
// [
//   {
//     id: '...',
//     merchant_name: '7-11',
//     category: {
//       id: '...',
//       name: '食物',
//       color: '#FF5733'
//     }
//   }
// ]
```

#### 多個關聯

```typescript
async function getTransactionsWithAllRelations(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(*),
      statement:statements(
        *,
        card:cards(*)
      )
    `
    )
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// 結果格式：巢狀物件包含 category, statement (含 card)
```

#### 只選擇關聯的特定欄位

```typescript
async function getTransactionsWithCategoryName(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      id,
      merchant_name,
      amount,
      date,
      category:categories(name, color)
    `
    )
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// 結果格式：只包含選擇的欄位
// [
//   {
//     id: '...',
//     merchant_name: '7-11',
//     amount: 150,
//     date: '2024-01-15',
//     category: { name: '食物', color: '#FF5733' }
//   }
// ]
```

### 聚合查詢

#### 使用 PostgreSQL 函數

```typescript
async function getMonthlySpending(userId: string, year: number, month: number) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_monthly_spending', {
    p_user_id: userId,
    p_year: year,
    p_month: month,
  });

  if (error) throw error;
  return data; // Returns number
}

// 使用
const spending = await getMonthlySpending(userId, 2024, 1);
console.log(`January 2024 spending: $${spending}`);
```

#### 在查詢中計算聚合（需要使用 Views 或自定義函數）

```typescript
// 方法 1：客戶端聚合
async function getCategorySpendingClient(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('category_id, amount')
    .eq('user_id', userId)
    .eq('type', 'EXPENSE');

  if (error) throw error;

  // 在客戶端聚合
  const spendingByCategory = data.reduce(
    (acc, transaction) => {
      const categoryId = transaction.category_id || 'uncategorized';
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  return spendingByCategory;
}

// 方法 2：使用 RPC 函數（更有效率）
async function getCategorySpendingRPC(userId: string, categoryId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_category_total', {
    p_user_id: userId,
    p_category_id: categoryId,
  });

  if (error) throw error;
  return data;
}
```

---

## 🎯 Flourish 特定模式

### 查詢使用者的所有交易

```typescript
async function getUserTransactions(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(id, name, color),
      statement:statements(
        id,
        statement_date,
        card:cards(id, name, bank, last4)
      )
    `
    )
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}
```

### 查詢特定月份的收支

```typescript
async function getMonthlyTransactions(userId: string, year: number, month: number) {
  const supabase = createBrowserClient();

  // 計算月份的開始和結束日期
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(name, color)
    `
    )
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;

  // 計算收入和支出總計
  const income = data.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);

  const expenses = data.filter((t) => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions: data,
    summary: {
      income,
      expenses,
      net: income - expenses,
      count: data.length,
    },
  };
}
```

### 依分類統計支出

```typescript
async function getSpendingByCategory(userId: string, startDate: string, endDate: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      amount,
      category:categories(id, name, color)
    `
    )
    .eq('user_id', userId)
    .eq('type', 'EXPENSE')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;

  // 按分類聚合
  const categorySpending: Record<
    string,
    {
      name: string;
      color: string;
      total: number;
      count: number;
    }
  > = {};

  data.forEach((transaction) => {
    const category = transaction.category || {
      id: 'uncategorized',
      name: '未分類',
      color: '#gray',
    };
    const categoryId = category.id;

    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        name: category.name,
        color: category.color,
        total: 0,
        count: 0,
      };
    }

    categorySpending[categoryId].total += transaction.amount;
    categorySpending[categoryId].count++;
  });

  // 轉換為陣列並排序
  return Object.entries(categorySpending)
    .map(([id, data]) => ({ categoryId: id, ...data }))
    .sort((a, b) => b.total - a.total);
}
```

### 查詢最近的交易（帶關聯）

```typescript
async function getRecentTransactions(userId: string, limit: number = 10) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      id,
      merchant_name,
      amount,
      date,
      type,
      category:categories(name, color)
    `
    )
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
```

### 查詢某分類的所有交易

```typescript
async function getTransactionsByCategory(
  userId: string,
  categoryId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
) {
  const supabase = createBrowserClient();

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .order('date', { ascending: false });

  if (options?.startDate) {
    query = query.gte('date', options.startDate);
  }
  if (options?.endDate) {
    query = query.lte('date', options.endDate);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

### 查詢某卡片的對帳單

```typescript
async function getCardStatements(userId: string, cardId: string, limit: number = 12) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('statements')
    .select(
      `
      *,
      card:cards(id, name, bank, last4)
    `
    )
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .order('statement_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
```

### 查詢未分類的交易

```typescript
async function getUncategorizedTransactions(userId: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .is('category_id', null) // 未分類
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}
```

---

## ⚡ 效能最佳化

### 1. 選擇性查詢欄位

```typescript
// ❌ 不好：查詢所有欄位（可能包含大型欄位如 raw_text）
const { data } = await supabase.from('transactions').select('*').eq('user_id', userId);

// ✅ 好：只查詢需要的欄位
const { data } = await supabase
  .from('transactions')
  .select('id, merchant_name, amount, date, type')
  .eq('user_id', userId);
```

**效益**：減少網路傳輸量，加快查詢速度。

### 2. 使用索引

Flourish 已建立的索引（參考 `20251113054900_indexes_functions.sql`）：

```sql
-- Transactions 查詢優化
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
```

**查詢建議**：

```typescript
// ✅ 好：使用索引 (user_id, date)
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId) // 使用索引
  .gte('date', startDate) // 使用索引
  .lte('date', endDate);

// ❌ 較慢：未使用索引的欄位
const { data } = await supabase.from('transactions').select('*').ilike('description', '%keyword%'); // 沒有索引，全表掃描
```

### 3. 快取策略

使用 React Query 的快取功能：

```typescript
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/features/transactions/server';

function useTransactionsQuery(userId: string) {
  return useQuery({
    queryKey: ['transactions', 'list', userId],
    queryFn: () => getTransactions(userId),
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新請求
    cacheTime: 10 * 60 * 1000, // 快取保留 10 分鐘
  });
}
```

**最佳實踐**：

- 頻繁變動的資料（如交易列表）：`staleTime: 2-5 分鐘`
- 較少變動的資料（如分類、卡片）：`staleTime: 10-15 分鐘`
- 靜態資料（如 Enum 值）：`staleTime: Infinity`

### 4. 批次操作

```typescript
// ❌ 不好：多次單獨請求
for (const transactionId of transactionIds) {
  await updateTransaction(transactionId, { category_id: categoryId });
}

// ✅ 好：批次更新
const { data } = await supabase
  .from('transactions')
  .update({ category_id: categoryId })
  .in('id', transactionIds)
  .select();
```

### 5. 分頁載入

```typescript
// ❌ 不好：一次載入所有資料
const { data } = await supabase.from('transactions').select('*').eq('user_id', userId); // 可能返回數千筆

// ✅ 好：分頁載入
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false })
  .range(0, 19); // 只載入前 20 筆
```

### 6. 使用 RPC 函數處理複雜聚合

```typescript
// ❌ 不好：客戶端聚合（需傳輸大量資料）
const { data } = await supabase
  .from('transactions')
  .select('amount')
  .eq('user_id', userId)
  .eq('type', 'EXPENSE');

const total = data.reduce((sum, t) => sum + t.amount, 0);

// ✅ 好：使用 RPC 函數（資料庫端聚合）
const { data: total } = await supabase.rpc('get_monthly_spending', {
  p_user_id: userId,
  p_year: 2024,
  p_month: 1,
});
```

### 7. 避免 N+1 查詢問題

```typescript
// ❌ 不好：N+1 查詢
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId);

// 對每筆交易查詢分類（N 次查詢）
for (const transaction of transactions) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', transaction.category_id)
    .single();

  transaction.category = category;
}

// ✅ 好：使用 JOIN 一次查詢
const { data: transactions } = await supabase
  .from('transactions')
  .select(
    `
    *,
    category:categories(*)
  `
  )
  .eq('user_id', userId);
```

### 8. 使用 Server Components 預取資料

```typescript
// app/transactions/page.tsx (Server Component)
export default async function TransactionsPage() {
  const user = await getUser();

  // 伺服器端預取資料
  const transactions = await getTransactions(user!.id);

  // 傳遞給 Client Component 作為 initialData
  return <TransactionsList userId={user!.id} initialTransactions={transactions} />;
}

// app/transactions/TransactionsList.tsx (Client Component)
'use client';
export function TransactionsList({ userId, initialTransactions }) {
  const { data } = useTransactionsQuery(userId, initialTransactions);
  // initialData 讓頁面立即顯示，無需等待
  return <div>{/* ... */}</div>;
}
```

---

## 💡 最佳實踐總結

### 1. 始終使用類型安全

```typescript
import type { Transaction, TransactionInsert } from '@/shared/types';

// ✅ 好：使用明確類型
async function createTransaction(data: TransactionInsert): Promise<Transaction> {
  // TypeScript 會驗證 data 的結構
}

// ❌ 不好：使用 any
async function createTransaction(data: any) {
  // 可能插入錯誤欄位
}
```

### 2. 錯誤處理

```typescript
// ✅ 好：明確的錯誤處理
async function getTransaction(id: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();

  if (error) {
    console.error('Failed to fetch transaction:', error);
    throw new Error(`Transaction not found: ${id}`);
  }

  return data;
}
```

### 3. 使用 React Query Hooks

```typescript
// ✅ 好：使用封裝好的 hooks
import { useTransactionsQuery } from '@/features/transactions/queries';

function TransactionsList({ userId }) {
  const { data, isLoading, error } = useTransactionsQuery(userId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <TransactionTable data={data} />;
}
```

### 4. 避免過度查詢

```typescript
// ❌ 不好：每次 render 都查詢
function TransactionItem({ transactionId }) {
  const transaction = await getTransaction(transactionId);  // 錯誤：不能在 render 中 await
  return <div>{transaction.merchant_name}</div>;
}

// ✅ 好：使用 React Query
function TransactionItem({ transactionId }) {
  const { data: transaction } = useTransactionQuery(transactionId, userId);
  return <div>{transaction?.merchant_name}</div>;
}
```

### 5. 使用樂觀更新

```typescript
const updateMutation = useUpdateTransactionMutation(userId);

function handleUpdate(transactionId: string, updates: TransactionUpdate) {
  updateMutation.mutate(
    { id: transactionId, updates },
    {
      // 樂觀更新：立即更新 UI
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['transactions', 'detail', variables.id]);

        const previousData = queryClient.getQueryData(['transactions', 'detail', variables.id]);

        queryClient.setQueryData(['transactions', 'detail', variables.id], (old) => ({
          ...old,
          ...variables.updates,
        }));

        return { previousData };
      },
      // 失敗時回滾
      onError: (err, variables, context) => {
        queryClient.setQueryData(['transactions', 'detail', variables.id], context.previousData);
      },
    }
  );
}
```

---

## 🔗 相關文檔

- **React Hooks API**：[hooks.md](./hooks.md)
- **TypeScript 類型**：[types.md](./types.md)
- **RLS 策略**：[../guides/rls-policies.md](../guides/rls-policies.md)
- **Supabase Query 官方文檔**：[Select](https://supabase.com/docs/reference/javascript/select)
- **Supabase Filter 官方文檔**：[Filters](https://supabase.com/docs/reference/javascript/using-filters)

---

**最後更新**：2025-11-24
**狀態**：✅ 完整（Task 3 已完成）
**涵蓋範圍**：基本 CRUD、進階查詢、Flourish 特定模式、效能最佳化、最佳實踐
