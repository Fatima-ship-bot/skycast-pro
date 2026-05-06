# SkyCast Pro - Deployment Checklist

## Pre-Deployment ✅

- [x] Build passes: `npm run build`
- [x] All new services integrated
- [x] GitHub Actions workflow created
- [x] Environment variables configured

## GitHub Pages Setup

### Step 1: Prepare Repository
```bash
cd c:\Users\DELL\OneDrive\Desktop\skycast-pro-main
git init
git add .
git commit -m "Initial commit: SkyCast Pro with backend services"
```

### Step 2: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/skycast-pro.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Pages → Source: Deploy from a branch
3. Select `gh-pages` branch and `/` (root)
4. Save

### Step 4: Monitor Deployment
- Check Actions tab for build status
- Once complete, app available at: `https://YOUR_USERNAME.github.io/skycast-pro/`

## Supabase Backend

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose region closest to users
4. Copy Project URL and anon key

### Step 2: Deploy Database

```bash
npm install -g @supabase/cli
supabase login
supabase db push
```

### Step 3: Deploy Edge Functions

```bash
supabase functions deploy process-alerts
supabase functions deploy cleanup-data
supabase functions deploy send-notification
```

### Step 4: Configure Cron Jobs

In Supabase Dashboard:

**Process Alerts** (every 30 minutes)
- Cron: `0 */30 * * * *`
- Function: `process-alerts`

**Cleanup Data** (daily at 2 AM UTC)
- Cron: `0 2 * * *`
- Function: `cleanup-data`

## Environment Configuration

### Local Development
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_OPENWEATHER_API_KEY=your-api-key
```

### GitHub Actions
Add to repository secrets (Settings → Secrets and variables → Actions):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`
- `VITE_OPENWEATHER_API_KEY` (optional)

## Post-Deployment Testing

### Test Frontend
- [ ] Visit app URL
- [ ] Test search functionality
- [ ] Sign in with email
- [ ] Create favorite city
- [ ] Create weather alert
- [ ] Compare cities
- [ ] Change settings

### Test Backend
- [ ] Check database in Supabase
- [ ] Verify favorites saved
- [ ] Verify alerts created
- [ ] Check search history
- [ ] Monitor rate limits

### Test Edge Functions
- [ ] Check function logs
- [ ] Verify cron jobs running
- [ ] Test alert notifications

## Deployment Commands

### Build
```bash
npm run build
```

### Test Production Build
```bash
npm run preview
```

### Deploy to GitHub Pages
```bash
git push origin main
# GitHub Actions will automatically deploy
```

### Deploy Supabase Changes
```bash
supabase db push  # Database migrations
supabase functions deploy  # Edge functions
```

## Rollback Plan

### GitHub Pages Rollback
1. Go to Actions tab
2. Find failed deployment
3. Run previous successful workflow
4. Or revert commit: `git revert HEAD`

### Supabase Rollback
```bash
# View migrations history
supabase migration list

# Rollback to previous migration
supabase db reset
supabase db push
```

## Monitoring

### GitHub Actions
- Check Actions tab after each push
- Set up email notifications for failures

### Supabase
- Monitor Edge Function logs
- Check database queries
- Review RLS policies

### Performance
- Check bundle size in build logs
- Monitor API response times
- Track error rates

## Support Resources

- **GitHub Pages**: https://docs.github.com/en/pages
- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/

## Completed Setup ✅

- [x] Vite config updated for GitHub Pages
- [x] GitHub Actions workflow created
- [x] Database migrations created (6 files)
- [x] Backend services created (6 services)
- [x] Edge Functions created (3 functions)
- [x] React components integrated
- [x] Rate limiting added
- [x] Search history tracking added
- [x] UI pages created (Alerts, Comparisons)

## Next Steps

1. **Push to GitHub**: `git push origin main`
2. **Enable GitHub Pages** in repository settings
3. **Deploy Supabase**: Run migration and function deployment commands
4. **Configure secrets** in GitHub Actions
5. **Test deployment**: Visit your live URL
6. **Monitor logs**: Check Actions and Supabase dashboards
