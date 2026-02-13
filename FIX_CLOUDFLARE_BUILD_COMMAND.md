# Fix: Cloudflare Pages Using Wrong Build Command

## Problem
Cloudflare Pages is executing:
```
Executing user command: npx @cloudflare/next-on-pages@1
```

Instead of:
```
Executing user command: npm run build:cloudflare
```

---

## Solution: Set Build Command in Cloudflare Dashboard

### Step 1: Go to Cloudflare Pages Settings
1. Go to: https://dash.cloudflare.com
2. **Workers & Pages** → Select your Pages project
3. **Settings** → **Builds & deployments**

### Step 2: Update Build Configuration

Find **"Build configuration"** section:

**Build command:**
```
npm run build:cloudflare
```

**Build output directory:**
```
.open-next/assets
```

**Deploy command:**
```
(leave completely empty - delete any value)
```

### Step 3: Save and Redeploy
1. Click **"Save"**
2. Go to **Deployments** tab
3. Click **"Retry deployment"** on latest deployment
4. Or push a new commit to trigger auto-deploy

---

## Why This Happens

Cloudflare Pages has auto-detection that:
1. Checks for `wrangler.json`/`wrangler.jsonc` files
2. If found, might try to use old adapter
3. Ignores your build command setting if auto-detection is active

**Solution:** Explicitly set build command in dashboard (overrides auto-detection)

---

## Verify Settings

After updating, check build logs should show:
```
Executing user command: npm run build:cloudflare
> azone@0.1.0 build:cloudflare
> npx @opennextjs/cloudflare build
```

NOT:
```
Executing user command: npx @cloudflare/next-on-pages@1
```

---

## Alternative: Framework Preset

If available in dashboard:
1. **Framework preset:** Select **"None"** or **"Next.js (OpenNext)"**
2. This disables auto-detection
3. Then set build command manually

---

## Summary

**Problem:** Cloudflare Pages using wrong build command (auto-detected)

**Solution:**
1. Go to Cloudflare Pages → Settings → Builds & deployments
2. Set **Build command:** `npm run build:cloudflare`
3. Set **Build output directory:** `.open-next/assets`
4. **Deploy command:** (empty)
5. Save and redeploy

**Next:** Update dashboard settings manually! 🚀
