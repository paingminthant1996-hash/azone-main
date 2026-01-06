"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart, ShoppingCart, Rocket, Shield, Palette, Database } from "lucide-react";
import { getAllTemplates } from "@/lib/db/queries";
import { Template } from "@/lib/types";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  // Map database category values to this category
  matches: string[];
}

const categories: Category[] = [
  {
    id: "1",
    name: "SaaS Dashboards",
    slug: "saas",
    icon: <BarChart className="w-6 h-6" />,
    description: "Complete admin panels and analytics dashboards",
    color: "from-blue-500 to-cyan-500",
    matches: ["SaaS", "Dashboard", "Admin", "Analytics"],
  },
  {
    id: "2",
    name: "E-commerce",
    slug: "ecommerce",
    icon: <ShoppingCart className="w-6 h-6" />,
    description: "Online stores and marketplace templates",
    color: "from-purple-500 to-pink-500",
    matches: ["E-commerce", "Ecommerce", "Store", "Marketplace"],
  },
  {
    id: "3",
    name: "Landing Pages",
    slug: "landing",
    icon: <Rocket className="w-6 h-6" />,
    description: "High-converting landing page templates",
    color: "from-orange-500 to-red-500",
    matches: ["Landing", "Landing Page", "Marketing"],
  },
  {
    id: "4",
    name: "Authentication",
    slug: "auth",
    icon: <Shield className="w-6 h-6" />,
    description: "Login, signup, and auth flow templates",
    color: "from-green-500 to-emerald-500",
    matches: ["Auth", "Authentication", "Login"],
  },
  {
    id: "5",
    name: "UI Components",
    slug: "components",
    icon: <Palette className="w-6 h-6" />,
    description: "Reusable component libraries",
    color: "from-pink-500 to-rose-500",
    matches: ["Components", "UI", "Design System"],
  },
  {
    id: "6",
    name: "Full Stack",
    slug: "fullstack",
    icon: <Database className="w-6 h-6" />,
    description: "Complete full-stack applications",
    color: "from-indigo-500 to-purple-500",
    matches: ["Full Stack", "Fullstack", "Application"],
  },
];

// Helper function to match template category to category slug
function getCategoryForTemplate(templateCategory: string): Category | null {
  const categoryLower = templateCategory.toLowerCase();
  for (const category of categories) {
    if (category.matches.some(match => categoryLower.includes(match.toLowerCase()))) {
      return category;
    }
  }
  // Default to first category if no match
  return categories[0];
}

// Helper function to get database category name from category slug
// This maps the slug back to the actual category value used in the database
function getCategoryNameFromSlug(slug: string): string {
  const category = categories.find(c => c.slug === slug);
  if (!category) return "";
  
  // Return the first match value which is typically the database category name
  return category.matches[0];
}

export default function CategoryLinks() {
  const router = useRouter();
  const [templatesByCategory, setTemplatesByCategory] = useState<Record<string, Template[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const data = await getAllTemplates();

        // Group templates by category
        const grouped: Record<string, Template[]> = {};
        data.forEach((template) => {
          const category = getCategoryForTemplate(template.category);
          if (category) {
            if (!grouped[category.slug]) {
              grouped[category.slug] = [];
            }
            grouped[category.slug].push(template);
          }
        });
        setTemplatesByCategory(grouped);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    // Get the actual category name from slug (for database matching)
    const categoryName = getCategoryNameFromSlug(categorySlug);
    // Navigate to templates page with category filter
    // Use the actual category name that matches database values
    router.push(`/templates?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-azone-black to-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.15] tracking-tight">
            <span className="text-white">Browse by</span>
            <span className="text-azone-purple ml-3">Category</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Find the perfect template for your project
          </p>
        </motion.div>

        {/* Categories Grid - Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const categoryTemplates = templatesByCategory[category.slug] || [];
            const hasTemplates = categoryTemplates.length > 0;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => handleCategoryClick(category.slug)}
                  disabled={!hasTemplates}
                  className={`w-full bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 h-full text-left group ${
                    hasTemplates
                      ? "border-gray-800 hover:border-azone-purple/50 cursor-pointer"
                      : "border-gray-800/50 opacity-50 cursor-not-allowed"
                  }`}
                  whileHover={hasTemplates ? { scale: 1.02 } : {}}
                  whileTap={hasTemplates ? { scale: 0.98 } : {}}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-azone-purple transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {category.description}
                  </p>

                  {/* Template Count & Arrow */}
                  <div className="flex items-center justify-between">
                    {hasTemplates ? (
                      <span className="text-azone-purple text-sm font-medium">
                        {categoryTemplates.length} {categoryTemplates.length === 1 ? "template" : "templates"}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">No templates</span>
                    )}
                    {hasTemplates && (
                      <ArrowRight className="w-4 h-4 text-azone-purple group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
