# Admin Dashboard - Separate Vercel Project Build Guide
## Admin Dashboard ကို Separate Project အဖြစ် တည်ဆောက်ခြင်း

### 🎯 Goal
- Admin Dashboard ကို separate Vercel project အဖြစ် build လုပ်မယ်
- Original dashboard design အတိုင်း ထားမယ်
- Main website နဲ့ same database (Supabase) သုံးမယ်
- Clean URL: `admin.paing.xyz`

---

## 📋 Required Files & Components

### **1. Core Admin Files (Required)**

#### **App Directory Structure**
```
app/
├── layout.tsx              # Root layout (no Header/Footer)
├── page.tsx                # Root page (redirects to /overview)
├── globals.css             # Global styles
├── login/
│   └── page.tsx           # Admin login page
├── overview/
│   └── page.tsx           # Dashboard overview with metrics
├── templates/
│   └── page.tsx           # Template management
├── settings/
│   └── page.tsx           # Site settings
├── analytics/
│   └── page.tsx           # Analytics dashboard
├── purchases/
│   └── page.tsx           # Purchase management
└── upload/
    └── page.tsx           # Template upload
```

#### **Admin Layout**
```
app/
└── admin/
    └── layout.tsx         # Dashboard layout with sidebar
```

**Note:** Admin layout က `app/admin/layout.tsx` မှာ ရှိရမယ် (သို့မဟုတ် root level မှာ routes တွေကို move လုပ်ပြီး layout ကို root level မှာ ထားလို့ရတယ်)

---

### **2. Components (Required)**

```
components/
└── admin/
    ├── DesignModeToggle.tsx    # Design mode toggle (optional)
    └── AdminNav.tsx            # Admin navigation (if used)
```

---

### **3. Library Files (Required)**

```
lib/
├── auth/
│   ├── auth.ts            # Authentication functions
│   └── supabase-client.ts # Supabase client
├── db/
│   ├── queries.ts         # Template queries
│   ├── analytics.ts       # Analytics queries
│   └── purchases.ts       # Purchase queries
├── contexts/
│   ├── SettingsContext.tsx    # Settings context
│   └── DesignModeContext.tsx   # Design mode context (optional)
├── types.ts               # TypeScript types
└── utils.ts               # Utility functions
```

---

### **4. Configuration Files (Required)**

```
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
├── postcss.config.js      # PostCSS config
├── middleware.ts         # Route protection
└── .env.local            # Environment variables
```

---

### **5. Actions (If Used)**

```
app/
└── actions/
    ├── manage-templates.ts    # Template CRUD operations
    ├── upload-template.ts     # Template upload
    └── send-email.ts          # Email sending (if used)
```

---

## 🏗️ Step-by-Step Build Process

### **Step 1: Create New Project Directory**

```bash
# Desktop မှာ new folder create လုပ်ပါ
cd ~/Desktop
mkdir azone-admin
cd azone-admin
```

---

### **Step 2: Initialize Project**

```bash
# Git initialize
git init
git remote add origin https://github.com/YOUR_USERNAME/azone-admin.git

# Create basic structure
mkdir -p app/{login,overview,templates,settings,analytics,purchases,upload}
mkdir -p components/admin
mkdir -p lib/{auth,db,contexts,utils}
mkdir -p app/actions
mkdir -p public
```

---

### **Step 3: Copy Required Files from Main Project**

#### **3.1 Copy Admin Pages**
```bash
# From main project
cp -r ../azone-main/app/admin/login ./app/login
cp -r ../azone-main/app/admin/overview ./app/overview
cp -r ../azone-main/app/admin/templates ./app/templates
cp -r ../azone-main/app/admin/settings ./app/settings
cp -r ../azone-main/app/admin/analytics ./app/analytics
cp -r ../azone-main/app/admin/purchases ./app/purchases
cp -r ../azone-main/app/admin/upload ./app/upload
```

