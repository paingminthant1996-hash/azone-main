"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useEffect } from "react";

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    customItems?: BreadcrumbItem[];
    templateTitle?: string;
}

export default function Breadcrumbs({ customItems, templateTitle }: BreadcrumbsProps = {}) {
    const pathname = usePathname();

    // Build breadcrumb items
    const buildBreadcrumbs = (): BreadcrumbItem[] => {
        // If custom items provided, use them
        if (customItems && customItems.length > 0) {
            return customItems;
        }

        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { name: 'Home', href: '/' }
        ];

        // Handle special routes
        if (paths[0] === 'templates') {
            breadcrumbs.push({ name: 'Templates', href: '/templates' });

            // If it's a template detail page (has slug)
            if (paths.length > 1 && paths[1]) {
                // Use template title if provided, otherwise use slug
                const name = templateTitle || paths[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                breadcrumbs.push({
                    name,
                    href: `/templates/${paths[1]}`
                });
            }
        } else if (paths[0] === 'admin') {
            breadcrumbs.push({ name: 'Admin', href: '/admin' });
            if (paths[1]) {
                const pageName = paths[1].charAt(0).toUpperCase() + paths[1].slice(1);
                breadcrumbs.push({ name: pageName, href: `/admin/${paths[1]}` });
            }
        } else if (paths[0] === 'account') {
            breadcrumbs.push({ name: 'Account', href: '/account' });
            if (paths[1]) {
                const pageName = paths[1].charAt(0).toUpperCase() + paths[1].slice(1);
                breadcrumbs.push({ name: pageName, href: `/account/${paths[1]}` });
            }
        } else {
            // Generic handling for other routes
            paths.forEach((path, index) => {
                const href = '/' + paths.slice(0, index + 1).join('/');
                const name = path
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                breadcrumbs.push({ name, href });
            });
        }

        return breadcrumbs;
    };

  const breadcrumbs = buildBreadcrumbs();

  // Add structured data for SEO - ALWAYS call useEffect (hooks must be in same order)
  useEffect(() => {
    // Don't add structured data on home page
    if (pathname === "/") {
      return;
    }

    if (typeof window !== "undefined" && breadcrumbs.length > 0) {
      const baseUrl = window.location.origin;
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${baseUrl}${crumb.href}`,
        })),
      };

      // Remove existing breadcrumb script if any
      const existingScript = document.getElementById("breadcrumb-structured-data");
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data script
      const script = document.createElement("script");
      script.id = "breadcrumb-structured-data";
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById("breadcrumb-structured-data");
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [breadcrumbs, pathname]);

  // Don't show breadcrumbs on home page - AFTER all hooks
  if (pathname === "/") {
    return null;
  }

  return (
    <nav 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-800"
      aria-label="Breadcrumb"
    >
            <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-600" aria-hidden="true" />
                        )}
                        {index === 0 ? (
                            <Link
                                href={crumb.href}
                                className="text-gray-400 hover:text-white transition-colors flex items-center"
                                aria-label="Home"
                            >
                                <Home className="w-4 h-4" />
                            </Link>
                        ) : index === breadcrumbs.length - 1 ? (
                            <span className="text-white font-medium" aria-current="page">
                                {crumb.name}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {crumb.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

