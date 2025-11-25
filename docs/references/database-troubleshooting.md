# Database Troubleshooting Reference

常見數據庫問題和快速解決方案。

**Last Updated**: 2025-10-31

---

## 🚨 連接相關錯誤

### P1001: Can't reach database server

**完整錯誤**:

```
Error: P1001: Can't reach database server at `db.fstcioczrehqtcbdzuij.supabase.co:5432`
Please make sure your database server is running at `db.fstcioczrehqtcbdzuij.supabase.co:5432`.
```

**最可能的原因**: 使用了直接連接（Direct Connection），本地網絡是 IPv4

**快速修復**:

1. 打開 Supabase Dashboard
2. 點 **Connect** → **Connection String**
3. 在 "Method" 改選 **Session pooler**
4. 複製新連接字符串
5. 更新 `.env` 中的 `DATABASE_URL`
6. 重新運行 migration

**驗證修復**:

```bash
npx prisma db execute --stdin --schema=packages/database/prisma/schema.prisma << 'EOF'
SELECT version();
EOF
```

---

### FATAL: Tenant or user not found

**完整錯誤**:

```
Error: Schema engine error:
FATAL: Tenant or user not found

Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-1-ap-northeast-1.pooler.supabase.com:5432"
```

**原因**: 連接字符串中用戶信息格式錯誤

**檢查清單**:

| 項目 | 正確 ✅                                    | 錯誤 ❌                               |
| ---- | ------------------------------------------ | ------------------------------------- |
| User | `postgres.fstcioczrehqtcbdzuij`            | `postgres`                            |
| Host | `aws-1-ap-northeast-1.pooler.supabase.com` | `db.fstcioczrehqtcbdzuij.supabase.co` |
| Port | `5432`                                     | `6543` (除非用 Transaction mode)      |

**正確的 CONNECTION_STRING**:

```
postgresql://postgres.YOUR_PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**修復步驟**:

1. 去 Supabase Dashboard → Settings → API
2. 確認你的 Project ID
3. 在 `.env` 中更新 `DATABASE_URL`：

   ```env
   DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
   ```

4. 重試連接

---

### ECONNREFUSED or timeout

**症狀**: 連接立即失敗，看不到任何有用的錯誤訊息

**可能的原因**:

- 防火牆阻止連接
- 網絡不穩定
- Supabase 服務暫時不可用
- 使用了錯誤的連接模式

**快速修復**:

1. 檢查網絡連接
2. 確認 Supabase Dashboard 可以訪問
3. 確認使用 **Session Pooler** 而非 Direct Connection
4. 稍等 1-2 分鐘後重試（服務可能在初始化）

**詳細診斷**:

```bash
# 測試 DNS 解析
nslookup aws-1-ap-northeast-1.pooler.supabase.com

# 測試連接（如果安裝了 psql）
psql "postgresql://postgres.YOUR_PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

---

## 🔄 Migration 相關錯誤

### Migration 無限期等待

**症狀**: `prisma migrate dev` 運行很久都沒反應

**可能的原因**:

- 網絡連接中斷
- Supabase 數據庫正在初始化
- 數據庫性能受限

**解決**:

1. **等待 2-3 分鐘** - Supabase 首次初始化可能很慢
2. **檢查 Supabase 狀態** - 查看 Dashboard 是否正常
3. **增加超時時間** - 編輯 `packages/database/prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // 增加連接超時（毫秒）
  // directUrl = env("DIRECT_URL")  // 可選：直接連接用於 migrations
}
```

1. **重新啟動** - 中止遷移（Ctrl+C），檢查數據庫狀態後重試

---

### Migration 衝突

**症狀**:

```
Error: A migration cannot be applied when a database is in a state of confusion.
Please make sure all migrations are fully applied.
```

**原因**: Prisma 認為數據庫狀態不一致

**修復**:

1. **檢查遷移歷史**:

```bash
npx prisma migrate status --schema=packages/database/prisma/schema.prisma
```

1. **如果只是本地開發，可以重置**:

```bash
npx prisma migrate reset --schema=packages/database/prisma/schema.prisma
```

⚠️ **警告**: `migrate reset` 會刪除所有數據！僅在開發環境使用。

1. **如果是生產環境，需要手動修復**（請聯繫 DBA）

---

## 🔐 安全和權限相關

### RLS (Row Level Security) Warning

**警告信息**:

```
RLS Disabled in Public
Detects cases where row level security (RLS) has not been enabled on tables
```

**這是安全最佳實踐警告，不是錯誤。**

**何時需要修復**: 實現認證系統時（Sprint 1+）

**目前可以忽略**: MVP 階段不需要 RLS，我們先確保功能正常運行。

---

### Permission Denied on table

**完整錯誤**:

```
ERROR: permission denied for schema public
```

**原因**: 使用的數據庫用戶沒有足夠權限

**修復**:

1. 在 Supabase Dashboard 使用 `postgres` 用戶重新執行 migration
2. 或聯繫專案所有者重新授予權限

```sql
-- Supabase SQL Editor 中運行（管理員用戶）
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

---

## 🧪 驗證和診斷

### 驗證數據庫連接

```bash
# 最簡單的驗證 - 運行 Prisma 生成
npx prisma generate --schema=packages/database/prisma/schema.prisma

# 如果這個成功，說明連接正常
```

### 檢查表格是否存在

```bash
npx prisma db execute --stdin --schema=packages/database/prisma/schema.prisma << 'EOF'
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
EOF
```

### 查看遷移歷史

```bash
npx prisma migrate status --schema=packages/database/prisma/schema.prisma
```

### 打開 Prisma Studio（可視化瀏覽）

```bash
cd packages/database
npx prisma studio
```

---

## 📋 常見問題清單

遇到問題時按順序檢查：

- [ ] `.env` 文件存在且有 `DATABASE_URL`
- [ ] `DATABASE_URL` 使用 Session Pooler（不是 Direct Connection）
- [ ] 密碼正確填入（不是 `[YOUR-PASSWORD]` 字符）
- [ ] 用戶名格式：`postgres.YOUR_PROJECT_ID`（包含點和項目 ID）
- [ ] Host 是 pooler URL：`aws-1-ap-northeast-1.pooler.supabase.com`
- [ ] Supabase Dashboard 可以正常訪問
- [ ] 網絡連接正常（測試其他網站）

---

## 🔗 相關資源

- [Database Setup Guide](../guides/database-setup.md) - 完整設置步驟
- [Prisma Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-databases)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)

---

## 💡 快速參考

### Session Pooler vs Direct Connection

使用 **Session Pooler**（推薦）：

```
postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**不要**使用 Direct Connection（容易出現 IPv4 錯誤）：

```
❌ postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
```

### Migration 命令速查

```bash
# 運行待執行的遷移
npx prisma migrate dev --name MIGRATION_NAME

# 查看遷移狀態
npx prisma migrate status

# 列出所有遷移
npx prisma migrate list

# 重置數據庫（開發環境專用！）
npx prisma migrate reset

# 在已有數據庫上創建 schema
npx prisma db push

# 從現有數據庫反向工程 schema
npx prisma db pull
```

---

**仍然無法解決？** 提交 issue 或查看相關文檔！
