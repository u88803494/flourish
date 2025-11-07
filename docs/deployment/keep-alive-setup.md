# Keep-Alive Service Setup Guide

## Overview

Render Free Plan services sleep after 15 minutes of inactivity. This guide shows how to set up UptimeRobot to prevent your services from sleeping.

**Service**: UptimeRobot (Free Plan)
**Features**: 50 monitors, 5-minute intervals
**Coverage**: Staging + Production APIs

---

## Why Keep-Alive?

### The Problem

**Render Free Plan Behavior**:

- Services sleep after 15 minutes of no requests
- Cold start takes 30-60 seconds
- First user request times out or is very slow

**Impact**:

- Poor user experience
- Failed health checks
- API timeouts on frontend

### The Solution

**UptimeRobot**:

- Pings your API every 5 minutes
- Keeps service awake 24/7
- Also provides uptime monitoring
- Free for up to 50 monitors

---

## Step 1: Sign Up for UptimeRobot

1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Click "Register for FREE"
3. Fill in:
   - Email
   - Password
   - Full Name
4. Verify email

---

## Step 2: Create Staging API Monitor

### 2.1 Add New Monitor

1. Log in to UptimeRobot Dashboard
2. Click "+ Add New Monitor"

### 2.2 Configure Monitor Settings

**Monitor Type**:

```
HTTP(s)
```

**Friendly Name**:

```
Flourish API - Staging
```

**URL (or IP)**:

```
https://flourish-api-staging.onrender.com/health/liveness
```

⚠️ **Note**: Replace with your actual Render staging URL

**Monitoring Interval**:

```
5 minutes
```

💡 Free plan allows 5-minute minimum interval

**Monitor Timeout**:

```
30 seconds
```

**HTTP Method**:

```
GET (default)
```

**Alert Contacts**:

- Select your email (created automatically)
- Or add new contact (Slack, Discord, Telegram, etc.)

### 2.3 Advanced Settings (Optional)

**Custom HTTP Headers** (if needed):

```
(leave empty unless you need authentication)
```

**POST Value** (if needed):

```
(not needed for health check)
```

**HTTP Auth**:

```
(not needed for public health endpoints)
```

### 2.4 Create Monitor

Click "Create Monitor"

---

## Step 3: Create Production API Monitor

Repeat Step 2 with production settings:

**Friendly Name**:

```
Flourish API - Production
```

**URL (or IP)**:

```
https://flourish-api-production.onrender.com/health/liveness
```

⚠️ **Note**: Replace with your actual Render production URL

**Monitoring Interval**:

```
5 minutes
```

**Monitor Timeout**:

```
30 seconds
```

**Alert Contacts**:

- Your email
- Consider adding SMS for production (paid feature)

Click "Create Monitor"

---

## Step 4: Verify Monitors

### Check Dashboard

You should see:

```
✅ Flourish API - Staging (Up)
✅ Flourish API - Production (Up)
```

### Monitor Status Meanings

| Status    | Meaning                           |
| --------- | --------------------------------- |
| Up ✅     | Service responding within timeout |
| Down ❌   | Service not responding or error   |
| Paused ⏸️ | Monitoring temporarily disabled   |

### View Details

Click on monitor name to see:

- Response time graph
- Uptime percentage
- Response time logs
- Alert history

---

## Step 5: Configure Alert Contacts

### Email Alerts (Default)

Already configured with your registration email

### Slack Integration (Recommended)

1. Go to "My Settings" → "Alert Contacts"
2. Click "+ Add Alert Contact"
3. Select "Slack"
4. Follow instructions to create Slack webhook
5. Test integration

### Discord Integration

1. Create Discord webhook in your server
2. Go to UptimeRobot → Alert Contacts
3. Select "Webhook"
4. Paste Discord webhook URL
5. Test

### SMS Alerts (Paid Feature)

- Available on Pro plan ($7/month)
- Recommended for critical production monitoring

---

## Step 6: Test Keep-Alive

### Wait 15 Minutes

Let your Render services sit idle for 15 minutes

### Check Render Dashboard

1. Go to Render Dashboard
2. Your services should still be "Live"
3. Not showing "Sleeping" status

### Verify with Manual Request

```bash
# Should respond quickly (not cold start)
time curl https://flourish-api-staging.onrender.com/health/liveness

# Expected: < 1 second response time
```

---

## Monitoring Dashboard

### UptimeRobot Dashboard

**Key Metrics**:

- **Uptime %**: Should be >99% for properly configured monitors
- **Response Time**: Average response time for health checks
- **24h Stats**: Uptime in last 24 hours
- **7d Stats**: Uptime in last 7 days
- **30d Stats**: Uptime in last 30 days

### Expected Values

**Good Performance**:

```
Uptime: 99.9%+
Average Response Time: 200-500ms
```

**Poor Performance** (investigate):

```
Uptime: <95%
Average Response Time: >2000ms
```

### Public Status Page (Optional)

Create a public status page:

1. Go to "My Settings" → "Public Status Pages"
2. Click "Add Public Status Page"
3. Select monitors to include
4. Customize design
5. Get shareable URL

**Example**: `https://stats.uptimerobot.com/your-custom-slug`

---

## Alerts Configuration

### Alert Threshold Settings

**For Staging**:

- Alert when down for: `5 minutes` (tolerant)
- Re-alert every: `30 minutes`
- Alert via: Email

**For Production**:

- Alert when down for: `2 minutes` (sensitive)
- Re-alert every: `15 minutes`
- Alert via: Email + Slack

