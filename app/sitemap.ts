import { MetadataRoute } from 'next'
import { getAllTemplates } from '@/lib/db/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paing.xyz'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic template pages
  try {
    // Check if Supabase is configured before trying to fetch templates
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://your-project-url.supabase.co') {
      // Supabase not configured, return static pages only
      console.warn('Supabase not configured, returning static pages only')
      return staticPages
    }

    const templates = await getAllTemplates()
    
    // Validate templates array
    if (!Array.isArray(templates) || templates.length === 0) {
      return staticPages
    }

    const templatePages: MetadataRoute.Sitemap = templates.map((template) => ({
      url: `${baseUrl}/templates/${template.slug}`,
      lastModified: template.updatedAt ? new Date(template.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: template.featured ? 0.9 : 0.8,
    }))

    return [...staticPages, ...templatePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if templates fail to load
    return staticPages
  }
}

