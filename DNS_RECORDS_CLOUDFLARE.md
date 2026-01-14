# DNS Records Configuration - Cloudflare

## 📋 Overview

This document contains the exact DNS records you need to add in Cloudflare for `paing.xyz` and `admin.paing.xyz`.

## 🌐 Required DNS Records

### Main Website (paing.xyz)

#### Option 1: Using Vercel's CNAME (Recommended)
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

**Note**: Some DNS providers don't allow CNAME on root domain. If that's the case, use Option 2.

#### Option 2: Using A Record (If CNAME not allowed)
```
Type: A
Name: @
IPv4 Address: 76.76.21.21
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

**Note**: The IP address above is Vercel's IP. Vercel will provide the correct IP when you add the domain.

### WWW Subdomain (www.paing.xyz)
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

### Admin Subdomain (admin.paing.xyz)
```
Type: CNAME
Name: admin
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

## 📝 Step-by-Step Instructions

### Step 1: Get Vercel DNS Information

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add domain: `paing.xyz`
5. Add domain: `admin.paing.xyz`
6. Vercel will show you the DNS records to add

### Step 2: Add DNS Records in Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: `paing.xyz`
3. Go to **DNS** → **Records**
4. Click **Add record**

#### For Main Domain (paing.xyz):
- **Type**: CNAME (or A if CNAME not allowed)
- **Name**: `@` (or leave blank for root)
- **Target**: `cname.vercel-dns.com` (or Vercel's IP)
- **Proxy status**: ✅ Proxied (Orange Cloud)
- **TTL**: Auto
- Click **Save**

#### For WWW Subdomain:
- **Type**: CNAME
- **Name**: `www`
- **Target**: `cname.vercel-dns.com`
- **Proxy status**: ✅ Proxied (Orange Cloud)
- **TTL**: Auto
- Click **Save**

#### For Admin Subdomain:
- **Type**: CNAME
- **Name**: `admin`
- **Target**: `cname.vercel-dns.com`
- **Proxy status**: ✅ Proxied (Orange Cloud)
- **TTL**: Auto
- Click **Save**

### Step 3: Verify DNS Records

After adding DNS records, verify they're correct:

```bash
# Check main domain
nslookup paing.xyz

# Check www subdomain
nslookup www.paing.xyz

# Check admin subdomain
nslookup admin.paing.xyz
```

### Step 4: Wait for Propagation

- DNS changes can take 5-30 minutes to propagate
- Cloudflare proxy (Orange Cloud) helps with faster propagation
- Check Vercel dashboard for domain verification status

## 🔒 SSL/TLS Configuration

### Automatic SSL (Recommended)
- Vercel automatically issues SSL certificates
- Cloudflare proxy (Orange Cloud) enables SSL
- SSL certificates are issued within 5-10 minutes after DNS propagation

### Manual SSL (If needed)
1. In Cloudflare: **SSL/TLS** → **Overview**
2. Set encryption mode to: **Full (strict)**
3. Vercel will handle SSL certificate issuance

## ✅ Verification Checklist

After adding DNS records:

- [ ] `paing.xyz` resolves to Vercel
- [ ] `www.paing.xyz` resolves to Vercel
- [ ] `admin.paing.xyz` resolves to Vercel
- [ ] All domains show "Proxied" (Orange Cloud) in Cloudflare
- [ ] Vercel dashboard shows domains as "Valid"
- [ ] SSL certificates are issued (check in Vercel)

## 🐛 Troubleshooting

### Issue: Domain not resolving
- **Check**: DNS records are correct
- **Check**: Proxy status is enabled (Orange Cloud)
- **Wait**: DNS propagation can take up to 30 minutes
- **Check**: Vercel domain configuration

### Issue: SSL certificate not issued
- **Wait**: SSL certificates take 5-10 minutes
- **Check**: DNS records are correct
- **Check**: Domain is verified in Vercel
- **Check**: Cloudflare SSL/TLS mode is "Full (strict)"

### Issue: Admin subdomain not working
- **Check**: CNAME record for `admin` is correct
- **Check**: Proxy status is enabled
- **Check**: Vercel domain configuration includes `admin.paing.xyz`

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Cloudflare DNS logs
3. Verify DNS records match Vercel's requirements
4. Contact Vercel support if domain verification fails

---

**Last Updated**: 2024
**Status**: Ready for DNS Configuration