### Custom Alert Messages

Go to Monitor Settings → Advanced Settings:

**Custom DOWN Alert Message**:

```
⚠️ {monitorFriendlyName} is DOWN!

URL: {monitorURL}
Reason: {alertDetails}
Duration: {alertDuration}

Action: Check Render dashboard immediately
```

**Custom UP Alert Message**:

```
✅ {monitorFriendlyName} is UP again!

Duration of downtime: {alertDuration}
```

---

## Best Practices

### ✅ DO

- Monitor both staging and production
- Set appropriate alert thresholds
- Test monitors after creation
- Check status page regularly
- Set up Slack/Discord alerts for team
- Review monthly uptime reports

### ❌ DON'T

- Don't monitor more frequently than 5 minutes (not allowed on free plan)
- Don't ignore downtime alerts
- Don't monitor unnecessary endpoints (save monitor quota)
- Don't forget to update URLs if they change
- Don't disable monitors without reason

---

## Troubleshooting

### Monitor Shows "Down" But Service is Actually Up

**Causes**:

- Render service is sleeping (cold start > 30s timeout)
- Network issue
- Health endpoint not configured correctly

**Solutions**:

```bash
# Test manually
curl https://your-service.onrender.com/health/liveness

# Check Render logs
# Verify endpoint exists in NestJS app
```

### Response Time Very High (>2000ms)

**Causes**:

- Render service sleeping
- Database connection slow
- Heavy computation in health check

**Solutions**:

- Ensure keep-alive is working (should not sleep)
- Optimize health check endpoint (should be lightweight)
- Check database connection pooling

### Too Many Alerts

**Causes**:

- Service actually unstable
- Alert threshold too sensitive

**Solutions**:

- Investigate service logs in Render
- Increase "Alert when down for" duration
- Check Render service status

### Monitor Paused Unexpectedly

**Causes**:

- UptimeRobot free plan limits
- Too many failed checks

**Solutions**:

- Check UptimeRobot account status
- Verify service is actually up
- Contact UptimeRobot support

---

## Cost and Limits

### Free Plan

**Included**:

- 50 monitors
- 5-minute check intervals
- Email alerts
- Unlimited alert contacts
- 2 months of log retention

**Limits**:

- Cannot check more frequently than 5 minutes
- No SMS alerts
- No custom HTTP headers (for advanced use cases)

### Pro Plan ($7/month)

**Additional Features**:

- 1-minute check intervals
- SMS alerts
- Advanced HTTP options
- 1-year log retention
- Priority support

**Recommendation**: Free plan sufficient for now, upgrade when:

- Need faster detection (<5min)
- Need SMS alerts
- > 50 monitors needed

---

## Alternatives

### Option 1: Cron-Job.org

**Free Plan**:

- 100 executions/day = ~10 min intervals
- Sufficient for single service
- **Problem**: Not enough for dual environments (need 200/day)

**Not Recommended** for our use case

### Option 2: Better Uptime (Free Tier)

**Free Plan**:

- 10 monitors
- 3-minute intervals
- Faster than UptimeRobot
- Good alternative if needed

### Option 3: GitHub Actions Cron

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Services Alive

on:
  schedule:
    - cron: '*/10 * * * *' # Every 10 minutes

jobs:
  ping-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Staging API
        run: curl https://flourish-api-staging.onrender.com/health/liveness

  ping-production:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Production API
        run: curl https://flourish-api-production.onrender.com/health/liveness
```

**Pros**: Free, integrated with GitHub
**Cons**: Less monitoring features, no uptime dashboard

---

## Migration Plan (If Needed)

### From Cron-Job.org to UptimeRobot

1. Set up UptimeRobot monitors (as described above)
2. Verify both monitors working for 24 hours
3. Disable Cron-Job.org tasks
4. Monitor for another 24 hours
5. Delete Cron-Job.org account (optional)

### To Paid Plan (UptimeRobot Pro)

**When to Upgrade**:

- Need <5min detection
- Need SMS alerts
- Need advanced HTTP features

**How to Upgrade**:

1. Go to UptimeRobot Billing
2. Select Pro plan ($7/month)
3. Enter payment details
4. Existing monitors automatically upgraded

---

## Checklist

After completing setup:

- [ ] UptimeRobot account created
- [ ] Staging monitor created and active
- [ ] Production monitor created and active
- [ ] Alert contacts configured
- [ ] Test downtime alert (pause monitor, verify alert received)
- [ ] Test uptime alert (unpause monitor, verify alert received)
- [ ] Public status page created (optional)
- [ ] Slack/Discord integration set up (optional)
- [ ] Documented monitor URLs for team

---

## Next Steps

✅ Keep-Alive configured successfully!

Now proceed to:

1. Monitor uptime for 48 hours
2. Adjust alert thresholds if needed
3. Set up public status page (optional)
4. Integrate with team chat (Slack/Discord)

---

## Important Notes

⏰ **5-Minute Interval**:

- Render services sleep after 15 minutes
- 5-minute pings ensure service wakes every 5 minutes
- Service never reaches 15-minute sleep threshold

📊 **Monitoring Value**:

- Not just keep-alive, also provides uptime monitoring
- Alerts you to actual production issues
- Historical data for incident analysis

💰 **Cost**:

- Free forever for up to 50 monitors
- Sufficient for small to medium projects
- Upgrade only when needed

---

**Last Updated**: 2025-01-07
**Service**: UptimeRobot Free Plan
**Status**: Active Monitoring
