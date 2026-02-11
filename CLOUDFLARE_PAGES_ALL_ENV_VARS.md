# Cloudflare Pages - All Required Environment Variables

## Complete List of Environment Variables

### ✅ Required (Must Have)

#### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get:**
- Supabase Dashboard → Project Settings → API
- https://supabase.com/dashboard

---

#### 2. Site URLs
```
NEXT_PUBLIC_SITE_URL=https://paing.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.paing.xyz
NEXT_PUBLIC_APP_URL=https://paing.xyz
```

---

#### 3. Admin Configuration
```
NEXT_PUBLIC_ADMIN_EMAILS=paingminthant1996@gmail.com
ADMIN_CREATE_SECRET=your-secret-key-here
```

**Note:** `ADMIN_CREATE_SECRET` is used to protect `/api/create-admin` endpoint.

---

### ⚠️ Optional (Recommended for Full Functionality)

#### 4. Stripe (For Payments)
```
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... or pk_test_...
```

**Where to get:**
- Stripe Dashboard → Developers → API keys
- Stripe Dashboard → Developers → Webhooks
- https://dashboard.stripe.com

**Note:** Without these, checkout/payment features won't work (will show 500 error).

---

#### 5. Email Configuration (Gmail SMTP)
```
GMAIL_USER=paingminthant1996@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
GMAIL_FROM_EMAIL=Azone <paingminthant1996@gmail.com>
```

**Where to get Gmail App Password:**
1. Google Account → Security
2. Enable 2-Step Verification (if not enabled)
3. App passwords → Generate new app password
4. Copy the 16-character password

**Used for:**
- Contact form emails (`/api/contact`)
- Newsletter subscription (`/api/newsletter/subscribe`)

---

#### 6. Email Configuration (Resend - Alternative)
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Azone <noreply@paing.xyz>
```

**Where to get:**
- Resend Dashboard → API Keys
- https://resend.com/api-keys

**Note:** Use either Gmail OR Resend, not both.

---

### 🔧 Optional (For Advanced Features)

#### 7. GitHub Token (For Template Downloads)
```
GITHUB_TOKEN=ghp_...
```

**Where to get:**
- GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- Required scopes: `repo`, `read:org`, `workflow`
- https://github.com/settings/tokens

**Used for:**
- Downloading templates from GitHub repositories

---

#### 8. Cloudflare API (For MCP/Advanced Features)
```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

**Where to get:**
- Cloudflare Dashboard → My Profile → API Tokens
- https://dash.cloudflare.com/profile/api-tokens

**Note:** Only needed if using Cloudflare MCP tools or advanced features.

---

#### 9. Admin Delete Secret (For Admin Actions)
```
ADMIN_DELETE_SECRET=delete-all-templates-secret
```

**Used for:**
- `/api/delete-all-templates`
- `/api/cleanup-old-versions`
- `/api/fix-sitename`

**Note:** If not set, defaults to `"delete-all-templates-secret"` (less secure).

---

## Quick Setup Checklist

### Minimum Required (Site Works):
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_ADMIN_URL`
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS`

### Recommended (Full Features):
- [ ] `STRIPE_SECRET_KEY` (for payments)
- [ ] `STRIPE_WEBHOOK_SECRET` (for webhooks)
- [ ] `GMAIL_USER` + `GMAIL_APP_PASSWORD` (for emails)
- [ ] `ADMIN_CREATE_SECRET` (for admin creation)

### Optional (Advanced):
- [ ] `GITHUB_TOKEN` (for GitHub downloads)
- [ ] `CLOUDFLARE_API_TOKEN` (for MCP tools)
- [ ] `ADMIN_DELETE_SECRET` (for admin actions)

---

## How to Add in Cloudflare Pages

1. Go to: **Cloudflare Dashboard** → **Pages** → **azone-main**
2. **Settings** → **Environment Variables**
3. Click **"Add variable"** for each variable
4. Select **Production** environment (or Preview for testing)
5. **Save**

---

## Variable Categories

### Public Variables (NEXT_PUBLIC_ prefix)
- Exposed to client-side code
- Can be accessed in browser
- Used for: Supabase client, site URLs, admin emails

### Secret Variables (No prefix)
- Server-side only
- Never exposed to client
- Used for: API keys, service role keys, passwords

---

## Security Notes

⚠️ **Never commit these to Git:**
- All environment variables
- API keys
- Secrets
- Passwords

✅ **Safe to commit:**
- `env.template` (without real values)
- Configuration files

---

## Testing Variables

After adding variables:
1. **Redeploy** the project
2. Check **Build logs** for any errors
3. Test features:
   - Admin login (Supabase)
   - Checkout (Stripe)
   - Contact form (Gmail)
   - Template downloads (GitHub)

---

## Troubleshooting

### "Supabase configuration missing"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Make sure they're in **Production** environment

### "Stripe is not configured"
- Add `STRIPE_SECRET_KEY` to environment variables
- Checkout will fail without this (but free templates still work)

### Email not working
- Check `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set
- Verify Gmail App Password is correct (16 characters)

### Admin creation fails
- Check `ADMIN_CREATE_SECRET` matches what you're sending
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

---

## Summary

**Minimum:** 6 variables (Supabase + URLs + Admin emails)
**Recommended:** 10+ variables (add Stripe + Email)
**Full Features:** 15+ variables (add GitHub + Cloudflare API)

Start with minimum, add more as needed! 🚀
