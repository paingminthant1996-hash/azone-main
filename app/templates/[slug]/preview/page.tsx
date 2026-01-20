"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Check,
  X
} from "lucide-react";
import Link from "next/link";
import { getTemplateDetail } from "@/lib/db/queries";
import { Template } from "@/lib/types";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

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

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleDownload = () => {
    // Create configuration JSON
    const config = {
      templateSlug: slug,
      templateTitle: template?.title,
      exportedAt: new Date().toISOString(),
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-config.json`;
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
      {/* Floating Buttons Bar - Responsive */}
      <div className="fixed top-16 sm:top-20 left-2 sm:left-4 right-2 sm:right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Back Button - Left */}
        <Link
          href={`/templates/${slug}`}
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-950/95 backdrop-blur-xl border border-gray-800/50 hover:bg-gray-900 text-gray-300 hover:text-white rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline sm:inline">Back</span>
        </Link>

        {/* Save & Download Button - Right */}
        <motion.button
          onClick={handleSave}
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-azone-purple hover:bg-purple-600 text-white rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium shadow-lg shadow-azone-purple/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Save & Download</span>
          <Download className="w-3.5 h-3.5 sm:hidden" />
        </motion.button>
      </div>

      {/* Full Page iframe - Responsive */}
      <div className="flex-1 relative pt-0">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
            <div className="text-center px-4">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">Loading demo...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={demoUrl}
          className="w-full h-screen min-h-[100dvh] border-0"
          title="Template Live Preview"
          onLoad={() => setIframeLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ height: '100dvh' }}
        />
      </div>

      {/* Save/Download Modal - Responsive */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            onClick={() => !saveSuccess && setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-950 border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              {saveSuccess ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Downloaded!</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Your configuration has been saved.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Save Template</h3>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                      <h4 className="text-xs sm:text-sm font-medium text-white mb-2">Template Info</h4>
                      <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                        <li>• Name: <span className="text-white">{template.title}</span></li>
                        <li>• Category: <span className="text-white">{template.category}</span></li>
                        <li>• Price: <span className="text-white">{template.price === 0 ? 'Free' : `$${template.price}`}</span></li>
                      </ul>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400">
                      Download the template configuration file.
                    </p>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg sm:rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleDownload}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-azone-purple hover:bg-purple-600 text-white rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Download
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
