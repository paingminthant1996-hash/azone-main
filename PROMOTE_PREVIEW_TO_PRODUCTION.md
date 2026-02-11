# Promote Preview to Production - Fix Guide

## Problem: Preview ကို deploy လုပ်နေတယ်, Production ကို deploy မလုပ်ဘူး

Cloudflare Pages က **preview deployments** ကို build လုပ်နေတယ်, **production deployment** ကို မလုပ်ဘူး။

---

## Solution 1: Promote Preview to Production (အလွယ်ဆုံး)

### Step 1: Go to Deployments Tab

1. **Cloudflare Dashboard** → **Pages** → **azone-main**
2. **Deployments** tab

### Step 2: Find Preview Build

1. **Version History** section မှာ
2. Latest preview build ကို find လုပ်ပါ (green checkmark, "Preview" button ရှိတာ)
3. Build hash: `5cecb6a` or latest one

### Step 3: Promote to Production

1. Preview build ကို click
2. **"Promote to production"** button click (သို့မဟုတ်)
3. **"Deploy version"** button click
4. **"Production"** select
5. Confirm

---

## Solution 2: Change Production Branch

Cloudflare Pages က **wrong branch** ကို watch လုပ်နေတာ ဖြစ်နိုင်တယ်။

### Step 1: Check Current Settings

1. **Settings** → **Builds & deployments**
2. **Production branch** check:
   - Current: `main` (should be)
   - If `cursor/azone-main-review-2076` → Change to `main`

### Step 2: Update Production Branch

1. **Production branch**: `main` select
2. **Save** button click
3. Auto-deploy trigger လုပ်ပါမယ်

---

## Solution 3: Manual Production Deployment

### Method 1: Via Deployments Tab

1. **Deployments** tab
2. **"Create new deployment"** button (top right)
3. Select:
   - **Branch**: `main` (NOT `cursor/azone-main-review-2076`)
   - **Environment**: **Production** (NOT Preview)
   - **Commit**: Latest from `main` branch
4. **"Deploy"** button click

### Method 2: Via Version History

1. **Version History** section
2. Latest version from `main` branch click
3. **"Deploy version"** button
4. **Environment**: **Production** select
5. Deploy

---

## Solution 4: Fix Branch Configuration

### Problem:
- Preview builds: `cursor/azone-main-review-2076` branch
- Production should be: `main` branch

### Fix:

1. **Settings** → **Builds & deployments**
2. **Production branch**: `main` (ensure this is set)
3. **Preview deployments**:
   - **Branch**: `cursor/azone-main-review-2076` (this is OK for previews)
   - But production should use `main`

---

## Why Preview Instead of Production?

1. **Branch mismatch**: Cloudflare building from `cursor/azone-main-review-2076` instead of `main`
2. **Manual deployment**: Preview environment selected instead of Production
3. **Settings**: Production branch not configured correctly

---

## Current Status

- **Preview builds**: `cursor/azone-main-review-2076` branch → Working ✅
- **Production deployment**: `main` branch → Not deploying ❌
- **Active production**: `c7270ff2` (old version)

---

## Recommended Action

**Immediate:**
1. Go to **Deployments** tab
2. Find latest preview build (`5cecb6a` or newest)
3. Click **"Promote to production"** (or "Deploy version" → Production)

**Long-term:**
1. **Settings** → **Builds & deployments**
2. Ensure **Production branch** = `main`
3. Ensure latest code is in `main` branch

---

## Verification

After promoting:
1. **Active Deployment** section → Latest version ပေါ်ရမယ်
2. **Status**: Production (not Preview)
3. Website: `https://paing.xyz` → Latest code ပေါ်ရမယ်
