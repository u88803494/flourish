# React Hooks API 參考

**狀態**: ✅ 完整（Sprint 14 Task 3）

---

## 🎯 目標

提供 `@repo/supabase-client` 套件中自訂 React Hooks 的完整 API 參考。

所有 hooks 基於 [TanStack React Query](https://tanstack.com/query/latest)，提供：

- 自動快取管理
- 自動重新驗證
- 樂觀更新
- 錯誤處理
- Loading 狀態

---

## 📖 目錄

- [認證 Hooks](#-認證-hooks)
  - [useAuthQuery](#useauthquery)
  - [useSignInMutation](#usesigninmutation)
  - [useSignUpMutation](#usesignupmutation)
  - [useSignOutMutation](#usesignoutmutation)
- [交易 Hooks](#-交易-hooks)
  - [useTransactionsQuery](#usetransactionsquery)
  - [useTransactionQuery](#usetransactionquery)
  - [useCreateTransactionMutation](#usecreatetransactionmutation)
  - [useUpdateTransactionMutation](#useupdatetransactionmutation)
  - [useDeleteTransactionMutation](#usedeletetransactionmutation)
- [卡片 Hooks](#-卡片-hooks)
- [分類 Hooks](#-分類-hooks)
- [帳單 Hooks](#-帳單-hooks)
- [通用模式](#-通用模式)

---

## 🔐 認證 Hooks

### `useAuthQuery`

查詢當前已認證使用者的資訊。

**匯入路徑**: `@repo/supabase-client/auth`

**類型簽名**:

```typescript
function useAuthQuery(initialData?: AuthUser | null): UseQueryResult<AuthUser | null, Error>;
```

**參數**:

| 參數          | 類型               | 必填 | 說明                               |
| ------------- | ------------------ | ---- | ---------------------------------- |
| `initialData` | `AuthUser \| null` | ❌   | 從 Server Component 傳入的初始資料 |

**回傳值**:

```typescript
{
  data: AuthUser | null         // 當前使用者資料
  isLoading: boolean            // 載入中
  error: Error | null           // 錯誤訊息
  refetch: () => Promise<...>   // 手動重新查詢
  // ... 其他 React Query 屬性
}
```

**`AuthUser` 類型**:

```typescript
interface AuthUser {
  id: string; // 使用者 UUID (來自 auth.users)
  email: string; // Email 地址
  createdAt: string; // 帳號建立時間 (ISO 8601)
}
```

**使用範例**:

```typescript
'use client';

import { useAuthQuery } from '@repo/supabase-client/auth';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useAuthQuery();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

**快取配置**:

- **Query Key**: `['auth', 'user']`
- **Stale Time**: 5 分鐘
- **自動重新驗證**: 視窗重新獲得焦點時

---

### `useSignInMutation`

執行使用者登入操作。

**匯入路徑**: `@repo/supabase-client/auth`

**類型簽名**:

```typescript
function useSignInMutation(): UseMutationResult<AuthUser, Error, SignInCredentials>;
```

**`SignInCredentials` 類型**:

```typescript
interface SignInCredentials {
  email: string;
  password: string;
}
```

**回傳值**:

```typescript
{
  mutate: (credentials: SignInCredentials, options?) => void
  mutateAsync: (credentials: SignInCredentials) => Promise<AuthUser>
  isPending: boolean               // 執行中
  isSuccess: boolean               // 成功
  isError: boolean                 // 失敗
  error: Error | null              // 錯誤訊息
  data: AuthUser | undefined       // 回傳的使用者資料
  reset: () => void                // 重置狀態
}
```

**使用範例**:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '@repo/supabase-client/auth';

export default function LoginForm() {
  const router = useRouter();
  const signInMutation = useSignInMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          console.log('Successfully signed in:', user.email);
          router.push('/dashboard');
        },
        onError: (error) => {
          console.error('Sign in failed:', error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={signInMutation.isPending}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={signInMutation.isPending}
      />
      <button type="submit" disabled={signInMutation.isPending}>
        {signInMutation.isPending ? '登入中...' : '登入'}
      </button>
      {signInMutation.error && (
        <p className="error">{signInMutation.error.message}</p>
      )}
    </form>
  );
}
```

**成功時自動處理**:

- 更新 `['auth', 'user']` 快取
- 重新驗證所有 auth 相關查詢

---

### `useSignUpMutation`

執行使用者註冊操作。

**匯入路徑**: `@repo/supabase-client/auth`

**類型簽名**:

```typescript
function useSignUpMutation(): UseMutationResult<AuthUser, Error, SignUpCredentials>;
```

**`SignUpCredentials` 類型**:

```typescript
interface SignUpCredentials {
  email: string;
  password: string;
}
```

**使用範例**:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpMutation } from '@repo/supabase-client/auth';

export default function SignUpForm() {
  const router = useRouter();
  const signUpMutation = useSignUpMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('密碼不符合');
      return;
    }

    signUpMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          alert('註冊成功！請檢查你的 email 進行驗證。');
          router.push('/login');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button disabled={signUpMutation.isPending}>
        {signUpMutation.isPending ? '註冊中...' : '註冊'}
      </button>
      {signUpMutation.error && (
        <p className="error">{signUpMutation.error.message}</p>
      )}
    </form>
  );
}
```

**注意事項**:

- Supabase 可能需要 email 驗證（依 Dashboard 設定）
- 註冊成功後，使用者需要點擊 email 中的驗證連結
- 驗證前無法登入（如果啟用了 email confirmation）

---

### `useSignOutMutation`

執行使用者登出操作。

**匯入路徑**: `@repo/supabase-client/auth`

**類型簽名**:

```typescript
function useSignOutMutation(): UseMutationResult<void, Error, void>;
```

**使用範例**:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useSignOutMutation } from '@repo/supabase-client/auth';

export default function SignOutButton() {
  const router = useRouter();
  const signOutMutation = useSignOutMutation();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('Signed out successfully');
        router.push('/login');
      },
    });
  };

  return (
    <button onClick={handleSignOut} disabled={signOutMutation.isPending}>
      {signOutMutation.isPending ? '登出中...' : '登出'}
    </button>
  );
}
```

**成功時自動處理**:

- 清除 `['auth', 'user']` 快取（設為 `null`）
- 清除所有 React Query 快取（因為資料可能是使用者特定的）

---

## 📊 交易 Hooks

### `useTransactionsQuery`

查詢使用者的所有交易記錄。

**匯入路徑**: `@repo/supabase-client/transactions`

**類型簽名**:

```typescript
function useTransactionsQuery(
  userId: string,
  initialData?: TransactionWithRelations[]
): UseQueryResult<TransactionWithRelations[], Error>;
```

**參數**:

| 參數          | 類型                         | 必填 | 說明                               |
| ------------- | ---------------------------- | ---- | ---------------------------------- |
| `userId`      | `string`                     | ✅   | 使用者 UUID                        |
| `initialData` | `TransactionWithRelations[]` | ❌   | 從 Server Component 傳入的初始資料 |

**`TransactionWithRelations` 類型**:

```typescript
interface TransactionWithRelations {
  id: string;
  user_id: string;
  statement_id: string | null;
  category_id: string | null;
  merchant_name: string;
  date: string; // ISO 8601 date
  amount: number; // Decimal as number
  type: 'EXPENSE' | 'INCOME' | 'REFUND';
  is_recurring: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Relations (可能為 null)
  category?: {
    id: string;
    name: string;
    color: string;
  } | null;

  statement?: {
    id: string;
    statement_date: string;
  } | null;
}
```

**使用範例（基本）**:

```typescript
'use client';

import { useTransactionsQuery } from '@repo/supabase-client/transactions';
import { useAuthQuery } from '@repo/supabase-client/auth';

export default function TransactionsList() {
  const { data: user } = useAuthQuery();
  const { data: transactions, isLoading, error } = useTransactionsQuery(user!.id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {transactions?.map(tx => (
        <li key={tx.id}>
          {tx.merchant_name} - ${tx.amount} ({tx.type})
          {tx.category && <span> - {tx.category.name}</span>}
        </li>
      ))}
    </ul>
  );
}
```

**使用範例（Server Component Pattern）**:

```typescript
// app/transactions/page.tsx (Server Component)
import { getTransactions } from '@repo/supabase-client/transactions/server';
import { getUser } from '@repo/supabase-client/auth/server';
import { TransactionsList } from './TransactionsList';

export default async function TransactionsPage() {
  const user = await getUser();
  const initialTransactions = await getTransactions(user!.id);

  return <TransactionsList userId={user!.id} initialTransactions={initialTransactions} />;
}

// app/transactions/TransactionsList.tsx (Client Component)
'use client';

import { useTransactionsQuery } from '@repo/supabase-client/transactions';

export function TransactionsList({ userId, initialTransactions }) {
  // 立即從 initialData 顯示資料，無需 loading 狀態
  const { data: transactions } = useTransactionsQuery(userId, initialTransactions);

  return (
    <div>
      <h1>Transactions ({transactions.length})</h1>
      {/* ... */}
    </div>
  );
}
```

**快取配置**:

- **Query Key**: `['transactions', 'list', userId]`
- **Stale Time**: 2 分鐘
- **Enabled**: 只有當 `userId` 存在時才查詢

---

### `useTransactionQuery`

查詢單一交易的詳細資訊。

**匯入路徑**: `@repo/supabase-client/transactions`

**類型簽名**:

```typescript
function useTransactionQuery(
  id: string,
  userId: string,
  initialData?: TransactionWithRelations
): UseQueryResult<TransactionWithRelations, Error>;
```

**參數**:

| 參數          | 類型                       | 必填 | 說明                               |
| ------------- | -------------------------- | ---- | ---------------------------------- |
| `id`          | `string`                   | ✅   | 交易 UUID                          |
| `userId`      | `string`                   | ✅   | 使用者 UUID（用於權限驗證）        |
| `initialData` | `TransactionWithRelations` | ❌   | 從 Server Component 傳入的初始資料 |

**使用範例**:

```typescript
'use client';

import { useTransactionQuery } from '@repo/supabase-client/transactions';
import { useAuthQuery } from '@repo/supabase-client/auth';

export default function TransactionDetail({ id }: { id: string }) {
  const { data: user } = useAuthQuery();
  const { data: transaction, isLoading, error } = useTransactionQuery(id, user!.id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!transaction) return <div>Transaction not found</div>;

  return (
    <div>
      <h1>{transaction.merchant_name}</h1>
      <p>Amount: ${transaction.amount}</p>
      <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
      <p>Type: {transaction.type}</p>
      {transaction.category && (
        <p>Category: {transaction.category.name}</p>
      )}
      {transaction.notes && <p>Notes: {transaction.notes}</p>}
    </div>
  );
}
```

**快取配置**:

- **Query Key**: `['transactions', 'detail', id]`
- **Stale Time**: 5 分鐘
- **Enabled**: 只有當 `id` 和 `userId` 都存在時才查詢

---

### `useCreateTransactionMutation`

建立新的交易記錄。

**匯入路徑**: `@repo/supabase-client/transactions`

**類型簽名**:

```typescript
function useCreateTransactionMutation(
  userId: string
): UseMutationResult<Transaction, Error, TransactionInsert>;
```

**`TransactionInsert` 類型**:

```typescript
interface TransactionInsert {
  user_id: string;
  statement_id?: string | null;
  category_id?: string | null;
  merchant_name: string;
  date: string; // ISO 8601 date
  amount: number;
  type: 'EXPENSE' | 'INCOME' | 'REFUND';
  is_recurring?: boolean;
  notes?: string | null;
}
```

**使用範例**:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTransactionMutation } from '@repo/supabase-client/transactions';
import { useAuthQuery } from '@repo/supabase-client/auth';

export default function CreateTransactionForm() {
  const router = useRouter();
  const { data: user } = useAuthQuery();
  const createMutation = useCreateTransactionMutation(user!.id);

  const [formData, setFormData] = useState({
    merchant_name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync({
        user_id: user!.id,
        merchant_name: formData.merchant_name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
      });

      alert('Transaction created successfully');
      router.push('/transactions');
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Merchant"
        value={formData.merchant_name}
        onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
      >
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
        <option value="REFUND">Refund</option>
      </select>
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Transaction'}
      </button>
      {createMutation.error && (
        <p className="error">{createMutation.error.message}</p>
      )}
    </form>
  );
}
```

**成功時自動處理**:

- 重新驗證 `['transactions', 'list', userId]` 查詢
- 新交易會自動出現在交易列表中

---

### `useUpdateTransactionMutation`

更新現有的交易記錄。

**匯入路徑**: `@repo/supabase-client/transactions`

**類型簽名**:

```typescript
function useUpdateTransactionMutation(
  userId: string
): UseMutationResult<Transaction, Error, { id: string; updates: TransactionUpdate }>;
```

**`TransactionUpdate` 類型**:

```typescript
interface TransactionUpdate {
  category_id?: string | null;
  merchant_name?: string;
  date?: string;
  amount?: number;
  type?: 'EXPENSE' | 'INCOME' | 'REFUND';
  is_recurring?: boolean;
  notes?: string | null;
}
```

**使用範例**:

```typescript
'use client';

import { useState } from 'react';
import { useUpdateTransactionMutation } from '@repo/supabase-client/transactions';
import { useAuthQuery } from '@repo/supabase-client/auth';

export default function EditTransactionForm({ transaction }) {
  const { data: user } = useAuthQuery();
  const updateMutation = useUpdateTransactionMutation(user!.id);

  const [merchant, setMerchant] = useState(transaction.merchant_name);
  const [amount, setAmount] = useState(transaction.amount.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: transaction.id,
        updates: {
          merchant_name: merchant,
          amount: parseFloat(amount),
        },
      });

      alert('Transaction updated successfully');
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={merchant} onChange={(e) => setMerchant(e.target.value)} />
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Updating...' : 'Update'}
      </button>
      {updateMutation.error && (
        <p className="error">{updateMutation.error.message}</p>
      )}
    </form>
  );
}
```

**成功時自動處理**:

- 更新 `['transactions', 'detail', id]` 快取
- 重新驗證 `['transactions', 'list', userId]` 查詢

---

### `useDeleteTransactionMutation`

刪除交易記錄。

**匯入路徑**: `@repo/supabase-client/transactions`

**類型簽名**:

```typescript
function useDeleteTransactionMutation(userId: string): UseMutationResult<void, Error, string>;
```

**參數**: 傳入交易的 ID (string)

**使用範例**:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useDeleteTransactionMutation } from '@repo/supabase-client/transactions';
import { useAuthQuery } from '@repo/supabase-client/auth';

export default function DeleteTransactionButton({ transactionId }) {
  const router = useRouter();
  const { data: user } = useAuthQuery();
  const deleteMutation = useDeleteTransactionMutation(user!.id);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(transactionId);
      alert('Transaction deleted successfully');
      router.push('/transactions');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
      className="btn-danger"
    >
      {deleteMutation.isPending ? 'Deleting...' : 'Delete Transaction'}
    </button>
  );
}
```

**成功時自動處理**:

- 移除 `['transactions', 'detail', transactionId]` 快取
- 重新驗證 `['transactions', 'list', userId]` 查詢
- 刪除的交易會自動從列表中消失

---

## 💳 卡片 Hooks

_（Sprint 14 後續實作，目前尚無自訂 hooks）_

目前卡片資料使用 Supabase client 直接查詢：

```typescript
const { data: cards } = await supabase
  .from('cards')
  .select('*')
  .eq('user_id', userId)
  .eq('is_active', true);
```

**未來規劃** (Release 1):

- `useCardsQuery(userId)`
- `useCardQuery(id, userId)`
- `useCreateCardMutation(userId)`
- `useUpdateCardMutation(userId)`
- `useDeleteCardMutation(userId)`

---

## 📂 分類 Hooks

_（Sprint 14 後續實作，目前尚無自訂 hooks）_

**未來規劃** (Release 1):

- `useCategoriesQuery(userId)`
- `useCategoryQuery(id, userId)`
- `useCreateCategoryMutation(userId)`
- `useUpdateCategoryMutation(userId)`
- `useDeleteCategoryMutation(userId)`

---

## 📄 帳單 Hooks

_（Sprint 14 後續實作，目前尚無自訂 hooks）_

**未來規劃** (Release 1):

- `useStatementsQuery(userId)`
- `useStatementQuery(id, userId)`
- `useUploadStatementMutation(userId)`
- `useDeleteStatementMutation(userId)`

---

## 🔄 通用模式

### Server Component + Client Component Pattern

這是 Next.js 15 推薦的模式，結合 Server 和 Client Components 的優勢：

**優點**:

- ✅ 首次渲染無 loading 狀態（資料從 server 傳入）
- ✅ 自動快取與重新驗證（React Query）
- ✅ SEO 友善（Server Component 渲染）
- ✅ 更好的使用者體驗

**實作模式**:

```typescript
// 1. Server Component（app/page.tsx）
import { getTransactions } from '@repo/supabase-client/transactions/server';
import { getUser } from '@repo/supabase-client/auth/server';
import { TransactionsList } from './TransactionsList';

export default async function TransactionsPage() {
  const user = await getUser();
  const initialTransactions = await getTransactions(user!.id);

  return <TransactionsList userId={user!.id} initialTransactions={initialTransactions} />;
}

// 2. Client Component (app/TransactionsList.tsx)
'use client';

import { useTransactionsQuery } from '@repo/supabase-client/transactions';

export function TransactionsList({ userId, initialTransactions }) {
  const { data: transactions } = useTransactionsQuery(userId, initialTransactions);

  // 資料立即可用，無需 loading 狀態
  return (
    <ul>
      {transactions.map(tx => (
        <li key={tx.id}>{tx.merchant_name} - ${tx.amount}</li>
      ))}
    </ul>
  );
}
```

---

### Optimistic Updates

對於需要即時反饋的操作，可以使用樂觀更新：

```typescript
const updateMutation = useUpdateTransactionMutation(userId);

// 樂觀更新範例
updateMutation.mutate(
  {
    id: transactionId,
    updates: { amount: newAmount },
  },
  {
    // 1. 立即更新 UI（樂觀）
    onMutate: async (variables) => {
      // 取消相關查詢，避免覆蓋樂觀更新
      await queryClient.cancelQueries({ queryKey: ['transactions', 'detail', variables.id] });

      // 快照當前資料（用於回滾）
      const previousTransaction = queryClient.getQueryData([
        'transactions',
        'detail',
        variables.id,
      ]);

      // 樂觀更新 UI
      queryClient.setQueryData(['transactions', 'detail', variables.id], (old) => ({
        ...old,
        ...variables.updates,
      }));

      return { previousTransaction };
    },

    // 2. 成功時不需要特別處理（已經更新了）
    onSuccess: (data, variables) => {
      // 可選：用真實資料覆蓋樂觀資料
      queryClient.setQueryData(['transactions', 'detail', variables.id], data);
    },

    // 3. 失敗時回滾
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['transactions', 'detail', variables.id],
        context.previousTransaction
      );
      alert('Failed to update: ' + err.message);
    },
  }
);
```

---

### Error Handling

**全域錯誤處理**（在 QueryClientProvider 層級）:

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error);
        // 可選：顯示全域錯誤 toast
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        // 可選：顯示全域錯誤 toast
      },
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**元件層級錯誤處理**:

```typescript
const { data, error, isError } = useTransactionsQuery(userId);

if (isError) {
  return (
    <div className="error-container">
      <h2>Error Loading Transactions</h2>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

---

### Loading States

**骨架屏**（推薦）:

```typescript
const { data: transactions, isLoading } = useTransactionsQuery(userId);

if (isLoading) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton-item" />
      ))}
    </div>
  );
}
```

**懸置指示器**（對於 mutations）:

```typescript
const createMutation = useCreateTransactionMutation(userId);

<button disabled={createMutation.isPending}>
  {createMutation.isPending ? (
    <>
      <Spinner /> Creating...
    </>
  ) : (
    'Create Transaction'
  )}
</button>
```

---

### Cache Invalidation

**手動重新驗證**:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// 重新驗證特定查詢
queryClient.invalidateQueries({ queryKey: ['transactions', 'list', userId] });

// 重新驗證所有交易查詢
queryClient.invalidateQueries({ queryKey: ['transactions'] });

// 立即重新查詢（不等待）
queryClient.refetchQueries({ queryKey: ['transactions', 'list', userId] });
```

---

## 🔗 相關文檔

- [Sprint 9, Task 3 - Supabase Client Package](../../sprints/release-0-foundation/09-supabase-migration-plan.md#task-3)
- [Authentication Guide](../guides/authentication.md)
- [Query Patterns](./query-patterns.md)
- [Types Reference](./types.md)
- [TanStack React Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)

---

**最後更新**: 2025-11-24
**完成狀態**: ✅ Sprint 14 Task 3
**實作 Sprint**: Sprint 9 Task 3 - Supabase Client Package
