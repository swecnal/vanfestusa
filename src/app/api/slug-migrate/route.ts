import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { oldSlug, newSlug } = await req.json();
    if (!oldSlug || !newSlug || oldSlug === newSlug) {
      return NextResponse.json({ error: "Invalid slugs" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    let sectionsUpdated = 0;
    let settingsUpdated = 0;

    // 1. Update all sections that reference the old slug in their data
    const { data: sections } = await supabase
      .from("sections")
      .select("id, data")
      .not("data", "is", null);

    if (sections) {
      for (const section of sections) {
        const dataStr = JSON.stringify(section.data);
        if (dataStr.includes(oldSlug)) {
          const newDataStr = dataStr.split(oldSlug).join(newSlug);
          const newData = JSON.parse(newDataStr);
          const { error } = await supabase
            .from("sections")
            .update({ data: newData })
            .eq("id", section.id);
          if (!error) sectionsUpdated++;
        }
      }
    }

    // 2. Update global_settings values that reference the old slug
    const { data: settings } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["navbars", "navbar_config", "navbar_builder_config", "footer_config", "footer_builder_config"]);

    if (settings) {
      for (const setting of settings) {
        const valueStr = JSON.stringify(setting.value);
        if (valueStr.includes(oldSlug)) {
          const newValueStr = valueStr.split(oldSlug).join(newSlug);
          const newValue = JSON.parse(newValueStr);
          const { error } = await supabase
            .from("global_settings")
            .update({ value: newValue })
            .eq("key", setting.key);
          if (!error) settingsUpdated++;
        }
      }
    }

    return NextResponse.json({
      updated: { sections: sectionsUpdated, settings: settingsUpdated },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
