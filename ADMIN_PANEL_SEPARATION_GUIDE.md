# Admin Panel Separation Guide
## Main Website နဲ့ Admin Panel ကို Separate Projects အဖြစ် ခွဲထုတ်ခြင်း

### 🎯 Goal
- Main website: `store.paing.xyz` (သို့မဟုတ် `paing.xyz`)
- Admin panel: `admin.paing.xyz` (သို့မဟုတ် separate subdomain)
- Same database (Supabase) ကို share လုပ်မယ်
- Clean URLs နဲ့ better separation of concerns

---

## 📋 Step-by-Step Guide

### **Step 1: New Vercel Project Setup**

#### 1.1 Create New Repository
```bash
# New folder တစ်ခု create လုပ်ပါ
cd ~/Desktop
mkdir azone-admin
cd azone-admin

# Git initialize
git init
git remote add origin https://github.com/YOUR_USERNAME/azone-admin.git
```

#### 1.2 Copy Admin Files Only
```bash
# Main project က admin files တွေ copy လုပ်ပါ
# From: azone-main/app/admin
# To: azone-admin/app

# Copy these directories:
- app/admin/          (all admin pages)
- components/admin/    (admin components)
- lib/auth/           (authentication)
- lib/db/             (database queries)
- lib/contexts/       (if used by admin)
- middleware.ts       (for admin protection)
```

#### 1.3 Create New Root Layout
Create `app/layout.tsx` for admin project:
```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";

export const metadata: Metadata = {
  title: "Admin Panel - Azone.store",
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
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
```

#### 1.4 Update File Structure
```
azone-admin/
├── app/
│   ├── layout.tsx          # New root layout (no Header/Footer)
│   ├── admin/
│   │   ├── layout.tsx      # Admin dashboard layout
│   │   ├── overview/
│   │   ├── templates/
│   │   ├── settings/
│   │   ├── analytics/
│   │   ├── purchases/
│   │   ├── upload/
│   │   └── login/
│   └── globals.css
├── components/
│   └── admin/              # Admin components only
├── lib/
│   ├── auth/               # Authentication
│   ├── db/                 # Database queries
│   └── contexts/           # Context providers
├── middleware.ts           # Admin route protection
├── package.json
├── next.config.js
└── tsconfig.json
```

---

### **Step 2: Environment Variables Setup**

#### 2.1 Same Supabase Credentials
Admin project မှာ main website နဲ့ **same Supabase credentials** သုံးပါ:

