# Cloudflare Pages Project Setup Guide

## Problem
"No projects found" in Cloudflare Workers & Pages dashboard - project needs to be created and connected to GitHub.

## Solution: Create Cloudflare Pages Project

### Step 1: Go to Cloudflare Pages Dashboard
1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **Create application**
3. Select **Pages** tab
4. Click **Connect to Git**

### Step 2: Connect GitHub Repository
1. **Authorize Cloudflare** to access your GitHub account (if not already done)
2. **Select repository**: `paingminthant1996-hash/azone-main`
3. Click **Begin setup**

### Step 3: Configure Build Settings

**Project name:** `azone-main` (or your preferred name)

**Production branch:** `main`

**Build command:**
```
npm run build:cloudflare
```

**Build output directory:**
```
.open-next/assets
```

**Root directory:** (leave empty or `/`)

**Environment variables:** (Add these after project creation)
- Go to **Settings** → **Environment Variables**
- Add all required variables (see below)

### Step 4: Add Environment Variables

After project is created, go to **Settings** → **Environment Variables**:

#### Required Variables (Production):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz
NEXT_PUBLIC_APP_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_EMAILS=paingminthant1996@gmail.com
```

#### Optional Variables:
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@paing.xyz
GMAIL_FROM_EMAIL=noreply@paing.xyz
ADMIN_CREATE_SECRET=your-secret-here
```

### Step 5: Deploy

After configuration:
1. Click **Save and Deploy**
2. Cloudflare will automatically:
   - Clone your repository
   - Install dependencies (`npm clean-install`)
   - Run build command (`npm run build:cloudflare`)
   - Deploy to Cloudflare Pages

### Step 6: Set Custom Domain (Optional)

After first deployment:
1. Go to **Custom domains** section
2. Click **Set up a custom domain**
3. Add: `paing.xyz`
4. Add: `www.paing.xyz` (will redirect to `paing.xyz`)
5. Add: `admin.paing.xyz` (for admin subdomain)

Cloudflare will automatically configure DNS records.

## Build Configuration Files

Your project already has these files configured:
- ✅ `cloudflare-pages-build-config.json` - Build config
- ✅ `wrangler.toml` - Cloudflare configuration
- ✅ `package.json` - Build scripts

## Verification

After deployment:
1. Check **Deployments** tab - should show "Success"
2. Visit your site URL (e.g., `https://azone-main.pages.dev`)
3. Check admin login: `https://admin.paing.xyz/admin/login`
4. Verify no "Supabase configuration missing" errors

## Troubleshooting

### Build Fails
- Check **Build logs** in Deployments tab
- Verify build command: `npm run build:cloudflare`
- Verify output directory: `.open-next/assets`

### Environment Variables Not Working
- Make sure variables are set for **Production** environment
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Custom Domain Not Working
- Check DNS records in Cloudflare DNS settings
- Wait for DNS propagation (can take up to 24 hours)
- Verify domain is added in Pages → Custom domains

## Quick Setup Checklist

- [ ] Create Cloudflare Pages project
- [ ] Connect to GitHub repository (`azone-main`)
- [ ] Set production branch: `main`
- [ ] Set build command: `npm run build:cloudflare`
- [ ] Set output directory: `.open-next/assets`
- [ ] Add environment variables
- [ ] Deploy project
- [ ] Set custom domains
- [ ] Verify deployment works

## Next Steps After Setup

1. **Monitor deployments** - Each push to `main` will auto-deploy
2. **Set up preview deployments** - For pull requests
3. **Configure environment variables** for Preview environment (optional)
4. **Set up custom domains** for production
