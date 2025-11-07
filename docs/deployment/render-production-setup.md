# Render Production Environment Setup Guide

## Overview

This guide walks you through setting up the **Production Environment** for Flourish API on Render.

**Account**: Your production Render account
**Branch**: `main`
**Purpose**: Live production deployment

---

## Prerequisites

- [ ] GitHub repository connected to Render account
- [ ] `main` branch exists with tested code
- [ ] Supabase database credentials ready (from `apps/api/.env.local`)
- [ ] Staging environment tested successfully

---

## Step 1: Create New Web Service

1. Log in to your **Production Render Account**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `u88803494/flourish`
   - If not already connected, click "Configure Account" and grant access

---

## Step 2: Configure Basic Settings

### Service Name

```
flourish-api-production
```

### Region

```
Singapore
```

### Branch

```
main
```

⚠️ **Critical**: Make sure to select `main` branch for production

### Runtime

```
Node
```

### Build Command

**Copy and paste this entire command**:

```bash
echo "🚀 Starting Flourish API build for Render (PRODUCTION)..." && \
echo "📦 Installing dependencies with pnpm..." && \
NODE_ENV=development pnpm install --frozen-lockfile && \
echo "🗄️  Generating Prisma Client..." && \
pnpm --filter @flourish/database prisma:generate && \
echo "🔄 Running database migrations..." && \
pnpm --filter @flourish/database migrate:prod && \
echo "🏗️  Building NestJS API..." && \
pnpm --filter @flourish/api build && \
echo "✅ Production build completed successfully!"
```

### Start Command

```bash
cd apps/api && pnpm start:prod
```

### Plan

```
Free
```

---

## Step 3: Configure Environment Variables

Click "Advanced" → "Add Environment Variable" and add the following:

### Required Environment Variables

#### 1. NODE_ENV

```
Key: NODE_ENV
Value: production
```

⚠️ **Note**: Use `production` for production environment (not `staging`)

#### 2. PORT

```
Key: PORT
Value: 10000
```

#### 3. DATABASE_URL

```
Key: DATABASE_URL
Value: postgresql://postgres.fstcioczrehqtcbdzuij:YbYkJd2EILWNCt3@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

⚠️ **Note**: Same database as staging (for now). Consider separate database in Phase 1.

#### 4. SUPABASE_JWT_SECRET

```
Key: SUPABASE_JWT_SECRET
Value: IsStG+ZJKxE7jWomyCHp4tEyhheDdWGXkZ1jINjWlIFPUeislODBTlecZ6tDOYoSg6YDMfcL/gOQjAx8P5kqWA==
```

#### 5. SUPABASE_SERVICE_ROLE_KEY

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdGNpb2N6cmVocXRjYmR6dWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgyMTY0NywiZXhwIjoyMDc3Mzk3NjQ3fQ.Nmt7Sk8cTxowrh02iDlFjbpEmM60PYT7ayq4bQ1behA
```

#### 6. CORS_ORIGIN

```
Key: CORS_ORIGIN
Value: https://flourish-flow.vercel.app,https://flourish-apex.vercel.app
```

🔒 **Security**: Production only allows official Vercel production URLs (no wildcards, no localhost)

---

## Step 4: Configure Health Check

Scroll down to **"Health Check Path"**:

```
/health/liveness
```

---

## Step 5: Auto-Deploy Settings

Configure carefully:

- ✅ **Auto-Deploy**: ON (deploy automatically when `main` branch updates)
- ⚠️ **Branch Protection**: Ensure `main` branch requires PR reviews on GitHub

---

## Step 6: Create Service

1. Review all settings carefully
2. Double-check `main` branch is selected
3. Verify CORS_ORIGIN does NOT include wildcards
4. Click **"Create Web Service"**
5. Wait for initial deployment (3-5 minutes)

---

## Step 7: Verify Deployment

Once deployment completes, you'll see a URL like:

```
https://flourish-api-production.onrender.com
```

### Test Health Endpoint

```bash
curl https://flourish-api-production.onrender.com/health/liveness
```

**Expected Response**:

```json
{ "status": "ok" }
```

### Test Readiness Endpoint

```bash
curl https://flourish-api-production.onrender.com/health/readiness
```

**Expected Response**:

```json
{ "status": "ok", "database": "connected" }
```

### Test CORS (should reject preview URLs)

```bash
# This should fail (preview URL not allowed in production)
curl -H "Origin: https://flourish-flow-abc123.vercel.app" \
  https://flourish-api-production.onrender.com/health/liveness
```

**Expected**: CORS error (this is correct behavior for production)

### Test CORS (should allow production URLs)

```bash
# This should succeed
curl -H "Origin: https://flourish-flow.vercel.app" \
  https://flourish-api-production.onrender.com/health/liveness
```

**Expected**: `{"status":"ok"}`

---

## Step 8: Record Service URL

**Save this URL** - you'll need it for Vercel environment variables:

```
PRODUCTION_API_URL=https://flourish-api-production.onrender.com
```

---

## Production-Specific Configurations

### GitHub Branch Protection

