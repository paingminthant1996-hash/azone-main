# Cloudflare Pages Deployment Guide - paing.xyz & admin.paing.xyz

## 📋 Overview

This guide explains how to deploy the main website to `paing.xyz` and the admin panel to `admin.paing.xyz` using **Cloudflare Pages**.

## 🏗️ Project Structure

```
Main Website (Public): paing.xyz
├── Homepage (/)
├── Templates (/templates)
├── Case Studies (/case-studies)
├── About (/about)
├── Contact (/contact)
├── Docs (/docs)
└── Account routes (/account/*)

Admin Panel (Private): admin.paing.xyz
├── Login (/admin/login)
├── Overview (/admin/overview)
├── Templates Management (/admin/templates)
├── Purchases (/admin/purchases)
├── Settings (/admin/settings)
└── Upload (/admin/upload)
```

## 🔧 Configuration Files

### 1. Build Configuration (`cloudflare-pages-build-config.json`)
```json
{
  "buildCommand": "npm run build:cloudflare",
  "outputDirectory": ".open-next/assets"
}
```

### 2. Wrangler Configuration (`wrangler.toml`)
```toml
name = "azone-main"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next/assets"
```

### 3. Redirects (`public/_redirects`)
```
/www/* https://paing.xyz/:splat 301
```

### 4. Middleware (`middleware.ts`)
- Admin subdomain routing: `admin.paing.xyz` → Allows `/admin/*` routes
- Main domain blocking: `paing.xyz` → Blocks `/admin/*` routes (404)
- Authentication check for admin routes

## 🌐 DNS Records (Cloudflare)

### Required DNS Records:

#### Main Website (paing.xyz)
```
Type: CNAME
Name: @
Target: [Your Cloudflare Pages domain]
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

#### WWW Subdomain (www.paing.xyz)
```
Type: CNAME
Name: www
Target: [Your Cloudflare Pages domain]
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

#### Admin Subdomain (admin.paing.xyz)
```
Type: CNAME
Name: admin
Target: [Your Cloudflare Pages domain]
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

**Note**: After creating the Cloudflare Pages project, you'll get a default domain like `azone-main.pages.dev`. Use this as the target for DNS records, or configure custom domains in Cloudflare Pages dashboard.

## 🚀 Cloudflare Pages Deployment Steps

### Step 1: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **"Create a project"**
4. Connect your GitHub repository:
   - Select repository: `azone-main`
   - Click **"Begin setup"**

### Step 2: Configure Build Settings

In the build configuration:

- **Framework preset**: Next.js (or None)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `.open-next/assets`
- **Root directory**: `/` (root)

**Environment Variables**:
Add these in **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
RESEND_API_KEY=your-resend-api-key
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ZONE_ID=your-cloudflare-zone-id
```

### Step 3: Add Custom Domains

1. Go to **Settings** → **Custom domains**
2. Add domain: `paing.xyz`
3. Add domain: `www.paing.xyz`
4. Add domain: `admin.paing.xyz`
5. Follow DNS instructions provided by Cloudflare

### Step 4: Configure DNS Records

1. Go to **DNS** → **Records** in Cloudflare Dashboard
2. Add the DNS records as shown in the DNS Records section above
3. Wait for DNS propagation (5-30 minutes)

### Step 5: Deploy

1. Cloudflare Pages will auto-deploy on every push to your main branch
2. Or manually trigger deployment from the dashboard
3. Wait for deployment to complete
4. Test both domains:
   - Main: `https://paing.xyz`
   - Admin: `https://admin.paing.xyz/admin/login`

## ✅ Verification Checklist

### Main Website (paing.xyz)
- [ ] Homepage loads correctly
- [ ] Templates page works
- [ ] Admin routes return 404 (e.g., `/admin/login` → 404)
- [ ] Docs page accessible (`/docs`)
- [ ] Footer shows Documentation link
- [ ] www.paing.xyz redirects to paing.xyz

### Admin Panel (admin.paing.xyz)
- [ ] `admin.paing.xyz` redirects to `/admin/overview` (if logged in)
- [ ] `admin.paing.xyz/admin/login` shows login page
- [ ] After login, dashboard loads correctly
- [ ] All admin routes work:
  - `/admin/overview`
  - `/admin/templates`
  - `/admin/purchases`
  - `/admin/settings`
  - `/admin/upload`

### DNS & SSL
- [ ] Both domains have SSL certificates (automatic with Cloudflare)
- [ ] DNS records are correct in Cloudflare
- [ ] Both domains resolve correctly
- [ ] SSL/TLS mode is "Full (strict)" in Cloudflare

## 🔒 Security Notes

1. **Admin Panel Protection**:
   - Only accessible on `admin.paing.xyz`
   - Requires authentication
   - Main domain blocks admin routes (404)

2. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use Cloudflare Pages environment variables
   - Keep service role keys secure

3. **DNS Security**:
   - Use Cloudflare proxy (Orange Cloud) for DDoS protection
   - Enable SSL/TLS encryption (Full strict mode)
   - Enable WAF (Web Application Firewall) rules

## 🐛 Troubleshooting

### Issue: Build fails
- **Check**: Build command is `npm run build:cloudflare`
- **Check**: Output directory is `.open-next/assets`
- **Check**: Node.js version (Cloudflare Pages uses Node.js 18+)
- **Check**: All dependencies are in `package.json`

### Issue: Admin panel not accessible
- **Check**: DNS records for `admin.paing.xyz`
- **Check**: Custom domain configuration in Cloudflare Pages
- **Check**: Middleware routing logic

### Issue: Main website shows 404 for admin routes
- **Expected**: This is correct behavior
- Admin routes are blocked on main domain

### Issue: SSL certificate not issued
- **Wait**: Cloudflare takes 5-10 minutes to issue SSL
- **Check**: DNS records are correct
- **Check**: Domain is verified in Cloudflare Pages
- **Check**: SSL/TLS mode is "Full (strict)"

### Issue: Build output directory error
- **Check**: `cloudflare-pages-build-config.json` has correct output directory
- **Check**: `wrangler.toml` has correct `pages_build_output_dir`
- **Verify**: Build command runs successfully locally

## 📝 Local Development

### Run locally:
```bash
npm install
npm run dev
```

### Build for Cloudflare:
```bash
npm run build:cloudflare
```

### Deploy manually:
```bash
npm run deploy:cloudflare
```

## 🔗 Important Links

- **Main Website**: https://paing.xyz
- **Admin Panel**: https://admin.paing.xyz/admin/login
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/

## 📦 Dependencies

This project uses:
- **Next.js 15** with App Router
- **OpenNext Cloudflare** (`@opennextjs/cloudflare`) for Cloudflare Pages compatibility
- **Supabase** for database and authentication
- **Stripe** for payments
- **Tailwind CSS** for styling

## ⚙️ Build Process

1. **Install dependencies**: `npm ci`
2. **Build with OpenNext**: `npm run build:cloudflare`
   - This runs: `npx @opennextjs/cloudflare build`
   - Outputs to: `.open-next/assets`
3. **Deploy**: Cloudflare Pages automatically deploys from GitHub

## 🎯 Next Steps

1. **DNS Configuration**: Add DNS records in Cloudflare (see DNS Records section)
2. **Cloudflare Pages Deployment**: Deploy to Cloudflare Pages (see Deployment Steps)
3. **Testing**: Verify both domains work correctly
4. **Monitoring**: Set up Cloudflare Analytics (optional)

---

**Last Updated**: 2026-02-09
**Status**: Ready for Cloudflare Pages Deployment
