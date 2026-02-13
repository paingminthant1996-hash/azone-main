# Admin User Creation Guide

Admin account ကို Supabase မှာ ဖန်တီးနည်း - 3 နည်း

## Method 1: Admin Page (အလွယ်ဆုံး) ⭐

1. Cloudflare deployment ပြီးရင်:
   - Go to: `https://admin.paing.xyz/admin/create-admin`
   - (သို့မဟုတ်) `https://paing.xyz/admin/create-admin` (temporary access)

2. Form ကို ဖြည့်ပါ:
   - **Email**: `paingminthant1996@gmail.com`
   - **Password**: `paing133#`
   - **Admin Secret**: `create-admin-secret-key`

3. "Create Admin User" button ကို click လုပ်ပါ

4. Success message ကို စောင့်ပါ

5. Login: `https://admin.paing.xyz/admin/login`

---

## Method 2: API Call (အမြန်ဆုံး) 🚀

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://paing.xyz/api/create-admin" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body (@{
    email = "paingminthant1996@gmail.com"
    password = "paing133#"
    adminSecret = "create-admin-secret-key"
  } | ConvertTo-Json)
```

**cURL:**
```bash
curl -X POST https://paing.xyz/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paingminthant1996@gmail.com",
    "password": "paing133#",
    "adminSecret": "create-admin-secret-key"
  }'
```

---

## Method 3: Script (Local Development) 💻

1. Environment variables ထည့်ပါ (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Script run လုပ်ပါ:
   ```bash
   npx tsx scripts/create-admin-user.ts
   ```

3. Success message ကို စောင့်ပါ

---

## Environment Variables

Cloudflare Pages မှာ environment variables ထည့်ရန်:

1. Go to: Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
2. Add:
   - `ADMIN_CREATE_SECRET` = `create-admin-secret-key` (optional, default value)
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

---

## Notes

- User ရှိပြီးသားဆိုရင် admin role ကို update လုပ်ပေးပါတယ်
- Email auto-confirm လုပ်ထားပါတယ် (email verification မလိုပါ)
- Admin role ကို `user_metadata.role = 'admin'` နဲ့ set လုပ်ထားပါတယ်

---

## Troubleshooting

### "Supabase configuration missing"
- Check: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Cloudflare Pages environment variables

### "Invalid admin secret"
- Default secret: `create-admin-secret-key`
- Or set `ADMIN_CREATE_SECRET` environment variable

### "User already exists"
- User ကို admin role သို့ update လုပ်ပေးပါတယ်
- Login လုပ်နိုင်ပါတယ်
