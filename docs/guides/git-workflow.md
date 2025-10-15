# Git Workflow 和 Commit 規範

本文檔定義了 Flourish 專案的 Git 工作流程和 Commit Message 規範。

---

## 🎯 核心原則

1. **遵循 Conventional Commits 規範**
2. **每次 commit 只做一件事**
3. **commit message 要清楚描述「做了什麼」和「為什麼」**
4. **使用英文撰寫 commit message**
5. **頻繁 commit，小步快跑**

---

## 📝 Commit Message 格式

### 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 詳細說明

#### 1. Type（必填）

定義 commit 的類型：

| Type | 用途 | 範例 |
|------|------|------|
| `feat` | 新功能 | `feat(flow): add transaction list page` |
| `fix` | 修復 bug | `fix(apex): resolve chart rendering issue` |
| `docs` | 文檔變更 | `docs: update README with setup guide` |
| `style` | 格式調整（不影響程式碼運作） | `style(flow): format with prettier` |
| `refactor` | 重構（不是新功能也不是修 bug） | `refactor(api): extract auth logic to service` |
| `perf` | 效能優化 | `perf(flow): optimize transaction query` |
| `test` | 測試相關 | `test(api): add unit tests for auth service` |
| `chore` | 建置或工具變更 | `chore(deps): upgrade next.js to 15.1.0` |
| `build` | 建置系統變更 | `build: update turbo pipeline config` |
| `ci` | CI 配置變更 | `ci: add github actions workflow` |
| `revert` | 撤銷之前的 commit | `revert: revert "feat: add payment feature"` |

#### 2. Scope（選填但推薦）

定義變更的範圍：

**應用層級**:
- `flow` - 記帳應用
- `apex` - 曲線圖工具
- `api` - 後端 API
- `docs` - 文檔網站

**套件層級**:
- `database` - Prisma package
- `chart-engine` - 圖表邏輯 package
- `ui` - UI 元件 package
- `eslint-config` - ESLint 設定
- `typescript-config` - TypeScript 設定

**功能層級**:
- `auth` - 認證功能
- `transactions` - 交易功能
- `categories` - 分類功能
- `stats` - 統計功能

**工具層級**:
- `deps` - 依賴管理
- `config` - 配置檔案

#### 3. Subject（必填）

簡短描述變更內容：

**規則**:
- 使用祈使句（imperative mood）：`add` 而非 `added` 或 `adds`
- 不要大寫開頭
- 不要句號結尾
- 限制在 50 字元內
- 要清楚描述「做了什麼」

**好的範例**:
```
feat(flow): add transaction creation form
fix(api): resolve database connection timeout
docs: update installation instructions
refactor(auth): simplify token validation logic
```

**不好的範例**:
```
feat: updates              // 太籠統
fix: bug fix               // 沒說明修了什麼 bug
feat(flow): Added form.    // 用了過去式且有句號
refactor: change stuff     // 不清楚
```

#### 4. Body（選填）

詳細描述變更內容：

**何時需要**:
- 變更複雜時
- 需要說明「為什麼」這樣做
- 有重要的技術決策
- 有破壞性變更（BREAKING CHANGE）

**格式**:
- 與 subject 空一行
- 每行限制在 72 字元內
- 可以多段落
- 可以使用項目符號（-）

**範例**:
```
feat(flow): add transaction filtering by date range

Users can now filter transactions by selecting a date range.
This improves the user experience when dealing with large
transaction histories.

Implementation details:
- Add DateRangePicker component
- Update API endpoint to accept date params
- Add query optimization for date range filters
```

#### 5. Footer（選填）

記錄特殊資訊：

**Breaking Changes**:
```
feat(api): change authentication token format

BREAKING CHANGE: JWT token payload structure has changed.
All clients must update to the new token format.
```

**關聯 Issue**:
```
fix(flow): resolve transaction deletion error

Fixes #123
Closes #124, #125
```

**相關 Commit**:
```
revert: revert "feat(flow): add export feature"

This reverts commit abc123def456.
```

---

## 📋 Commit 實踐指南

### 1. 原子性 Commit

**原則**: 一個 commit 只做一件邏輯上的事情

