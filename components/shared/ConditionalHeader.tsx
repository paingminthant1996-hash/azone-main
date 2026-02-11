"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

/**
 * Conditionally renders Header and Breadcrumbs
 * Hides them on preview pages to prevent duplication
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Check synchronously if we're on a preview page - MUST check before render
  const isPreviewPage = pathname?.includes("/preview") || false;

  useEffect(() => {
    // Backup: Aggressively hide header and breadcrumbs via DOM manipulation
    // This catches any edge cases where pathname check might fail
    if (isPreviewPage || (typeof window !== 'undefined' && window.location.pathname.includes("/preview"))) {
      const hideElements = () => {
        const selectors = [
          'header',
          'nav[aria-label="Breadcrumb"]',
          '.header-container',
          '.breadcrumbs-container',
          '[class*="header-container"]',
          '[class*="breadcrumbs-container"]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.display = 'none';
            htmlEl.style.visibility = 'hidden';
            htmlEl.style.height = '0';
            htmlEl.style.overflow = 'hidden';
            htmlEl.style.opacity = '0';
            htmlEl.style.position = 'absolute';
            htmlEl.style.top = '-9999px';
            htmlEl.style.pointerEvents = 'none';
          });
        });
      };
      
      // Hide immediately and after delays to catch late-rendering elements
      hideElements();
      const timeouts = [
        setTimeout(hideElements, 0),
        setTimeout(hideElements, 50),
        setTimeout(hideElements, 100),
        setTimeout(hideElements, 200),
        setTimeout(hideElements, 500),
      ];
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [isPreviewPage, pathname]);

  // CRITICAL: Don't render header/breadcrumbs on preview pages
  // This check happens synchronously before render, preventing initial render
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
