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
    // Mark body with preview class for CSS targeting
    document.body.classList.add('preview-layout-active');
    
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
          const htmlEl = el as HTMLElement;
          htmlEl.style.display = 'none';
          htmlEl.style.visibility = 'hidden';
          htmlEl.style.height = '0';
          htmlEl.style.overflow = 'hidden';
          htmlEl.style.opacity = '0';
          htmlEl.style.position = 'absolute';
          htmlEl.style.top = '-9999px';
        });
      });
    };
    
    // Hide immediately and multiple times to catch late-rendering elements
    hideElements();
    const timeouts = [
      setTimeout(hideElements, 0),
      setTimeout(hideElements, 50),
      setTimeout(hideElements, 100),
      setTimeout(hideElements, 200),
      setTimeout(hideElements, 500),
    ];
    
    return () => {
      document.body.classList.remove('preview-layout-active');
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="preview-layout">
      {/* No header or breadcrumbs - they're in the iframe content */}
      {children}
    </div>
  );
}
