# Deployment Guide - paing.xyz & admin.paing.xyz

## 📋 Overview

This guide explains how to deploy the main website to `paing.xyz` and the admin panel to `admin.paing.xyz` subdomain.

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

## 🔧 Configuration Changes Made

### 1. Middleware (middleware.ts)
- **Admin Subdomain Routing**: `admin.paing.xyz` → Allows `/admin/*` routes
- **Main Domain**: `paing.xyz` → Blocks `/admin/*` routes (404)
- **Authentication**: Admin routes require login on admin subdomain

### 2. Metadata (app/layout.tsx)
- Updated `metadataBase` to `https://paing.xyz`
- Updated `canonical` URL to `https://paing.xyz`
- Updated OpenGraph URLs

### 3. Vercel Configuration (vercel.json)
- Removed redirects from `paing.xyz` to `store.paing.xyz`
- Main domain now serves the website directly
- `www.paing.xyz` redirects to `paing.xyz`

## 🌐 DNS Records (Cloudflare)

### Required DNS Records:

#### Main Website (paing.xyz)
```
Type: A
Name: @
Content: [Vercel IP Address]
Proxy: ✅ Proxied (Orange Cloud)

Type: A
Name: www
Content: [Vercel IP Address]
Proxy: ✅ Proxied (Orange Cloud)
```

#### Admin Panel (admin.paing.xyz)
```
Type: CNAME
Name: admin
Content: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
```

**OR** (if using A record):
```
Type: A
Name: admin
Content: [Vercel IP Address]
Proxy: ✅ Proxied (Orange Cloud)
```

## 🚀 Vercel Deployment Steps

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Add Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
RESEND_API_KEY=your-resend-api-key
```

### Step 3: Add Domains

#### Main Website Domain:
1. Go to **Project Settings** → **Domains**
2. Add domain: `paing.xyz`
3. Add domain: `www.paing.xyz`
4. Follow DNS instructions

#### Admin Subdomain:
1. In the same project, add domain: `admin.paing.xyz`
2. Follow DNS instructions

### Step 4: Deploy

1. Push code to GitHub
2. Vercel will auto-deploy
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
- [ ] Both domains have SSL certificates (automatic with Vercel)
- [ ] DNS records are correct in Cloudflare
- [ ] Both domains resolve correctly

## 🔒 Security Notes

1. **Admin Panel Protection**:
   - Only accessible on `admin.paing.xyz`
   - Requires authentication
   - Main domain blocks admin routes (404)

2. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use Vercel environment variables
   - Keep service role keys secure

3. **DNS Security**:
   - Use Cloudflare proxy (Orange Cloud) for DDoS protection
   - Enable SSL/TLS encryption

## 🐛 Troubleshooting

### Issue: Admin panel not accessible
- **Check**: DNS records for `admin.paing.xyz`
- **Check**: Vercel domain configuration
- **Check**: Middleware routing logic

### Issue: Main website shows 404 for admin routes
- **Expected**: This is correct behavior
- Admin routes are blocked on main domain

### Issue: SSL certificate not issued
- **Wait**: Vercel takes 5-10 minutes to issue SSL
- **Check**: DNS records are correct
- **Check**: Domain is verified in Vercel

## 📝 Next Steps

1. **DNS Configuration**: Add DNS records in Cloudflare (see DNS Records section)
2. **Vercel Deployment**: Deploy to Vercel (see Vercel Deployment Steps)
3. **Testing**: Verify both domains work correctly
4. **Monitoring**: Set up Vercel Analytics (optional)

## 🔗 Important Links

- **Main Website**: https://paing.xyz
- **Admin Panel**: https://admin.paing.xyz/admin/login
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

**Last Updated**: 2024
**Status**: Ready for Deployment
