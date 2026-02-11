"use client";

import { ReactNode, useEffect } from "react";

/**
 * Preview Layout - Hides Header and Breadcrumbs
 * 
 * This layout is used for template preview pages to prevent
 * duplicate headers when loading templates in iframe.
 */
export default function PreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Aggressively hide header and breadcrumbs in preview pages
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
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.height = '0';
          (el as HTMLElement).style.overflow = 'hidden';
        });
      });
    };
    
    // Hide immediately
    hideElements();
    
    // Hide again after a short delay (in case elements render later)
    const timeout = setTimeout(hideElements, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="preview-layout">
      {/* No header or breadcrumbs - they're in the iframe content */}
      {children}
    </div>
  );
}
