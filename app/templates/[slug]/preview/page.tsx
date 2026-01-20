"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getTemplateDetail } from "@/lib/db/queries";
import { Template } from "@/lib/types";
import CustomizerSidebar from "@/components/marketplace/CustomizerSidebar";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  // Customizer state
  const [customSiteName, setCustomSiteName] = useState("My Store");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#7C3AED");
  const [customHeadingFont, setCustomHeadingFont] = useState("Inter");

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

          // Collect all images
          const images: string[] = [];
          if (templateData.imageUrl) images.push(templateData.imageUrl);
          if (templateData.screenshotUrls) images.push(...templateData.screenshotUrls);
          setAllImages(images);
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

  // Apply customizations via useEffect
  useEffect(() => {
    // Set CSS variables for customizations
    document.documentElement.style.setProperty('--custom-primary-color', customPrimaryColor);
    document.documentElement.style.setProperty('--custom-heading-font', customHeadingFont);
    
    return () => {
      // Cleanup on unmount
      document.documentElement.style.removeProperty('--custom-primary-color');
      document.documentElement.style.removeProperty('--custom-heading-font');
    };
  }, [customPrimaryColor, customHeadingFont]);

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

  return (
    <div className="min-h-screen bg-azone-black">
      {/* Header with Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          href={`/templates/${slug}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Template Details
        </Link>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Header */}
            <div className="bg-gray-950/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 
                    className="text-3xl font-semibold text-white mb-2"
                    style={{ fontFamily: customHeadingFont }}
                  >
                    {customSiteName || template.title}
                  </h1>
                  <p className="text-gray-400 text-sm">{template.title} - Live Preview</p>
                </div>
                {template.demoUrl && (
                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Demo
                  </a>
                )}
              </div>
            </div>

            {/* Preview Gallery */}
            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold text-white"
                style={{ fontFamily: customHeadingFont }}
              >
                Gallery
              </h2>

              {/* Main Preview Image */}
              <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-gray-950 border border-gray-800/50">
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[selectedImage]}
                    alt={`${template.title} - Preview ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No preview images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-azone-purple"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                      style={{
                        borderColor: selectedImage === index ? customPrimaryColor : undefined
                      }}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Customizer Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CustomizerSidebar
                siteName={customSiteName}
                primaryColor={customPrimaryColor}
                headingFont={customHeadingFont}
                onSiteNameChange={setCustomSiteName}
                onPrimaryColorChange={setCustomPrimaryColor}
                onHeadingFontChange={setCustomHeadingFont}
                onReset={() => {
                  setCustomSiteName("My Store");
                  setCustomPrimaryColor("#7C3AED");
                  setCustomHeadingFont("Inter");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply custom styles */}
      <style jsx global>{`
        :root {
          --custom-primary-color: ${customPrimaryColor};
          --custom-heading-font: ${customHeadingFont};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--custom-heading-font), sans-serif;
        }
      `}</style>
    </div>
  );
}
