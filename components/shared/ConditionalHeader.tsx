"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

/**
 * Conditionally renders Header and Breadcrumbs
 * Hides them on preview pages to prevent duplication
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isPreviewPage = pathname?.includes("/preview") || false;

  useEffect(() => {
    setMounted(true);
    
    // Also hide via DOM manipulation as backup
    if (isPreviewPage) {
      const header = document.querySelector('header');
      const breadcrumbs = document.querySelector('nav[aria-label="Breadcrumb"]');
      const headerContainer = document.querySelector('.header-container');
      const breadcrumbsContainer = document.querySelector('.breadcrumbs-container');
      
      if (header) header.style.display = 'none';
      if (breadcrumbs) breadcrumbs.style.display = 'none';
      if (headerContainer) headerContainer.style.display = 'none';
      if (breadcrumbsContainer) breadcrumbsContainer.style.display = 'none';
    }
  }, [isPreviewPage]);

  // Don't render header/breadcrumbs on preview pages
  if (isPreviewPage || !mounted) {
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
