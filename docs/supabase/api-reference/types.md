# TypeScript 類型參考

**狀態**: ✅ 完整（Task 3 已完成）

---

## 🎯 目標

提供 Supabase 自動生成的 TypeScript 類型參考與使用指南，確保類型安全的資料庫操作。

---

## 🔧 類型生成

### 自動生成指令

Flourish 專案使用 Supabase CLI 自動生成 TypeScript 類型：

```bash
# 從遠端資料庫生成類型
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > packages/supabase-client/src/shared/types/database.ts

# 從本地資料庫生成類型（開發環境）
npx supabase gen types typescript --local > packages/supabase-client/src/shared/types/database.ts
```

### 類型檔案結構

```
packages/supabase-client/src/
├── shared/
│   └── types/
│       ├── database.ts         # 自動生成的資料庫類型
│       └── index.ts            # 便利的類型匯出
├── features/
│   ├── auth/
│   │   └── types.ts           # 認證相關自定義類型
│   └── transactions/
│       └── types.ts           # 交易相關自定義類型
```

**重要**：`database.ts` 是自動生成的檔案，不應手動編輯。每次 schema 變更後應重新生成。

---

## 📋 主要類型

### Database Schema Types

完整的資料庫 schema 類型定義，包含所有資料表、檢視、函數和 Enums：

```typescript
export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: UserInsert; Update: UserUpdate };
      cards: { Row: Card; Insert: CardInsert; Update: CardUpdate };
      categories: { Row: Category; Insert: CategoryInsert; Update: CategoryUpdate };
      transactions: { Row: Transaction; Insert: TransactionInsert; Update: TransactionUpdate };
      statements: { Row: Statement; Insert: StatementInsert; Update: StatementUpdate };
      recurring_expenses: {
        Row: RecurringExpense;
        Insert: RecurringExpenseInsert;
        Update: RecurringExpenseUpdate;
      };
      saving_rules: { Row: SavingRule; Insert: SavingRuleInsert; Update: SavingRuleUpdate };
    };
    Enums: {
      transaction_type: 'EXPENSE' | 'INCOME' | 'REFUND';
      statement_status: 'PENDING' | 'EXTRACTED' | 'IMPORTED' | 'ARCHIVED';
      recurring_frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';
    };
    Functions: {
      get_monthly_spending: {
        Args: { p_user_id: string; p_year: number; p_month: number };
        Returns: number;
      };
      get_category_total: { Args: { p_user_id: string; p_category_id: string }; Returns: number };
      get_category_spending_by_range: {
        Args: {
          p_user_id: string;
          p_category_id: string;
          p_start_date: string;
          p_end_date: string;
        };
        Returns: number;
      };
    };
  };
};
```

### Table Row Types

每個資料表的完整 Row 類型（查詢時返回的資料）：

#### User

```typescript
export type User = {
  id: string; // UUID (references auth.users)
  email: string; // 使用者 email
  name: string | null; // 顯示名稱（選填）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### Card

```typescript
export type Card = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  name: string; // 卡片名稱（例如：主要信用卡）
  bank: string; // 銀行名稱（例如：玉山銀行）
  last4: string; // 卡號末四碼
  is_active: boolean | null; // 是否啟用（預設 true）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### Category

```typescript
export type Category = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  name: string; // 分類名稱（例如：食物、交通）
  color: string | null; // 顏色代碼（例如：#FF5733）
  is_active: boolean | null; // 是否啟用（預設 true）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### Transaction

```typescript
export type Transaction = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  statement_id: string | null; // 對帳單 ID (references statements)
  category_id: string | null; // 分類 ID (references categories)
  type: 'EXPENSE' | 'INCOME' | 'REFUND'; // 交易類型
  merchant_name: string; // 商家名稱
  amount: number; // 金額（正數）
  date: string; // 交易日期（ISO 8601）
  description: string | null; // 描述
  raw_text: string | null; // PDF 原始文字
  confidence: number | null; // AI 提取信心度（0-1）
  is_manual_entry: boolean | null; // 是否手動輸入（預設 false）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### Statement

