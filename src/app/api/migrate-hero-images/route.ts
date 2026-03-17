import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST() {
  const supabase = getSupabaseServer();

  // Get all hero_simple sections
  const { data: sections, error } = await supabase
    .from("sections")
    .select("id, data, settings, page_id")
    .eq("section_type", "hero_simple");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; status: string }> = [];

  for (const section of sections || []) {
    const data = section.data as Record<string, unknown>;
    const settings = (section.settings || {}) as Record<string, unknown>;
    const bgConfig = settings.bgConfig as Record<string, unknown> | undefined;

    // Only migrate if data.bgImage exists and bgConfig doesn't already have an image
    if (data.bgImage && typeof data.bgImage === "string" && data.bgImage.trim()) {
      if (!bgConfig?.imageUrl) {
        const newSettings = {
          ...settings,
          bgConfig: {
            type: "image",
            imageUrl: data.bgImage,
            imageSizing: "cover",
            imageOpacity: 15, // Match the original opacity-15 class
          },
        };

        // Remove bgImage from data
        const newData = { ...data };
        delete newData.bgImage;

        const { error: updateError } = await supabase
          .from("sections")
          .update({
            data: newData,
            settings: newSettings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", section.id);

        if (updateError) {
          results.push({ id: section.id, status: `error: ${updateError.message}` });
        } else {
          results.push({ id: section.id, status: "migrated" });
        }
      } else {
        results.push({ id: section.id, status: "skipped (bgConfig already has image)" });
      }
    } else {
      results.push({ id: section.id, status: "skipped (no bgImage in data)" });
    }
  }

  return NextResponse.json({ migrated: results.filter((r) => r.status === "migrated").length, results });
}
