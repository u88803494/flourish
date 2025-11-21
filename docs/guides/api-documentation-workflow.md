# API 文檔與類型自動化工作流程

**最後更新**: 2025-11-13
**架構**: Supabase-first

## 🎯 目的

在沒有獨立後端的情況下，我們需要一個可靠的機制來記錄 Supabase 自動生成的 API，並確保前端在與之互動時的型別安全。本指南定義了相關的自動化工作流程。

這套流程是 AI 助手（如 Claude）與專案協作的基礎，也是開發者的「單一事實來源」。

## 核心工具

1.  **Supabase CLI**: 用於從資料庫生成規格與型別。
2.  **OpenAPI Specification**: 作為 API 的「說明書」。
3.  **TypeScript Types**: 作為資料庫結構在程式碼中的「強型別對映」。

---

## 流程一：同步 OpenAPI 規格

**目的**: 讓 AI 和開發者知道目前有哪些 API 端點、欄位和可用的過濾操作。

### 何時執行？

- 當資料庫結構有**重大變更**時（例如，新增資料表、新增或移除欄位）。
- 定期執行（例如，每個 Sprint 開始時），以確保文件最新。

### 如何執行？

1.  **產生 OpenAPI 規格**

    ```bash
    # 使用 Supabase CLI 產生 OpenAPI 規格
    npx supabase gen types typescript --local > docs/references/api/supabase-openapi-spec.yaml
    ```

    **注意**：
    - 這需要本地 Supabase 服務正在運行（`npx supabase start`）
    - 或者連接到遠端專案（`npx supabase link`）
    - 產生的是 TypeScript 型別，OpenAPI spec 需要從 Supabase Dashboard 下載

2.  **替代方案：從 Supabase Dashboard 下載**
    - 前往 Supabase Dashboard → API → API docs
    - 下載 OpenAPI specification
    - 儲存到 `docs/references/api/supabase-openapi-spec.yaml`

3.  **提交變更**
    將更新後的規格檔案 commit 到 Git。

### 如何使用？

- **給 AI 的指令**: "在撰寫任何 Supabase 查詢前，請務必參考 `docs/references/api/supabase-openapi-spec.yaml` 檔案，以了解可用的 API 和參數。"
- **給開發者**: 可以使用任何 OpenAPI 預覽工具（如 VS Code 的擴充套件）來查看這份文件。

---

## 流程二：生成 TypeScript 類型

**目的**: 在前端程式碼中實現完整的型別安全，讓每一次資料庫互動都有 IDE 的自動補全和編譯時檢查。

### 何時執行？

- **每次**資料庫結構變更後（例如，執行了一次 `supabase db push`）。
- 這是確保型別安全的關鍵步驟。

### 如何執行？

**注意**: `@repo/supabase-client` 套件將在 **Sprint 9, Task 3** 建立。在此之前，請使用以下指令：

```bash
# Sprint 9, Task 3 之後
pnpm --filter=@repo/supabase-client generate-types

# Sprint 9, Task 3 之前（暫時）
npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > temp-types.ts
```

這個指令會執行 `packages/supabase-client/package.json` 中定義的腳本：

```json
"scripts": {
  "generate-types": "npx supabase gen types typescript --project-id fstcioczrehqtcbdzuij > src/types.ts"
}
```

它會自動覆寫 `packages/supabase-client/src/types.ts` 檔案，使其與最新的資料庫結構保持同步。

### 如何使用？

在你的 Supabase client 初始化檔案中，傳入生成的型別：

```typescript
// packages/supabase-client/src/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types'; // 👈 導入生成的型別

// ...

// 建立 client 時傳入型別
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

- **給 AI 的指令**: "所有資料庫相關的型別，都必須從 `@repo/supabase-client` 導入，不准手寫 `interface`。"
- **給開發者**: 享受 VS Code 帶來的完整自動補全和型別檢查。
