# Flourish Git 工作流程指南

## 概述

本文件說明 Flourish 專案的 Git 分支策略和部署工作流程。

**策略**：GitHub Flow + Staging 環境
**核心原則**：`main` 是唯一真相來源，`staging` 是測試分支

---

## 分支結構

```
main (Production 生產環境)
  ├── 受 PR 審查保護
  ├── 自動部署到 Production Render
  └── 自動部署到 Vercel Production

staging (Testing 測試環境)
  ├── 無保護（允許直接推送）
  ├── 自動部署到 Staging Render
  ├── 用於部署測試
  └── 可隨時重置為 main

feat/* (Feature Development 功能開發)
  ├── 從 main 建立
  ├── 合併到 staging 進行測試
  └── 測試後透過 PR 合併到 main
```

---

## 日常開發工作流程

### 步驟 1：建立功能分支

```bash
# 總是從 main 建立分支
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

**分支命名慣例**：

- `feat/feature-name` - 新功能
- `fix/bug-name` - Bug 修復
- `refactor/description` - 程式碼重構
- `docs/description` - 文件更新
- `chore/description` - 維護任務

### 步驟 2：開發

```bash
# 進行變更
git add .
git commit -m "feat: add user authentication"

# 推送到遠端
git push origin feat/your-feature-name
```

**Commit 訊息慣例**：

```
type: short description

[optional body]
[optional footer]
```

**類型**：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 步驟 3：在 Staging 測試（選用但建議）

**目的**：在建立 PR 前測試部署行為

```bash
# 切換到 staging
git checkout staging
git pull origin staging

# 合併你的功能
git merge feat/your-feature-name --no-ff

# 推送以觸發 staging 部署
git push origin staging
```

**會發生什麼**：

- Render Staging 自動部署
- Vercel preview deployments 使用 staging API
- 你可以測試部署後的版本

**測試檢查清單**：

- [ ] API 健康檢查回應正常
- [ ] 前端可以連接到 API
- [ ] 沒有 CORS 錯誤
- [ ] 沒有建置失敗
- [ ] 功能運作如預期

### 步驟 4：建立 Pull Request 到 Main

**在 staging 測試通過後**（或如果跳過 staging）：

```bash
# 推送你的功能分支（如果還沒推送）
git push origin feat/your-feature-name
```

然後在 GitHub 上：

1. 前往 repository
2. 點擊 "Pull Requests" → "New Pull Request"
3. Base: `main` ← Compare: `feat/your-feature-name`
4. 填寫 PR 模板：
   - 變更了什麼
   - 如何測試
   - 截圖（如果有 UI 變更）
5. 請求審查

**PR 模板範例**：

```markdown
## What Changed（變更內容）

- 使用 JWT 新增使用者認證
- 建立登入/註冊頁面

## How to Test（如何測試）

1. 造訪 /login
2. 建立新帳號
3. 驗證 localStorage 中的 token

## Checklist（檢查清單）

- [x] 在 staging 環境測試過
- [x] 沒有 console 錯誤
- [x] 本地測試通過
- [x] 文件已更新
```

### 步驟 5：審查和合併

**審查者檢查清單**：

- [ ] 程式碼品質可接受
- [ ] 沒有安全性問題
- [ ] 測試存在且通過
- [ ] 文件已更新
- [ ] 在 staging 測試過（如適用）

**合併**：

- 使用 "Squash and Merge" 保持乾淨的歷史
- 或使用 "Create Merge Commit" 保留歷史
- 合併後刪除功能分支

**合併後會發生什麼**：

- Render Production 從 `main` 自動部署
- Vercel Production 從 `main` 自動部署
- 你的功能上線了！🚀

---

## 緊急 Hotfix 工作流程

針對關鍵的 production bugs：

### 步驟 1：建立 Hotfix 分支

```bash
# 從 main（production）建立分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description
```

### 步驟 2：修復並在 Staging 測試

```bash
# 進行修復
git add .
git commit -m "fix: resolve critical authentication bug"

# 先在 staging 測試
git checkout staging
git merge hotfix/critical-bug-description
git push origin staging
```

**驗證 staging 部署運作正常！**

### 步驟 3：快速通道 PR 到 Main

```bash
# 在 GitHub 上建立 PR
git push origin hotfix/critical-bug-description
```

**PR 流程**：

- 標記為 "urgent" 或 "hotfix"
- 請求立即審查
- 批准後立即合併
- 監控 production 部署

---

## Staging 分支維護

### 何時重置 Staging

**情境**：

- 累積多個未測試的功能
- Staging 有失敗的部署
- 想從 production 重新開始
- Staging 與 main 分歧太遠

### 如何重置 Staging

```bash
# 重置 staging 完全匹配 main
git checkout staging
git fetch origin
git reset --hard origin/main
git push origin staging --force
```

⚠️ **警告**：這會刪除 staging 中所有不在 main 的 commits

### 安全重置（如果不確定）

```bash
# 先建立備份
git checkout staging
git branch staging-backup

# 然後重置
git reset --hard origin/main
git push origin staging --force
```

---

## 進階工作流程

### Staging 中的多個功能

**情境**：同時測試多個功能

```bash
# 合併功能 A
git checkout staging
git merge feat/feature-a --no-ff
git push origin staging

