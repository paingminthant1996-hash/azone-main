"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import { getAllLegacyProjects } from "@/lib/db/queries";
import { getAllLegacyProjects as getLocalLegacyProjects } from "@/lib/data";
import { LegacyProject } from "@/lib/types";
import LegacyCardSkeleton from "@/components/shared/LegacyCardSkeleton";

export default function LegacyCollection() {
  const [projects, setProjects] = useState<LegacyProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getAllLegacyProjects();
        // Always ensure we have at least local data as fallback
        if (data.length === 0) {
          const localData = getLocalLegacyProjects();
          setProjects(localData);
        } else {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load legacy projects:", error);
        // Fallback to local data on error
        const localData = getLocalLegacyProjects();
        setProjects(localData);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-azone-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.15] tracking-tight">
            <span className="text-white">Case</span>
            <span className="text-azone-purple ml-3">Studies</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-world implementations. Production deployments. Proven results.
            <br />
            <span className="text-gray-500 text-base mt-1 block">
              Past projects that demonstrate our approach to building at scale.
            </span>
          </p>
        </div>

        {/* Masonry Grid Layout - Always show projects (local fallback ensures this) */}
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <LegacyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project, index) => (
              <LegacyCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/case-studies">
            <motion.button
              className="inline-block px-10 py-4 text-lg font-semibold bg-azone-purple text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface LegacyCardProps {
  project: LegacyProject;
  index: number;
}

function LegacyCard({ project, index }: LegacyCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the button (it has its own link)
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    // Link to case studies page
    router.push("/case-studies");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={handleCardClick}
      className="break-inside-avoid mb-6 group relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95 backdrop-blur-2xl border border-gray-800/60 rounded-3xl group-hover:border-gray-700/80 transition-all duration-500 shadow-2xl shadow-black/50"></div>

      {/* Border Glow Effect - Only on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-azone-purple/20 via-azone-purple/10 to-azone-purple/20 blur-2xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          {project.imageUrl && !imageError ? (
            <>
              <img
                src={project.imageUrl}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/30 via-gray-800/20 to-transparent">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800/40 to-gray-800/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-gray-700/30">
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Year Badge with Glassmorphism */}
          <motion.div
            className="absolute top-4 left-4 backdrop-blur-md bg-gray-800/90 border border-gray-700/50 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="w-4 h-4" />
            {project.year}
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies with Enhanced Styling */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-3 py-1.5 text-xs font-medium bg-gray-800/50 backdrop-blur-sm text-gray-300 rounded-full border border-gray-700/40 hover:border-gray-600/60 hover:text-gray-200 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1.5 text-xs font-medium bg-gray-800/50 backdrop-blur-sm text-gray-500 rounded-full border border-gray-700/40">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* View Showcase Button - CTA with Purple */}
          <Link href="/case-studies">
            <motion.button
              className="w-full py-3.5 px-4 bg-azone-purple text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50 flex items-center justify-center gap-2 group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Showcase
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

