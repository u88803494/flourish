# Flourish Git Workflow Guide

## Overview

This document describes the Git branching strategy and deployment workflow for Flourish project.

**Strategy**: GitHub Flow + Staging Environment
**Key Principle**: `main` is the single source of truth, `staging` is a testing branch

---

## Branch Structure

```
main (Production)
  ├── Protected with PR reviews
  ├── Auto-deploys to Production Render
  └── Auto-deploys to Vercel Production

staging (Testing)
  ├── No protection (direct push allowed)
  ├── Auto-deploys to Staging Render
  ├── Used for deployment testing
  └── Can be reset to main anytime

feat/* (Feature Development)
  ├── Created from main
  ├── Merged to staging for testing
  └── Merged to main via PR after testing
```

---

## Daily Development Workflow

### Step 1: Create Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

**Branch Naming Convention**:

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `chore/description` - Maintenance tasks

### Step 2: Development

```bash
# Make changes
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin feat/your-feature-name
```

**Commit Message Convention**:

```
type: short description

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Step 3: Test in Staging (Optional but Recommended)

**Purpose**: Test deployment behavior before creating PR

```bash
# Switch to staging
git checkout staging
git pull origin staging

# Merge your feature
git merge feat/your-feature-name --no-ff

# Push to trigger staging deployment
git push origin staging
```

**What happens**:

- Render Staging auto-deploys
- Vercel preview deployments use staging API
- You can test the deployed version

**Test Checklist**:

- [ ] API health check responds
- [ ] Frontend can connect to API
- [ ] No CORS errors
- [ ] No build failures
- [ ] Feature works as expected

### Step 4: Create Pull Request to Main

**After staging test passes** (or if skipping staging):

```bash
# Push your feature branch (if not already)
git push origin feat/your-feature-name
```

Then on GitHub:

1. Go to repository
2. Click "Pull Requests" → "New Pull Request"
3. Base: `main` ← Compare: `feat/your-feature-name`
4. Fill in PR template:
   - What changed
   - How to test
   - Screenshots (if UI changes)
5. Request review

**PR Template Example**:

```markdown
## What Changed

- Added user authentication with JWT
- Created login/signup pages

## How to Test

1. Visit /login
2. Create new account
3. Verify token in localStorage

## Checklist

- [x] Tested in staging environment
- [x] No console errors
- [x] Tests pass locally
- [x] Documentation updated
```

### Step 5: Review and Merge

**Reviewer Checklist**:

- [ ] Code quality acceptable
- [ ] No security issues
- [ ] Tests exist and pass
- [ ] Documentation updated
- [ ] Tested in staging (if applicable)

**Merge**:

- Use "Squash and Merge" for clean history
- Or "Create Merge Commit" if preserving history
- Delete feature branch after merge

**What happens after merge**:

- Render Production auto-deploys from `main`
- Vercel Production auto-deploys from `main`
- Your feature is live! 🚀

---

## Emergency Hotfix Workflow

For critical production bugs:

### Step 1: Create Hotfix Branch

```bash
# Branch from main (production)
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description
```

### Step 2: Fix and Test in Staging

```bash
# Make fix
git add .
git commit -m "fix: resolve critical authentication bug"

# Test in staging first
git checkout staging
git merge hotfix/critical-bug-description
git push origin staging
```

**Verify staging deployment works!**

### Step 3: Fast-track PR to Main

```bash
# Create PR on GitHub
git push origin hotfix/critical-bug-description
```

**PR Process**:

- Mark as "urgent" or "hotfix"
- Request immediate review
- Merge as soon as approved
- Monitor production deployment

---

## Staging Branch Maintenance

### When to Reset Staging

**Scenarios**:

- Accumulated multiple untested features
- Staging has failed deployments
- Want to start fresh from production
- Staging diverged too far from main

### How to Reset Staging

```bash
# Reset staging to match main exactly
git checkout staging
git fetch origin
git reset --hard origin/main
git push origin staging --force
```

⚠️ **Warning**: This deletes all commits in staging that aren't in main

### Safe Reset (If Unsure)

```bash
# Create backup first
git checkout staging
git branch staging-backup

# Then reset
git reset --hard origin/main
git push origin staging --force
```

---

## Advanced Workflows

### Multiple Features in Staging

**Scenario**: Testing multiple features simultaneously

```bash
# Merge feature A
git checkout staging
git merge feat/feature-a --no-ff
git push origin staging

# Merge feature B
git merge feat/feature-b --no-ff
git push origin staging

# Test both features together
```

**Then**:

- If both pass: Create separate PRs for each feature
- If one fails: Reset staging and merge only the passing feature

### Reverting a Commit

**If a commit in main breaks production**:

```bash
git checkout main
git pull origin main