# 合併功能 B
git merge feat/feature-b --no-ff
git push origin staging

# 一起測試兩個功能
```

**然後**：

- 如果兩個都通過：為每個功能建立獨立的 PRs
- 如果一個失敗：重置 staging 並只合併通過的功能

### 回退 Commit

**如果 main 中的 commit 破壞了 production**：

```bash
git checkout main
git pull origin main

# 回退壞的 commit
git revert <bad-commit-hash>
git push origin main
```

**或在 GitHub 上**：

1. 前往已合併的 PR
2. 點擊 "Revert"
3. 使用回退建立新的 PR
4. 立即合併

---

## Branch Protection 規則（GitHub）

### Main Branch Protection

**Settings → Branches → Add Rule for `main`**：

必要設定：

- ✅ Require pull request reviews before merging
  - Number of approvals: 1
- ✅ Require status checks to pass before merging
  - Require branches to be up to date
- ✅ Require signed commits（選用）
- ✅ Include administrators

選用但建議：

- ✅ Require linear history（強制 squash/rebase）
- ✅ Require deployments to succeed before merging

### Staging Branch Protection

**不需要保護** - staging 是用於實驗

---

## Git Aliases（選用但建議）

加到 `~/.gitconfig` 或 `~/.zshrc`：

```bash
# 快速指令
alias gs="git status"
alias gc="git checkout"
alias gp="git pull"
alias gpush="git push"

# 功能工作流程
alias gf="git checkout -b feat/"
alias gmm="git checkout main && git pull && git checkout -"

# Staging 工作流程
alias gst="git checkout staging"
alias gstm="git checkout staging && git merge"
alias gstpush="git checkout staging && git push origin staging"

# 重置 staging
alias gstreset="git checkout staging && git reset --hard origin/main && git push origin staging --force"
```

使用方式：

```bash
# 建立功能
gf user-auth
# 返回 main，拉取，然後回到功能分支
gmm

# 合併到 staging
gstm feat/user-auth
gstpush

# 重置 staging
gstreset
```

---

## 疑難排解

### "Merge conflict in staging"

**原因**：多個功能合併到 staging 時產生衝突

**解決方法**：

```bash
# 簡單方法：重置 staging
git checkout staging
git reset --hard origin/main
git push origin staging --force

# 然後逐一合併功能
git merge feat/feature-a --no-ff
# 如有衝突，解決它們
git push origin staging
```

### "PR has conflicts with main"

**原因**：建立功能分支後 main 已更新

**解決方法**：

```bash
# 更新你的功能分支
git checkout feat/your-feature
git fetch origin
git rebase origin/main

# 或使用 merge
git merge origin/main

# 如果 rebase 過，強制推送
git push origin feat/your-feature --force
```

### "Accidentally pushed to main directly"

**預防**：啟用 branch protection！

**復原**：

```bash
# 如果你是唯一開發者且立即發現
git checkout main
git reset --hard HEAD~1
git push origin main --force

# 否則，回退 commit
git revert HEAD
git push origin main
```

### "Staging deployment failed"

```bash
# 檢查 Render logs
# 在你的功能分支中修復問題
git checkout feat/your-feature
# 進行修復
git add .
git commit -m "fix: resolve deployment issue"

# 重新合併到 staging
git checkout staging
git reset --hard origin/main  # 重新開始
git merge feat/your-feature --no-ff
git push origin staging
```

---

## 最佳實踐

### ✅ 該做

- 總是從 `main` 建立分支
- 使用描述性的分支名稱
- 撰寫清楚的 commit 訊息
- 建立 PR 前在 staging 測試
- 合併後刪除功能分支
- 定期保持 staging 與 main 同步

### ❌ 不該做

- 不要直接 commit 到 `main`
- 不要 force-push 到 `main`
- 不要將 staging 合併到 main
- 不要讓功能分支開太久
- 不要忘記在建立功能分支前 pull
- 不要在部署相關變更時跳過 staging 測試

---

## 工作流程圖

```
Developer Local（開發者本地）
      ↓ (create feature branch 建立功能分支)
   feat/xxx
      ↓ (develop & commit 開發 & commit)
   feat/xxx (ready 完成)
      ↓ (merge to staging 合併到 staging)
   staging ──→ Render Staging Deploy ──→ Test（測試）
      ↓ (if test passes 如果測試通過)
   feat/xxx ──→ GitHub PR ──→ Review（審查）
      ↓ (approved & merged 批准 & 合併)
   main ──→ Render Production Deploy
        └──→ Vercel Production Deploy
        └──→ 🎉 Live!（上線！）
```

---

## 快速參考

| 任務            | 指令                                                                  |
| --------------- | --------------------------------------------------------------------- |
| 新功能          | `git checkout main && git pull && git checkout -b feat/xxx`           |
| 在 staging 測試 | `git checkout staging && git merge feat/xxx && git push`              |
| 建立 PR         | 推送分支，然後在 GitHub 上建立 PR                                     |
| 重置 staging    | `git checkout staging && git reset --hard origin/main && git push -f` |
| Hotfix          | `git checkout -b hotfix/xxx` → staging → PR → main                    |
| 回退 commit     | `git revert <hash>` 或使用 GitHub UI                                  |

---

**最後更新**：2025-11-07
**版本**：1.0
**狀態**：Active Workflow
