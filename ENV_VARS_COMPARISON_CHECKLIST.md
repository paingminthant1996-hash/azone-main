# Environment Variables Comparison Checklist

## Instructions
1. Open your `.env.local` file
2. Open `supabase/functions/download-source/.env` file
3. Check each variable below
4. Mark ✅ if found, ❌ if missing
5. Add missing ones to Cloudflare Pages

---

## Required Variables (Must Have)

### Supabase Configuration
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Check in `.env.local`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Check in `.env.local`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Check in `.env.local`

### Site URLs
- [ ] `NEXT_PUBLIC_SITE_URL` - Check in `.env.local`
- [ ] `NEXT_PUBLIC_ADMIN_URL` - Check in `.env.local`
- [ ] `NEXT_PUBLIC_APP_URL` - Check in `.env.local`

### Admin Configuration
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` - Check in `.env.local`
- [ ] `ADMIN_CREATE_SECRET` - Check in `.env.local`

---

## Optional Variables (Recommended)

### Stripe (For Payments)
- [ ] `STRIPE_SECRET_KEY` - Check in `.env.local`
- [ ] `STRIPE_WEBHOOK_SECRET` - Check in `.env.local`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Check in `.env.local`

### Email - Gmail SMTP
- [ ] `GMAIL_USER` - Check in `.env.local`
- [ ] `GMAIL_APP_PASSWORD` - Check in `.env.local`
- [ ] `GMAIL_FROM_EMAIL` - Check in `.env.local`

### Email - Resend (Alternative)
- [ ] `RESEND_API_KEY` - Check in `.env.local`
- [ ] `RESEND_FROM_EMAIL` - Check in `.env.local`

### GitHub Token
- [ ] `GITHUB_TOKEN` - Check in `.env.local`

### Cloudflare API
- [ ] `CLOUDFLARE_API_TOKEN` - Check in `.env.local`
- [ ] `CLOUDFLARE_ZONE_ID` - Check in `.env.local`
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Check in `.env.local`
- [ ] `CLOUDFLARE_API_KEY` - Check in `.env.local` (optional)

### Admin Delete Secret
- [ ] `ADMIN_DELETE_SECRET` - Check in `.env.local` (or use default)

---

## Variables in supabase/functions/download-source/.env

Check these variables in `supabase/functions/download-source/.env`:

- [ ] `SUPABASE_URL` - May be in download-source/.env
- [ ] `SUPABASE_ANON_KEY` - May be in download-source/.env
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - May be in download-source/.env
- [ ] `GITHUB_TOKEN` - May be in download-source/.env
- [ ] Any other variables specific to download function

**Note:** Variables in `supabase/functions/download-source/.env` are for Supabase Edge Functions, not Cloudflare Pages. But you can copy values if needed.

---

## How to Check Your Files

### Step 1: Open `.env.local`
Look for these patterns:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Step 2: Open `supabase/functions/download-source/.env`
Look for:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
GITHUB_TOKEN=...
```

### Step 3: Compare with Checklist
- ✅ Mark found variables
- ❌ Mark missing variables
- 📝 Note values (for copying to Cloudflare)

---

## Add to Cloudflare Pages - Step by Step

### Group 1: Supabase (Required - Add First)
1. Go to Cloudflare Pages → Settings → Environment Variables
2. Click "Add variable"
3. Name: `NEXT_PUBLIC_SUPABASE_URL`
4. Value: Copy from `.env.local`
5. Environment: Production
6. Save

Repeat for:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Group 2: Site URLs (Required)
Add these:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADMIN_URL`
- `NEXT_PUBLIC_APP_URL`

### Group 3: Admin (Required)
Add these:
- `NEXT_PUBLIC_ADMIN_EMAILS`
- `ADMIN_CREATE_SECRET`

### Group 4: Stripe (Optional)
Add these if found:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Group 5: Email - Gmail (Optional)
Add these if found:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `GMAIL_FROM_EMAIL`

### Group 6: Other Optional
Add these if found:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_ACCOUNT_ID`
- `ADMIN_DELETE_SECRET`

---

## Quick Copy Format

For each variable, copy in this format:

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co
Found in: .env.local (line X)
Status: ✅ Ready to add
```

---

## Missing Variables

If a variable is missing from `.env.local`:

1. **Check if it's optional** - Some variables have defaults
2. **Check `env.template`** - See what's expected
3. **Add to `.env.local` first** - Then copy to Cloudflare
4. **Or skip if optional** - Add later if needed

---

## Important Notes

### Variable Names
- **Exact match** required (case-sensitive)
- `NEXT_PUBLIC_` prefix for client-side
- No prefix for server-side secrets

### Values
- Copy **exact values** (no quotes)
- Long keys - copy entire string
- No extra spaces

### Environment
- Select **Production** for live site
- Or **Preview** for testing

---

## After Adding All Variables

1. ✅ Save all variables
2. ✅ Redeploy project
3. ✅ Check deployment logs
4. ✅ Test features:
   - Admin login
   - Checkout
   - Contact form
   - Template downloads

---

## Summary

**Checklist Process:**
1. Open `.env.local` (127 lines)
2. Open `supabase/functions/download-source/.env` (82 lines)
3. Compare with this checklist
4. Mark ✅ or ❌
5. Add to Cloudflare Pages **one by one**
6. Start with Required variables first!

**Start with Required, then add Optional ones!** 🚀