```typescript
export type Statement = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  card_id: string; // 信用卡 ID (references cards)
  statement_date: string; // 對帳單日期（ISO 8601）
  upload_date: string | null; // 上傳日期（ISO 8601）
  pdf_url: string | null; // PDF 檔案 URL
  status: 'PENDING' | 'EXTRACTED' | 'IMPORTED' | 'ARCHIVED' | null; // 處理狀態
  extracted_count: number | null; // 已提取交易數量
  imported_count: number | null; // 已匯入交易數量
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### RecurringExpense

```typescript
export type RecurringExpense = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  category_id: string | null; // 分類 ID (references categories)
  name: string; // 固定支出名稱（例如：Netflix 訂閱）
  amount: number; // 每次金額
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL'; // 頻率
  start_date: string; // 開始日期（ISO 8601）
  end_date: string | null; // 結束日期（ISO 8601，選填）
  description: string | null; // 描述
  is_active: boolean | null; // 是否啟用（預設 true）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

#### SavingRule

```typescript
export type SavingRule = {
  id: string; // UUID
  user_id: string; // 擁有者 ID (references users)
  name: string; // 規則名稱（例如：每月存款）
  amount: number; // 每次存款金額
  frequency: string; // 頻率（字串格式）
  is_active: boolean | null; // 是否啟用（預設 true）
  created_at: string | null; // ISO 8601 timestamp
  updated_at: string | null; // ISO 8601 timestamp
};
```

### Insert Types

用於插入新資料的類型（required 欄位必填，其他選填）：

```typescript
// 所有 Insert 類型都將可選欄位標記為可選
export type UserInsert = {
  id: string; // 必須與 auth.users.id 一致
  email: string; // 必填
  name?: string | null; // 選填
  created_at?: string | null; // 自動生成
  updated_at?: string | null; // 自動生成
};

export type CardInsert = {
  id?: string; // 自動生成 UUID
  user_id: string; // 必填
  name: string; // 必填
  bank: string; // 必填
  last4: string; // 必填
  is_active?: boolean | null; // 預設 true
  created_at?: string | null; // 自動生成
  updated_at?: string | null; // 自動生成
};

export type TransactionInsert = {
  id?: string; // 自動生成 UUID
  user_id: string; // 必填
  statement_id?: string | null; // 選填
  category_id?: string | null; // 選填
  type: 'EXPENSE' | 'INCOME' | 'REFUND'; // 必填
  merchant_name: string; // 必填
  amount: number; // 必填
  date: string; // 必填（ISO 8601）
  description?: string | null; // 選填
  raw_text?: string | null; // 選填
  confidence?: number | null; // 選填
  is_manual_entry?: boolean | null; // 預設 false
  created_at?: string | null; // 自動生成
  updated_at?: string | null; // 自動生成
};

// CategoryInsert, StatementInsert, RecurringExpenseInsert, SavingRuleInsert
// 同樣模式：必填欄位保持必填，其他欄位變為可選
```

### Update Types

用於更新現有資料的類型（所有欄位都是可選的）：

```typescript
// 所有 Update 類型都將所有欄位標記為可選
export type UserUpdate = {
  id?: string;
  email?: string;
  name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CardUpdate = {
  id?: string;
  user_id?: string;
  name?: string;
  bank?: string;
  last4?: string;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TransactionUpdate = {
  id?: string;
  user_id?: string;
  statement_id?: string | null;
  category_id?: string | null;
  type?: 'EXPENSE' | 'INCOME' | 'REFUND';
  merchant_name?: string;
  amount?: number;
  date?: string;
  description?: string | null;
  raw_text?: string | null;
  confidence?: number | null;
  is_manual_entry?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

// CategoryUpdate, StatementUpdate, RecurringExpenseUpdate, SavingRuleUpdate
// 同樣模式：所有欄位都是可選的
```

### Enum Types

資料庫 Enum 類型定義：

