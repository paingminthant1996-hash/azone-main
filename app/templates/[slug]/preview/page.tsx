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
      {/* Back Button - Fixed Top Left Corner */}
      <Link
        href={`/templates/${slug}`}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-3 bg-gray-950/90 backdrop-blur-xl border border-gray-800/50 hover:bg-gray-900 text-gray-300 hover:text-white rounded-xl transition-all text-sm shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden lg:inline">Back</span>
      </Link>

      {/* Save & Download Button - Fixed Top Right Corner */}
      <motion.button
        onClick={handleSave}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-azone-purple hover:bg-purple-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-azone-purple/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="w-4 h-4" />
        <span className="hidden lg:inline">Save & Download</span>
      </motion.button>

      {/* Full Page iframe */}
      <div className="flex-1 relative">
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
          className="w-full h-screen border-0"
          title="Template Live Preview"
          onLoad={() => setIframeLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
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
                  <p className="text-gray-400 text-sm">Your configuration has been saved.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Save Template</h3>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                      <h4 className="text-sm font-medium text-white mb-2">Template Info</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Name: <span className="text-white">{template.title}</span></li>
                        <li>• Category: <span className="text-white">{template.category}</span></li>
                        <li>• Price: <span className="text-white">{template.price === 0 ? 'Free' : `$${template.price}`}</span></li>
                      </ul>
                    </div>

                    <p className="text-sm text-gray-400">
                      Download the template configuration file. This can be used when setting up your project.
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
