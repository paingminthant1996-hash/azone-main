# Cloudflare Pages Deployment Troubleshooting

## Problem: Deploy မလုပ်ဘူး

## Possible Causes & Solutions

### 1. Branch Configuration Issue

Cloudflare Pages က **wrong branch** ကို watch လုပ်နေတာ ဖြစ်နိုင်တယ်။

**Check:**
1. Cloudflare Dashboard → **Pages** → **azone-main**
2. **Settings** → **Builds & deployments**
3. **Production branch** ကို check လုပ်ပါ:
   - `main` ဖြစ်နေရင် → `cursor/azone-main-review-2076` သို့ ပြောင်းပါ
   - (သို့မဟုတ်) **Preview deployments** → **Branch** → `cursor/azone-main-review-2076` enable လုပ်ပါ

### 2. GitHub Integration Issue

Cloudflare Pages က GitHub repo နဲ့ connect မဖြစ်တာ ဖြစ်နိုင်တယ်။

**Check:**
1. Cloudflare Dashboard → **Pages** → **azone-main**
2. **Settings** → **Git**
3. **Connected repository** check လုပ်ပါ
4. **Reconnect** လုပ်ရင် reconnect လုပ်ပါ

### 3. Build Command Error

Build command က error ဖြစ်နေတာ ဖြစ်နိုင်တယ်။

**Check:**
1. Cloudflare Dashboard → **Pages** → **azone-main**
2. **Deployments** tab
3. Latest deployment click
4. **Build logs** ကို check လုပ်ပါ
5. Error message ရှိရင် fix လုပ်ပါ

### 4. Manual Deployment

Auto-deploy မလုပ်ရင် manual deployment လုပ်နိုင်တယ်။

**Method 1: Cloudflare Dashboard**
1. Cloudflare Dashboard → **Pages** → **azone-main**
2. **Deployments** tab
3. **Create new deployment** button
4. **Branch**: `cursor/azone-main-review-2076`
5. **Commit**: Latest commit select
6. **Deploy** click

**Method 2: Wrangler CLI**
```bash
npm run deploy:cloudflare
```

**Method 3: GitHub Actions** (if configured)
- Push to branch → GitHub Actions trigger

### 5. Environment Variables Missing

Build က environment variables မရှိလို့ fail ဖြစ်နိုင်တယ်။

**Check:**
1. Cloudflare Dashboard → **Pages** → **azone-main**
2. **Settings** → **Environment Variables**
3. Required variables အကုန် ရှိရင် check လုပ်ပါ:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## Quick Fix Steps

1. **Check branch configuration**
   - Settings → Builds & deployments → Production branch

2. **Check latest deployment**
   - Deployments tab → Latest deployment → Build logs

3. **Manual trigger**
   - Create new deployment → Select branch → Deploy

4. **Check GitHub connection**
   - Settings → Git → Connected repository

---

## Current Status

- **Branch**: `cursor/azone-main-review-2076`
- **Latest commit**: `fca42d0` - "Add deployment order fix guide"
- **Build config**: `npm run build:cloudflare`
- **Output dir**: `.open-next/assets`

---

## Next Steps

1. Cloudflare Dashboard သွားပါ
2. Pages → azone-main → Settings → Builds & deployments
3. Production branch ကို `cursor/azone-main-review-2076` သို့ set လုပ်ပါ
4. Save လုပ်ပါ
5. Deployments tab → Create new deployment
