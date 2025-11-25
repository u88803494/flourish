# 術語表

**目的**: 專案術語參考，確保溝通一致性

**最後更新**: 2025-11-21
**狀態**: 使用中

---

## 📖 如何使用本術語表

**給開發者**:

- 在程式碼、文檔和溝通中一致使用這些術語
- 隨著專案演進添加新術語
- 架構變更時更新定義

**給 AI Agents**:

- 遇到不熟悉的術語時參考本術語表
- 在生成的程式碼和文檔中使用規範術語
- 在所有輸出中保持一致性

---

## 🌱 專案與品牌

### Flourish

**定義**: 整合的個人成長平台，結合財務追蹤與效能統計。

**理念**: "When money flows and statistics rise, everything will flourish."（當金錢流動、統計上升，一切都會繁榮）

**元件**:

- Flow（財務追蹤）
- Apex（效能統計）

**狀態**: 積極開發中，Release 0 已完成

---

## 🏗️ 架構術語

### Supabase-first Architecture

**定義**: 使用 Supabase 作為主要後端的架構模式，消除自訂 API 伺服器。

**取代**: NestJS + Render 架構（Sprint 8 棄用）

**優點**: $0 成本，減少 70% 維護，開發速度快 60%

### Monorepo

**定義**: 使用 Turborepo + pnpm workspaces 包含多個 apps 和 packages 的單一儲存庫。

### RLS (Row Level Security)

**定義**: PostgreSQL 功能，在資料庫層級強制執行資料存取控制。

### ADR (Architecture Decision Record)

**定義**: 記錄重大架構決策的文件。

**位置**: docs/decisions/

---

## 📱 應用程式

### Flow

**全名**: Flow - 財務追蹤應用程式

**Port**: 3100（開發）

**URL**: <https://flourish-flow.vercel.app>

### Apex

**全名**: Apex - 效能統計應用程式

**Port**: 3200（開發）

**URL**: <https://flourish-apex.vercel.app>

---

## 📦 套件

### @repo/supabase-client

**目的**: 集中式 Supabase 客戶端配置與 React hooks

### @repo/database

**目的**: 使用 Prisma 的資料庫 schema 參考（僅參考用）

### @repo/ui

**目的**: 使用 Tailwind CSS 的共享 React 元件

---

## 🗄️ 資料庫術語

### Migration

**定義**: 定義資料庫 schema 變更的 SQL 檔案

**位置**: supabase/migrations/

### Schema

**定義**: 資料庫結構定義（表、欄位、關係）

### Transaction

**定義**: 單筆財務交易記錄（收入或支出）

---

## 🔐 安全術語

### JWT (JSON Web Token)

**定義**: Supabase Auth 使用的 token-based 認證標準

### Anon Key

**目的**: 前端使用安全的公開 API 金鑰

### Service Role Key

**目的**: 繞過 RLS 策略的管理 API 金鑰（⚠️ 絕不暴露給前端！）

---

## 🚀 部署術語

### Vercel

**定義**: 具全球 CDN 的前端託管平台

### Supabase Cloud

**定義**: 具 BaaS 功能的託管 PostgreSQL 託管

**Project Ref**: fstcioczrehqtcbdzuij

---

## 🏃 開發術語

### Sprint

**定義**: 具特定目標的時間框限開發迭代

**編號**: 將從 0.1-0.11 重新編號為 01-11（Sprint 11）

### Release

**定義**: 由多個 Sprint 組成的主要開發里程碑

**範例**: Release 0 (Foundation), Release 1 (Core Features)

### MCP (Model Context Protocol)

**定義**: AI agents 存取外部工具和服務的標準

### Conventional Commits

**格式**: `<type>(<scope>): <subject>`

---

## 🎨 UI/UX 術語

### Design Tokens

**定義**: 集中式設計值（顏色、間距、排版）

### Component

**定義**: 可重用的 React UI 構建塊

### Server Component

**定義**: 在伺服器上執行的 React 元件（Next.js 15 功能）

### Client Component

**定義**: 在瀏覽器中執行的 React 元件

---

## 📊 資料術語

### KPI (Key Performance Indicator)

**定義**: 追蹤財務績效的可衡量值

### Category

**定義**: 交易的分類（收入或支出）

### Recurring Expense

**定義**: 按計劃重複的自動化費用

### Saving Rule

**定義**: 基於條件的自動化儲蓄規則

---

## 🛠️ 工具術語

### Turborepo

**定義**: JavaScript/TypeScript 的 Monorepo 建置系統

### pnpm

**定義**: 快速、節省磁碟空間的套件管理器

### Prettier

**定義**: 一致風格的程式碼格式化工具

### Husky

**定義**: Git hooks 管理器

### Type Check

**定義**: TypeScript 類型驗證過程

**指令**: `pnpm check-types`

### Lint

**定義**: 程式碼風格與潛在錯誤檢查工具

**指令**: `pnpm lint` 或 `pnpm lint --fix`

---

## 📝 文檔術語

### Diataxis Framework

**定義**: 具 4 個類別的文檔結構框架（Tutorials、How-to、Reference、Explanation）

**參考**: <https://diataxis.fr/>

### CLAUDE.md

**目的**: 主要 AI agent 指令檔案

### AGENTS.md

**目的**: AI agent 協作與工作流程指南

### ARCHITECTURE.md

**目的**: 系統架構文檔

---

## 🔗 縮寫與簡稱

| 縮寫 | 完整術語                          |
| ---- | --------------------------------- |
| ADR  | Architecture Decision Record      |
| API  | Application Programming Interface |
| CRUD | Create, Read, Update, Delete      |
| JWT  | JSON Web Token                    |
| KPI  | Key Performance Indicator         |
| MCP  | Model Context Protocol            |
| RLS  | Row Level Security                |
| UUID | Universally Unique Identifier     |

---

**維護者**: Flourish Team
**上次審查**: Sprint 10 (2025-11-21)
