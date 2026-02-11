# Fix: Build Using Deprecated @cloudflare/next-on-pages

## Problem
Cloudflare Pages is auto-detecting and using deprecated `@cloudflare/next-on-pages`:
```
Executing user command: npx @cloudflare/next-on-pages@1
⚡️ @cloudflare/next-on-pages CLI v.1.13.16
The Vercel build (`npx vercel build`) command failed.
```

**Root Cause:** 
- `@cloudflare/next-on-pages` is still in `package.json` (deprecated)
- Cloudflare Pages auto-detects it and uses it instead of build command
- Should use `@opennextjs/cloudflare` instead

---

## Solution

### Step 1: Remove Deprecated Package
Remove `@cloudflare/next-on-pages` from `package.json`:
```json
// Remove this line:
"@cloudflare/next-on-pages": "^1.13.16",
```

### Step 2: Verify Build Command
Make sure Cloudflare Pages uses correct build command:
- **Build command:** `npm run build:cloudflare`
- This runs: `npx @opennextjs/cloudflare build`

### Step 3: Verify wrangler.toml
Make sure `wrangler.toml` has:
```toml
pages_build_output_dir = ".open-next/assets"
```

---

## Fix Applied

✅ Removed `@cloudflare/next-on-pages` from `package.json`
✅ Using `@opennextjs/cloudflare` (correct adapter)
✅ Build command: `npm run build:cloudflare`

---

## After Fix

1. **Commit and push** changes
2. **Redeploy** in Cloudflare Pages
3. **Check build logs** - should show:
   ```
   Executing user command: npm run build:cloudflare
   > npx @opennextjs/cloudflare build
   ```

---

## Why This Happened

Cloudflare Pages has auto-detection that:
1. Checks for `@cloudflare/next-on-pages` in package.json
2. If found, uses it automatically (ignoring build command)
3. This is deprecated - should use `@opennextjs/cloudflare`

---

## Summary

**Problem:** Using deprecated `@cloudflare/next-on-pages`

**Solution:**
- Remove from `package.json`
- Use `@opennextjs/cloudflare` (already configured)
- Build command: `npm run build:cloudflare`

**Next:** Commit, push, and redeploy! 🚀
