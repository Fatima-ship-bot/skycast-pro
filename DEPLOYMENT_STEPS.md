# SkyCast Pro - Complete Deployment Steps

## ✅ Current Status
- **Supabase Project**: Already created (ID: `wsslqogckvtuttcpzcgc`)
- **Credentials**: In `.env` file ready to use
- **Git Repository**: Already pushed to main branch
- **Build**: Ready to deploy

---

## 📋 Step 1: Deploy Database Migrations

### Option A: Manual Web UI (Recommended)

1. Go to: https://app.supabase.com/project/wsslqogckvtuttcpzcgc
2. Click **SQL Editor** → **New Query**
3. Copy the entire contents of `SUPABASE_MANUAL_MIGRATIONS.sql` 
4. Paste into the SQL Editor
5. Click **Run** (or Ctrl+Enter)
6. Wait for all migrations to complete (should take 1-2 minutes)

### Option B: Via Supabase CLI

```bash
cd c:\Users\DELL\OneDrive\Desktop\skycast-pro-main

# Login first (opens browser)
npx supabase login

# Deploy migrations
npx supabase db push --linked
```

---

## 🚀 Step 2: Deploy Edge Functions

After migrations are done, deploy the three serverless functions:

```bash
# Make sure you're in the project directory
cd c:\Users\DELL\OneDrive\Desktop\skycast-pro-main

# Deploy each function
npx supabase functions deploy process-alerts --project-ref wsslqogckvtuttcpzcgc
npx supabase functions deploy cleanup-data --project-ref wsslqogckvtuttcpzcgc
npx supabase functions deploy send-notification --project-ref wsslqogckvtuttcpzcgc
```

If you haven't logged in yet:
```bash
npx supabase login  # Then use the link provided
```

---

## ⏰ Step 3: Configure Cron Jobs

After Edge Functions are deployed, set up scheduled tasks:

1. Go to: https://app.supabase.com/project/wsslqogckvtuttcpzcgc/functions
2. Click on **process-alerts** function
3. Scroll to **Cron** section
4. Enable cron and set: `0 */30 * * * *` (every 30 minutes)
5. Repeat for **cleanup-data**: `0 2 * * *` (daily at 2 AM UTC)
6. **send-notification** doesn't need cron (triggered by alerts)

---

## 🔑 Step 4: Update GitHub Repository Secrets

Add environment variables to GitHub so CI/CD pipeline can access Supabase:

1. Go to: https://github.com/Fatima-ship-bot/skycast-pro
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://wsslqogckvtuttcpzcgc.supabase.co` |
| `VITE_SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzc2xxb2dja3Z0dXR0Y3B6Y2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzEwNTIsImV4cCI6MjA5MzY0NzA1Mn0._UnsY8JFEuJ2PX3GtuK56xwGR76bM5SrvHnacSYRFRA` |

---

## 🌐 Step 5: Verify Frontend Deployment

Your frontend should be auto-deploying via GitHub Actions:

1. Go to: https://github.com/Fatima-ship-bot/skycast-pro/actions
2. You should see a workflow running
3. Once complete (green checkmark), your app will be at:
   ```
   https://Fatima-ship-bot.github.io/skycast-pro/
   ```

---

## ✅ Step 6: Test Everything

### Frontend Tests
- [ ] Visit: https://Fatima-ship-bot.github.io/skycast-pro/
- [ ] Search for a city (e.g., "London")
- [ ] Test sign in with email
- [ ] Create a favorite city
- [ ] Create a weather alert
- [ ] Compare two cities
- [ ] Check settings page
- [ ] Test export functionality

### Backend Tests (Supabase)
1. Go to: https://app.supabase.com/project/wsslqogckvtuttcpzcgc/editor
2. Check **profiles** table - should have your user
3. Check **favorite_cities** - should have saved cities
4. Check **weather_alerts** - should have alerts
5. Check Edge Functions logs for any errors

---

## 🆘 Troubleshooting

### Frontend shows blank page
- Check console (F12) for errors
- Check GitHub Actions build status
- Verify secrets are set correctly

### Backend not working
- Check Supabase SQL Editor for migration errors
- Check Edge Functions logs in Supabase dashboard
- Verify environment variables are correct

### Migrations failed
- Go back to SQL Editor
- Clear the errors by dropping conflicting tables first
- Re-run migrations step by step

---

## 📝 Deployment Checklist

- [ ] Database migrations deployed
- [ ] Edge Functions deployed
- [ ] Cron jobs configured
- [ ] GitHub secrets added
- [ ] Frontend deployed to GitHub Pages
- [ ] Tested frontend functionality
- [ ] Tested backend functionality
- [ ] Verified email authentication works
- [ ] Verified favorites sync works
- [ ] Verified weather alerts work

---

## 🎉 You're Done!

Once all steps are complete:
1. Your app is live at: `https://Fatima-ship-bot.github.io/skycast-pro/`
2. All data is backed up in Supabase
3. Alerts run automatically every 30 minutes
4. Data cleanup runs daily

**Share your app URL and enjoy!** 🚀
