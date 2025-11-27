# ADR 003: 認證策略 - 採用 Supabase Auth 並保留 Clerk 遷移路徑

## 狀態

✅ **已採納** - 2025-11-26

## 背景

在 Sprint 12 開始前，我們需要為 Flourish 平台實作用戶認證功能。在實作前，我們研究了市場上的認證方案，以找出最適合我們架構和需求的解決方案。

### 專案背景

- **框架**：Next.js 15 (App Router) + React 19
- **後端**：Supabase（依據 ADR 001）
- **部署**：Vercel
- **現有套件**：`@repo/supabase-client`
- **架構決策**：Supabase-first 方針（ADR 001）
- **成本目標**：$0/月

### 評估的選項

1. **Supabase Auth** - Supabase 平台內建的認證功能
2. **Clerk** - Vercel Marketplace 上的專業認證平台
3. **NextAuth.js v5 (Auth.js)** - 開源認證函式庫
4. **Auth0** - 企業級認證解決方案
5. **Lucia Auth** - ❌ 已於 2025 年 3 月棄用

## 決策

**採用 Supabase Auth** 作為主要認證方案，同時記錄未來遷移至 Clerk 的路徑。

## 理由

### 1. 方案比較

| 評估標準          | Supabase Auth  | Clerk         | NextAuth.js v5 |
| ----------------- | -------------- | ------------- | -------------- |
| **設定時間**      | 1-2 小時       | 30 分鐘       | 1-3 小時       |
| **免費 MAU 上限** | 50,000         | 10,000        | 無限制         |
| **月費**          | $0 → $25 (Pro) | $0 → $25+     | $0             |
| **預建 UI**       | ❌ 無          | ✅ 有         | ❌ 無          |
| **效能**          | 18.3ms         | 12.5ms        | 15.8ms         |
| **Supabase 整合** | ✅ 原生        | ⚠️ 需設定     | ⚠️ 需設定      |
| **符合 ADR 001**  | ✅ 完全符合    | ❌ 新增供應商 | ⚠️ 部分符合    |

### 2. 為什麼選擇 Supabase Auth？

#### 符合現有架構（ADR 001）

- 專案已採用 Supabase-first 架構
- 單一平台管理（資料庫 + 認證 + API）
- 不增加額外供應商依賴
- `@repo/supabase-client` 套件已存在

#### 成本最佳化

| 月活躍用戶 (MAU) | Clerk 費用 | Supabase Auth 費用 |
| ---------------- | ---------- | ------------------ |
| 5,000            | 免費       | 免費               |
| 10,000           | $25/月     | 免費               |
| 50,000           | ~$125/月   | 免費               |
| 100,000          | ~$250/月   | $25/月 (Pro)       |

Supabase Auth 維持 ADR 001 設定的 $0/月目標。

#### 原生 RLS 整合

- Row Level Security 策略與 Supabase Auth 無縫整合
- RLS 策略可直接使用 `auth.uid()` 函數
- 資料庫層級安全性，無需額外設定

#### 降低維護負擔

- 只需管理單一儀表板（Supabase）
- 無需在認證提供者和資料庫之間同步資料
- 統一的除錯和監控

### 3. 為什麼現在不選 Clerk？

Clerk 確實有吸引人的優勢：

**Clerk 的優點**：

- ⚡ 設定最快（30 分鐘）
- 🎨 漂亮的預建 UI 元件
- 🚀 效能最佳（12.5ms）
- 🏢 優秀的 B2B 功能（組織、角色）

**現在不選 Clerk 的原因**：

- 💰 規模化後有額外成本（超過 10K MAU 後 $25+/月）
- 🔧 引入新供應商（違反單一平台目標）
- 📊 需要管理兩個儀表板
- 🔄 Clerk 和 Supabase 之間的資料同步複雜度

### 4. 為什麼不選 NextAuth.js v5？

- 需要額外的 Supabase 整合工作
- 沒有預建 UI（和 Supabase Auth 一樣需要自建）
- 增加複雜度但對我們的用例沒有顯著好處
- 仍然需要自己建立登入/註冊頁面

## 遷移路徑：Supabase Auth → Clerk

### 為什麼這個方向比較好

如果未來需要 Clerk 的功能，從 Supabase Auth 遷移到 Clerk 相對簡單：

| 方向             | 難度        | 用戶影響        |
| ---------------- | ----------- | --------------- |
| Supabase → Clerk | ⭐⭐ 簡單   | ✅ 密碼可保留   |
| Clerk → Supabase | ⭐⭐⭐ 困難 | ⚠️ 需要重設密碼 |

### 遷移可行性

**Clerk 支援匯入現有用戶**：

```bash
POST /v1/users
{
  "email_address": ["user@example.com"],
  "password": "hashed_password",
  "password_hasher": "bcrypt"  # Supabase 使用 bcrypt
}
```

**關鍵點**：Supabase Auth 使用 bcrypt 進行密碼雜湊，Clerk 可以直接匯入。用戶不需要重設密碼。