**好的做法** ✅:
```bash
# Commit 1: 重新命名
git add apps/flow
git commit -m "refactor(flow): rename web app to flow"

# Commit 2: 加入文檔
git add docs/
git commit -m "docs: add project documentation"

# Commit 3: 更新 README
git add README.md
git commit -m "docs: update README with project structure"
```

**不好的做法** ❌:
```bash
# 一次 commit 做太多事
git add .
git commit -m "feat: add everything"
```

### 2. 分次 Commit 的時機

**應該分開 commit 的情況**:
- ✅ 功能開發 vs 文檔更新
- ✅ 新功能 vs bug 修復
- ✅ 重構 vs 新功能
- ✅ 不同模組的變更
- ✅ 依賴更新 vs 程式碼變更

**可以合併的情況**:
- ✅ 同一個功能的多個檔案
- ✅ 相關的測試和實作程式碼
- ✅ 格式調整（如果很小）

### 3. Commit 頻率

**建議頻率**:
- 完成一個小功能：commit
- 修復一個 bug：commit
- 重構一段程式碼：commit
- 更新文檔：commit
- 一天至少 commit 1-3 次

**太頻繁** ❌:
```bash
git commit -m "fix: typo"
git commit -m "fix: another typo"
git commit -m "fix: one more typo"
```

**太少** ❌:
```bash
# 一週才 commit 一次，包含 20 個檔案的變更
git commit -m "feat: add lots of features"
```

---

## 🔄 Git Workflow

### 分支策略

**主分支**:
- `main` - 穩定版本，隨時可部署
- `develop` - 開發分支（如果需要）

**功能分支**:
```
feature/<sprint>-<feature-name>
例如: feature/sprint-1-auth-system
```

**修復分支**:
```
fix/<bug-description>
例如: fix/transaction-deletion-error
```

**重構分支**:
```
refactor/<component-name>
例如: refactor/auth-service
```

### 工作流程

```bash
# 1. 建立新分支
git checkout -b feature/sprint-1-auth-system

# 2. 開發並頻繁 commit
git add src/auth/login.tsx
git commit -m "feat(flow): add login page UI"

git add src/auth/register.tsx
git commit -m "feat(flow): add register page UI"

# 3. 推送到遠端
git push origin feature/sprint-1-auth-system

# 4. 建立 Pull Request（如果有協作）

# 5. Merge 到 main
git checkout main
git merge feature/sprint-1-auth-system

# 6. 刪除功能分支
git branch -d feature/sprint-1-auth-system
```

---

## 📌 實際範例

### 範例 1: 新功能開發

**情境**: 開發交易列表頁面

```bash
# Commit 1: 建立元件
git add apps/flow/src/components/TransactionList.tsx
git commit -m "feat(flow): add TransactionList component

- Create reusable transaction list component
- Support filtering and sorting
- Add loading and error states"

# Commit 2: 整合 API
git add apps/flow/src/app/transactions/page.tsx
git commit -m "feat(flow): integrate TransactionList with API

- Fetch transactions from backend
- Handle pagination
- Add refresh functionality"

# Commit 3: 加入樣式
git add apps/flow/src/components/TransactionList.module.css
git commit -m "style(flow): style TransactionList component"
```

### 範例 2: Bug 修復

```bash
git add apps/api/src/transactions/transactions.service.ts
git commit -m "fix(api): resolve transaction deletion authorization bug

Users were able to delete other users' transactions due to
missing ownership check in the service layer.

Fixes #42"
```

### 範例 3: 重構

```bash
git add apps/api/src/auth/
git commit -m "refactor(api): extract JWT validation to separate service

- Create JwtService for token operations
- Remove duplication in auth guards
- Improve testability"
```

### 範例 4: 文檔更新

```bash
git add README.md docs/api-guide.md
git commit -m "docs: update API documentation and README

- Add authentication flow diagram
- Update installation instructions
- Fix broken links"
```

### 範例 5: 依賴更新

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): upgrade next.js to 15.1.0

- Update Next.js from 15.0.0 to 15.1.0
- Update React to 19.1.0
- Run pnpm update"
```

### 範例 6: 配置變更

```bash
git add turbo.json
git commit -m "build: optimize turbo pipeline for faster builds

