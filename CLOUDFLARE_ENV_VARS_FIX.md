# Cloudflare Environment Variables Fix

## Problem: Supabase Configuration Missing Error

Error message:
```
Supabase configuration missing! Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Cloudflare Pages environment variables.
```

## Root Cause

Cloudflare Variables မှာ variable names က **wrong** ဖြစ်နေတယ်:
- ❌ `SUPABASE_URL` → Should be `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY` → Should be `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Solution: Fix Variable Names in Cloudflare

### Step 1: Go to Cloudflare Dashboard

1. **Cloudflare Dashboard** → **Pages** → **azone-main**
2. **Settings** → **Environment Variables** (or **Variables and Secrets**)

### Step 2: Check Current Variables

Current (Wrong):
- `SUPABASE_URL` ❌
- `SUPABASE_ANON_KEY` ❌

### Step 3: Add Correct Variables

**Required Variables (with NEXT_PUBLIC_ prefix):**

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Value: Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`
   - Get from: Supabase Dashboard → Settings → API → Project URL

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Value: Your Supabase anon/public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Get from: Supabase Dashboard → Settings → API → anon/public key

3. **`SUPABASE_SERVICE_ROLE_KEY`** (Keep as Secret)
   - Value: Your Supabase service_role key
   - Get from: Supabase Dashboard → Settings → API → service_role key

### Step 4: Remove Old Variables (Optional)

After adding correct ones, you can delete:
- `SUPABASE_URL` (if exists)
- `SUPABASE_ANON_KEY` (if exists)

**Note:** Keep `SUPABASE_SERVICE_ROLE_KEY` - it's correct and needed.

---

## Complete List of Required Variables

### Public Variables (NEXT_PUBLIC_ prefix):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz
NEXT_PUBLIC_APP_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_EMAILS=paingminthant1996@gmail.com
```

### Secrets (No NEXT_PUBLIC_ prefix):

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
GITHUB_TOKEN=ghp_...
CLOUDFLARE_API_KEY=...
CLOUDFLARE_ZONE_ID=...
```

---

## Why NEXT_PUBLIC_ Prefix?

- **`NEXT_PUBLIC_`** prefix က Next.js က client-side code မှာ use လုပ်နိုင်အောင် expose လုပ်ပေးတယ်
- Without prefix → Server-side only (client မှာ access မရဘူး)
- Supabase client က browser မှာ run လုပ်တာကြောင့် `NEXT_PUBLIC_` prefix လိုအပ်တယ်

---

## Verification

After adding variables:

1. **Save** all variables
2. **Retry deployment** (or wait for next auto-deploy)
3. **Check admin login page** → Error message မရှိတော့ဘူး
4. **Check website** → Supabase features work correctly

---

## Current Status

- **Error**: Supabase configuration missing
- **Cause**: Missing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Fix**: Add variables with correct names in Cloudflare

---

## Next Steps

1. **Cloudflare Dashboard** → Pages → azone-main → Settings → Environment Variables
2. **Add** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Set values** from Supabase Dashboard
4. **Save**
5. **Retry deployment**
