"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TemplateCard from "@/components/marketplace/TemplateCard";
import TemplateCardSkeleton from "@/components/shared/TemplateCardSkeleton";
import { getFeaturedTemplates } from "@/lib/db/queries";
import { getFeaturedTemplates as getLocalFeaturedTemplates } from "@/lib/data";
import { Template } from "@/lib/types";

export default function FeaturedTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const data = await getFeaturedTemplates();
        // Always ensure we have at least local data as fallback
        if (data.length === 0) {
          const localData = getLocalFeaturedTemplates();
          setTemplates(localData);
        } else {
          setTemplates(data);
        }
      } catch (error) {
        console.warn("Failed to load templates:", error);
        // Fallback to local data on error
        const localData = getLocalFeaturedTemplates();
        setTemplates(localData);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-azone-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.15] tracking-tight">
            <span className="text-white">Production</span>
            <span className="text-azone-purple ml-3">Templates</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Built for production. Designed for scale. Used in real-world products.
            <br />
            <span className="text-gray-500 text-base mt-1 block">
              Enterprise-grade UI kits and boilerplates.
            </span>
          </p>
        </div>

        {/* Templates Grid - Curated Collection Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 overflow-visible">
            {templates.map((template, index) => (
              <TemplateCard
                key={template.id}
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
            ))}
          </div>
        )}

        {/* View All Button - CTA */}
        <div className="text-center mt-16">
          <Link
            href="/templates"
            className="inline-block px-10 py-4 text-lg font-semibold bg-azone-purple text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}

