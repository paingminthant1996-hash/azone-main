# v0.dev Prompt for Admin Dashboard
## v0.dev မှာ Admin Dashboard UI Generate လုပ်ဖို့ Prompt

### 🎯 Copy this prompt to v0.dev:

```
Create a modern admin dashboard for a template marketplace with the following features:

**Layout:**
- Left sidebar navigation (fixed, dark theme) with:
  - Logo/brand at top: "Templates" with back arrow
  - Navigation items: Overview (dashboard icon), Templates (document icon), Inquiries (message icon), Settings (gear icon)
  - User profile at bottom: circular avatar, "Admin" name, email "admin@templates.io"
- Main content area with:
  - Top header bar with search (only on templates page) and "Add New Template" button
  - Dashboard content area

**Overview Page:**
- 4 metric cards in a row:
  1. Total Templates (purple gradient card with bar chart icon) - shows number "45"
  2. Live Previews (blue card with eye icon) - shows "1,200"
  3. Customer Inquiries (blue card with message icon) - shows "12"
  4. Total Revenue (blue card with trending line icon) - shows "$24,540"

- Bottom section split into two:
  - Left: "Recent Templates" table with columns: Template Name, Category, Upload Date, Status (Live/Draft badge), Action (three dots)
    - Show 5 rows: "E-Commerce Pro", "Portfolio Minimal", "SaaS Dashboard", "Blog Platform", "Startup Landing"
  - Right: "Client Messages" list with 4 items:
    - Each item: blue dot, name, email, subject, time ago
    - "Sarah Johnson", "Mike Chen", "Emma Davis", "Alex Rodriguez"

**Design Requirements:**
- Dark theme: black background (#050505), dark gray cards
- Purple accent color (#7C3AED) for active states and primary actions
- Blue accents for icons and secondary elements
- Modern, clean design with proper spacing
- Responsive layout (mobile sidebar toggle)
- Smooth transitions and hover effects

**Components:**
- Sidebar with active route highlighting
- Metric cards with icons and numbers
- Data table with hover effects
- Message list with time stamps
- Search bar in header
- Action buttons with icons

Use Next.js 15, TypeScript, Tailwind CSS, and lucide-react for icons. Make it fully functional with proper TypeScript types.
```

---

### 📋 Alternative Shorter Prompt:

```
Build a dark-themed admin dashboard for a template marketplace:

**Sidebar (left):**
- Logo "Templates" with back arrow
- Nav: Overview, Templates, Inquiries, Settings (with icons)
- User profile at bottom: Admin avatar, name, email

**Overview Page:**
- 4 metric cards: Total Templates (45), Live Previews (1,200), Customer Inquiries (12), Total Revenue ($24,540)
- Recent Templates table (5 rows with name, category, date, status, action)
- Client Messages list (4 items with name, email, subject, time)

**Design:**
- Dark theme (#050505 background)
- Purple (#7C3AED) for active states
- Blue for icons
- Responsive with mobile sidebar toggle

Next.js 15 + TypeScript + Tailwind + lucide-react icons. Fully typed.
```

---

### 🎨 Detailed Component Prompt:

```
Create a production-ready admin dashboard component with:

1. **SidebarNavigation Component:**
   - Fixed left sidebar (256px width)
   - Dark gray background with border
   - Logo section at top
   - Navigation menu items with icons (lucide-react)
   - Active state highlighting (purple background)
   - User profile card at bottom
   - Mobile responsive (toggle button)

2. **DashboardOverview Component:**
   - Header with title "Overview"
   - 4 metric cards in grid:
     * Total Templates: purple gradient, bar chart icon, number display
     * Live Previews: blue card, eye icon, formatted number
     * Customer Inquiries: blue card, message icon, count
     * Total Revenue: blue card, trending icon, currency format
   - Two-column layout below:
     * Recent Templates table (left) - sortable, with status badges
     * Client Messages list (right) - with avatars and timestamps

3. **Design System:**
   - Colors: #050505 (black), #7C3AED (purple), #1E40AF (blue)
   - Typography: Inter font, proper hierarchy
   - Spacing: consistent padding and margins
   - Animations: smooth transitions, hover effects

4. **Technical:**
   - Next.js 15 App Router
   - TypeScript with proper types
   - Tailwind CSS for styling
   - Framer Motion for animations
   - Responsive breakpoints

Export as ready-to-use components with proper props and types.
```

---

### 🚀 Complete Full-Stack Prompt:

```
Build a complete admin dashboard application for a template marketplace:

**Project Structure:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- lucide-react for icons

**Pages Needed:**
1. Login page (/login) - simple form with email/password
2. Overview page (/overview) - dashboard with metrics
3. Templates page (/templates) - table with search and filters
4. Settings page (/settings) - form with theme color picker
5. Analytics page (/analytics) - charts and statistics
6. Purchases page (/purchases) - transaction list

**Shared Layout:**
- AdminLayout component with sidebar navigation
- Sidebar: Overview, Templates, Inquiries, Settings
- Top header: search bar, action buttons
- User profile section

**Overview Page Details:**
- 4 metric cards: Total Templates (45), Live Previews (1,200), Customer Inquiries (12), Total Revenue ($24,540)
- Recent Templates table: Name, Category, Date, Status (Live/Draft), Actions
- Client Messages: Name, Email, Subject, Time ago

**Design:**
- Dark theme (#050505 background)
- Purple accent (#7C3AED) for primary actions
- Blue (#1E40AF) for secondary elements
- Modern glassmorphism effects
- Responsive design

**Features:**
- Authentication check
- Route protection
- Active route highlighting
- Mobile sidebar toggle
- Loading states
- Error handling

Generate complete code with all files, proper TypeScript types, and ready to deploy.
```

