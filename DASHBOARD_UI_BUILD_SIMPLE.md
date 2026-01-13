# Dashboard UI Build - Simple Steps
## Admin Dashboard ကို Separate Project အဖြစ် Build လုပ်ခြင်း

### 🎯 Goal
Dashboard UI ကို separate Vercel project အဖြစ် build လုပ်မယ်

---

## 📝 Step 1: New Folder Create လုပ်ပါ

```bash
# Desktop မှာ
cd ~/Desktop
mkdir azone-admin
cd azone-admin
```

---

## 📝 Step 2: Git Initialize လုပ်ပါ

```bash
git init
```

---

## 📝 Step 3: Folders Create လုပ်ပါ

```bash
mkdir -p app/login
mkdir -p app/overview
mkdir -p app/templates
mkdir -p app/settings
mkdir -p app/analytics
mkdir -p app/purchases
mkdir -p app/upload
mkdir -p app/admin
mkdir -p components/admin
mkdir -p lib/auth
mkdir -p lib/db
mkdir -p lib/contexts
mkdir -p app/actions
```

---

## 📝 Step 4: Main Project က Files Copy လုပ်ပါ

### 4.1 Admin Pages Copy
```bash
# Main project path ကို adjust လုပ်ပါ
cp -r ../azone-main/app/admin/login/* ./app/login/
cp -r ../azone-main/app/admin/overview/* ./app/overview/
cp -r ../azone-main/app/admin/templates/* ./app/templates/
cp -r ../azone-main/app/admin/settings/* ./app/settings/
cp -r ../azone-main/app/admin/analytics/* ./app/analytics/
cp -r ../azone-main/app/admin/purchases/* ./app/purchases/
cp -r ../azone-main/app/admin/upload/* ./app/upload/
cp ../azone-main/app/admin/layout.tsx ./app/admin/
```

### 4.2 Components Copy
```bash
cp -r ../azone-main/components/admin/* ./components/admin/
```

### 4.3 Library Files Copy
```bash
cp -r ../azone-main/lib/auth/* ./lib/auth/
cp -r ../azone-main/lib/db/* ./lib/db/
cp -r ../azone-main/lib/contexts/* ./lib/contexts/
cp ../azone-main/lib/types.ts ./lib/
cp ../azone-main/lib/utils.ts ./lib/
```

### 4.4 Actions Copy
```bash
cp -r ../azone-main/app/actions/* ./app/actions/
```

### 4.5 Config Files Copy
```bash
cp ../azone-main/package.json ./
cp ../azone-main/tsconfig.json ./
cp ../azone-main/next.config.js ./
cp ../azone-main/tailwind.config.ts ./
cp ../azone-main/postcss.config.js ./
cp ../azone-main/middleware.ts ./
cp ../azone-main/app/globals.css ./app/
```

---

## 📝 Step 5: Root Layout Create လုပ်ပါ

`app/layout.tsx` file create လုပ်ပြီး ဒါကို paste လုပ်ပါ:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { DesignModeProvider } from "@/lib/contexts/DesignModeContext";
import { DesignModeToggle } from "@/components/admin/DesignModeToggle";

