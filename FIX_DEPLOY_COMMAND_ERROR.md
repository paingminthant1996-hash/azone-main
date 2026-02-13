# Fix: Deploy Command Error - Authentication Error [code: 10000]

## Problem
Build succeeded ✅ but deploy failed ❌:
```
✘ [ERROR] Authentication error [code: 10000]
Failed: error occurred while running deploy command
```

**Root Cause:** Using `npx wrangler deploy` which is for **Workers**, not **Pages**.

---

## Solution: Remove Deploy Command

### For Cloudflare Pages:
- ✅ **Build command:** `npm run build:cloudflare`
- ❌ **Deploy command:** (Leave empty - Pages auto-deploys)

### For Cloudflare Workers:
- ✅ **Build command:** `npm run build`
- ✅ **Deploy command:** `npx wrangler deploy`

**You're using Pages, so deploy command should be empty!**

---

## Fix Steps

### Step 1: Go to Cloudflare Pages Settings
1. Cloudflare Dashboard → **Workers & Pages**
2. Select your **Pages** project (`azone-main` or `azone-main-pages`)
3. **Settings** → **Builds & deployments**

### Step 2: Update Build Configuration
1. Find **"Deploy command"** field
2. **Delete** or **leave empty** (remove `npx wrangler deploy`)
3. Keep **Build command:** `npm run build:cloudflare`
4. Keep **Build output directory:** `.open-next/assets`
5. **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"Retry deployment"** on latest deployment
3. Or push a new commit to trigger auto-deploy

---

## Correct Configuration for Pages

### Build Settings:
```
Project name: azone-main-pages (or your chosen name)
Production branch: main
Build command: npm run build:cloudflare
Build output directory: .open-next/assets
Deploy command: (empty - leave blank)
```

### Why No Deploy Command?
- Cloudflare Pages **automatically deploys** after build
- `npx wrangler deploy` is only for **Workers**
- Pages uses the build output directly

---

## Error Details

### What Happened:
1. ✅ Build succeeded (`npm run build:cloudflare`)
2. ❌ Deploy failed (`npx wrangler deploy`)
3. Error: Authentication error [code: 10000]
4. Worker name mismatch: "azone-main" vs "azone-main-v1"

### Why It Failed:
- `wrangler deploy` tries to deploy as **Worker**
- But you're using **Pages** (different service)
- Pages doesn't need deploy command

---

## Verification

After removing deploy command:

1. **Save** settings
2. **Redeploy** (or wait for next commit)
3. **Check** deployment logs:
   - Should show: "Build command completed"
   - Should show: "Deployment successful"
   - Should NOT show: "wrangler deploy" errors

---

## Summary

**Problem:** Deploy command `npx wrangler deploy` is for Workers, not Pages

**Solution:** 
- Remove deploy command (leave empty)
- Keep build command: `npm run build:cloudflare`
- Pages will auto-deploy after build

**Next:** Update Pages settings and redeploy! 🚀
