# 資料庫設置指南

> ⚠️ **已棄用**: 本指南描述舊的 Prisma 為主的設置（Phase 0，Sprint 0.8 之前）。
>
> **目前架構（Sprint 0.8+）**：Flourish **直接使用 Supabase**，不使用 Prisma 或 NestJS。
>
> **目前的資料庫設置**，請參考：
>
> - [Supabase 遷移方法](./supabase-migration-approaches.md) - 遷移方法說明
> - [ADR 002 - Imperative Migrations](../decisions/002-imperative-migrations.md) - 架構決策
> - [Sprint 0.9.2 文檔](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md) - 遷移實作
>
> 本文件僅保留作為歷史參考。

---

完整的 Supabase + Prisma 資料庫設置指南，適用於本地開發和新團隊成員。

**上次更新**: 2025-10-31
**狀態**: ⚠️ 已棄用（已由 Supabase 優先方法取代）

---

## 📋 概述

> **Historical Note**: This describes the Phase 0 architecture before ADR 001.

Flourish 使用 **Supabase** (PostgreSQL) 作為數據庫，**Prisma ORM** 作為數據訪問層。

本指南涵蓋：

- Supabase 專案創建
- 連接方式配置（解決 IPv4/IPv6 問題）
- 環境變數設置
- 首次遷移執行
- 驗證設置

---

## 📦 前置要求

- Supabase 帳戶 (免費) - https://supabase.com
- Node.js 18+ 和 pnpm 9+
- 文本編輯器（能編輯 `.env` 文件）

---

## 🚀 Step 1: 創建 Supabase 專案

### 1.1 登入 Supabase

1. 前往 https://supabase.com
2. 點 "Sign In" 或 "Start Your Project"
3. 使用 GitHub 或其他方式註冊/登入

### 1.2 建立新專案

1. 點 "New Project"
2. **Project Name**: `flourish` （或你喜歡的名字）
3. **Database Password**: 設置一個強密碼（會在後續使用）
4. **Region**: 選擇 **Tokyo (ap-northeast-1)** 或最接近你的區域

> 💡 **地區選擇很重要**: 選擇地理位置最接近你的地區以降低延遲

### 1.3 等待專案初始化

Supabase 會在 2-3 分鐘內建立新專案。初始化完成後，你會看到 Dashboard。

---

## 🔌 Step 2: 理解連接模式（重要！）

### 為什麼有多種連接方式？

Supabase 提供 3 種連接模式來解決不同的使用場景：

| 模式                   | Port | 適合場景             | IPv4 支援   | Prepared Statements |
| ---------------------- | ---- | -------------------- | ----------- | ------------------- |
| **Direct Connection**  | 5432 | 長期連接的伺服器     | ⚠️ 有時失敗 | ✅ 是               |
| **Session Pooler**     | 5432 | 一般開發環境（推薦） | ✅ 是       | ✅ 是               |
| **Transaction Pooler** | 6543 | Serverless 函數      | ✅ 是       | ❌ 否               |

### 推薦方案：Session Pooler

**為什麼？**

- ✅ 支援 IPv4（解決本地網絡問題）
- ✅ 支援 Prepared Statements（Prisma 需要）
- ✅ 性能穩定（連接池化）
- ✅ 適合開發和生產環境

### 常見問題：IPv4/IPv6 衝突

如果你看到錯誤：

```
Error: Can't reach database server at db.xxx.supabase.co:5432
```

**原因**: 你的本地網絡是 IPv4，Supabase 默認使用 IPv6

**解決**: 使用 Session Pooler 連接字符串（見下一步）

---

## 🔑 Step 3: 取得連接字符串

### 3.1 打開 Supabase Dashboard

1. 在 Supabase Dashboard 點 **"Connect"** 按鈕（右上角）
2. 選擇 **"Connection String"** tab

### 3.2 選擇 Session Pooler

在 "Method" 下拉選單中，選擇 **"Session pooler"**

你會看到連接字符串：

```
postgresql://postgres.fstcioczrehqtcbdzuij:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

⚠️ **重要**: `[YOUR-PASSWORD]` 是你在步驟 1.2 設置的數據庫密碼，需要手動填入！

### 3.3 複製其他必要的認證信息

還需要以下信息（在 Settings > API）：

1. **Project URL** - 格式: `https://fstcioczrehqtcbdzuij.supabase.co`
2. **Anon Public Key** - 以 `eyJ` 開頭
3. **Service Role Key** - 以 `eyJ` 開頭
4. **JWT Secret** - Settings > JWT Keys > Reveal

---

## 🔐 Step 4: 配置環境變數

### 4.1 編輯 `.env` 文件

在專案根目錄開啟 `.env` 文件：

```env
# 數據庫連接（使用 Session Pooler）
DATABASE_URL=postgresql://postgres.fstcioczrehqtcbdzuij:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# Supabase 前端 URL
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co

# Supabase Anon Key（前端可見，安全的）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Service Role Key（後端私密）
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT Secret（後端私密）
SUPABASE_JWT_SECRET=your_jwt_secret
```

> ⚠️ **安全提醒**: `.env` 已在 `.gitignore` 中，不會被提交到 git。保護好你的密鑰！