export const metadata: Metadata = {
  title: "Admin Dashboard - Azone.store",
  description: "Admin dashboard for Azone.store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="min-h-screen flex flex-col bg-azone-black">
        <SettingsProvider>
          <DesignModeProvider>
            {children}
            <DesignModeToggle />
          </DesignModeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
```

---

## 📝 Step 6: Root Page Create လုပ်ပါ

`app/page.tsx` file create လုပ်ပြီး ဒါကို paste လုပ်ပါ:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/overview");
  }, [router]);

  return (
    <div className="min-h-screen bg-azone-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
```

---

## 📝 Step 7: Admin Layout Update လုပ်ပါ

`app/admin/layout.tsx` file ကို open လုပ်ပြီး navigation hrefs တွေကို update လုပ်ပါ:

```tsx
// Find this part:
const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },  // Changed from /admin/overview
  { name: "Templates", href: "/templates", icon: FileText },        // Changed from /admin/templates
  { name: "Inquiries", href: "/purchases", icon: MessageSquare },   // Changed from /admin/purchases
  { name: "Settings", href: "/settings", icon: Settings },          // Changed from /admin/settings
];
```

---

## 📝 Step 8: Environment Variables Setup လုပ်ပါ

`.env.local` file create လုပ်ပြီး ဒါကို paste လုပ်ပါ:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

**Important:** Main project က same values တွေ သုံးပါ!

---

## 📝 Step 9: Package.json Update လုပ်ပါ

`package.json` file ကို open လုပ်ပြီး name ကို change လုပ်ပါ:

```json
{
  "name": "azone-admin",  // Changed from "azone-store"
  "version": "1.0.0",
  ...
}
```

---

## 📝 Step 10: Dependencies Install လုပ်ပါ

```bash
npm install
```

---

## 📝 Step 11: Test Locally လုပ်ပါ

```bash
npm run dev
```

Browser မှာ open လုပ်ပါ: `http://localhost:3000`

**Check လုပ်ရမယ့် အရာတွေ:**
- ✅ Login page: `http://localhost:3000/login`
- ✅ Overview page: `http://localhost:3000/overview`
- ✅ Sidebar navigation works
- ✅ All pages load correctly

---

## 📝 Step 12: Build Test လုပ်ပါ

```bash
npm run build
```

Error တွေ ရှိရင် fix လုပ်ပါ။

---

## 📝 Step 13: GitHub Repository Create လုပ်ပါ

1. GitHub သို့သွားပါ
2. New repository create လုပ်ပါ: `azone-admin`
3. Repository URL ကို copy လုပ်ပါ

---

## 📝 Step 14: Git Push လုပ်ပါ

```bash
git add .
git commit -m "Initial admin dashboard setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/azone-admin.git
git push -u origin main
```

---

## 📝 Step 15: Vercel Project Create လုပ်ပါ

1. [Vercel Dashboard](https://vercel.com) သို့သွားပါ
2. "Add New Project" click လုပ်ပါ
3. GitHub repository ကို select လုပ်ပါ: `azone-admin`
4. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `./`
5. Environment Variables add လုပ်ပါ:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAILS`
6. "Deploy" click လုပ်ပါ

---

## 📝 Step 16: Domain Setup လုပ်ပါ

1. Vercel project settings သို့သွားပါ
2. "Domains" section click လုပ်ပါ
3. `admin.paing.xyz` add လုပ်ပါ
4. DNS records add လုပ်ပါ:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

---

## ✅ Done!

Dashboard UI က `admin.paing.xyz` မှာ live ဖြစ်နေပါပြီ! 🎉

---

## 🔧 Troubleshooting

### Error: Module not found
**Solution:** Dependencies install လုပ်ပါ: `npm install`

### Error: Cannot find module '@/lib/...'
**Solution:** File paths check လုပ်ပါ - files တွေ copy လုပ်ထားတာ confirm လုပ်ပါ

### Error: Environment variables missing
**Solution:** `.env.local` file check လုပ်ပါ - values တွေ correct ဖြစ်တာ confirm လုပ်ပါ

### Build fails
**Solution:** `npm run build` run လုပ်ပြီး error messages တွေ read လုပ်ပါ - fix လုပ်ပါ

---

## 📋 Quick Checklist

- [ ] Step 1: Folder created
- [ ] Step 2: Git initialized
- [ ] Step 3: Folders created
- [ ] Step 4: Files copied
- [ ] Step 5: Root layout created
- [ ] Step 6: Root page created
- [ ] Step 7: Admin layout updated
- [ ] Step 8: Environment variables set
- [ ] Step 9: Package.json updated
- [ ] Step 10: Dependencies installed
- [ ] Step 11: Tested locally
- [ ] Step 12: Build successful
- [ ] Step 13: GitHub repo created
- [ ] Step 14: Pushed to GitHub
- [ ] Step 15: Vercel project created
- [ ] Step 16: Domain configured

---

**ဒါပဲ! Step by step လုပ်သွားရင် dashboard UI ready ဖြစ်သွားမယ်!** 🚀
