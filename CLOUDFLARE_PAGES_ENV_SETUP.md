# Cloudflare Pages Environment Variables Setup Guide

## Problem
Environment variables are set in **Cloudflare Workers** but the app runs on **Cloudflare Pages**. These are different services and need separate configuration.

## Solution: Set Variables in Cloudflare Pages

### Step 1: Go to Cloudflare Pages Dashboard
1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages** → Select your project (`azone-main`)

### Step 2: Add Environment Variables
1. Click on **Settings** tab
2. Scroll down to **Environment Variables** section
3. Click **Add variable** for each variable below

### Step 3: Required Variables for Production

Add these variables with **Production** environment selected:

#### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### Site URLs
```
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_APP_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz
```

#### Admin
```
NEXT_PUBLIC_ADMIN_EMAILS=paingminthant1996@gmail.com
ADMIN_CREATE_SECRET=your-secret-here
```

#### Stripe (Optional - for payments)
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Resend/Email (Optional)
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@paing.xyz
GMAIL_FROM_EMAIL=noreply@paing.xyz
```

### Step 4: Copy Values from Worker (if needed)
If you already have values in Cloudflare Worker:
1. Go to **Workers & Pages** → Your Worker
2. Copy the variable values
3. Paste them into **Pages** environment variables

### Step 5: Redeploy
After adding variables:
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
3. Or push a new commit to trigger auto-deploy

## Important Notes

⚠️ **Cloudflare Workers ≠ Cloudflare Pages**
- Workers: Serverless functions
- Pages: Static site hosting (Next.js)
- They have **separate** environment variable configurations

✅ **Environment Selection**
- Select **Production** environment for live site
- You can also add **Preview** environment for preview deployments

## Verification

After deployment, check:
1. Admin login page should not show "Supabase configuration missing" error
2. Console should not show environment variable errors
3. Site should function normally

## Troubleshooting

If still not working:
1. Make sure variables are set for **Production** environment
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Check build logs for any errors
