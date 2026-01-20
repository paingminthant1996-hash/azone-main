"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Eye, 
  ExternalLink, 
  Download, 
  Save, 
  RotateCcw,
  Palette,
  Type,
  Globe,
  ToggleLeft,
  ToggleRight,
  FileText,
  Layout,
  Image as ImageIcon,
  Mail,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from "lucide-react";
import Link from "next/link";
import { getTemplateDetail } from "@/lib/db/queries";
import { Template } from "@/lib/types";

// Font options
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

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Customizer state
  const [customSiteName, setCustomSiteName] = useState("My Store");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#7C3AED");
  const [customHeadingFont, setCustomHeadingFont] = useState("Inter");
  
  // Content editor state
  const [customHeading, setCustomHeading] = useState("Next-Gen SaaS Templates");
  const [customSubheading, setCustomSubheading] = useState("Launch your startup faster with production-ready templates");

  // Section toggles
  const [showHeroSection, setShowHeroSection] = useState(true);
  const [showGallerySection, setShowGallerySection] = useState(true);
  const [showContactSection, setShowContactSection] = useState(true);

  // Panel expansion state
  const [expandedPanels, setExpandedPanels] = useState({
    branding: true,
    sections: false,
    content: false,
  });

  // Save/Download modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch template data
  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true);
        const templateDetail = await getTemplateDetail(slug);
        if (templateDetail) {
          const templateData: Template = {
            id: templateDetail.id,
            slug: templateDetail.slug,
            title: templateDetail.title,
            description: templateDetail.description,
            shortDescription: templateDetail.short_description,
            price: parseFloat(templateDetail.price || 0),
            category: templateDetail.category,
            featured: templateDetail.featured || false,
            imageUrl: templateDetail.preview_image_url,
            screenshotUrls: templateDetail.screenshot_urls || [],
            techStack: templateDetail.tech_stack || [],
            features: templateDetail.features || [],
            demoUrl: templateDetail.demo_url,
            createdAt: templateDetail.created_at,
            updatedAt: templateDetail.updated_at,
            downloadUrls: templateDetail.download_urls || [],
            downloadPermission: templateDetail.download_permission || 'purchase',
          };
          setTemplate(templateData);
        }
      } catch (error) {
        console.error("Failed to load template:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchTemplate();
    }
  }, [slug]);

  // Send customization to iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const customization = {
        type: 'CUSTOMIZATION_UPDATE',
        data: {
          siteName: customSiteName,
          primaryColor: customPrimaryColor,
          headingFont: customHeadingFont,
          heading: customHeading,
          subheading: customSubheading,
          sections: {
            hero: showHeroSection,
            gallery: showGallerySection,
            contact: showContactSection,
          }
        }
      };
      iframeRef.current.contentWindow.postMessage(customization, '*');
    }
  }, [customSiteName, customPrimaryColor, customHeadingFont, customHeading, customSubheading, showHeroSection, showGallerySection, showContactSection]);

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const handleReset = () => {
    setCustomSiteName("My Store");
    setCustomPrimaryColor("#7C3AED");
    setCustomHeadingFont("Inter");
    setCustomHeading("Next-Gen SaaS Templates");
    setCustomSubheading("Launch your startup faster with production-ready templates");
    setShowHeroSection(true);
    setShowGallerySection(true);
    setShowContactSection(true);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleDownload = () => {
    // Create configuration JSON
    const config = {
      siteName: customSiteName,
      primaryColor: customPrimaryColor,
      headingFont: customHeadingFont,
      content: {
        heading: customHeading,
        subheading: customSubheading,
      },
      sections: {
        hero: showHeroSection,
        gallery: showGallerySection,
        contact: showContactSection,
      },
      exportedAt: new Date().toISOString(),
      templateSlug: slug,
      templateTitle: template?.title,
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-customization.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveModal(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-azone-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-azone-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Template not found</h1>
          <Link href="/templates" className="text-azone-purple hover:underline">
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  // Get demo URL
  const demoUrl = template.demoUrl || `https://paing.xyz/templates/${slug}`;

  return (
    <div className="min-h-screen bg-azone-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href={`/templates/${slug}`}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Details</span>
          </Link>
          <div className="hidden md:block">
            <h1 className="text-white font-semibold">{template.title}</h1>
            <p className="text-gray-500 text-xs">Live Preview & Customizer</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-azone-purple hover:bg-purple-600 text-white rounded-lg transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>Save & Download</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left - iframe Preview */}
        <div className="flex-1 relative bg-gray-900">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
                <p className="text-gray-400">Loading demo...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={demoUrl}
            className="w-full h-full border-0"
            title="Template Live Preview"
            onLoad={() => setIframeLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Right - Customizer Panel */}
        <div className="w-80 lg:w-96 bg-gray-950/95 backdrop-blur-xl border-l border-gray-800/50 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Panel Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-800/50">
              <Palette className="w-5 h-5 text-azone-purple" />
              <h2 className="text-lg font-semibold text-white">Customize Preview</h2>
            </div>

            {/* Branding Section */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => togglePanel('branding')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-azone-purple" />
                  <span className="text-white font-medium">Branding</span>
                </div>
                {expandedPanels.branding ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedPanels.branding && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 space-y-4"
                  >
                    {/* Site Name */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Site Name</label>
                      <input
                        type="text"
                        value={customSiteName}
                        onChange={(e) => setCustomSiteName(e.target.value)}
                        placeholder="Enter site name"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Primary Color */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customPrimaryColor}
                          onChange={(e) => setCustomPrimaryColor(e.target.value)}
                          className="w-12 h-10 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customPrimaryColor}
                          onChange={(e) => setCustomPrimaryColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-azone-purple"
                        />
                      </div>
                    </div>

                    {/* Heading Font */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Heading Font</label>
                      <select
                        value={customHeadingFont}
                        onChange={(e) => setCustomHeadingFont(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-azone-purple"
                        style={{ fontFamily: customHeadingFont }}
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section Toggles */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => togglePanel('sections')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-azone-purple" />
                  <span className="text-white font-medium">Section Toggles</span>
                </div>
                {expandedPanels.sections ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedPanels.sections && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 space-y-3"
                  >
                    {/* Hero Section Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Hero Section</span>
                      </div>
                      <button
                        onClick={() => setShowHeroSection(!showHeroSection)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          showHeroSection ? 'bg-azone-purple' : 'bg-gray-700'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ left: showHeroSection ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    </div>

                    {/* Gallery Section Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Gallery Section</span>
                      </div>
                      <button
                        onClick={() => setShowGallerySection(!showGallerySection)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          showGallerySection ? 'bg-azone-purple' : 'bg-gray-700'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ left: showGallerySection ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    </div>

                    {/* Contact Section Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Contact Section</span>
                      </div>
                      <button
                        onClick={() => setShowContactSection(!showContactSection)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          showContactSection ? 'bg-azone-purple' : 'bg-gray-700'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ left: showContactSection ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Editor */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => togglePanel('content')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-azone-purple" />
                  <span className="text-white font-medium">Content Editor</span>
                </div>
                {expandedPanels.content ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {expandedPanels.content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 space-y-4"
                  >
                    {/* Heading */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Main Heading</label>
                      <input
                        type="text"
                        value={customHeading}
                        onChange={(e) => setCustomHeading(e.target.value)}
                        placeholder="Enter heading"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple text-sm"
                      />
                    </div>

                    {/* Subheading */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Subheading</label>
                      <textarea
                        value={customSubheading}
                        onChange={(e) => setCustomSubheading(e.target.value)}
                        placeholder="Enter subheading"
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple text-sm resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-azone-purple/10 border border-azone-purple/30 rounded-xl">
              <p className="text-xs text-gray-400 text-center">
                💡 Changes apply instantly to the preview. Click <strong className="text-white">Save & Download</strong> to export your customization settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save/Download Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !saveSuccess && setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-950 border border-gray-800 rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {saveSuccess ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Downloaded!</h3>
                  <p className="text-gray-400 text-sm">Your customization settings have been saved.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Save Customization</h3>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                      <h4 className="text-sm font-medium text-white mb-2">Your Settings</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Site Name: <span className="text-white">{customSiteName}</span></li>
                        <li>• Primary Color: <span className="text-white">{customPrimaryColor}</span></li>
                        <li>• Heading Font: <span className="text-white">{customHeadingFont}</span></li>
                        <li>• Hero: <span className="text-white">{showHeroSection ? 'Visible' : 'Hidden'}</span></li>
                        <li>• Gallery: <span className="text-white">{showGallerySection ? 'Visible' : 'Hidden'}</span></li>
                        <li>• Contact: <span className="text-white">{showContactSection ? 'Visible' : 'Hidden'}</span></li>
                      </ul>
                    </div>

                    <p className="text-sm text-gray-400">
                      Download your customization as a JSON file. You can use this to apply your settings when setting up the template.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleDownload}
                      className="flex-1 px-4 py-3 bg-azone-purple hover:bg-purple-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Download Config
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
