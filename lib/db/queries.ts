// Database query functions - Supabase integration
import { Template, LegacyProject } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { templates, legacyProjects, getTemplateBySlug } from "../data";

// Helper function to transform database row to Template
function transformTemplate(row: any): Template {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description || undefined,
    price: parseFloat(row.price),
    category: row.category,
    featured: row.featured || false,
    imageUrl: row.preview_image_url || undefined,
    screenshotUrls: row.screenshot_urls || [],
    techStack: row.tech_stack || [],
    features: row.features || [],
    demoUrl: row.demo_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper function to transform database row to LegacyProject
function transformLegacyProject(row: any): LegacyProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    year: row.year,
    imageUrl: row.image_url || undefined,
    technologies: row.technologies || [],
    projectUrl: row.project_url || undefined,
    caseStudyUrl: row.case_study_url || undefined,
    createdAt: row.created_at,
  };
}

/**
 * Get all templates from Supabase (or fallback to local data)
 */
export async function getAllTemplates(): Promise<Template[]> {
  // Fallback to local data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return templates;
  }

  try {
    const { data, error } = await supabase!
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Only log if it's not a common/expected error
      if (error.code !== "PGRST301" && error.code !== "42P01") {
        console.warn("Error fetching templates:", error.message || error);
      }
      // Fallback to local data on error
      return templates;
    }

    return data ? data.map(transformTemplate) : templates;
  } catch (error) {
    // Only log unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage && !errorMessage.includes("fetch")) {
      console.warn("Failed to fetch templates:", errorMessage);
    }
    // Fallback to local data on error
    return templates;
  }
}

/**
 * Get featured templates from Supabase (or fallback to local data)
 */
export async function getFeaturedTemplates(): Promise<Template[]> {
  // Fallback to local data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return templates.filter((t) => t.featured);
  }

  try {
    const { data, error } = await supabase!
      .from("templates")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      // Only log if it's not a common/expected error (like RLS or missing table)
      if (error.code !== "PGRST301" && error.code !== "42P01") {
        console.warn("Error fetching featured templates:", error.message || error);
      }
      // Fallback to local data on error
      return templates.filter((t) => t.featured);
    }

    return data ? data.map(transformTemplate) : templates.filter((t) => t.featured);
  } catch (error) {
    // Only log unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage && !errorMessage.includes("fetch")) {
      console.warn("Failed to fetch featured templates:", errorMessage);
    }
    // Fallback to local data on error
    return templates.filter((t) => t.featured);
  }
}

/**
 * Get template by slug from Supabase (or fallback to local data)
 */
export async function getTemplateBySlugDB(
  slug: string
): Promise<Template | null> {
  // Fallback to local data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return getTemplateBySlug(slug) || null;
  }

  try {
    const { data, error } = await supabase!
      .from("templates")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned, try local data
        return getTemplateBySlug(slug) || null;
      }
      console.error("Error fetching template:", error);
      // Fallback to local data
      return getTemplateBySlug(slug) || null;
    }

    return data ? transformTemplate(data) : getTemplateBySlug(slug) || null;
  } catch (error) {
    console.error("Failed to fetch template:", error);
    // Fallback to local data
    return getTemplateBySlug(slug) || null;
  }
}

/**
 * Get all legacy projects from Supabase (or fallback to local data)
 */
export async function getAllLegacyProjects(): Promise<LegacyProject[]> {
  // Fallback to local data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return legacyProjects;
  }

  try {
    // Try to fetch with year ordering first, fallback to created_at if year column doesn't exist
    let query = supabase!
      .from("legacy_projects")
      .select("*");
    
    // Try ordering by created_at first (more reliable), then by year if needed
    const { data, error } = await query
      .order("created_at", { ascending: false });

    if (error) {
      // If created_at fails, try year as fallback
      if (error.code === "42703" || error.message?.includes("column") || error.message?.includes("created_at")) {
        const { data: dataYear, error: errorYear } = await supabase!
          .from("legacy_projects")
          .select("*")
          .order("year", { ascending: false });
        
        if (errorYear) {
          // If both fail, just get data without ordering
          const { data: dataNoOrder, error: errorNoOrder } = await supabase!
            .from("legacy_projects")
            .select("*");
          
          if (errorNoOrder) {
            // Only log if it's not a common/expected error (missing table, RLS)
            if (errorNoOrder.code !== "PGRST301" && errorNoOrder.code !== "42P01") {
              console.warn("Error fetching legacy projects:", errorNoOrder.message || errorNoOrder);
            }
            return legacyProjects;
          }
          return dataNoOrder ? dataNoOrder.map(transformLegacyProject) : legacyProjects;
        }
        return dataYear ? dataYear.map(transformLegacyProject) : legacyProjects;
      }
      
      // Only log if it's not a common/expected error
      if (error.code !== "PGRST301" && error.code !== "42P01") {
        console.warn("Error fetching legacy projects:", error.message || error);
      }
      // Fallback to local data on error
      return legacyProjects;
    }

    return data ? data.map(transformLegacyProject) : legacyProjects;
  } catch (error) {
    // Only log unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage && !errorMessage.includes("fetch")) {
      console.warn("Failed to fetch legacy projects:", errorMessage);
    }
    // Fallback to local data on error
    return legacyProjects;
  }
}

/**
 * Create a purchase record in Supabase
 */
export async function createPurchase(
  templateId: string,
  customerEmail: string,
  transactionId: string,
  amount: number
): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }

  try {
    const { error } = await supabase.from("purchases").insert({
      template_id: templateId,
      customer_email: customerEmail,
      transaction_id: transactionId,
      amount: amount,
      status: "completed",
    });

    if (error) {
      console.error("Error creating purchase:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to create purchase:", error);
    throw error;
  }
}

/**
 * Get template detail with demos and versions from Supabase
 * Returns template with joined demos and template_versions data
 */
export async function getTemplateDetail(slug: string): Promise<any | null> {
  if (!isSupabaseConfigured() || !supabase) {
    // Fallback to local data
    return getTemplateBySlug(slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("templates")
      .select(`
        *,
        demos:default_demo_id (
          demo_url,
          host_type,
          allow_embed
        ),
        template_versions (
          id,
          version,
          is_public
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned, try local data
        return getTemplateBySlug(slug) || null;
      }
      console.error("Error fetching template detail:", error);
      // Fallback to local data
      return getTemplateBySlug(slug) || null;
    }

    return data || getTemplateBySlug(slug) || null;
  } catch (error) {
    console.error("Failed to fetch template detail:", error);
    // Fallback to local data
    return getTemplateBySlug(slug) || null;
  }
}

/**
 * Get template with demos (alternative function)
 */
export async function getTemplateWithDemos(slug: string): Promise<any | null> {
  return getTemplateDetail(slug);
}

/**
 * Request download source URL from Next.js API route
 * This calls the /api/download endpoint with user's access token
 */
export async function requestDownloadSource(
  versionId: string,
  accessToken: string
): Promise<{ url?: string; expires_in?: number; error?: string }> {
  try {
    // Get API base URL (works in both client and server)
    const apiBase =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${apiBase}/api/download?version_id=${versionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
      console.error("Download request failed:", res.status, errorData);
      return { error: errorData.error || "download_failed" };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to request download source:", error);
    return { error: "network_error" };
  }
}

