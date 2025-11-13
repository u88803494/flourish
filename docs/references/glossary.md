# 專案詞彙表 (Glossary)

**最後更新**: 2025-11-13

本文件定義了 Flourish 專案中使用的核心術語，以確保團隊成員（包括 AI 助手）對概念有一致的理解。

---

## A

### ADR (Architecture Decision Record)

- **定義**: 一種用來記錄重要架構決策的文檔。它解釋了「為什麼」我們做出某個技術選擇，以及權衡了哪些替代方案。
- **位置**: `docs/decisions/`

### Apex

- **定義**: Flourish 專案中的「統計追蹤應用」。它是一個基於山達基狀況公式，用於繪製統計曲線、追蹤績效的工具。
- **理念**: 追蹤統計的頂點 (Apex)，幫助使用者達到權勢狀況 (Power Condition)。

## C

### Condition Formula (狀況公式)

- **定義**: 源自山達基管理技術的一套方法論，用於根據統計數據的趨勢來判斷當前的「狀況」（如：緊急、正常、富裕），並提供相應的行動步驟來改善狀況。
- **應用**: Apex 應用的核心分析引擎。

## F

### Flow

- **定義**: Flourish 專案中的「財務追蹤應用」。它是一個專為信用卡重度使用者設計的記帳工具，核心流程是處理每月 PDF 對帳單。
- **理念**: 金錢即流動 (Flow)，透過管理財務流動來創造富足。

## O

### OpenAPI Specification

- **定義**: 一套用於定義 RESTful API 結構的行業標準。它通常是一個 JSON 或 YAML 檔案，可以用來自動生成互動式 API 文檔、客戶端程式碼等。
- **應用**: 我們使用它來記錄 Supabase 自動生成的 API，作為 AI 和開發者的「API 說明書」。
- **位置**: `docs/references/api/supabase-openapi-spec.yaml`

## P

### Pre-Deduction System (預扣系統)

- **定義**: Flourish 的核心預算計算模型。它透過在總收入中預先扣除「固定月費」、「分攤年費」和「自動儲蓄」，來計算出使用者「真正可用的預算」。
- **公式**: `實際可用金額 = 總收入 - 自動儲蓄 - 固定月費 - 分攤年費`

## S

### Statement-Centric Model (以帳單為中心的模型)

- **定義**: Flourish 專案的資料庫核心架構。所有交易 (Transaction) 都必須源自於一份對帳單 (Statement)，而不是獨立存在。
- **流程**: `User` → `Card` → `Statement` → `Transaction`
- **實作**: 參考資料庫 schema（`supabase/migrations/`）

### Supabase-first

- **定義**: 本專案採用的後端架構，即前端應用直接與 Supabase 的服務（資料庫、認證、API）互動，移除了獨立的 NestJS 後端層。
- **決策**: `docs/decisions/001-architecture-simplification.md`
