import { Template, LegacyProject } from "./types";

// Premium Template Data - Fallback when Supabase is empty
export const templates: Template[] = [
    {
        id: "1",
        slug: "aura-ai-dashboard",
        title: "Aura AI Dashboard",
        description:
            "A cutting-edge AI analytics dashboard designed for modern data teams. Features real-time AI model performance tracking, interactive data visualizations, and intelligent insights. Built with the latest React patterns and optimized for enterprise-scale applications. Perfect for AI startups, data science teams, and tech companies looking to showcase their AI capabilities with a professional, polished interface.",
        shortDescription:
            "Enterprise-grade AI analytics dashboard with real-time insights and beautiful data visualizations",
        price: 89,
        category: "Dashboard",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80",
        techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Framer Motion"],
        features: [
            "Real-time AI Model Monitoring",
            "Interactive Data Visualizations",
            "Custom Dashboard Builder",
            "Dark/Light Mode",
            "Fully Responsive",
            "Performance Optimized",
            "TypeScript Ready",
            "Comprehensive Documentation",
            "20+ Pre-built Components",
            "API Integration Ready",
        ],
        demoUrl: "https://store.paing.xyz/templates/aura-ai-dashboard",
    },
    {
        id: "2",
        slug: "quantum-dashboard-pro",
        title: "Quantum Dashboard Pro",
        description:
            "A stunning, conversion-optimized dashboard template for SaaS products. Features smooth scroll animations, compelling hero sections, social proof integration, and A/B testing ready layouts. Designed to maximize conversions with proven UX patterns and modern design aesthetics. Includes pricing tables, feature showcases, testimonials, and CTA optimization for maximum impact.",
        shortDescription: "High-converting SaaS dashboard with modern animations and conversion-optimized layouts",
        price: 79,
        category: "Dashboard",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80",
        techStack: ["Next.js", "React", "Framer Motion", "TypeScript", "Tailwind CSS", "Stripe"],
        features: [
            "Conversion Optimized Design",
            "Smooth Scroll Animations",
            "A/B Testing Ready",
            "Pricing Table Components",
            "Testimonials Section",
            "Feature Showcase",
            "Newsletter Integration",
            "Analytics Ready",
            "SEO Optimized",
            "Mobile First Design",
        ],
        demoUrl: "https://store.paing.xyz/templates/quantum-dashboard-pro",
    },
    {
        id: "3",
        slug: "nexus-saas-platform",
        title: "Nexus SaaS Platform",
        description:
            "A premium SaaS platform template with modern shopping experience. Features product galleries, advanced filtering, shopping cart, checkout flow, and order management. Built for high-performance online stores with SEO optimization, payment integration ready, and mobile-first design. Perfect for fashion, electronics, and lifestyle brands.",
        shortDescription: "Premium SaaS platform with advanced features and modern user experience",
        price: 99,
        category: "SaaS",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&q=80",
        techStack: ["Next.js", "React", "TypeScript", "Stripe", "Tailwind CSS", "Sanity CMS"],
        features: [
            "Product Gallery",
            "Advanced Filtering",
            "Shopping Cart",
            "Checkout Flow",
            "Order Management",
            "Payment Integration Ready",
            "SEO Optimized",
            "Mobile First",
            "Inventory Management",
            "Admin Dashboard",
        ],
        demoUrl: "https://store.paing.xyz/templates/nexus-saas-platform",
    },
    {
        id: "4",
        slug: "stellar-portfolio-pro",
        title: "Stellar Portfolio Pro",
        description:
            "An elegant portfolio template for creative professionals. Showcase your work with stunning project galleries, smooth page transitions, and interactive elements. Perfect for designers, developers, photographers, and agencies looking to make a lasting impression. Features advanced image optimization, blog integration, and social media connectivity.",
        shortDescription: "Elegant portfolio template for creative professionals with stunning galleries and smooth animations",
        price: 59,
        category: "Portfolio",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop&q=80",
        techStack: ["Next.js", "React", "Three.js", "Framer Motion", "TypeScript"],
        features: [
            "Project Gallery",
            "Smooth Animations",
            "Interactive Elements",
            "About Section",
            "Contact Form",
            "Blog Ready",
            "Social Media Integration",
            "Image Optimization",
            "Fast Loading",
            "SEO Friendly",
        ],
        demoUrl: "https://store.paing.xyz/templates/stellar-portfolio-pro",
    },
    {
        id: "5",
        slug: "zenith-crypto-tracker",
        title: "Zenith Crypto Tracker",
        description:
            "A professional cryptocurrency portfolio tracker with real-time price updates, portfolio analytics, and market insights. Features beautiful charts, transaction history, profit/loss tracking, and multi-wallet support. Perfect for crypto traders, DeFi platforms, and financial applications looking to provide comprehensive portfolio management.",
        shortDescription: "Advanced cryptocurrency portfolio tracker with real-time updates and comprehensive analytics",
        price: 69,
        category: "Finance",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop&q=80",
        techStack: ["React", "Next.js", "WebSocket", "Chart.js", "TypeScript", "CoinGecko API"],
        features: [
            "Real-time Price Updates",
            "Portfolio Analytics",
            "Multi-wallet Support",
            "Transaction History",
            "Profit/Loss Tracking",
            "Market Insights",
            "Responsive Charts",
            "Dark Mode",
            "Export Functionality",
            "API Integration",
        ],
        demoUrl: "https://store.paing.xyz/templates/zenith-crypto-tracker",
    },
    {
        id: "6",
        slug: "lumina-ecommerce-pro",
        title: "Lumina E-Commerce Pro",
        description:
            "A premium e-commerce template with modern shopping experience. Features product galleries, advanced filtering, shopping cart, checkout flow, and order management. Built for high-performance online stores with SEO optimization, payment integration ready, and mobile-first design. Perfect for fashion, electronics, and lifestyle brands.",
        shortDescription: "Premium e-commerce platform with advanced features and modern shopping experience",
        price: 94,
        category: "E-Commerce",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=800&fit=crop&q=80",
        techStack: ["Next.js", "React", "TypeScript", "Stripe", "Tailwind CSS", "Sanity CMS"],
        features: [
            "Product Gallery",
            "Advanced Filtering",
            "Shopping Cart",
            "Checkout Flow",
            "Order Management",
            "Payment Integration Ready",
            "SEO Optimized",
            "Mobile First",
            "Inventory Management",
            "Admin Dashboard",
        ],
        demoUrl: "https://store.paing.xyz/templates/lumina-ecommerce-pro",
    },
];

