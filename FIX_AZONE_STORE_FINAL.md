# Fix Azone.store → Azone - Final Guide

## Problem: Database မှာ "Azone.store" က "Azone" သို့ မပြောင်းဘူး

---

## Solution 1: Admin Page (အလွယ်ဆုံး)

1. **Cloudflare deployment ပြီးရင်** (2-3 minutes):
   - Go to: `https://admin.paing.xyz/admin/fix-sitename`
2. **Admin secret** ထည့်ပါ:
   - `delete-all-templates-secret`
3. **"Fix Site Name to Azone"** button click
4. **Result** ကို check လုပ်ပါ - updated count ပေါ်ရမယ်
5. **Website refresh** → Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Solution 2: Supabase Dashboard (အမြန်ဆုံး) ⭐

### Step 1: Go to Supabase

1. Go to: https://supabase.com/dashboard
2. Your project → **Table Editor** → **settings** table

### Step 2: Check Current Values

1. `site_name` column ကို check လုပ်ပါ
2. "Azone.store" (သို့မဟုတ်) တခြား variation ရှိရင် note လုပ်ပါ

### Step 3: Update to "Azone"

1. `site_name` column ကို click
2. Value ကို **"Azone"** သို့ change လုပ်ပါ
3. **Save** button click
4. **All rows** ကို check လုပ်ပါ (multiple rows ရှိရင်)

### Step 4: Verify

1. Website refresh → Hard refresh (Ctrl+Shift+R)
2. Header/Footer မှာ "Azone" ပေါ်ရမယ်

---

## Solution 3: API Call

```powershell
Invoke-RestMethod -Uri "https://paing.xyz/api/fix-sitename" `
  -Method POST `
  -Headers @{ "x-admin-secret" = "delete-all-templates-secret" }
```

Response မှာ:
- `updatedCount`: How many records updated
- `currentSettings`: Current values in database
- `details`: What was changed

---

## Why Still Not Working?

### Issue 1: Browser Cache

**Fix:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Incognito mode နဲ့ test လုပ်ပါ

### Issue 2: Multiple Settings Records

**Fix:**
- Supabase Dashboard → `settings` table
- **All rows** ကို check လုပ်ပါ
- **Every row** ရဲ့ `site_name` ကို "Azone" သို့ update လုပ်ပါ

### Issue 3: Database Not Updated

**Fix:**
- Admin page (`/admin/fix-sitename`) run လုပ်ပါ
- (သို့မဟုတ်) Supabase Dashboard ကနေ manual update လုပ်ပါ

### Issue 4: Cloudflare Cache

**Fix:**
- Cloudflare Dashboard → **Caching** → **Purge Everything**
- (သို့မဟုတ်) Wait 5-10 minutes for cache to expire

---

## Verification Steps

1. **Check Database:**
   - Supabase Dashboard → `settings` table
   - `site_name` = "Azone" (all rows)

2. **Check Website:**
   - Visit: `https://paing.xyz`
   - Header/Footer မှာ "Azone" ပေါ်ရမယ်
   - Hard refresh if needed

3. **Check API:**
   - Visit: `https://paing.xyz/api/settings`
   - Response မှာ `"siteName": "Azone"` ပေါ်ရမယ်

---

## Current Status

- **Code**: ✅ "Azone" (correct)
- **Database**: ❓ Check needed (might be "Azone.store")
- **Fix tool**: ✅ Ready (`/admin/fix-sitename`)

---

## Recommended Action

**Immediate:**
1. **Supabase Dashboard** → `settings` table → Check `site_name`
2. If "Azone.store" → Change to "Azone"
3. **Save**
4. **Website hard refresh** (Ctrl+Shift+R)

**Alternative:**
1. Wait for Cloudflare deployment
2. Go to `/admin/fix-sitename`
3. Run fix
4. Hard refresh website

---

## Troubleshooting

If still not working after all steps:

1. **Check browser console** (F12) → Any errors?
2. **Check network tab** → `/api/settings` response ကို check
3. **Check Supabase logs** → Any errors?
4. **Clear all caches** → Browser + Cloudflare

---

## Quick Test

Run this to check current database value:

```powershell
Invoke-RestMethod -Uri "https://paing.xyz/api/settings" | ConvertTo-Json
```

Look for `"siteName"` in the response - should be `"Azone"`.
