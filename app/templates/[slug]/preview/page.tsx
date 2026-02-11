"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTemplateDetail } from "@/lib/db/queries";
import { Template } from "@/lib/types";

export default function TemplatePreviewPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

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

  // Get demo URL - Use the template page directly (it has its own header)
  const demoUrl = template.demoUrl || `https://paing.xyz/templates/${slug}`;

  return (
    <div className="min-h-screen bg-azone-black flex flex-col relative">
      {/* Back Button Only - Fixed Position (above iframe) */}
      <div className="fixed top-4 left-2 sm:left-4 z-[100] pointer-events-none">
        <Link
          href={`/templates/${slug}`}
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-950/95 backdrop-blur-xl border border-gray-800/50 hover:bg-gray-900 text-gray-300 hover:text-white rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline sm:inline">Back</span>
        </Link>
      </div>

      {/* Full Page iframe - No padding, full screen */}
      <div className="flex-1 relative w-full h-screen">
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

    </div>
  );
}
