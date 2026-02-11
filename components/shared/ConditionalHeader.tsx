"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

/**
 * Conditionally renders Header and Breadcrumbs
 * Hides them on preview pages to prevent duplication
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  const isPreviewPage = pathname?.includes("/preview") || false;

  // Don't render header/breadcrumbs on preview pages
  if (isPreviewPage) {
    return null;
  }

  return (
    <>
      <ErrorBoundary fallback={
        <div className="min-h-screen bg-azone-black flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Header Error</h1>
            <p className="text-gray-400">Please refresh the page</p>
          </div>
        </div>
      }>
        <div key="header-wrapper" suppressHydrationWarning className="header-container">
          <Header />
        </div>
      </ErrorBoundary>
      <div key="breadcrumbs-wrapper" suppressHydrationWarning className="breadcrumbs-container">
        <Breadcrumbs />
      </div>
    </>
  );
}