// Premium Legacy Projects Data
export const legacyProjects: LegacyProject[] = [
    {
        id: "legacy-1",
        title: "Quantum Finance Platform",
        description:
            "A comprehensive financial management platform for enterprise clients. Features real-time market data, advanced analytics, risk management tools, and seamless integration with major financial institutions. Built with microservices architecture and designed for scalability. Handles millions of transactions daily with 99.9% uptime.",
        year: 2023,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Stripe"],
        projectUrl: "#",
    },
    {
        id: "legacy-2",
        title: "Nexus Healthcare System",
        description:
            "A complete healthcare management system for hospitals and clinics. Includes patient management, appointment scheduling, electronic health records, telemedicine integration, and billing system. HIPAA compliant and designed for modern healthcare workflows. Used by 50+ healthcare facilities across the region.",
        year: 2023,
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=80",
        technologies: ["Vue.js", "TypeScript", "Supabase", "Chart.js", "Stripe", "Twilio"],
        projectUrl: "#",
    },
    {
        id: "legacy-3",
        title: "Aurora Social Network",
        description:
            "A modern social networking platform with real-time messaging, content sharing, and community features. Features include live chat, video calls, content moderation, and advanced privacy controls. Built for scale with millions of users in mind. Includes AI-powered content recommendations and moderation.",
        year: 2022,
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&q=80",
        technologies: ["React", "Next.js", "WebSocket", "MongoDB", "Redis", "GraphQL", "AWS S3"],
        projectUrl: "#",
    },
];

// Helper functions for data access
export function getTemplateBySlug(slug: string): Template | undefined {
    return templates.find((template) => template.slug === slug);
}

export function getFeaturedTemplates(): Template[] {
    return templates.filter((template) => template.featured);
}

export function getAllTemplates(): Template[] {
    return templates;
}

export function getAllLegacyProjects(): LegacyProject[] {
    return legacyProjects;
}