### 4.2 驗證環境變數

檢查 `.env` 中是否有：

- ✅ `DATABASE_URL` 指向 Session Pooler
- ✅ `NEXT_PUBLIC_SUPABASE_URL` 是你的 Project URL
- ✅ 所有 KEY 都已填入（沒有空值）

---

## 📦 Step 5: 執行 Prisma Migration

### 5.1 安裝依賴

```bash
pnpm install
```

### 5.2 運行遷移

```bash
npx prisma migrate dev --name init --schema=packages/database/prisma/schema.prisma
```

這個命令會：

1. 連接到 Supabase 數據庫
2. 執行 `packages/database/prisma/migrations/0_init/migration.sql`
3. 創建以下表格：
   - `users` - 用戶信息
   - `cards` - 信用卡管理
   - `statements` - 對帳單
   - `transactions` - 交易記錄
   - `categories` - 分類
   - `recurring_expenses` - 循環支出（Sprint 2+）
   - `saving_rules` - 儲蓄規則（Sprint 2+）

### 5.3 預期輸出

成功運行應該看到：

```
Applying migration `0_init`
The following migration(s) have been applied:
  migrations/
    └─ 0_init/
      └─ migration.sql
Your database is now in sync with your schema.
```

---

## ✅ Step 6: 驗證設置

### 6.1 在 Supabase Dashboard 驗證

1. 前往 Supabase Dashboard
2. 點 **"Table Editor"**
3. 應該看到 8 個新表格：
   - `_prisma_migrations`
   - `users`
   - `cards`
   - `statements`
   - `transactions`
   - `categories`
   - `recurring_expenses`
   - `saving_rules`

### 6.2 (可選) 使用 Prisma Studio

```bash
cd packages/database && npx prisma studio
```

這會打開互動式數據庫瀏覽器，可視化查看所有表和數據。

---

## 🔧 常見問題與解決方案

### ❌ 連接錯誤：`Can't reach database server`

**症狀**:

```
Error: P1001: Can't reach database server at db.fstcioczrehqtcbdzuij.supabase.co:5432
```

**原因**: 使用了直接連接（Direct Connection），而你的網絡是 IPv4

**解決**:

1. 回到 Supabase Connect 頁面
2. 在 "Method" 改選 **"Session pooler"**
3. 複製新的連接字符串到 `.env` 的 `DATABASE_URL`
4. 重新運行 migration

---

### ❌ 連接錯誤：`Tenant or user not found`

**症狀**:

```
Error: Schema engine error:
FATAL: Tenant or user not found
```

**原因**: 連接字符串中的用戶格式錯誤

**檢查清單**:

- ✅ User 應該是 `postgres.YOUR_PROJECT_ID`（包含點號和項目 ID）
- ✅ 不是只有 `postgres`
- ✅ 密碼正確填入
- ✅ 主機名是 pooler URL：`aws-1-ap-northeast-1.pooler.supabase.com`

**正確格式**:

```
postgresql://postgres.fstcioczrehqtcbdzuij:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

---

### ⚠️ Security Warning：RLS Disabled

Supabase Dashboard 可能顯示警告：

```
RLS Disabled in Public
Detects cases where row level security (RLS) has not been enabled on tables
```

**這是正常的！**

RLS (Row Level Security) 是安全最佳實踐，但不是必要的。我們會在實現認證系統（Sprint 1+）時啟用 RLS。

---

### 🐌 遷移超時

**症狀**: Migration 運行很久都沒完成

**解決**:

1. 檢查 Supabase 數據庫狀態（可能正在初始化）
2. 稍等片刻後重試
3. 檢查網絡連接
4. 如果仍然超時，可能需要增加 `connect_timeout`：

```prisma
// packages/database/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // 如需要
}
```

---

## 📚 相關文檔

### Current Documentation (Sprint 0.8+)

- **[Supabase Migration Approaches](./supabase-migration-approaches.md)** ⭐ - Comprehensive guide to migration methods
- **[ADR 002 - Imperative Migrations](../decisions/002-imperative-migrations.md)** - Why we chose Imperative over Declarative
- [Sprint 0.9.2 Documentation](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md) - Implementation details

### Historical Documentation (Pre-Sprint 0.8)

- [Database Design](../architecture/database-design.md) - 詳細的 schema 設計說明
- [Prisma Guide](../references/prisma-guide.md) - Prisma ORM 使用指南
- [Development Setup](./development-setup.md) - 完整開發環境設置

---

## 🆘 需要幫助？

如果遇到本指南未涵蓋的問題：

1. 檢查 [Database Troubleshooting](../references/database-troubleshooting.md)
2. 查看 [Prisma 文檔](https://www.prisma.io/docs/)
3. 查看 [Supabase 文檔](https://supabase.com/docs)
4. 在專案 Issue 或討論中提問

---

**成功完成本指南？** 🎉 現在你可以開始開發 Flourish 的功能了！

下一步：

- 查看 [Sprint 0.5 requirements](../sprints/sprint-0-foundation/requirements.md)
- 開始實現 PDF 上傳功能
- 集成 AI 交易辨識