```env
# .env.local (Admin Project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

**Important:** Same database ကို share လုပ်တာမို့ data တွေ sync ဖြစ်မယ် ✅

#### 2.2 Vercel Environment Variables
1. Vercel dashboard သို့သွားပါ
2. New project create လုပ်ပါ
3. Environment variables တွေ add လုပ်ပါ (same as main project)

---

### **Step 3: Update Routes & Links**

#### 3.1 Remove `/admin` Prefix
Admin project မှာ routes တွေက:
- ❌ `/admin/overview` (old)
- ✅ `/overview` (new - cleaner!)

Update `app/admin/layout.tsx`:
```tsx
const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Inquiries", href: "/purchases", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];
```

#### 3.2 Update File Structure
Move files:
```
app/admin/overview/page.tsx  →  app/overview/page.tsx
app/admin/templates/page.tsx  →  app/templates/page.tsx
app/admin/settings/page.tsx   →  app/settings/page.tsx
app/admin/login/page.tsx      →  app/login/page.tsx
```

#### 3.3 Update Middleware
Update `middleware.ts`:
```ts
export async function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (request.nextUrl.pathname !== '/login') {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Check admin
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const isAdmin = session.user.user_metadata?.role === 'admin' ||
                   (session.user.email && adminEmails.includes(session.user.email));
    
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
```

---

### **Step 4: Package.json Setup**

#### 4.1 Copy Dependencies
Main project က `package.json` ကို copy လုပ်ပြီး admin project အတွက် dependencies တွေ keep လုပ်ပါ:

```json
{
  "name": "azone-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "tailwindcss": "^3.4.1"
  }
}
```

#### 4.2 Install Dependencies
```bash
npm install
```

---

### **Step 5: Vercel Deployment**

#### 5.1 Connect Repository
1. Vercel dashboard သို့သွားပါ
2. "Add New Project" click လုပ်ပါ
3. GitHub repository ကို connect လုပ်ပါ
4. Project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### 5.2 Domain Setup
1. Vercel project settings သို့သွားပါ
2. "Domains" section ကို click လုပ်ပါ
3. Add domain: `admin.paing.xyz` (သို့မဟုတ် `admin-store.paing.xyz`)
4. DNS records add လုပ်ပါ:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

---

### **Step 6: Testing & Verification**

#### 6.1 Test Checklist
- [ ] Admin login works: `admin.paing.xyz/login`
- [ ] Overview page loads: `admin.paing.xyz/overview`
- [ ] Templates page works: `admin.paing.xyz/templates`
- [ ] Settings page works: `admin.paing.xyz/settings`
- [ ] Database connection works (same data as main site)
- [ ] Authentication works correctly
- [ ] All admin features functional

#### 6.2 Verify Database Connection
1. Admin panel မှာ template တစ်ခု create လုပ်ပါ
2. Main website မှာ check လုပ်ပါ - template ပေါ်ရမယ် ✅
3. Main website မှာ purchase တစ်ခု create လုပ်ပါ
4. Admin panel မှာ check လုပ်ပါ - purchase ပေါ်ရမယ် ✅

---

### **Step 7: Remove Admin from Main Project**

#### 7.1 Backup First!
```bash
# Main project ကို backup လုပ်ပါ
cd ~/Desktop/azone-main
git checkout -b backup-before-admin-removal
git commit -am "Backup before removing admin panel"
git push origin backup-before-admin-removal
```

#### 7.2 Delete Admin Files
```bash
# Main project မှာ admin files တွေ delete လုပ်ပါ
rm -rf app/admin
rm -rf components/admin
# Keep lib/auth and lib/db (main site might need them)
```

#### 7.3 Update Main Project Layout
Update `app/layout.tsx`:
```tsx
// Remove admin-related imports
// Remove DesignModeToggle (or keep if main site needs it)
// Remove admin navigation from Header
```

#### 7.4 Update Middleware
Update `middleware.ts` in main project:
```ts
// Remove admin route protection
// Keep only account route protection if needed
```

#### 7.5 Commit & Deploy
```bash
git add .
git commit -m "Remove admin panel - moved to separate project"
git push origin main
```

---

## ✅ Benefits

### 1. **Clean URLs**
- Main site: `store.paing.xyz`
- Admin: `admin.paing.xyz`
- No `/admin` prefix needed

### 2. **Better Separation**
- Main site code က cleaner
- Admin code က isolated
- Easier to maintain

### 3. **Independent Deployments**
- Admin changes က main site ကို affect မလုပ်ဘူး
- Main site changes က admin ကို affect မလုပ်ဘူး
- Faster deployments

### 4. **Same Database**
- Data sync automatically
- Single source of truth
- No data duplication

---

## 🔧 Quick Setup Script

Create `setup-admin-project.sh`:

```bash
#!/bin/bash

# Create new admin project
mkdir azone-admin
cd azone-admin

# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/azone-admin.git

# Copy admin files from main project
cp -r ../azone-main/app/admin ./app/
cp -r ../azone-main/components/admin ./components/
cp -r ../azone-main/lib/auth ./lib/
cp -r ../azone-main/lib/db ./lib/
cp -r ../azone-main/lib/contexts ./lib/
cp ../azone-main/middleware.ts ./
cp ../azone-main/package.json ./
cp ../azone-main/tsconfig.json ./
cp ../azone-main/tailwind.config.ts ./
cp ../azone-main/next.config.js ./

# Create root layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";

export const metadata: Metadata = {
  title: "Admin Panel - Azone.store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-azone-black">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
EOF

echo "Admin project setup complete!"
echo "Next steps:"
echo "1. Update routes (remove /admin prefix)"
echo "2. Setup environment variables"
echo "3. Deploy to Vercel"
```

---

## 📝 Important Notes

1. **Database Connection:** Same Supabase project ကို use လုပ်ပါ
2. **Environment Variables:** Same credentials သုံးပါ
3. **Authentication:** Same auth system သုံးပါ
4. **Testing:** Thoroughly test before removing from main project
5. **Backup:** Always backup before major changes

---

## 🚀 Deployment Checklist

- [ ] Admin project created
- [ ] Files copied and organized
- [ ] Routes updated (no /admin prefix)
- [ ] Environment variables set
- [ ] Vercel project created
- [ ] Domain configured (admin.paing.xyz)
- [ ] Database connection verified
- [ ] All features tested
- [ ] Main project admin files removed
- [ ] Main project deployed
- [ ] Both sites working correctly

---

## 🆘 Troubleshooting

### Issue: Database not connecting
**Solution:** Check environment variables are same in both projects

### Issue: Authentication not working
**Solution:** Verify middleware.ts is correctly configured

### Issue: Routes not working
**Solution:** Check file structure matches route structure

### Issue: Styling broken
**Solution:** Copy globals.css and tailwind.config.ts

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Test database connection separately

---

**Ready to start? Begin with Step 1!** 🚀
