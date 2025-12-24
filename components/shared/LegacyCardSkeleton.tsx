"use client";

import { motion } from "framer-motion";

export default function LegacyCardSkeleton() {
  return (
    <div className="break-inside-avoid mb-6 relative rounded-3xl overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl"></div>
      
      <div className="relative z-10">
        {/* Image Skeleton */}
        <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-3xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-azone-purple/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Year Badge Skeleton */}
          <div className="absolute top-4 left-4 w-16 h-8 bg-gray-800/60 backdrop-blur-sm rounded-xl"></div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6">
          <div className="h-7 w-3/4 bg-gray-800/60 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-800/60 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-800/60 rounded mb-5"></div>
          <div className="flex gap-2 mb-5">
            <div className="h-7 w-20 bg-gray-800/60 rounded-full"></div>
            <div className="h-7 w-24 bg-gray-800/60 rounded-full"></div>
            <div className="h-7 w-20 bg-gray-800/60 rounded-full"></div>
          </div>
          <div className="h-12 w-full bg-gradient-to-r from-gray-800/60 to-gray-800/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