- Enable parallel execution for lint tasks
- Add caching for type-check tasks
- Reduce redundant builds"
```

---

## 🚫 常見錯誤和修正

### 錯誤 1: Commit Message 太籠統

❌ **錯誤**:
```
git commit -m "fix: bug fix"
git commit -m "update: changes"
git commit -m "feat: improvements"
```

✅ **正確**:
```
git commit -m "fix(flow): resolve transaction form validation error"
git commit -m "refactor(api): optimize database query performance"
git commit -m "feat(apex): add trend line calculation"
```

### 錯誤 2: 一次 Commit 太多

❌ **錯誤**:
```bash
# 修改了 20 個檔案
git add .
git commit -m "feat: add multiple features and fix bugs"
```

✅ **正確**:
```bash
# 分成多次邏輯清晰的 commits
git add apps/flow/src/features/auth/
git commit -m "feat(flow): add authentication pages"

git add apps/api/src/auth/
git commit -m "feat(api): implement JWT authentication"

git add docs/auth-flow.md
git commit -m "docs: add authentication flow documentation"
```

### 錯誤 3: Commit Message 使用過去式

❌ **錯誤**:
```
git commit -m "feat(flow): added login form"
git commit -m "fix(api): fixed bug"
```

✅ **正確**:
```
git commit -m "feat(flow): add login form"
git commit -m "fix(api): resolve connection timeout"
```

### 錯誤 4: 沒有使用 Scope

❌ **錯誤**:
```
git commit -m "feat: add form"  // 哪個 app 的 form？
git commit -m "fix: bug"        // 哪裡的 bug？
```

✅ **正確**:
```
git commit -m "feat(flow): add transaction form"
git commit -m "fix(api): resolve auth token expiration"
```

---

## 🔍 Commit 檢查清單

在 commit 之前，問自己：

- [ ] **單一目的**: 這個 commit 只做一件事嗎？
- [ ] **清楚描述**: 別人看得懂我做了什麼嗎？
- [ ] **格式正確**: 遵循 Conventional Commits 格式嗎？
- [ ] **有 scope**: 有指定變更範圍嗎？
- [ ] **使用祈使句**: 用 `add` 而非 `added` 嗎？
- [ ] **檢查內容**: 確認 staged 的檔案都是該 commit 的嗎？
- [ ] **測試通過**: 程式碼可以運行嗎？（如果適用）

---

## 🛠️ 有用的 Git 指令

### 查看變更

```bash
# 查看尚未 staged 的變更
git diff

# 查看已 staged 的變更
git diff --staged

# 查看特定檔案的變更
git diff path/to/file
```

### 修改 Commit

```bash
# 修改最後一次 commit 的 message
git commit --amend -m "fix(flow): correct commit message"

# 加入忘記的檔案到最後一次 commit
git add forgotten-file.ts
git commit --amend --no-edit

# 修改最後一次 commit 的內容
git add modified-file.ts
git commit --amend
```

### 撤銷操作

```bash
# 撤銷 staging（保留檔案變更）
git reset HEAD file.ts

# 撤銷所有 staging
git reset

# 撤銷檔案的所有變更（危險！）
git checkout -- file.ts

# 撤銷最後一次 commit（保留變更）
git reset --soft HEAD~1

# 撤銷最後一次 commit（移除變更，危險！）
git reset --hard HEAD~1
```

### 查看歷史

```bash
# 查看 commit 歷史
git log --oneline

# 查看特定檔案的歷史
git log -- path/to/file

# 查看詳細的變更內容
git log -p

# 查看圖形化的分支歷史
git log --graph --oneline --all
```

---

## 📚 參考資源

- [Conventional Commits 規範](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Semantic Versioning](https://semver.org/)

---

## 💡 最後的建議

1. **持續練習**: Commit message 寫得好需要練習
2. **保持一致**: 團隊要統一風格
3. **及時 Commit**: 不要累積太多變更
4. **清楚描述**: 想像你在跟未來的自己解釋
5. **善用工具**: 之後會設定 commitlint 自動檢查

記住：**好的 commit 歷史是給人看的，不只是給機器看的**！

---

這份規範將在 Sprint 0.4 設定 commitlint 時強制執行。