### 預估遷移工作量

| 步驟       | 時間            | 說明                      |
| ---------- | --------------- | ------------------------- |
| 設定 Clerk | 30 分鐘         | 建立專案、配置環境        |
| 匯出用戶   | 30 分鐘         | 從 Supabase 執行 SQL 查詢 |
| 匯入用戶   | 1 小時          | 使用 Clerk API 批量匯入   |
| 程式碼修改 | 2-3 小時        | 替換認證相關程式碼        |
| 測試       | 1 小時          | 驗證流程正常              |
| **總計**   | **約 5-6 小時** | 一次性遷移                |

### 何時考慮遷移

在以下情況考慮遷移至 Clerk：

- [ ] 需要快速獲得精美的預建認證 UI
- [ ] 需要 B2B 功能（組織、角色、多租戶）
- [ ] 團隊規模擴大，需要更快的開發速度
- [ ] 預算允許 $25+/月的認證費用
- [ ] 認證流程的用戶體驗成為關鍵差異化因素

## 實作計劃

### 階段 1：環境設定（15-20 分鐘）

```bash
# 確認 Next.js 版本（安全性）
# 必須升級至 15.2.3+ 以修復 CVE-2025-29927
pnpm add next@latest

# 安裝依賴（可能已存在）
cd packages/supabase-client
pnpm add @supabase/ssr @supabase/supabase-js
```

### 階段 2：伺服器/客戶端工具（20-30 分鐘）

建立伺服器端 client：

```typescript
// packages/supabase-client/src/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

### 階段 3：Middleware（15-20 分鐘）

```typescript
// apps/flow/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.getSession();
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### 階段 4：認證 UI（30-40 分鐘）

使用 Supabase Auth 方法建立自訂登入/註冊頁面。

### 階段 5：RLS 策略（15-20 分鐘）

```sql
-- 啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 建立策略
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);
```

## 安全考量

### CVE-2025-29927 漏洞

**重要**：Next.js 版本 11.1.4 - 15.2.2 存在漏洞，允許繞過 middleware 認證。

**必要行動**：在實作認證前升級至 Next.js 15.2.3 或更高版本。

```bash
pnpm add next@15.2.3
```

### 2025 最佳實踐

- 使用 cookie-based 認證（HTTP-only cookies）
- Server Components 使用 `createServerClient`
- Client Components 使用 `createBrowserClient`
- Middleware 自動處理 session 刷新

## 正面影響

1. **成本**：維持 $0/月目標（ADR 001）
2. **簡潔**：單一平台管理
3. **安全**：原生 RLS 整合
4. **彈性**：清晰的 Clerk 遷移路徑
5. **一致性**：符合現有架構決策

## 負面影響與緩解措施

### 1. 沒有預建 UI

**影響**：需要手動建立登入/註冊頁面

**緩解**：

- 使用 Tailwind CSS 快速開發 UI
- 考慮使用 shadcn/ui 元件
- 一次性工作，完全控制設計

### 2. 初始設定時間較長

**影響**：1-2 小時 vs Clerk 的 30 分鐘

**緩解**：

- 完整的實作步驟文件
- 可重用的模式供未來專案使用
- 長期成本節省可彌補初始投資

### 3. 效能差距

**影響**：18.3ms vs Clerk 的 12.5ms（差距 5.8ms）

**緩解**：

- 差距對用戶不可感知
- 對當前規模足夠
- 需要時可後續優化

## 參考資料

### 內部文件

- [ADR 001: 架構簡化](./001-architecture-simplification.md)
- [Sprint 12: 認證功能](../sprints/release-1-core-features/12-authentication.md)

### 外部資源

- [Supabase Auth 文件](https://supabase.com/docs/guides/auth)
- [Supabase SSR 套件](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js 15 認證](https://nextjs.org/docs/app/building-your-application/authentication)
- [Clerk 文件](https://clerk.com/docs)
- [Clerk 定價](https://clerk.com/pricing)

### 研究來源

- [Clerk vs Supabase Auth 比較](https://www.getmonetizely.com/articles/clerk-vs-supabase-auth-how-to-choose-the-right-authentication-service-for-your-budget)
- [2025 Next.js App Router 完整認證指南](https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router)
- [2025 認證提供者比較](https://kinde.com/comparisons/top-authentication-providers-2025/)

## 決策者

- **提議者**：Henry Lee
- **日期**：2025-11-26
- **背景**：Sprint 12 認證規劃

## 審查時程

### 下次審查觸發條件

- Sprint 12 完成後（評估實作經驗）
- Release 1 完成後（評估整體認證體驗）
- 如果需要 B2B 功能（考慮遷移至 Clerk）
- 如果用戶成長超過 50K MAU（評估擴展需求）

### 預期穩定性

此決策預計在 Release 1 期間保持穩定。如果出現 B2B 功能或進階認證需求，建議在 Release 2 時重新評估。

---

**最後更新**：2025-11-26
**狀態**：已採納，待實作
