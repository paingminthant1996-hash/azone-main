# Cloudflare Pages Environment Variables Setup

Supabase error ဖြေရှင်းနည်း - Environment Variables ထည့်ရန်

## ❌ Error Message

```
@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ Solution: Cloudflare Pages Environment Variables ထည့်ပါ

### Step 1: Cloudflare Dashboard သွားပါ

1. Go to: https://dash.cloudflare.com
2. **Pages** → Your project (`azone-main` or similar)
3. **Settings** → **Environment Variables**

### Step 2: Required Environment Variables ထည့်ပါ

အောက်ပါ variables တွေ **Production**, **Preview**, **Development** အကုန် ထည့်ပါ:

#### 🔴 Required (Supabase)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### 🟡 Optional (Supabase Alternative)

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

#### 🟢 Other Required Variables

```
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz
NEXT_PUBLIC_APP_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_EMAILS=paingminthant1996@gmail.com
```

#### 🔵 Optional Variables

```
ADMIN_CREATE_SECRET=create-admin-secret-key
ADMIN_DELETE_SECRET=delete-all-templates-secret
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
GMAIL_USER=paingminthant1996@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

---

## 📍 Supabase Keys ဘယ်ကနေ ရမလဲ?

1. Go to: https://supabase.com/dashboard
2. Your project → **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Keep secret!)

---

## 🔄 After Adding Variables

1. **Save** all environment variables
2. Go to **Deployments** tab
3. Click **Retry deployment** on the latest failed deployment
   - (သို့မဟုတ်) **Create new deployment** → **Retry deployment**

---

## ✅ Verification

Deployment ပြီးရင်:

1. Check build logs - error မရှိတော့ဘူး
2. Visit: `https://paing.xyz` - website load ဖြစ်ရမယ်
3. Visit: `https://admin.paing.xyz/admin/login` - login page ပေါ်ရမယ်

---

## 🚨 Common Issues

### Issue 1: "Still getting error after adding variables"

**Solution:**
- Check variable names are **exactly** correct (case-sensitive)
- Make sure you added to **Production** environment
- **Retry deployment** after adding variables

### Issue 2: "Variables added but build still fails"

**Solution:**
- Check build logs for other errors
- Verify Supabase project is active
- Check API keys are valid (not expired)

### Issue 3: "Admin login not working"

**Solution:**
- Make sure `NEXT_PUBLIC_ADMIN_EMAILS` includes your email
- Or create admin user via `/admin/create-admin` page

---

## 📝 Quick Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added
- [ ] Variables saved
- [ ] Deployment retried
- [ ] Build successful
- [ ] Website accessible

---

## 🔗 Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Cloudflare Pages: https://dash.cloudflare.com
- Project API Settings: https://supabase.com/dashboard/project/_/settings/api
