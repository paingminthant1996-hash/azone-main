import { notFound } from "next/navigation";
import { Suspense } from "react";
import TemplateDetail from "@/components/marketplace/TemplateDetail";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getTemplateBySlugDB } from "@/lib/db/queries";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlugDB(slug);

  if (!template) {
    return {
      title: "Template Not Found - Azone.store",
    };
  }

  return {
    title: `${template.title} - Azone.store`,
    description: template.shortDescription || template.description,
  };
}

export default async function TemplatePage({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlugDB(slug);

  if (!template) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TemplateDetail template={template} />
    </Suspense>
  );
}

