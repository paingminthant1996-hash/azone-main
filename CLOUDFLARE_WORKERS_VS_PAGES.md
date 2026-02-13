# Cloudflare Workers vs Pages - Explanation

## မေးခွန်း: Worker နဲ့ Pages နှစ်ခု မထပ်သွားဘူးလား?

**အဖြေ: မထပ်သွားပါဘူး!** Next.js app က Cloudflare Pages မှာ run လုပ်တဲ့အခါ API routes တွေက automatically Workers ဖြစ်သွားပါတယ်။

---

## Cloudflare Workers vs Pages

### Cloudflare Workers
- **အသုံးပြုပုံ**: Serverless functions, API endpoints, edge computing
- **Example**: `/api/checkout`, `/api/create-admin` - API routes
- **Runtime**: Edge runtime (runs at Cloudflare edge locations)

### Cloudflare Pages
- **အသုံးပြုပုံ**: Static site hosting, full-stack applications
- **Example**: Your Next.js app (`/`, `/templates`, `/admin`)
- **Runtime**: Pages runtime + Workers (for API routes)

---

## Next.js on Cloudflare Pages - How It Works

### OpenNext Adapter
Your project uses `@opennextjs/cloudflare` adapter which:
1. **Builds** Next.js app for Cloudflare Pages
2. **Converts** API routes (`app/api/*`) to Cloudflare Workers automatically
3. **Serves** static pages from Cloudflare Pages
4. **Runs** API routes as Workers at the edge

### Single Project Setup
You only need to create **ONE** Cloudflare Pages project:
- ✅ Pages project = Your entire Next.js app
- ✅ API routes = Automatically become Workers (no separate setup needed)
- ✅ Everything works together seamlessly

---

## What You Need to Do

### ✅ Create Cloudflare Pages Project (ONLY ONE)
1. Go to Cloudflare Dashboard → Workers & Pages
2. Create application → Pages → Connect to Git
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build:cloudflare`
   - Output directory: `.open-next/assets`

### ❌ DON'T Create Separate Worker
- No need to create a separate Worker project
- API routes are automatically handled by Pages
- OpenNext adapter converts them to Workers

---

## How API Routes Become Workers

When you build with `@opennextjs/cloudflare`:

```
app/api/checkout/route.ts
  ↓ (OpenNext builds)
  → Cloudflare Worker (automatically)
  → Runs at edge locations
```

**You don't need to:**
- Create separate Worker projects
- Configure Workers manually
- Deploy Workers separately

**Everything is handled automatically!**

---

## Environment Variables

### Where to Set Variables?
**Cloudflare Pages** (not Workers):
1. Go to Pages project → Settings → Environment Variables
2. Add all variables there
3. They're available to:
   - Pages (static pages)
   - Workers (API routes) - automatically

### Why Not Workers?
- Workers = Separate service (for standalone functions)
- Pages = Your Next.js app (includes API routes as Workers)
- Variables in Pages are shared with API route Workers automatically

---

## Summary

| Question | Answer |
|----------|--------|
| Need separate Worker? | ❌ No |
| API routes become Workers? | ✅ Yes (automatically) |
| Need to configure Workers? | ❌ No |
| Create Pages project? | ✅ Yes (only one) |
| Variables in Pages or Workers? | ✅ Pages (shared automatically) |

---

## Your Current Setup

✅ **Correct Setup:**
- One Cloudflare Pages project
- Build command: `npm run build:cloudflare`
- Output: `.open-next/assets`
- API routes = Workers (automatic)

❌ **Wrong Setup:**
- Separate Worker project
- Separate Pages project
- Manual Worker configuration
- Separate deployments

---

## Conclusion

**မထပ်သွားပါဘူး!** 
- Create **ONE** Cloudflare Pages project
- API routes automatically become Workers
- Everything works together
- No separate Worker setup needed

Just create the Pages project and everything will work! 🚀
