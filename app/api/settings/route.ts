import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SiteSettings } from "@/lib/types";

// Initialize Supabase admin client for database operations
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Check if user is admin (server-side)
async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // No-op for read-only operations
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    // Check if user is admin via metadata
    if (user.user_metadata?.role === "admin") {
      return true;
    }

    // Check admin emails from environment variable
    const adminEmails =
      process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
      [];
    if (user.email && adminEmails.includes(user.email)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Transform database row to SiteSettings interface
function transformSiteSettings(row: any): SiteSettings {
  return {
    id: row.id,
    themeColor: row.theme_color || "#3b82f6",
    siteName: row.site_name || "My Store",
    language: row.language || "en",
    isMaintenanceMode: row.is_maintenance_mode || false,
    // Granular Translation Fields (English)
    heroTitleEn: row.hero_title_en,
    heroSubtitleEn: row.hero_subtitle_en,
    ctaButtonEn: row.cta_button_en,
    footerTextEn: row.footer_text_en,
    // Granular Translation Fields (Myanmar)
    heroTitleMm: row.hero_title_mm,
    heroSubtitleMm: row.hero_subtitle_mm,
    ctaButtonMm: row.cta_button_mm,
    footerTextMm: row.footer_text_mm,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET - Fetch site settings
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Get the first (and should be only) row from site_settings
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If table doesn't exist or no rows, return default settings
      if (error.code === "PGRST116" || error.code === "42P01") {
        return NextResponse.json({
          themeColor: "#3b82f6",
          siteName: "My Store",
          language: "en",
          isMaintenanceMode: false,
        });
      }
      console.error("Error fetching site settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch site settings" },
        { status: 500 }
      );
    }

    if (!data) {
      // Return default settings if no data exists
      return NextResponse.json({
        themeColor: "#3b82f6",
        siteName: "My Store",
        language: "en",
        isMaintenanceMode: false,
      });
    }

    return NextResponse.json(transformSiteSettings(data));
  } catch (error: any) {
    console.error("GET site settings error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PATCH - Update site settings (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      themeColor,
      siteName,
      language,
      isMaintenanceMode,
      heroTitleEn,
      heroSubtitleEn,
      ctaButtonEn,
      footerTextEn,
      heroTitleMm,
      heroSubtitleMm,
      ctaButtonMm,
      footerTextMm,
    } = body;

    // Validate input
    const updates: any = {};
    if (themeColor !== undefined) {
      if (typeof themeColor !== "string" || themeColor.length > 50) {
        return NextResponse.json(
          { error: "Invalid themeColor. Must be a string with max 50 characters." },
          { status: 400 }
        );
      }
      updates.theme_color = themeColor;
    }
    if (siteName !== undefined) {
      if (typeof siteName !== "string" || siteName.length > 255) {
        return NextResponse.json(
          { error: "Invalid siteName. Must be a string with max 255 characters." },
          { status: 400 }
        );
      }
      updates.site_name = siteName;
    }
    if (language !== undefined) {
      if (typeof language !== "string" || language.length > 10) {
        return NextResponse.json(
          { error: "Invalid language. Must be a string with max 10 characters." },
          { status: 400 }
        );
      }
      updates.language = language;
    }
    if (isMaintenanceMode !== undefined) {
      if (typeof isMaintenanceMode !== "boolean") {
        return NextResponse.json(
          { error: "Invalid isMaintenanceMode. Must be a boolean." },
          { status: 400 }
        );
      }
      updates.is_maintenance_mode = isMaintenanceMode;
    }
    // Granular Translation Fields (English)
    if (heroTitleEn !== undefined) {
      updates.hero_title_en = heroTitleEn;
    }
    if (heroSubtitleEn !== undefined) {
      updates.hero_subtitle_en = heroSubtitleEn;
    }
    if (ctaButtonEn !== undefined) {
      updates.cta_button_en = ctaButtonEn;
    }
    if (footerTextEn !== undefined) {
      updates.footer_text_en = footerTextEn;
    }
    // Granular Translation Fields (Myanmar)
    if (heroTitleMm !== undefined) {
      updates.hero_title_mm = heroTitleMm;
    }
    if (heroSubtitleMm !== undefined) {
      updates.hero_subtitle_mm = heroSubtitleMm;
    }
    if (ctaButtonMm !== undefined) {
      updates.cta_button_mm = ctaButtonMm;
    }
    if (footerTextMm !== undefined) {
      updates.footer_text_mm = footerTextMm;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if a row exists
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing row
      const { data, error } = await supabase
        .from("site_settings")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating site settings:", error);
        return NextResponse.json(
          { error: `Failed to update site settings: ${error.message}` },
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Insert new row with defaults
      const defaultSettings = {
        theme_color: updates.theme_color || "#3b82f6",
        site_name: updates.site_name || "My Store",
        language: updates.language || "en",
        is_maintenance_mode: updates.is_maintenance_mode || false,
      };

      const { data, error } = await supabase
        .from("site_settings")
        .insert(defaultSettings)
        .select()
        .single();

      if (error) {
        console.error("Error creating site settings:", error);
        return NextResponse.json(
          { error: `Failed to create site settings: ${error.message}` },
          { status: 500 }
        );
      }
      result = data;
    }

    // Revalidate paths to refresh cached data
    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/api/settings");

    return NextResponse.json(transformSiteSettings(result));
  } catch (error: any) {
    console.error("PATCH site settings error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
