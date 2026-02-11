# Manual Deployment Instructions

## Problem: Auto-deploy မလုပ်ဘူး

Cloudflare Pages auto-deploy မလုပ်ရင် manual deployment လုပ်ရမယ်။

---

## Solution: Manual Deployment via Cloudflare Dashboard

### Step 1: Go to Cloudflare Dashboard

1. **Cloudflare Dashboard** → **Pages** → **azone-main**
2. **Deployments** tab

### Step 2: Create New Deployment

1. **"Create new deployment"** button click (top right)
2. **Branch**: `main` select
3. **Commit**: Latest commit (`a6dba92` or newest) select
4. **"Deploy"** button click

### Step 3: Wait for Build

1. Build logs ကို watch လုပ်ပါ
2. 2-5 minutes စောင့်ပါ
3. Success ဖြစ်ရင် latest version top မှာ ပေါ်ပါမယ်

---

## Alternative: Deploy Specific Version

1. **Version History** section မှာ
2. Latest version (`7bd52345` or newest) click
3. **"Deploy version"** button click
4. Confirm

---

## Check Build Logs

Deployment fail ဖြစ်ရင်:

1. Latest deployment click
2. **Build logs** tab
3. Error message ကို check လုပ်ပါ
4. Common errors:
   - Environment variables missing
   - Build command error
   - Dependencies error

---

## Current Status

- **Main branch**: Updated (`a6dba92`)
- **Latest commit**: Force deployment trigger pushed
- **Action**: Manual deployment needed via Cloudflare Dashboard

---

## Next Steps

1. Cloudflare Dashboard → Pages → azone-main → Deployments
2. "Create new deployment" → Select `main` branch → Latest commit
3. Deploy
4. Wait for build completion
