import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ToastProvider } from "@/lib/utils/toast";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { DesignModeProvider } from "@/lib/contexts/DesignModeContext";
import { DesignModeToggle } from "@/components/admin/DesignModeToggle";
import ConditionalHeader from "@/components/shared/ConditionalHeader";

export const metadata: Metadata = {
  title: "Azone - Production-Ready Templates for Serious Builders",
  description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
  keywords: ["UI templates", "Next.js templates", "React templates", "production-ready", "startup templates", "enterprise UI", "boilerplates"],
  authors: [{ name: "Azone" }],
  creator: "Azone",
  publisher: "Azone",
  metadataBase: new URL("https://paing.xyz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://paing.xyz",
    siteName: "Azone",
    title: "Azone - Production-Ready Templates for Serious Builders",
    description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Azone - Production-Ready Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Azone - Production-Ready Templates for Serious Builders",
    description: "Built for production. Designed for scale. Used in real-world products. Enterprise-grade UI kits and boilerplates for funded startup founders and senior engineers.",
    images: ["/og"],
    creator: "@azone",
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
    canonical: "https://paing.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        {/* Prevent blank page on slow connections */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
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
                {/* Conditionally render header/breadcrumbs (hidden on preview pages) */}
                <ConditionalHeader />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </main>
                <ErrorBoundary fallback={null}>
                  <Footer />
                </ErrorBoundary>
                <ErrorBoundary fallback={null}>
                  <DesignModeToggle />
                </ErrorBoundary>
              </ToastProvider>
            </DesignModeProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

