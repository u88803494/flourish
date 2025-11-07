# Render Staging Environment Setup Guide

## Overview

This guide walks you through setting up the **Staging Environment** for Flourish API on Render.

**Account**: Your staging Render account
**Branch**: `staging`
**Purpose**: Testing deployment before production

---

## Prerequisites

- [ ] GitHub repository connected to Render account
- [ ] `staging` branch exists and is pushed to GitHub
- [ ] Supabase database credentials ready (from `apps/api/.env.local`)

---

## Step 1: Create New Web Service

1. Log in to your **Staging Render Account**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `u88803494/flourish`
   - If not already connected, click "Configure Account" and grant access

---

## Step 2: Configure Basic Settings

### Service Name

```
flourish-api-staging
```

### Region

```
Singapore
```

### Branch

```
staging
```

⚠️ **Important**: Make sure to select `staging` branch, not `main`

### Runtime

```
Node
```

### Build Command

**Copy and paste this entire command**:

```bash
echo "🚀 Starting Flourish API build for Render (STAGING)..." && \
echo "📦 Installing dependencies with pnpm..." && \
NODE_ENV=development pnpm install --frozen-lockfile && \
echo "🗄️  Generating Prisma Client..." && \
pnpm --filter @flourish/database prisma:generate && \
echo "🔄 Running database migrations..." && \
pnpm --filter @flourish/database migrate:prod && \
echo "🏗️  Building NestJS API..." && \
pnpm --filter @flourish/api build && \
echo "✅ Staging build completed successfully!"
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
Value: staging
```

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

⚠️ **Note**: This is from your `apps/api/.env.local` file

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
Value: https://flourish-flow-*.vercel.app,https://flourish-apex-*.vercel.app,http://localhost:3100,http://localhost:3200
```

💡 **Note**: Wildcard patterns allow all Vercel preview deployments

---

## Step 4: Configure Health Check

Scroll down to **"Health Check Path"**:

```
/health/liveness
```

---

## Step 5: Auto-Deploy Settings

Make sure these are enabled:

- ✅ **Auto-Deploy**: ON (deploy automatically when `staging` branch updates)

---

## Step 6: Create Service

1. Review all settings
2. Click **"Create Web Service"**
3. Wait for initial deployment (3-5 minutes)

---

## Step 7: Verify Deployment

Once deployment completes, you'll see a URL like:

```
https://flourish-api-staging.onrender.com
```

### Test Health Endpoint

```bash
curl https://flourish-api-staging.onrender.com/health/liveness
```

**Expected Response**:

```json
{ "status": "ok" }
```

### Test Readiness Endpoint

```bash
curl https://flourish-api-staging.onrender.com/health/readiness
```

**Expected Response**:

```json
{ "status": "ok", "database": "connected" }
```

---

## Step 8: Record Service URL

**Save this URL** - you'll need it for Vercel environment variables:

```
STAGING_API_URL=https://flourish-api-staging.onrender.com
```

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

**Solution**: Make sure the build command includes:

```bash
pnpm --filter @flourish/database prisma:generate
```

### Health Check Fails

**Solution**:

1. Check logs in Render Dashboard
2. Verify `PORT=10000` environment variable
3. Ensure `/health/liveness` endpoint exists in NestJS app

### CORS Errors from Vercel

**Solution**:

1. Verify `CORS_ORIGIN` includes wildcard patterns
2. Check `apps/api/src/main.ts` implements regex-based CORS validation
3. Test with:
   ```bash
   curl -H "Origin: https://flourish-flow-abc123.vercel.app" \
     https://flourish-api-staging.onrender.com/health/liveness
   ```

### Service Sleeps After 15 Minutes

**Solution**: This is expected behavior for Free Plan. Options:

1. Set up Keep-Alive service (see `keep-alive-setup.md`)
2. Accept cold starts for staging environment
3. Upgrade to Starter Plan ($7/month)

---

## Next Steps

✅ Staging API deployed successfully!

Now proceed to:

1. **[Production Setup](./render-production-setup.md)** - Set up production environment
2. **[Vercel Configuration](../README.md#vercel-environment-variables)** - Configure frontend apps
3. **[Keep-Alive Setup](./keep-alive-setup.md)** - Prevent service from sleeping

---

## Maintenance

### Update Environment Variables

1. Go to Service Settings → Environment Variables
2. Edit the variable
3. Click "Save Changes"
4. Service will automatically redeploy

### Manual Redeploy

1. Go to Service → Deploys
2. Find successful deploy
3. Click "..." → "Redeploy"

### View Logs

1. Go to Service → Logs
2. Real-time logs will appear
3. Use search/filter for specific errors

---

## Important Notes

⚠️ **Security**:

- Never commit environment variables to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Rotate keys if exposed

💰 **Free Tier Limits**:

- 750 build hours/month
- Service sleeps after 15 min inactivity
- Shares resources with other free services

🔄 **Auto-Deploy**:

- Every push to `staging` branch triggers deployment
- Check "Events" tab for deployment history
- Failed deploys won't replace current version

---

**Last Updated**: 2025-01-07
**Status**: Active
**Service URL**: `https://flourish-api-staging.onrender.com` (update after creation)
