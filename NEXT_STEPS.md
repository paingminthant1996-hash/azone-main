# Next Steps - Deployment Guide

## 📋 Current Status

✅ **Code Changes**: Complete
- Subdomain routing configured
- URLs updated (store.paing.xyz → paing.xyz)
- All commits ready

✅ **Documentation**: Complete
- Deployment guides created
- DNS configuration ready

⚠️ **Pending**:
- `.env.local` file (for local development)
- GitHub repository (new repository needed)
- Vercel deployment
- DNS configuration

## 🚀 Step-by-Step Actions

### Step 1: Create .env.local File (Optional - for local testing)

1. Create `.env.local` file in project root
2. Copy from `ENV_LOCAL_TEMPLATE.md`
3. Update with your actual credentials:

```env
# Domain Configuration
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Azone.store <noreply@paing.xyz>
```

### Step 2: GitHub Repository Setup

**Option A: Create New Repository**
1. Go to https://github.com/new
2. Repository name: `azone-main` (or your preferred name)
3. Visibility: Private (recommended)
4. Don't initialize with README
5. Click "Create repository"

**Option B: Use Existing Repository**
- Current remote points to: `llm-chat-app-template`
- Need to update to new repository

**Update Git Remote:**
```bash
# Remove old remote
git remote remove origin

# Add new remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/azone-main.git

# Push to new repository
git push -u origin main
```

### Step 3: Vercel Deployment

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Add New Project**:
   - Import GitHub repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Make sure `NEXT_PUBLIC_SITE_URL=https://paing.xyz`
4. **Add Domains**:
   - Go to Project Settings → Domains
   - Add: `paing.xyz`
   - Add: `www.paing.xyz`
   - Add: `admin.paing.xyz`
5. **Deploy**: Vercel will auto-deploy from GitHub

### Step 4: DNS Configuration (Cloudflare)

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Select Domain**: `paing.xyz`
3. **Go to DNS → Records**
4. **Add Records**:

#### Main Domain (paing.xyz):
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

#### WWW Subdomain:
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

#### Admin Subdomain:
```
Type: CNAME
Name: admin
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

5. **Wait for DNS Propagation**: 5-30 minutes
6. **Verify in Vercel**: Check domain verification status

### Step 5: Verification

After deployment, test:

1. **Main Website**: https://paing.xyz
   - [ ] Homepage loads
   - [ ] Templates page works
   - [ ] Admin routes return 404 (e.g., `/admin/login` → 404)

2. **Admin Panel**: https://admin.paing.xyz/admin/login
   - [ ] Login page loads
   - [ ] Can login as admin
   - [ ] Dashboard works
   - [ ] All admin routes accessible

3. **SSL Certificates**:
   - [ ] All domains have SSL (automatic with Vercel)
   - [ ] HTTPS works for all domains

## 📝 Quick Command Reference

```bash
# 1. Check current status
git status
git remote -v

# 2. Update git remote (if needed)
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/azone-main.git

# 3. Push to GitHub
git push -u origin main

# 4. Test locally (after creating .env.local)
npm run dev
```

## 🔗 Important Links

- **GitHub**: https://github.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Main Website**: https://paing.xyz (after deployment)
- **Admin Panel**: https://admin.paing.xyz/admin/login (after deployment)

## ⚠️ Important Notes

1. **Environment Variables**: 
   - Never commit `.env.local` to Git
   - Add all variables in Vercel dashboard
   - Use same values for production

2. **DNS Propagation**:
   - Can take 5-30 minutes
   - Cloudflare proxy helps with faster propagation
   - Check Vercel dashboard for domain verification

3. **SSL Certificates**:
   - Vercel issues automatically
   - Takes 5-10 minutes after DNS propagation
   - No manual configuration needed

## ✅ Checklist

- [ ] `.env.local` created (for local dev)
- [ ] GitHub repository created/updated
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added in Vercel
- [ ] Domains added in Vercel
- [ ] DNS records added in Cloudflare
- [ ] DNS propagation complete
- [ ] SSL certificates issued
- [ ] Main website tested
- [ ] Admin panel tested

---

**Ready to start?** Begin with Step 1 (optional) or Step 2 (GitHub setup).
