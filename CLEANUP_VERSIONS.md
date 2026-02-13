# Template Versions Cleanup Guide

Old template versions ကို ဖျက်ပြီး latest version ပဲ ထားနည်း

## 🎯 Purpose

Template versions table မှာ old versions တွေ ရှိနေရင် latest version ပဲ ထားပြီး old versions တွေ ဖျက်ပေးပါတယ်။

## 📍 Method 1: Admin Page (အလွယ်ဆုံး)

1. Cloudflare deployment ပြီးရင်:
   - Go to: `https://admin.paing.xyz/admin/cleanup-versions`

2. Admin secret ထည့်ပါ:
   - `delete-all-templates-secret`

3. "Cleanup Old Versions" button ကို click လုပ်ပါ

4. Confirm လုပ်ပါ

5. Done ✅

---

## 📍 Method 2: API Call (အမြန်ဆုံး)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://paing.xyz/api/cleanup-old-versions" `
  -Method POST `
  -Headers @{
    "x-admin-secret" = "delete-all-templates-secret"
  }
```

**cURL:**
```bash
curl -X POST https://paing.xyz/api/cleanup-old-versions \
  -H "x-admin-secret: delete-all-templates-secret"
```

---

## 🔍 How It Works

1. **Fetch all template versions** from `template_versions` table
2. **Group by template_id** - Each template ရဲ့ versions တွေကို စုပါတယ်
3. **Keep latest version** - `created_at` အသစ်ဆုံး version ကို ထားပါတယ်
4. **Delete old versions** - ကျန်တဲ့ old versions တွေ အကုန် ဖျက်ပါတယ်

---

## 📊 Response Example

```json
{
  "success": true,
  "message": "Successfully cleaned up old template versions. Kept latest version for 5 template(s).",
  "deletedCount": 12,
  "keptCount": 5
}
```

---

## ⚠️ Important Notes

- **Latest version only** - Each template အတွက် latest version 1 ခုပဲ ထားပါတယ်
- **Cannot be undone** - Old versions တွေ ဖျက်ပြီးရင် ပြန်မရနိုင်ပါ
- **Safe operation** - Latest version ကို ဘယ်တော့မှ မဖျက်ပါ

---

## 🔐 Security

- Admin secret key required
- Default: `delete-all-templates-secret`
- Or set `ADMIN_DELETE_SECRET` environment variable

---

## ✅ Checklist

- [ ] Cloudflare deployment successful
- [ ] Go to `/admin/cleanup-versions` page
- [ ] Enter admin secret
- [ ] Click "Cleanup Old Versions"
- [ ] Verify success message
- [ ] Check Supabase - only latest versions remain
