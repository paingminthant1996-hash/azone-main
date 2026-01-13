#!/bin/bash

# Admin Panel Separation Setup Script
# This script helps create a separate admin project

echo "🚀 Starting Admin Panel Separation Setup..."
echo ""

# Check if we're in the right directory
if [ ! -d "app/admin" ]; then
    echo "❌ Error: app/admin directory not found!"
    echo "Please run this script from the main project root directory."
    exit 1
fi

# Create new admin project directory
ADMIN_DIR="../azone-admin"
echo "📁 Creating admin project directory: $ADMIN_DIR"
mkdir -p "$ADMIN_DIR"
cd "$ADMIN_DIR"

# Initialize git
echo "🔧 Initializing Git repository..."
git init
echo "✅ Git initialized"

# Create directory structure
echo "📂 Creating directory structure..."
mkdir -p app
mkdir -p components/admin
mkdir -p lib/{auth,db,contexts,utils}
mkdir -p public

# Copy admin files
echo "📋 Copying admin files..."
cp -r ../azone-main/app/admin/* ./app/ 2>/dev/null || true
cp -r ../azone-main/components/admin/* ./components/admin/ 2>/dev/null || true
cp -r ../azone-main/lib/auth/* ./lib/auth/ 2>/dev/null || true
cp -r ../azone-main/lib/db/* ./lib/db/ 2>/dev/null || true
cp -r ../azone-main/lib/contexts/* ./lib/contexts/ 2>/dev/null || true
cp ../azone-main/lib/types.ts ./lib/ 2>/dev/null || true
cp ../azone-main/lib/utils.ts ./lib/utils/ 2>/dev/null || true
cp ../azone-main/middleware.ts ./ 2>/dev/null || true

# Copy config files
echo "⚙️ Copying configuration files..."
cp ../azone-main/package.json ./
cp ../azone-main/tsconfig.json ./
cp ../azone-main/tailwind.config.ts ./
cp ../azone-main/postcss.config.js ./
cp ../azone-main/next.config.js ./
cp ../azone-main/.gitignore ./ 2>/dev/null || true

# Copy styles
echo "🎨 Copying styles..."
cp ../azone-main/app/globals.css ./app/ 2>/dev/null || true

# Create root layout
echo "📝 Creating root layout..."
cat > app/layout.tsx << 'EOF'
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
EOF

# Create root page (redirect to overview)
echo "📝 Creating root page..."
cat > app/page.tsx << 'EOF'
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
EOF

# Create .env.local template
echo "📝 Creating .env.local template..."
cat > .env.local.example << 'EOF'
# Supabase Configuration (Same as main project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com

# Optional: Site URL
NEXT_PUBLIC_SITE_URL=https://admin.paing.xyz
EOF

# Create README
echo "📝 Creating README..."
cat > README.md << 'EOF'
# Azone Admin Panel

Separate admin panel for Azone.store marketplace.

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials (same as main project)
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`

## Deployment

Deploy to Vercel with domain: `admin.paing.xyz`

## Database

Uses the same Supabase database as the main website.
EOF

echo ""
echo "✅ Admin project setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd $ADMIN_DIR"
echo "2. Copy .env.local.example to .env.local and add your credentials"
echo "3. Update routes (remove /admin prefix) - see ADMIN_PANEL_SEPARATION_GUIDE.md"
echo "4. npm install"
echo "5. npm run dev"
echo "6. Test locally"
echo "7. Deploy to Vercel"
echo ""
echo "📖 See ADMIN_PANEL_SEPARATION_GUIDE.md for detailed instructions"