**Important**: Protect `main` branch to prevent accidental deployments

1. Go to GitHub repository settings
2. Branches → Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators (everyone must follow rules)

### Deployment Notifications

Consider setting up Slack/Discord webhooks:

1. Render Dashboard → Service → Settings
2. Scroll to "Deploy Notifications"
3. Add webhook URL

---

## Troubleshooting

### Build Fails: "pnpm: command not found"

**Solution**: Render should auto-detect pnpm from `package.json`. If not:

1. Go to Service Settings
2. Add environment variable:
   ```
   ENABLE_PNPM=true
   ```
3. Redeploy

### Build Fails: "Prisma Client not generated"

**Solution**: Verify build command includes:

```bash
pnpm --filter @flourish/database prisma:generate
```

### Health Check Fails

**Solution**:

1. Check logs in Render Dashboard
2. Verify `PORT=10000` environment variable
3. Ensure `/health/liveness` endpoint exists

### CORS Rejects Legitimate Production URLs

**Solution**:

1. Verify exact production URLs in Vercel dashboard
2. Update `CORS_ORIGIN` if URLs changed
3. Check `apps/api/src/main.ts` CORS implementation
4. Test with exact URL:
   ```bash
   curl -H "Origin: https://flourish-flow.vercel.app" \
     https://flourish-api-production.onrender.com/health/liveness
   ```

### Accidental Deployment from Wrong Branch

**Prevention**:

- Set up GitHub branch protection
- Require PR reviews
- Never force-push to `main`

**Recovery**:

1. Find last good deployment in Render Dashboard
2. Click "..." → "Redeploy"
3. Or revert commit in git and push

---

## Monitoring & Alerts

### Set Up UptimeRobot

**Important**: Production should have reliable keep-alive monitoring

See [Keep-Alive Setup Guide](./keep-alive-setup.md) for detailed steps.

### Log Monitoring

**Check logs regularly**:

1. Render Dashboard → Service → Logs
2. Look for errors, warnings
3. Monitor performance metrics

### Set Up Error Tracking (Future)

Consider integrating:

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay
- **New Relic**: APM and monitoring

---

## Maintenance

### Update Environment Variables

1. Go to Service Settings → Environment Variables
2. Edit the variable
3. Click "Save Changes"
4. Service will automatically redeploy

⚠️ **Production Warning**: Environment variable changes trigger deployment

### Manual Redeploy

1. Go to Service → Deploys
2. Find successful deploy
3. Click "..." → "Redeploy"

### Emergency Rollback

**If production deployment fails**:

1. **Quick Fix**: Redeploy previous version
   - Render Dashboard → Deploys
   - Find last successful deploy
   - Click "..." → "Redeploy"

2. **Git Revert**: If issue is in code

   ```bash
   git checkout main
   git revert <bad-commit-hash>
   git push origin main
   ```

   - Render will auto-deploy the revert

3. **Expected Time**: 5-10 minutes total

### View Logs

1. Go to Service → Logs
2. Real-time logs will appear
3. Use search/filter for debugging

---

## Security Best Practices

🔒 **Environment Variables**:

- Never commit to git
- Rotate keys periodically
- Use separate credentials for production (future)

🔒 **CORS Configuration**:

- Only allow known production domains
- No wildcards in production
- No localhost URLs

🔒 **Branch Protection**:

- Require PR reviews for `main`
- Prevent force pushes
- Require status checks

🔒 **Access Control**:

- Limit who can access Render dashboard
- Use separate production account
- Enable 2FA on Render account

---

## Production Checklist

Before going live:

- [ ] All tests pass in staging
- [ ] CORS configured correctly (no wildcards)
- [ ] Environment variables set correctly
- [ ] Health checks working
- [ ] GitHub branch protection enabled
- [ ] Keep-alive monitoring set up
- [ ] Error tracking configured (if applicable)
- [ ] Deployment notifications configured
- [ ] Rollback procedure tested
- [ ] Documentation updated

---

## Next Steps

✅ Production API deployed successfully!

Now proceed to:

1. **[Vercel Configuration](../README.md#vercel-environment-variables)** - Configure frontend for production
2. **[Keep-Alive Setup](./keep-alive-setup.md)** - Prevent service from sleeping
3. **[Git Workflow](./git-workflow.md)** - Follow proper deployment workflow

---

## Important Notes

⚠️ **Production Safety**:

- Every push to `main` deploys to production
- Always test in staging first
- Use PR review process
- Never skip branch protection

💰 **Free Tier Limits**:

- 750 build hours/month
- Service sleeps after 15 min inactivity
- Consider upgrading for production workloads

🔄 **Auto-Deploy**:

- Only from `main` branch
- Triggered by git push
- Check "Events" tab for history
- Failed deploys won't replace current version

📊 **Monitoring**:

- Set up UptimeRobot for keep-alive
- Monitor error logs daily
- Track performance metrics
- Set up alerts for critical issues

---

**Last Updated**: 2025-01-07
**Status**: Active
**Service URL**: `https://flourish-api-production.onrender.com` (update after creation)
