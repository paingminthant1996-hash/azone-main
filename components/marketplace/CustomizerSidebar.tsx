"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Type, Globe, RotateCcw } from "lucide-react";

interface CustomizerSidebarProps {
  siteName: string;
  primaryColor: string;
  headingFont: string;
  onSiteNameChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onHeadingFontChange: (value: string) => void;
  onReset: () => void;
}

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
];

export default function CustomizerSidebar({
  siteName,
  primaryColor,
  headingFont,
  onSiteNameChange,
  onPrimaryColorChange,
  onHeadingFontChange,
  onReset,
}: CustomizerSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-950/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-6 shadow-2xl shadow-black/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-azone-purple" />
          <h3 className="text-lg font-semibold text-white">Customize Preview</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-6"
        >
          {/* Site Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => onSiteNameChange(e.target.value)}
              placeholder="Enter site name"
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Palette className="w-4 h-4 text-gray-400" />
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-16 h-12 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                placeholder="#7C3AED"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1 px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all font-mono text-sm"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Choose your brand color
            </p>
          </div>

          {/* Heading Font */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Type className="w-4 h-4 text-gray-400" />
              Heading Font
            </label>
            <select
              value={headingFont}
              onChange={(e) => onHeadingFontChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
              style={{ fontFamily: headingFont }}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-gray-500">
              Font for headings and titles
            </p>
          </div>

          {/* Reset Button */}
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </motion.button>

          {/* Preview Note */}
          <div className="pt-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 text-center">
              Changes apply instantly to the preview
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
