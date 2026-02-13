# Fix: Project Name Conflict - "azone-main" Already Exists

## Problem
Error: "A project with that name already exists. Choose a different name"

## Solution Options

### Option 1: Use Different Name (Recommended)

Change the project name to something unique:

**Suggested Names:**
- `azone-main-pages`
- `azone-pages`
- `azone-production`
- `azone-main-site`
- `azone-2024`

**Steps:**
1. In the "Project name" field, change from `azone-main` to `azone-main-pages`
2. Keep other settings:
   - Build command: `npm run build:cloudflare`
   - Deploy command: (leave empty or remove `npx wrangler deploy`)
   - Output directory: `.open-next/assets`
3. Click "Deploy"

---

### Option 2: Check Existing Projects

The existing `azone-main` might be:
- A Worker project (not Pages)
- An old Pages project

**Check:**
1. Go to Cloudflare Dashboard → Workers & Pages
2. Filter by "Workers" - see if `azone-main` is there
3. Filter by "Pages" - see if `azone-main` is there
4. If it's a Worker, you can keep it and create Pages with different name
5. If it's an old Pages project, you can:
   - Use it (if it's configured correctly)
   - Delete it and create new one
   - Or use different name

---

### Option 3: Delete Existing Project (If Not Needed)

**⚠️ Warning:** Only delete if you're sure it's not being used!

1. Go to Cloudflare Dashboard → Workers & Pages
2. Find `azone-main` project
3. Click on it → Settings → Delete project
4. Then create new one with same name

---

## Important: Worker vs Pages

### You're Creating a Worker (Wrong!)
The form shows "Create a Worker" - but you need **Pages**!

**Fix:**
1. Go back to Workers & Pages dashboard
2. Click "Create application"
3. Select **"Pages"** tab (not "Workers")
4. Then connect to Git

### Correct Setup for Pages:
- **Type:** Pages (not Worker)
- **Build command:** `npm run build:cloudflare`
- **Output directory:** `.open-next/assets`
- **Deploy command:** (leave empty - Pages auto-deploys)

---

## Recommended Solution

### Step 1: Use Different Name
1. Change project name to: `azone-main-pages`
2. This avoids conflict
3. Custom domain can still be `paing.xyz` (independent of project name)

### Step 2: Make Sure It's Pages (Not Worker)
1. Go back to dashboard
2. Create application → **Pages** tab
3. Connect to Git
4. Use name: `azone-main-pages`

### Step 3: Configure Build Settings
- **Project name:** `azone-main-pages`
- **Production branch:** `main`
- **Build command:** `npm run build:cloudflare`
- **Build output directory:** `.open-next/assets`
- **Deploy command:** (leave empty - Pages doesn't need this)

---

## Project Name vs Custom Domain

**Important:** Project name and custom domain are **different**:

- **Project name:** `azone-main-pages` (internal Cloudflare name)
- **Custom domain:** `paing.xyz` (your actual website URL)

You can use any project name, but still use `paing.xyz` as custom domain!

---

## Quick Fix Steps

1. **Change project name** to `azone-main-pages`
2. **Make sure you're creating Pages** (not Worker)
3. **Build command:** `npm run build:cloudflare`
4. **Output directory:** `.open-next/assets`
5. **Deploy command:** (leave empty)
6. Click "Deploy"

---

## After Creating Project

1. **Add environment variables** (Settings → Environment Variables)
2. **Set custom domain:** `paing.xyz` (Settings → Custom domains)
3. **Redeploy** if needed

---

## Summary

**Problem:** Project name `azone-main` already exists

**Solution:** 
- Use different name: `azone-main-pages`
- Make sure you're creating **Pages** (not Worker)
- Project name doesn't affect your custom domain

**Next:** Create Pages project with new name! 🚀
