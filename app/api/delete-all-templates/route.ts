import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Delete All Templates API Route
 * 
 * This route deletes all templates from the Supabase database.
 * 
 * Security: Should be protected with admin authentication in production.
 * 
 * Usage: POST /api/delete-all-templates
 * Headers: x-admin-secret: [your-secret-key]
 */

const ADMIN_SECRET = process.env.ADMIN_DELETE_SECRET || "delete-all-templates-secret";

export async function POST(request: NextRequest) {
  try {
    // Check admin secret
    const secret = request.headers.get("x-admin-secret");
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized. Admin secret required." },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Delete all templates
    // First get all template IDs
    const { data: allTemplates, error: fetchError } = await supabase
      .from("templates")
      .select("id");

    if (fetchError) {
      console.error("Error fetching templates:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch templates", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!allTemplates || allTemplates.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No templates to delete",
        deletedCount: 0,
      });
    }

    // Delete all templates by IDs
    const templateIds = allTemplates.map(t => t.id);
    const deletedCount = templateIds.length;
    
    const { error } = await supabase
      .from("templates")
      .delete()
      .in("id", templateIds);

    if (error) {
      console.error("Error deleting templates:", error);
      return NextResponse.json(
        { error: "Failed to delete templates", details: error.message },
        { status: 500 }
      );
    }

    // Also delete template versions if they exist
    try {
      const { data: versions } = await supabase.from("template_versions").select("id");
      if (versions && versions.length > 0) {
        const versionIds = versions.map(v => v.id);
        await supabase.from("template_versions").delete().in("id", versionIds);
      }
    } catch (versionError) {
      // Ignore if table doesn't exist
      console.warn("template_versions table may not exist:", versionError);
    }

    return NextResponse.json({
      success: true,
      message: "All templates deleted successfully",
      deletedCount: deletedCount,
    });
  } catch (error: any) {
    console.error("Delete templates error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
