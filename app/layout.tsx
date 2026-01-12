import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ToastProvider } from "@/lib/utils/toast";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { DesignModeProvider } from "@/lib/contexts/DesignModeContext";
import { DesignModeToggle } from "@/components/admin/DesignModeToggle";

export const metadata: Metadata = {
  title: "Azone.store - Production-Ready Templates for Serious Builders",
  description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
  keywords: ["UI templates", "Next.js templates", "React templates", "production-ready", "startup templates", "enterprise UI", "boilerplates"],
  authors: [{ name: "Azone.store" }],
  creator: "Azone.store",
  publisher: "Azone.store",
  metadataBase: new URL("https://store.paing.xyz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://store.paing.xyz",
    siteName: "Azone.store",
    title: "Azone.store - Production-Ready Templates for Serious Builders",
    description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Azone.store - Production-Ready Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Azone.store - Production-Ready Templates for Serious Builders",
    description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
    images: ["/og"],
    creator: "@azonestore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://store.paing.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="min-h-screen flex flex-col bg-azone-black">
        <ErrorBoundary>
          <SettingsProvider>
            <DesignModeProvider>
              <ToastProvider>
                {/* Skip to main content link for accessibility */}
                <a
                  href="#main-content"
                  className="skip-link"
                  aria-label="Skip to main content"
                >
                  Skip to main content
                </a>
                <Header />
                <Breadcrumbs />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
                <DesignModeToggle />
              </ToastProvider>
            </DesignModeProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