```typescript
// 交易類型
export type TransactionType = 'EXPENSE' | 'INCOME' | 'REFUND';

// 對帳單狀態
export type StatementStatus = 'PENDING' | 'EXTRACTED' | 'IMPORTED' | 'ARCHIVED';

// 固定支出頻率
export type RecurringFrequency =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'BIANNUAL'
  | 'ANNUAL';

// 使用 Constants 取得所有可用值
import { Constants } from '@/shared/types/database';

const allTransactionTypes = Constants.public.Enums.transaction_type;
// ['EXPENSE', 'INCOME', 'REFUND']

const allStatementStatuses = Constants.public.Enums.statement_status;
// ['PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED']

const allRecurringFrequencies = Constants.public.Enums.recurring_frequency;
// ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL']
```

---

## 🎨 自定義類型

### AuthUser

認證使用者的簡化類型（不包含敏感資料）：

```typescript
/**
 * Authenticated user information
 * 用於前端顯示的使用者資訊，不包含敏感資料
 */
export interface AuthUser {
  id: string; // 使用者 UUID
  email: string; // Email
  createdAt: string; // 建立時間（ISO 8601）
}
```

**使用時機**：

- 前端顯示使用者資訊
- Session 管理
- React Context 狀態

**來源**：`packages/supabase-client/src/features/auth/types.ts`

### SignInCredentials

登入憑證：

```typescript
/**
 * Sign in credentials
 * 登入時需要的憑證
 */
export interface SignInCredentials {
  email: string; // Email
  password: string; // 密碼
}
```

### SignUpCredentials

註冊憑證：

```typescript
/**
 * Sign up credentials
 * 註冊時需要的憑證
 */
export interface SignUpCredentials {
  email: string; // Email
  password: string; // 密碼
}
```

### TransactionWithRelations

包含關聯資料的交易類型：

```typescript
/**
 * Transaction with related category and card information
 * 包含分類和卡片完整資訊的交易
 *
 * 使用 Omit 移除外鍵欄位，用完整物件取代
 */
export type TransactionWithRelations = Omit<Transaction, 'category_id'> & {
  category: Category | null; // 完整的分類物件
  card: Card | null; // 完整的卡片物件
};
```

**使用時機**：

- 顯示交易列表（需要顯示分類名稱和卡片資訊）
- 交易詳情頁面
- React Query 返回的資料類型

**來源**：`packages/supabase-client/src/features/transactions/types.ts`

**範例**：

```typescript
// ❌ 不好：需要額外查詢分類和卡片
const transaction: Transaction = {
  id: '123',
  category_id: 'cat-456',
  merchant_name: '7-11',
  // ...
};

// ✅ 好：直接包含關聯資料
const transactionWithRelations: TransactionWithRelations = {
  id: '123',
  category: {
    id: 'cat-456',
    name: '食物',
    color: '#FF5733',
    // ...
  },
  card: {
    id: 'card-789',
    name: '主要信用卡',
    bank: '玉山銀行',
    last4: '1234',
    // ...
  },
  merchant_name: '7-11',
  // ...
};
```

---

## 🎯 使用範例

### 查詢資料

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { Transaction, Card } from '@/shared/types';

// 查詢單一交易
async function getTransaction(id: string): Promise<Transaction | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();

  if (error) throw error;
  return data; // 類型自動推斷為 Transaction
}

// 查詢帶關聯的交易
async function getTransactionWithRelations(id: string): Promise<TransactionWithRelations | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(*),
      card:cards(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as TransactionWithRelations; // 需要手動斷言類型
}

// 查詢使用者所有卡片
async function getUserCards(userId: string): Promise<Card[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data; // 類型自動推斷為 Card[]
}
```

### 插入資料

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { TransactionInsert, CardInsert, CategoryInsert } from '@/shared/types';

// 插入新交易
async function createTransaction(transaction: TransactionInsert): Promise<Transaction> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').insert(transaction).select().single();

  if (error) throw error;
  return data; // 類型自動推斷為 Transaction
}

// 插入新卡片
async function createCard(card: CardInsert): Promise<Card> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('cards').insert(card).select().single();

  if (error) throw error;
  return data; // 類型自動推斷為 Card
}

// 批次插入交易
async function createTransactions(transactions: TransactionInsert[]): Promise<Transaction[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from('transactions').insert(transactions).select();

  if (error) throw error;
  return data; // 類型自動推斷為 Transaction[]
}
```