#### **3.2 Copy Admin Layout**
```bash
# Option 1: Keep admin layout structure
mkdir -p app/admin
cp ../azone-main/app/admin/layout.tsx ./app/admin/layout.tsx

# Option 2: Move to root (cleaner URLs)
# We'll update routes to remove /admin prefix
```

#### **3.3 Copy Components**
```bash
cp -r ../azone-main/components/admin ./components/
```

#### **3.4 Copy Library Files**
```bash
cp -r ../azone-main/lib/auth ./lib/
cp -r ../azone-main/lib/db ./lib/
cp -r ../azone-main/lib/contexts ./lib/
cp ../azone-main/lib/types.ts ./lib/
cp ../azone-main/lib/utils.ts ./lib/utils/
```

#### **3.5 Copy Actions**
```bash
cp -r ../azone-main/app/actions ./app/
```

#### **3.6 Copy Configuration Files**
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

### **Step 4: Create Root Layout**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { DesignModeProvider } from "@/lib/contexts/DesignModeContext";
import { DesignModeToggle } from "@/components/admin/DesignModeToggle";

export const metadata: Metadata = {
  title: "Admin Dashboard - Azone.store",
  description: "Admin dashboard for Azone.store marketplace",
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

### **Step 5: Create Root Page (Redirect)**

Create `app/page.tsx`:

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

### **Step 6: Update Routes (Remove /admin Prefix)**

#### **6.1 Update Admin Layout Navigation**

Edit `app/admin/layout.tsx` (or create new layout at root):

```tsx
const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Inquiries", href: "/purchases", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];
```

#### **6.2 Move Files (Optional - for cleaner structure)**

```bash
# If you want cleaner URLs without /admin prefix
# Move files from app/admin/* to app/*
mv app/admin/overview ./app/overview
mv app/admin/templates ./app/templates
mv app/admin/settings ./app/settings
# ... etc

# Then move layout to root
mv app/admin/layout.tsx ./app/admin-layout.tsx
# And update it to wrap all routes
```

**OR** Keep structure and update routes in layout:

```tsx
// Keep app/admin/layout.tsx but update hrefs
const navigation = [
  { name: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  // ... etc
];
```

---

### **Step 7: Update Middleware**

Edit `middleware.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Allow login page
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/admin/login') {
    return response
  }

  // Protect all other routes
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Check if user is admin
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
  const isAdmin = 
    session.user.user_metadata?.role === 'admin' ||
    (session.user.email && adminEmails.includes(session.user.email))

  if (!isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'access_denied')
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

### **Step 8: Setup Environment Variables**

Create `.env.local`:

```env
# Supabase Configuration (Same as main project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com

# Optional
NEXT_PUBLIC_SITE_URL=https://admin.paing.xyz
```

---

### **Step 9: Update Package.json**

Edit `package.json`:

```json
{
  "name": "azone-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.89.0",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.562.0",
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

---

### **Step 10: Install Dependencies**

```bash
npm install
```

---

### **Step 11: Update Import Paths**

Check all files for import paths that might need updating:

```bash
# Search for imports that reference main project structure
grep -r "@/components/layout" app/
grep -r "@/components/shared" app/
# Update these if needed
```

---

### **Step 12: Test Locally**

```bash
npm run dev
```

Visit: `http://localhost:3000`

**Test Checklist:**
- [ ] Login page loads: `/login`
- [ ] Overview page loads: `/overview` (or `/admin/overview`)
- [ ] Templates page works
- [ ] Settings page works
- [ ] Analytics page works
- [ ] Purchases page works
- [ ] Upload page works
- [ ] Sidebar navigation works
- [ ] Authentication works
- [ ] Database connection works

---

### **Step 13: Build for Production**

```bash
npm run build
```

Fix any build errors that appear.

---

### **Step 14: Deploy to Vercel**

#### **14.1 Create Vercel Project**

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### **14.2 Add Environment Variables**

In Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAILS`

#### **14.3 Configure Domain**

1. Go to Project Settings → Domains
2. Add domain: `admin.paing.xyz`
3. Configure DNS:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

#### **14.4 Deploy**

Click "Deploy" and wait for deployment to complete.

---

## 📦 Complete File Checklist

### **Required Files:**

```
✅ app/
   ✅ layout.tsx
   ✅ page.tsx
   ✅ globals.css
   ✅ login/page.tsx
   ✅ overview/page.tsx (or admin/overview/page.tsx)
   ✅ templates/page.tsx (or admin/templates/page.tsx)
   ✅ settings/page.tsx (or admin/settings/page.tsx)
   ✅ analytics/page.tsx (or admin/analytics/page.tsx)
   ✅ purchases/page.tsx (or admin/purchases/page.tsx)
   ✅ upload/page.tsx (or admin/upload/page.tsx)
   ✅ admin/layout.tsx (dashboard layout with sidebar)

✅ components/
   ✅ admin/DesignModeToggle.tsx
   ✅ admin/AdminNav.tsx (if used)

✅ lib/
   ✅ auth/auth.ts
   ✅ auth/supabase-client.ts
   ✅ db/queries.ts
   ✅ db/analytics.ts
   ✅ db/purchases.ts
   ✅ contexts/SettingsContext.tsx
   ✅ contexts/DesignModeContext.tsx
   ✅ types.ts
   ✅ utils.ts

✅ app/actions/
   ✅ manage-templates.ts
   ✅ upload-template.ts
   ✅ send-email.ts (if used)

✅ Configuration Files:
   ✅ package.json
   ✅ tsconfig.json
   ✅ next.config.js
   ✅ tailwind.config.ts
   ✅ postcss.config.js
   ✅ middleware.ts
   ✅ .env.local
   ✅ .gitignore
```

---

## 🔧 Quick Setup Script

Create `setup.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up Admin Dashboard Project..."

# Create directories
mkdir -p app/{login,overview,templates,settings,analytics,purchases,upload,admin}
mkdir -p components/admin
mkdir -p lib/{auth,db,contexts,utils}
mkdir -p app/actions

# Copy files (adjust paths as needed)
echo "📋 Copying files from main project..."
# Add copy commands here

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo "📝 Next: Update .env.local with your Supabase credentials"
echo "📝 Then: npm run dev"
```

---

## ✅ Verification Steps

After deployment:

1. **Test Login:**
   - Visit `admin.paing.xyz/login`
   - Login with admin credentials
   - Should redirect to overview

2. **Test Dashboard:**
   - Overview page shows metrics
   - Sidebar navigation works
   - All pages accessible

3. **Test Database:**
   - Create template in admin
   - Check main website - should appear
   - Create purchase on main site
   - Check admin - should appear

4. **Test Features:**
   - Template upload works
   - Settings save works
   - Analytics load correctly
   - Purchases display correctly

---

## 🎯 Final Structure Options

### **Option 1: With /admin Prefix**
```
app/
├── layout.tsx
├── page.tsx
└── admin/
    ├── layout.tsx (dashboard layout)
    ├── overview/page.tsx
    ├── templates/page.tsx
    └── ...
```
**URLs:** `admin.paing.xyz/admin/overview`

### **Option 2: Clean URLs (Recommended)**
```
app/
├── layout.tsx
├── page.tsx
├── admin/
│   └── layout.tsx (dashboard layout)
├── overview/page.tsx
├── templates/page.tsx
└── ...
```
**URLs:** `admin.paing.xyz/overview`

---

## 📝 Important Notes

1. **Same Database:** Use same Supabase credentials as main project
2. **Same Auth:** Same authentication system
3. **Original Design:** Keep dashboard design exactly as is
4. **Test Thoroughly:** Test all features before going live
5. **Backup:** Always backup before major changes

---

## 🚀 Ready to Build!

Follow these steps in order, and you'll have a separate admin dashboard project ready for deployment! 🎉
