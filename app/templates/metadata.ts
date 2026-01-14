import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates - Azone.store",
  description: "Browse our collection of production-ready templates. Built for scale. Designed for production. Used in real-world products.",
  keywords: [
    "Next.js templates",
    "React templates",
    "SaaS templates",
    "admin dashboard templates",
    "e-commerce templates",
    "landing page templates",
    "production-ready templates",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/templates`,
    title: "Templates - Azone.store",
    description: "Browse our collection of production-ready templates. Built for scale. Designed for production.",
    siteName: "Azone.store",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/og`,
        width: 1200,
        height: 630,
        alt: "Azone.store Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates - Azone.store",
    description: "Browse our collection of production-ready templates.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/og`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/templates`,
  },
};

