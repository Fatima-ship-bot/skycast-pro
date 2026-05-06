# GitHub Pages Deployment Guide

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Node.js 18+** installed locally
3. **Git** configured

## Step 1: Initialize Git Repository

If not already done:

```bash
cd c:\Users\DELL\OneDrive\Desktop\skycast-pro-main
git init
git add .
git commit -m "Initial commit: SkyCast Pro with full backend integration"
```

## Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a repository named `skycast-pro`
3. **Important**: Repository must be **public** for free GitHub Pages
4. Don't initialize with README (you already have one)

## Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/skycast-pro.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (will be created by GitHub Actions)
   - Folder: **/ (root)**
4. Save

## Step 5: Configure Environment Variables (Optional)

For live weather data, add to your repository:

1. Settings → Secrets and variables → Actions → New repository secret
2. Add `VITE_OPENWEATHER_API_KEY` with your OpenWeather API key
3. Update `.github/workflows/deploy.yml` to include:

```yaml
env:
  VITE_OPENWEATHER_API_KEY: ${{ secrets.VITE_OPENWEATHER_API_KEY }}
```

## Step 6: Monitor Deployment

1. Go to **Actions** tab in your repository
2. GitHub Actions will automatically build and deploy when you push to `main`
3. First deployment may take 1-2 minutes
4. Once complete, your app will be available at:

```
https://YOUR_USERNAME.github.io/skycast-pro/
```

## Supabase Backend Setup

### Deploy Migrations

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Create a new project at supabase.com if needed

# Push migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy process-alerts
supabase functions deploy cleanup-data
supabase functions deploy send-notification
```

### Configure Supabase in Your App

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_OPENWEATHER_API_KEY=your-api-key
```

Get these values from Supabase dashboard:
- Settings → API
- Copy `URL` and `anon key`

### Update GitHub Actions Secrets

Add to repository secrets:
1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_KEY`
3. `VITE_OPENWEATHER_API_KEY` (optional)

## Manual Deployment

To manually build and test locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview

# Test build is in dist/ folder
```

## Troubleshooting

### Pages not deployed
- Check Actions tab for build errors
- Ensure branch is set to `main`
- Verify `gh-pages` branch exists in Settings → Pages

### Blank page loading
- Check browser console for errors
- Verify base path is set correctly in vite.config.ts
- Check that dist/ folder was created with build

### API errors
- Verify Supabase URL and keys are correct
- Check CORS settings in Supabase
- For OpenWeather: verify API key is valid

### Build failures
- Run `npm ci` to install exact dependencies
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and `package-lock.json`, then reinstall

## Advanced: Custom Domain

To use a custom domain (e.g., skycast.yourdomain.com):

1. In GitHub Pages settings, add custom domain
2. Add DNS records to your domain provider:
   ```
   CNAME → your-username.github.io
   ```
3. GitHub will auto-generate HTTPS certificate

## Monitoring & Maintenance

### Set up Edge Function Scheduling

For `process-alerts` and `cleanup-data`:

```bash
# Via Supabase dashboard:
# 1. Go to Cron Jobs
# 2. Create new cron job
# 3. Function: process-alerts
#    Schedule: Every 30 minutes (0 */30 * * * *)
# 4. Function: cleanup-data
#    Schedule: Daily at 2 AM (0 2 * * *)
```

### Check Deployment Status

```bash
# View build logs
supabase functions list

# View error logs
supabase logs
```

## Performance Tips

1. **Optimize Images**: Use WebP format for faster loading
2. **Enable Caching**: GitHub Pages sets long cache headers by default
3. **Minify**: Build already minifies everything
4. **Monitor Bundle Size**: Check Actions logs for chunk size warnings

## Security Considerations

1. Never commit `.env.local` to git (already in .gitignore)
2. Use repository secrets for sensitive data
3. Keep Supabase RLS policies enabled
4. Rotate API keys regularly

## Support

For issues:
- GitHub Pages docs: https://docs.github.com/en/pages
- Supabase docs: https://supabase.com/docs
- Vite docs: https://vitejs.dev/
- React docs: https://react.dev/
