import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Cleanup Old Template Versions API Route
 * 
 * Deletes old template versions, keeping only the latest version for each template.
 * 
 * Security: Protected with admin secret.
 * 
 * Usage: POST /api/cleanup-old-versions
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

    // Get all template versions
    const { data: allVersions, error: fetchError } = await supabase
      .from("template_versions")
      .select("id, template_id, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching template versions:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch template versions", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!allVersions || allVersions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No template versions found",
        deletedCount: 0,
        keptCount: 0,
      });
    }

    // Group versions by template_id and keep only the latest (first) one
    const versionsByTemplate = new Map<string, any[]>();
    
    for (const version of allVersions) {
      const templateId = version.template_id;
      if (!versionsByTemplate.has(templateId)) {
        versionsByTemplate.set(templateId, []);
      }
      versionsByTemplate.get(templateId)!.push(version);
    }

    // Collect IDs of old versions to delete (all except the latest)
    const oldVersionIds: string[] = [];
    let keptCount = 0;

    for (const [templateId, versions] of versionsByTemplate.entries()) {
      if (versions.length > 1) {
        // Keep the first one (latest), delete the rest
        const latestVersion = versions[0];
        const oldVersions = versions.slice(1);
        oldVersionIds.push(...oldVersions.map(v => v.id));
        keptCount += 1;
      } else {
        // Only one version, keep it
        keptCount += 1;
      }
    }

    if (oldVersionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No old versions to delete. All templates already have only one version.",
        deletedCount: 0,
        keptCount: keptCount,
      });
    }

    // Delete old versions
    const { error: deleteError } = await supabase
      .from("template_versions")
      .delete()
      .in("id", oldVersionIds);

    if (deleteError) {
      console.error("Error deleting old versions:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete old versions", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up old template versions. Kept latest version for ${keptCount} template(s).`,
      deletedCount: oldVersionIds.length,
      keptCount: keptCount,
    });
  } catch (error: any) {
    console.error("Cleanup old versions error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
