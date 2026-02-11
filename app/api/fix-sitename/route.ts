import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Fix Site Name API Route
 * 
 * Updates site_name in database from "Azone.store" to "Azone"
 * 
 * Security: Protected with admin secret.
 * 
 * Usage: POST /api/fix-sitename
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

    // Update site_name in settings table
    const { data, error } = await supabase
      .from("settings")
      .update({ site_name: "Azone" })
      .neq("site_name", "Azone") // Only update if not already "Azone"
      .select();

    if (error) {
      console.error("Error updating site_name:", error);
      return NextResponse.json(
        { error: "Failed to update site_name", details: error.message },
        { status: 500 }
      );
    }

    // Also check for "Azone.store" variations
    const { data: allSettings, error: fetchError } = await supabase
      .from("settings")
      .select("id, site_name");

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
    }

    let updatedCount = data?.length || 0;
    const variations = ["Azone.store", "Azone,store", "azone.store", "AZone Store"];

    // Update any variations found
    for (const variation of variations) {
      const { data: updateData, error: updateError } = await supabase
        .from("settings")
        .update({ site_name: "Azone" })
        .eq("site_name", variation)
        .select();

      if (updateError) {
        console.error(`Error updating ${variation}:`, updateError);
      } else if (updateData && updateData.length > 0) {
        updatedCount += updateData.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Site name updated to "Azone". ${updatedCount} record(s) updated.`,
      updatedCount: updatedCount,
    });
  } catch (error: any) {
    console.error("Fix site name error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