# Revert the bad commit
git revert <bad-commit-hash>
git push origin main
```

**Or on GitHub**:

1. Go to PR that was merged
2. Click "Revert"
3. Create new PR with revert
4. Merge immediately

---

## Branch Protection Rules (GitHub)

### Main Branch Protection

**Settings → Branches → Add Rule for `main`**:

Required settings:

- ✅ Require pull request reviews before merging
  - Number of approvals: 1
- ✅ Require status checks to pass before merging
  - Require branches to be up to date
- ✅ Require signed commits (optional)
- ✅ Include administrators

Optional but recommended:

- ✅ Require linear history (forces squash/rebase)
- ✅ Require deployments to succeed before merging

### Staging Branch Protection

**No protection needed** - staging is meant for experimentation

---

## Git Aliases (Optional but Recommended)

Add to `~/.gitconfig` or `~/.zshrc`:

```bash
# Quick commands
alias gs="git status"
alias gc="git checkout"
alias gp="git pull"
alias gpush="git push"

# Feature workflow
alias gf="git checkout -b feat/"
alias gmm="git checkout main && git pull && git checkout -"

# Staging workflow
alias gst="git checkout staging"
alias gstm="git checkout staging && git merge"
alias gstpush="git checkout staging && git push origin staging"

# Reset staging
alias gstreset="git checkout staging && git reset --hard origin/main && git push origin staging --force"
```

Usage:

```bash
# Create feature
gf user-auth
# Returns to main, pulls, then back to feature branch
gmm

# Merge to staging
gstm feat/user-auth
gstpush

# Reset staging
gstreset
```

---

## Troubleshooting

### "Merge conflict in staging"

**Cause**: Multiple features merged to staging with conflicts

**Solution**:

```bash
# Easy way: Reset staging
git checkout staging
git reset --hard origin/main
git push origin staging --force

# Then merge features one by one
git merge feat/feature-a --no-ff
# Resolve conflicts if any
git push origin staging
```

### "PR has conflicts with main"

**Cause**: main updated since feature branch created

**Solution**:

```bash
# Update your feature branch
git checkout feat/your-feature
git fetch origin
git rebase origin/main

# Or use merge
git merge origin/main

# Force push if rebased
git push origin feat/your-feature --force
```

### "Accidentally pushed to main directly"

**Prevention**: Enable branch protection!

**Recovery**:

```bash
# If you're the only developer and caught it immediately
git checkout main
git reset --hard HEAD~1
git push origin main --force

# Otherwise, revert the commit
git revert HEAD
git push origin main
```

### "Staging deployment failed"

```bash
# Check Render logs
# Fix the issue in your feature branch
git checkout feat/your-feature
# Make fixes
git add .
git commit -m "fix: resolve deployment issue"

# Re-merge to staging
git checkout staging
git reset --hard origin/main  # Start fresh
git merge feat/your-feature --no-ff
git push origin staging
```

---

## Best Practices

### ✅ DO

- Always branch from `main`
- Use descriptive branch names
- Write clear commit messages
- Test in staging before creating PR
- Delete feature branches after merge
- Keep staging in sync with main periodically

### ❌ DON'T

- Don't commit directly to `main`
- Don't force-push to `main`
- Don't merge staging into main
- Don't keep feature branches open too long
- Don't forget to pull before creating feature branch
- Don't skip testing in staging for deployment-related changes

---

## Workflow Diagram

```
Developer Local
      ↓ (create feature branch)
   feat/xxx
      ↓ (develop & commit)
   feat/xxx (ready)
      ↓ (merge to staging)
   staging ──→ Render Staging Deploy ──→ Test
      ↓ (if test passes)
   feat/xxx ──→ GitHub PR ──→ Review
      ↓ (approved & merged)
   main ──→ Render Production Deploy
        └──→ Vercel Production Deploy
        └──→ 🎉 Live!
```

---

## Quick Reference

| Task            | Commands                                                              |
| --------------- | --------------------------------------------------------------------- |
| New feature     | `git checkout main && git pull && git checkout -b feat/xxx`           |
| Test in staging | `git checkout staging && git merge feat/xxx && git push`              |
| Create PR       | Push branch, then create PR on GitHub                                 |
| Reset staging   | `git checkout staging && git reset --hard origin/main && git push -f` |
| Hotfix          | `git checkout -b hotfix/xxx` → staging → PR → main                    |
| Revert commit   | `git revert <hash>` or use GitHub UI                                  |

---

**Last Updated**: 2025-01-07
**Version**: 1.0
**Status**: Active Workflow
