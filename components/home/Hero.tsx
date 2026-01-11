"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function Hero() {
  const { settings, getText } = useSettings();
  const themeColor = settings?.themeColor || "#7C3AED";
  
  // Get granular translations with fallback
  const heroTitle = getText(settings?.heroTitleEn, settings?.heroTitleMm);
  const heroSubtitle = getText(settings?.heroSubtitleEn, settings?.heroSubtitleMm);
  const ctaButton = getText(settings?.ctaButtonEn, settings?.ctaButtonMm);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-azone-black">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 80%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${themeColor} 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              `radial-gradient(circle at 80% 20%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 20%, ${themeColor} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${themeColor} 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating 3D Mockup Effect */}
      <motion.div
        className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{ opacity: 0, x: 100, rotateY: -20 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          y: [0, -20, 0],
          rotateY: [-20, -25, -20],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-96 h-96 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-azone-purple/20 to-azone-purple/5 rounded-3xl backdrop-blur-xl border border-azone-purple/30 shadow-2xl shadow-azone-purple/20 transform perspective-1000">
            <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
            <div className="absolute top-8 left-8 right-8 h-32 bg-gradient-to-r from-azone-purple/30 to-transparent rounded-lg"></div>
            <div className="absolute top-48 left-8 right-8 space-y-3">
              <div className="h-4 bg-azone-purple/20 rounded w-3/4"></div>
              <div className="h-4 bg-azone-purple/10 rounded w-1/2"></div>
              <div className="h-4 bg-azone-purple/10 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-8 leading-[1.15] tracking-tight transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroTitle ? (
              heroTitle.split("\n").map((line, index) => (
                <span key={index}>
                  {index === 1 ? (
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}88, ${themeColor})`,
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    <span className="text-white">{line}</span>
                  )}
                  {index < heroTitle.split("\n").length - 1 && <br />}
                </span>
              ))
            ) : (
              <>
                <span className="text-white">Production-Ready</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}88, ${themeColor})`,
                  }}
                >
                  Launch Accelerator
                </span>
                <br />
                <span className="text-white">for Serious Builders</span>
              </>
            )}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroSubtitle ? (
              heroSubtitle.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < heroSubtitle.split("\n").length - 1 && <br />}
                </span>
              ))
            ) : (
              <>
                Built for scale. Designed for production. Used in real-world products.
                <br />
                <span className="text-gray-500 text-base mt-2 block">
                  For funded startup founders and senior engineers.
                </span>
              </>
            )}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/templates">
              <motion.button
                className="px-10 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 10px 40px ${themeColor}40`,
                  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {ctaButton || "Browse Templates"}
              </motion.button>
            </Link>
            <Link href="/case-studies">
              <motion.button
                className="px-10 py-4 text-lg font-medium bg-transparent text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-all duration-300"
                style={{
                  borderColor: "rgb(55, 65, 81)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Case Studies
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Outside content container for proper centering */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-sm">Scroll to explore</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