---

### 💡 Quick Copy-Paste Prompts:

#### **Prompt 1: Basic Dashboard**
```
Dark admin dashboard with sidebar (Overview, Templates, Settings), overview page with 4 metric cards (Total Templates: 45, Live Previews: 1,200, Customer Inquiries: 12, Total Revenue: $24,540), recent templates table, and client messages list. Next.js 15 + TypeScript + Tailwind. Purple accent (#7C3AED), dark theme.
```

#### **Prompt 2: With Details**
```
Create admin dashboard: left sidebar with navigation (Overview, Templates, Inquiries, Settings) and user profile, overview page with 4 purple/blue metric cards showing stats, recent templates table (5 rows), client messages list (4 items). Dark theme, responsive, Next.js 15, TypeScript, Tailwind CSS.
```

#### **Prompt 3: Complete App**
```
Build full admin dashboard app: login page, sidebar layout, overview with metrics (45 templates, 1,200 previews, 12 inquiries, $24,540 revenue), templates management table, settings page. Dark UI, purple accents, Next.js 15 + TypeScript + Tailwind. Include authentication and route protection.
```

---

### 📝 Usage Instructions:

1. **Go to v0.dev**
2. **Paste one of the prompts above**
3. **Click "Generate"**
4. **v0 will create:**
   - Complete UI components
   - TypeScript types
   - Tailwind CSS styles
   - Next.js structure
   - All necessary files

5. **After generation:**
   - Copy the generated code
   - Paste into your admin project
   - Adjust as needed
   - Connect to your database

---

### 🎯 Recommended Prompt (Best Results):

```
Create a modern admin dashboard for a template marketplace:

**Layout:**
- Fixed left sidebar (256px) with dark background
- Logo "Templates" at top with back arrow
- Navigation: Overview (LayoutDashboard icon), Templates (FileText), Inquiries (MessageSquare), Settings (Settings) - from lucide-react
- Active route highlighted with purple background
- User profile card at bottom: circular avatar, "Admin" name, "admin@templates.io" email

**Overview Page:**
- Page title "Overview" with icon
- 4 metric cards in grid (2x2 on mobile, 4 columns on desktop):
  1. Total Templates: purple gradient card, BarChart3 icon, number "45"
  2. Live Previews: blue card, Eye icon, "1,200" formatted
  3. Customer Inquiries: blue card, MessageSquare icon, "12"
  4. Total Revenue: blue card, TrendingUp icon, "$24,540" currency

- Bottom section (2 columns):
  - Left: "Recent Templates" table with columns: Template Name, Category, Upload Date, Status (purple "Live" badge or gray "Draft"), Action (three dots menu)
    - 5 rows: "E-Commerce Pro" (E-Commerce, Jan 10, Live), "Portfolio Minimal" (Portfolio, Jan 8, Live), "SaaS Dashboard" (Dashboard, Jan 5, Draft), "Blog Platform" (Blog, Jan 3, Live), "Startup Landing" (Landing Page, Dec 28, Live)
  - Right: "Client Messages" list:
    - Each item: blue dot indicator, name (bold), email (gray), subject, time ago
    - "Sarah Johnson" (sarah@company.com, Template customization, 2 hours ago)
    - "Mike Chen" (mike@startup.io, License inquiry, 5 hours ago)
    - "Emma Davis" (emma@design.co, Installation support, 1 day ago)
    - "Alex Rodriguez" (alex@agency.com, Bulk purchase, 2 days ago)

**Design:**
- Background: #050505 (azone-black)
- Cards: dark gray (#1F2937) with border
- Primary accent: #7C3AED (purple)
- Secondary: #3B82F6 (blue)
- Text: white for headings, gray-400 for secondary
- Hover effects on interactive elements
- Smooth transitions
- Mobile: sidebar hidden, toggle button in header

**Tech Stack:**
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- lucide-react (for icons)

**Components to generate:**
- AdminLayout (sidebar + main content wrapper)
- DashboardOverview (overview page content)
- MetricCard (reusable metric card component)
- RecentTemplatesTable (data table component)
- ClientMessagesList (message list component)

Make it production-ready with proper TypeScript types, responsive design, and clean code structure.
```

---

### ✅ After v0 Generates:

1. **Copy all generated files**
2. **Paste into your admin project:**
   - Components → `components/admin/`
   - Pages → `app/overview/page.tsx`, etc.
   - Types → `lib/types.ts`

3. **Connect to your database:**
   - Replace mock data with real API calls
   - Connect to Supabase
   - Add authentication

4. **Customize:**
   - Adjust colors if needed
   - Add more features
   - Connect to your backend

---

**v0.dev မှာ prompt ကို paste လုပ်ပြီး Generate click လုပ်ရင် complete UI က auto generate ဖြစ်သွားမယ်!** 🚀
