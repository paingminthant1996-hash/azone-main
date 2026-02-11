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
    // Hide header and breadcrumbs in preview pages
    const header = document.querySelector('header');
    const breadcrumbs = document.querySelector('nav[aria-label="Breadcrumb"]');
    
    if (header) {
      header.style.display = 'none';
    }
    if (breadcrumbs) {
      breadcrumbs.style.display = 'none';
    }
    
    return () => {
      // Restore on unmount
      if (header) {
        header.style.display = '';
      }
      if (breadcrumbs) {
        breadcrumbs.style.display = '';
      }
    };
  }, []);

  return (
    <div className="preview-layout">
      {/* No header or breadcrumbs - they're in the iframe content */}
      {children}
    </div>
  );
}
