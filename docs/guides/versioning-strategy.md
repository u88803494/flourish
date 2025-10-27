# 版本管理策略

## 📏 版本號規則

本專案採用**語意化版本**（Semantic Versioning），格式為：

```
v主版本.次版本.修訂版本
v1.2.3
│ │ └── PATCH: 修復 bug（向下相容）
│ └──── MINOR: 新增功能（向下相容）
└────── MAJOR: 重大變更（可能不相容）
```

---

## 🎯 版本號更新時機

### 什麼時候更新版本號？

**更新版本號的時機：**
- ✅ **功能里程碑完成時**（Sprint 完成、Phase 完成）
- ✅ **準備部署新版本時**
- ✅ **重大 bug 修復後**
- ✅ **想要標記重要進度時**

**不需要更新版本號：**
- ❌ 每次 commit
- ❌ 小的程式碼調整
- ❌ 文檔更新
- ❌ 開發過程中的中間狀態

### 簡單原則

```
開發中 → 不改版本號
功能完成 → 打 tag + 更新版本號
```

---

## 📅 專案版本規劃

### Phase 0: Foundation（開發階段）

| Sprint | 版本號 | 里程碑 |
|--------|--------|--------|
| Sprint 0 完成 | v0.0.1 | 基礎設施完成（Prettier, Husky, Prisma, NestJS） |
| Sprint 1 完成 | v0.1.0 | 認證系統完成 |
| Sprint 2 完成 | v0.2.0 | 基本記帳功能（CRUD） |
| Sprint 3 完成 | v0.3.0 | 分類與統計功能 |
| Sprint 4 完成 | v0.4.0 | Apex 圖表整合 |

### Phase 1: Core Features（核心功能）

| 階段 | 版本號 | 里程碑 |
|------|--------|--------|
| Phase 1 完成 | v0.5.0 | MVP - 可以實際使用 |

### Phase 2: Enhancement（功能增強）

| 階段 | 版本號 | 里程碑 |
|------|--------|--------|
| 匯入匯出 | v0.6.0 | CSV/Excel 支援 |
| 預算管理 | v0.7.0 | 預算追蹤功能 |
| 進階報表 | v0.8.0 | 完整統計報表 |

### Phase 3: Production（正式發布）

| 階段 | 版本號 | 里程碑 |
|------|--------|--------|
| Beta | v0.9.0 | 功能完整，測試中 |
| **正式發布** | **v1.0.0** 🎉 | 第一個穩定版本 |

---

## 🔧 實際操作

### 1. 打標籤（Git Tag）

```bash
# 查看現有標籤
git tag

# 建立標籤（功能完成時）
git tag -a v0.1.0 -m "feat: complete authentication system"

# 推送標籤到 GitHub
git push origin v0.1.0

# 推送所有標籤
git push origin --tags

# 刪除本地標籤（如果打錯）
git tag -d v0.1.0

# 刪除遠端標籤
git push origin --delete v0.1.0
```

### 2. 更新 package.json

```json
{
  "name": "@repo/flourish",
  "version": "0.1.0",  // 與 git tag 保持同步
  "private": true
}
```

在根目錄和各個應用的 package.json 都要更新：
- `/package.json`
- `/apps/flow/package.json`
- `/apps/apex/package.json`
- `/apps/api/package.json`

### 3. 更新 CHANGELOG

建立 `/CHANGELOG.md`：

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Current development work

## [0.1.0] - 2025-11-XX
### Added
- Supabase authentication integration
- Login and register pages
- JWT validation in NestJS

## [0.0.1] - 2025-10-XX
### Added
- Initial monorepo setup with Turborepo
- Prettier configuration
- Husky and lint-staged
- Prisma setup
- NestJS application
- Basic project structure
```

---

## 📝 版本更新 Checklist

當準備發布新版本時：

- [ ] 所有功能測試通過
- [ ] 程式碼已 commit 並 push
- [ ] 更新所有 package.json 的 version
- [ ] 更新 CHANGELOG.md
- [ ] 建立 git tag
- [ ] 推送 tag 到 GitHub
- [ ] （選擇性）在 GitHub 建立 Release

---

## 💡 實用建議

### 開發期間（0.x.x）

- **放輕鬆**：0.x.x 版本代表還在開發，可以隨意改動
- **不用太頻繁**：不是每個 commit 都要改版本號
- **里程碑導向**：完成一個完整功能才打 tag

### 什麼時候發布 1.0.0？

當你覺得：
- ✅ 功能完整可用
- ✅ 願意分享給朋友使用
- ✅ 不會有大的 breaking changes
- ✅ 準備長期維護

### 個人專案 vs 團隊專案

**個人專案（你的情況）：**
- 版本號主要是給自己看的里程碑
- 可以跳版本（v0.1.0 → v0.3.0）
- 不用太嚴格遵守規則

**團隊/開源專案：**
- 嚴格遵守語意化版本
- 每個版本都要有 CHANGELOG
- 不能隨意跳版本

---

## 🚀 下一步

1. **現在**：繼續開發，暫時保持 `0.0.0`
2. **Sprint 0 完成後**：打第一個 tag `v0.0.1`
3. **有可用功能後**：更新到 `v0.1.0`

記住：版本號是**里程碑標記**，不是負擔。專注在開發上，有重要進展時再更新版本！