### 更新資料

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { TransactionUpdate, CardUpdate } from '@/shared/types';

// 更新交易分類
async function updateTransactionCategory(
  transactionId: string,
  categoryId: string
): Promise<Transaction> {
  const supabase = createBrowserClient();

  // TransactionUpdate 讓所有欄位都是可選的
  const updates: TransactionUpdate = {
    category_id: categoryId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data; // 類型自動推斷為 Transaction
}

// 停用卡片
async function deactivateCard(cardId: string): Promise<Card> {
  const supabase = createBrowserClient();

  const updates: CardUpdate = {
    is_active: false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single();

  if (error) throw error;
  return data; // 類型自動推斷為 Card
}
```

### 刪除資料

```typescript
import { createBrowserClient } from '@/lib/supabase/client';

// 刪除交易
async function deleteTransaction(transactionId: string, userId: string): Promise<void> {
  const supabase = createBrowserClient();

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId); // RLS 會確保只能刪除自己的資料

  if (error) throw error;
}

// 刪除分類（會影響相關交易的 category_id）
async function deleteCategory(categoryId: string, userId: string): Promise<void> {
  const supabase = createBrowserClient();

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', userId);

  if (error) throw error;
}
```

### 使用 Enum Types

```typescript
import type { TransactionType, StatementStatus, RecurringFrequency } from '@/shared/types';
import { Constants } from '@/shared/types/database';

// 類型安全的下拉選單
const transactionTypes: TransactionType[] = Constants.public.Enums.transaction_type;

function TransactionTypeSelect() {
  return (
    <select>
      {transactionTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}

// 類型安全的條件判斷
function getTransactionColor(type: TransactionType): string {
  switch (type) {
    case 'EXPENSE':
      return 'red';
    case 'INCOME':
      return 'green';
    case 'REFUND':
      return 'blue';
    // TypeScript 會確保處理所有情況
  }
}

// 狀態轉換
function canImportStatement(status: StatementStatus): boolean {
  return status === 'EXTRACTED';
}
```

### 使用資料庫函數

```typescript
import { createBrowserClient } from '@/lib/supabase/client';

// 呼叫自定義 PostgreSQL 函數
async function getMonthlySpending(userId: string, year: number, month: number): Promise<number> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_monthly_spending', {
    p_user_id: userId,
    p_year: year,
    p_month: month,
  });

  if (error) throw error;
  return data; // 類型自動推斷為 number
}

// 取得分類總支出
async function getCategoryTotal(userId: string, categoryId: string): Promise<number> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_category_total', {
    p_user_id: userId,
    p_category_id: categoryId,
  });

  if (error) throw error;
  return data; // 類型自動推斷為 number
}

// 取得分類時間區間支出
async function getCategorySpendingByRange(
  userId: string,
  categoryId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_category_spending_by_range', {
    p_user_id: userId,
    p_category_id: categoryId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data; // 類型自動推斷為 number
}
```

---

## 💡 最佳實踐

### 1. 類型匯出策略

```typescript
// ❌ 不好：直接從 database.ts 匯入
import type { Database } from '@/shared/types/database';
type User = Database['public']['Tables']['users']['Row'];

// ✅ 好：使用便利的類型匯出
import type { User } from '@/shared/types';
```

**原因**：`index.ts` 提供了更簡潔的類型名稱，減少重複程式碼。

### 2. 類型擴展

需要擴展自動生成的類型時，建立自定義類型：

```typescript
// packages/supabase-client/src/features/transactions/types.ts
import type { Transaction, Category, Card } from '@/shared/types';

/**
 * Transaction with related data
 * 擴展 Transaction 類型，移除外鍵並加入完整物件
 */
export type TransactionWithRelations = Omit<Transaction, 'category_id'> & {
  category: Category | null;
  card: Card | null;
};

/**
 * Transaction with computed fields
 * 加入前端計算欄位
 */
