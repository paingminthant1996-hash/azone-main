// TypeScript interfaces for Azone.store

export interface Template {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  category: string;
  featured: boolean;
  imageUrl?: string;
  screenshotUrls?: string[];
  techStack: string[];
  features: string[];
  demoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  downloadUrls?: string[];
  downloadPermission?: string;
}

export interface LegacyProject {
  id: string;
  title: string;
  description: string;
  year: number;
  imageUrl?: string;
  technologies: string[];
  projectUrl?: string;
  caseStudyUrl?: string;
  createdAt?: string;
}

export interface Purchase {
  id: string;
  templateId: string;
  customerEmail: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt?: string;
}

export interface SiteSettings {
  id: string;
  themeColor: string;
  siteName: string;
  language: string;
  isMaintenanceMode: boolean;
  // Granular Translation Fields (English)
  heroTitleEn?: string;
  heroSubtitleEn?: string;
  ctaButtonEn?: string;
  footerTextEn?: string;
  // Granular Translation Fields (Myanmar)
  heroTitleMm?: string;
  heroSubtitleMm?: string;
  ctaButtonMm?: string;
  footerTextMm?: string;
  createdAt?: string;
  updatedAt?: string;
}
