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

    // First, check current values
    const { data: currentSettings, error: fetchError } = await supabase
      .from("settings")
      .select("id, site_name");

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch settings", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!currentSettings || currentSettings.length === 0) {
      // No settings found, create one with correct value
      const { data: newSetting, error: createError } = await supabase
        .from("settings")
        .insert({ site_name: "Azone" })
        .select();

      if (createError) {
        return NextResponse.json(
          { error: "Failed to create settings", details: createError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Settings created with site_name 'Azone'",
        updatedCount: 1,
        created: true,
      });
    }

    // Update all records that don't have "Azone"
    const variations = ["Azone.store", "Azone,store", "azone.store", "AZone Store", "azone-store"];
    let updatedCount = 0;
    const updates: any[] = [];

    for (const setting of currentSettings) {
      const currentName = setting.site_name;
      
      // Check if it needs updating
      if (currentName !== "Azone" && (variations.includes(currentName) || currentName?.includes("store") || currentName?.includes("Store"))) {
        const { data: updated, error: updateError } = await supabase
          .from("settings")
          .update({ site_name: "Azone" })
          .eq("id", setting.id)
          .select();

        if (updateError) {
          console.error(`Error updating setting ${setting.id}:`, updateError);
          updates.push({ id: setting.id, error: updateError.message });
        } else {
          updatedCount++;
          updates.push({ id: setting.id, oldValue: currentName, newValue: "Azone" });
        }
      }
    }

    // Also do a bulk update for any remaining variations
    for (const variation of variations) {
      const { data: bulkUpdated, error: bulkError } = await supabase
        .from("settings")
        .update({ site_name: "Azone" })
        .eq("site_name", variation)
        .select();

      if (!bulkError && bulkUpdated && bulkUpdated.length > 0) {
        updatedCount += bulkUpdated.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Site name fixed. ${updatedCount} record(s) updated to "Azone".`,
      updatedCount: updatedCount,
      details: updates,
      currentSettings: currentSettings.map(s => ({ id: s.id, site_name: s.site_name })),
    });
  } catch (error: any) {
    console.error("Fix site name error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
