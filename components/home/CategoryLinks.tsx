"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart, ShoppingCart, Rocket, Shield, Palette, Database } from "lucide-react";
import { getAllTemplates } from "@/lib/db/queries";
import { Template } from "@/lib/types";
import TemplateCardSkeleton from "@/components/shared/TemplateCardSkeleton";

// Lazy load TemplateCard for code splitting
const TemplateCard = lazy(() => import("@/components/marketplace/TemplateCard"));

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

export default function CategoryLinks() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [templatesByCategory, setTemplatesByCategory] = useState<Record<string, Template[]>>({});

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const data = await getAllTemplates();
        setTemplates(data);

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

        {/* Categories with Templates */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const categoryTemplates = templatesByCategory[category.slug] || [];
            const hasTemplates = categoryTemplates.length > 0;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-8"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  {hasTemplates && (
                    <Link
                      href={`/templates?category=${category.slug}`}
                      className="flex items-center gap-2 text-azone-purple hover:text-azone-purple/80 text-sm font-medium transition-colors group"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Templates Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {[1, 2, 3].map((i) => (
                      <TemplateCardSkeleton key={i} />
                    ))}
                  </div>
                ) : hasTemplates ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {categoryTemplates.slice(0, 3).map((template, index) => (
                      <Suspense key={template.id} fallback={<TemplateCardSkeleton />}>
                        <TemplateCard
                          id={template.id}
                          title={template.title}
                          category={template.category}
                          price={template.price}
                          techStack={template.techStack}
                          imageUrl={template.imageUrl}
                          slug={template.slug}
                          updatedAt={template.updatedAt}
                          featured={template.featured}
                          index={index}
                        />
                      </Suspense>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                    <p className="text-gray-500">No templates in this category yet</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
