"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, Settings, Save, Palette, Globe, FileText, Type } from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    themeColor: "#3b82f6",
    siteName: "My Store",
    language: "en",
    // Granular Translation Fields (English)
    heroTitleEn: "",
    heroSubtitleEn: "",
    ctaButtonEn: "",
    footerTextEn: "",
    // Granular Translation Fields (Myanmar)
    heroTitleMm: "",
    heroSubtitleMm: "",
    ctaButtonMm: "",
    footerTextMm: "",
  });

  // Fetch current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();
        setSettings(data);
        setFormData({
          themeColor: data.themeColor || "#3b82f6",
          siteName: data.siteName || "My Store",
          language: data.language || "en",
          heroTitleEn: data.heroTitleEn || "",
          heroSubtitleEn: data.heroSubtitleEn || "",
          ctaButtonEn: data.ctaButtonEn || "",
          footerTextEn: data.footerTextEn || "",
          heroTitleMm: data.heroTitleMm || "",
          heroSubtitleMm: data.heroSubtitleMm || "",
          ctaButtonMm: data.ctaButtonMm || "",
          footerTextMm: data.footerTextMm || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      const data = await response.json();
      setSettings(data);
      setSuccess("Settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-azone-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-azone-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-azone-purple" />
              <h1 className="text-4xl font-bold text-white">Site Settings</h1>
            </div>
            <p className="text-gray-400">Manage global site settings and preferences</p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Error</p>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400">{success}</p>
          </motion.div>
        )}

        {/* Dashboard Grid */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-azone-purple/20 rounded-lg">
                  <Palette className="w-5 h-5 text-azone-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white">Theme Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Theme Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => handleChange("themeColor", e.target.value)}
                      className="w-20 h-12 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      value={formData.themeColor}
                      onChange={(e) => handleChange("themeColor", e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                      placeholder="#3b82f6"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      title="Enter a valid hex color code (e.g., #3b82f6)"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose the primary theme color for your site
                  </p>
                </div>
              </div>
            </motion.div>

            {/* General Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-azone-purple/20 rounded-lg">
                  <Globe className="w-5 h-5 text-azone-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white">General Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Site Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                    placeholder="My Store"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The name of your site displayed throughout the platform
                  </p>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                    required
                  >
                    <option value="en">English</option>
                    <option value="my">Myanmar</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the default language for your site
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content Management Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-azone-purple/20 rounded-lg">
                <FileText className="w-5 h-5 text-azone-purple" />
              </div>
              <h2 className="text-xl font-semibold text-white">Content Management</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Manage content translations for different sections of your site. Provide both English and Myanmar translations side by side.
            </p>

            <div className="space-y-6">
              {/* Hero Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Hero Title
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">English</label>
                    <textarea
                      value={formData.heroTitleEn}
                      onChange={(e) => handleChange("heroTitleEn", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="Production-Ready&#10;Launch Accelerator&#10;for Serious Builders"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Myanmar</label>
                    <textarea
                      value={formData.heroTitleMm}
                      onChange={(e) => handleChange("heroTitleMm", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="ထုတ်လုပ်ရန်အဆင်သင့်&#10;လွှတ်တင်ရေးအရှိန်မြှင့်စက်&#10;စိတ်ရင်းဖြင့်တည်ဆောက်သူများအတွက်"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Hero Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Hero Subtitle
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">English</label>
                    <textarea
                      value={formData.heroSubtitleEn}
                      onChange={(e) => handleChange("heroSubtitleEn", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="Built for scale. Designed for production. Used in real-world products.&#10;For funded startup founders and senior engineers."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Myanmar</label>
                    <textarea
                      value={formData.heroSubtitleMm}
                      onChange={(e) => handleChange("heroSubtitleMm", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="အတိုင်းအတာအတွက်တည်ဆောက်ထားသည်။ ထုတ်လုပ်ရန်အတွက်ဒီဇိုင်းထုတ်ထားသည်။"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  CTA Button Text
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">English</label>
                    <input
                      type="text"
                      value={formData.ctaButtonEn}
                      onChange={(e) => handleChange("ctaButtonEn", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                      placeholder="Browse Templates"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Myanmar</label>
                    <input
                      type="text"
                      value={formData.ctaButtonMm}
                      onChange={(e) => handleChange("ctaButtonMm", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                      placeholder="ပုံစံများကြည့်ရှုရန်"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Footer Description
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">English</label>
                    <textarea
                      value={formData.footerTextEn}
                      onChange={(e) => handleChange("footerTextEn", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="Production-ready templates built for scale. Designed for funded startup founders and senior engineers."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Myanmar</label>
                    <textarea
                      value={formData.footerTextMm}
                      onChange={(e) => handleChange("footerTextMm", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all resize-none"
                      placeholder="အတိုင်းအတာအတွက်တည်ဆောက်ထားသောထုတ်လုပ်ရန်အဆင်သင့်ပုံစံများ။"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-azone-purple hover:bg-azone-purple/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-azone-purple/20"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
