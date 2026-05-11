# SkyCast Pro - Quick Deployment Guide

## Step 1: Create Supabase Project (Manual)

Since the web UI is having issues, please:

1. Go to: https://app.supabase.com/new/uxqxjtzxssnxuyfrxgen
2. Fill out the form:
   - **Project Name**: `skycast-pro`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose one closest to you
   - Click **Create new project**
3. Wait for the project to be created (5-10 minutes)
4. Once created, copy your **Project URL** and **Anon Key** from Project Settings → API

## Step 2: Update Environment Variables

Once you have the credentials, run this command in the terminal:

```bash
cd c:\Users\DELL\OneDrive\Desktop\skycast-pro-main

# Update .env with your Supabase credentials
# Replace YOUR_PROJECT_URL and YOUR_ANON_KEY with actual values
$env:VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
$env:VITE_SUPABASE_KEY="YOUR_ANON_KEY"
```

## Step 3: Deploy Migrations to Supabase

After project is created, copy the SQL from `SUPABASE_MANUAL_MIGRATIONS.sql` and:

1. Go to: `https://app.supabase.com/project/YOUR_PROJECT_ID/sql/new`
2. Paste the entire SQL script
3. Click **Run**

## Step 4: Check GitHub Pages Deployment

Your frontend is automatically deploying to GitHub Pages:

→ Check here: `https://github.com/Fatima-ship-bot/skycast-pro/actions`

Once the build completes, your live app will be at:

→ `https://Fatima-ship-bot.github.io/skycast-pro/`

---

## Current Status

✅ **Frontend**:
- Build passes
- GitHub Pages workflow configured
- Ready for deployment

⏳ **Backend**:
- Waiting for Supabase project creation
- All migrations prepared in `SUPABASE_MANUAL_MIGRATIONS.sql`
- Ready to deploy once project exists

---

**Need help?** Let me know once you've created the Supabase project and I'll verify everything!