export type TransactionWithMeta = Transaction & {
  formattedAmount: string; // 格式化金額（例如：$1,234.56）
  formattedDate: string; // 格式化日期（例如：2024/01/15）
  categoryName: string; // 分類名稱
  cardName: string; // 卡片名稱
};
```

### 3. 類型安全查詢

利用 TypeScript 的類型推斷確保查詢安全：

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { Transaction, TransactionInsert } from '@/shared/types';

// ✅ 好：使用類型參數
async function createTransaction(data: TransactionInsert): Promise<Transaction> {
  const supabase = createBrowserClient();

  // TypeScript 會驗證 data 符合 TransactionInsert 類型
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return transaction; // 類型自動推斷為 Transaction
}

// ❌ 不好：使用 any 或不指定類型
async function createTransactionUnsafe(data: any) {
  const supabase = createBrowserClient();
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert(data) // 可能插入錯誤欄位
    .select()
    .single();
  return transaction; // 類型為 any
}
```

### 4. Null 檢查

處理可空欄位時始終進行 null 檢查：

```typescript
import type { Transaction, Category } from '@/shared/types';

// ✅ 好：檢查 null
function displayTransaction(transaction: Transaction, category: Category | null) {
  console.log(transaction.merchant_name); // 必填欄位，不需檢查
  console.log(transaction.description ?? '無描述'); // 選填欄位，使用 ?? 提供預設值

  if (category) {
    console.log(category.name); // 檢查後安全存取
  }
}

// ❌ 不好：忽略 null 可能性
function displayTransactionUnsafe(transaction: Transaction, category: Category | null) {
  console.log(category.name); // 可能會拋出錯誤
}
```

### 5. 日期處理

資料庫返回的日期是 ISO 8601 字串，需要轉換：

```typescript
import type { Transaction } from '@/shared/types';

// ✅ 好：明確轉換日期
function formatTransactionDate(transaction: Transaction): string {
  const date = new Date(transaction.date); // ISO 8601 → Date
  return date.toLocaleDateString('zh-TW'); // Date → 顯示格式
}

// ✅ 好：插入時使用 ISO 8601
const newTransaction: TransactionInsert = {
  user_id: userId,
  type: 'EXPENSE',
  merchant_name: '7-11',
  amount: 150,
  date: new Date().toISOString(), // Date → ISO 8601
};
```

### 6. 類型守衛

建立類型守衛函數檢查執行期類型：

```typescript
import type { Transaction, TransactionType, StatementStatus } from '@/shared/types';
import { Constants } from '@/shared/types/database';

// 檢查是否為有效的交易類型
export function isValidTransactionType(value: unknown): value is TransactionType {
  return Constants.public.Enums.transaction_type.includes(value as TransactionType);
}

// 檢查是否為有效的對帳單狀態
export function isValidStatementStatus(value: unknown): value is StatementStatus {
  return Constants.public.Enums.statement_status.includes(value as StatementStatus);
}

// 使用類型守衛
function processTransaction(data: unknown) {
  if (typeof data === 'object' && data !== null && 'type' in data) {
    if (isValidTransactionType(data.type)) {
      // TypeScript 知道 data.type 是 TransactionType
      console.log(data.type);
    }
  }
}
```

### 7. 泛型查詢函數

建立可重用的類型安全查詢函數：

```typescript
import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/shared/types';

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

// 泛型查詢函數
async function getById<T extends TableName>(table: T, id: string): Promise<TableRow<T> | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();

  if (error) throw error;
  return data; // 類型自動推斷為正確的 Row 類型
}

// 使用泛型函數
const transaction = await getById('transactions', 'some-id'); // 類型為 Transaction | null
const card = await getById('cards', 'some-id'); // 類型為 Card | null
```

---

## 🔄 類型更新工作流程

### 1. Schema 變更

