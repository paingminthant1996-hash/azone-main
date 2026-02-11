# Fix: Cloudflare Pages Auto-Detecting Deprecated Adapter

## Problem
Cloudflare Pages is still auto-detecting and using `@cloudflare/next-on-pages`:
```
Executing user command: npx @cloudflare/next-on-pages@1
Found wrangler.json file. Reading build configuration...
```

Even though we removed it from `package.json`, Cloudflare Pages is still detecting it.

---

## Root Cause

Cloudflare Pages has auto-detection that checks for:
1. `wrangler.json` or `wrangler.jsonc` files
2. `@cloudflare/next-on-pages` in package.json (we removed this ✅)
3. Build command configuration

The issue is that Cloudflare Pages might be:
- Using cached configuration
- Auto-detecting based on file structure
- Not respecting the build command setting

---

## Solution: Explicitly Set Build Command

### Step 1: Verify Cloudflare Pages Settings

Go to Cloudflare Dashboard:
1. **Workers & Pages** → Your Pages project
2. **Settings** → **Builds & deployments**
3. **Build configuration** section

### Step 2: Set Build Command Explicitly

Make sure these are set:

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
(leave empty)
```

### Step 3: Check for Auto-Detection Override

Cloudflare Pages might be overriding your build command. Check:
- **Framework preset:** Should be "None" or "Next.js (OpenNext)"
- **Auto-detection:** Might need to disable if available

---

## Alternative: Remove/Update wrangler.jsonc

If `wrangler.jsonc` exists and is causing issues:

### Option 1: Delete wrangler.jsonc
If not needed, delete it:
```bash
rm wrangler.jsonc
```

### Option 2: Update wrangler.jsonc
If needed, make sure it doesn't reference old adapter:
```jsonc
{
  // Make sure it doesn't reference @cloudflare/next-on-pages
  // Should use @opennextjs/cloudflare instead
}
```

---

## Verify Build Command in Dashboard

### Check Current Settings:
1. Go to Cloudflare Pages project
2. **Settings** → **Builds & deployments**
3. Look for **"Build command"** field
4. Should show: `npm run build:cloudflare`

### If Wrong:
1. Click **"Edit"** or **"Change"**
2. Set to: `npm run build:cloudflare`
3. **Save**

---

## Force Correct Build

### Method 1: Update Build Command in Dashboard
1. Cloudflare Dashboard → Pages → Settings
2. Build command: `npm run build:cloudflare`
3. Save and redeploy

### Method 2: Add .cloudflare/pages.json (if needed)
Create `.cloudflare/pages.json`:
```json
{
  "buildCommand": "npm run build:cloudflare",
  "outputDirectory": ".open-next/assets"
}
```

---

## Why This Happens

Cloudflare Pages auto-detection:
1. Checks for `wrangler.json`/`wrangler.jsonc`
2. Checks for `@cloudflare/next-on-pages` in package.json
3. If found, uses old adapter automatically
4. Ignores build command setting

**Solution:** Explicitly set build command in dashboard.

---

## Summary

**Problem:** Cloudflare Pages auto-detecting deprecated adapter

**Solution:**
1. ✅ Removed `@cloudflare/next-on-pages` from package.json
2. ⚠️ Need to explicitly set build command in Cloudflare Dashboard
3. ⚠️ Check/remove `wrangler.jsonc` if causing issues
4. ✅ Build command: `npm run build:cloudflare`

**Next:** Update Cloudflare Pages dashboard settings! 🚀