```bash
# 1. 在 supabase/migrations/ 創建新遷移
npx supabase migration new add_field_to_transactions

# 2. 編輯 SQL 檔案
ALTER TABLE transactions ADD COLUMN notes TEXT;

# 3. 應用遷移到本地資料庫
npx supabase db reset

# 4. 重新生成類型
npx supabase gen types typescript --local > packages/supabase-client/src/shared/types/database.ts

# 5. 檢查類型變更
git diff packages/supabase-client/src/shared/types/database.ts

# 6. 更新相關程式碼
# 新欄位 notes 現在會出現在 Transaction、TransactionInsert、TransactionUpdate 類型中

# 7. 推送到遠端（正式環境）
npx supabase db push

# 8. 重新生成遠端類型（確保一致）
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > packages/supabase-client/src/shared/types/database.ts
```

### 2. 檢查類型變更

```bash
# 執行類型檢查
pnpm check-types

# 如果有錯誤，TypeScript 會告訴你哪些地方需要更新
# 例如：
# error TS2339: Property 'notes' does not exist on type 'TransactionInsert'
```

### 3. 更新測試

```typescript
// 更新測試以反映新欄位
describe('Transaction', () => {
  it('should create transaction with notes', async () => {
    const transaction: TransactionInsert = {
      user_id: userId,
      type: 'EXPENSE',
      merchant_name: '7-11',
      amount: 150,
      date: new Date().toISOString(),
      notes: 'Test note', // 新欄位
    };

    const result = await createTransaction(transaction);
    expect(result.notes).toBe('Test note');
  });
});
```

---

## ⚠️ 常見問題

### 1. 類型生成失敗

**問題**：`npx supabase gen types typescript` 失敗

**解決方案**：

```bash
# 檢查是否登入
npx supabase login

# 檢查是否連結專案
npx supabase link --project-ref fstcioczrehqtcbdzuij

# 檢查本地資料庫是否啟動（如果使用 --local）
npx supabase start
```

### 2. 類型不一致

**問題**：本地類型與遠端資料庫不一致

**解決方案**：

```bash
# 從遠端資料庫重新生成類型
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > packages/supabase-client/src/shared/types/database.ts

# 或者從本地資料庫生成（確保本地已同步最新遷移）
npx supabase db reset
npx supabase gen types typescript --local > packages/supabase-client/src/shared/types/database.ts
```

### 3. 關聯查詢類型推斷錯誤

**問題**：使用 `.select('*, category(*)')` 時類型不正確

**解決方案**：建立自定義類型並手動斷言

```typescript
// ❌ 不好：類型推斷不正確
const { data } = await supabase.from('transactions').select('*, category(*)').single();
// data 的類型不包含 category 物件

// ✅ 好：使用自定義類型
import type { TransactionWithRelations } from '@/features/transactions/types';

const { data } = await supabase
  .from('transactions')
  .select('*, category:categories(*), card:cards(*)')
  .single();

const transaction = data as TransactionWithRelations;
// 現在 transaction.category 和 transaction.card 的類型正確
```

### 4. Enum 值驗證

**問題**：需要在執行期驗證 Enum 值

**解決方案**：使用 `Constants` 和類型守衛

```typescript
import { Constants } from '@/shared/types/database';
import type { TransactionType } from '@/shared/types';

// 驗證使用者輸入
function validateTransactionType(input: string): TransactionType {
  if (Constants.public.Enums.transaction_type.includes(input as TransactionType)) {
    return input as TransactionType;
  }
  throw new Error(`Invalid transaction type: ${input}`);
}

// 使用
try {
  const type = validateTransactionType(userInput);
  // type 的類型為 TransactionType
} catch (error) {
  console.error(error.message);
}
```

---

## 🔗 相關文檔

- **Sprint 9, Task 3**：[Supabase 遷移計劃](../../sprints/release-0-foundation/09-supabase-migration-plan.md#task-3)
- **架構設計**：[資料庫設計](../../architecture/database-design.md)
- **React Hooks API**：[hooks.md](./hooks.md)
- **認證指南**：[authentication.md](../guides/authentication.md)
- **Supabase 官方文檔**：[TypeScript Support](https://supabase.com/docs/guides/api/generating-types)

---

**最後更新**：2025-11-24
**狀態**：✅ 完整（Task 3 已完成）
**涵蓋範圍**：所有資料表類型、Insert/Update 類型、Enum 類型、自定義類型、使用範例、最佳實踐
