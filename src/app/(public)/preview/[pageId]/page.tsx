import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Section } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ pageId: string }>;
}

async function getSiteStyles(): Promise<SiteStyles> {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["button_styles", "link_styles", "heading_styles"]);

    if (!rows) return EMPTY_SITE_STYLES;

    const map: Record<string, unknown> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }

    return {
      button_styles: (map.button_styles as SiteStyles["button_styles"]) || EMPTY_SITE_STYLES.button_styles,
      link_styles: (map.link_styles as SiteStyles["link_styles"]) || EMPTY_SITE_STYLES.link_styles,
      heading_styles: (map.heading_styles as SiteStyles["heading_styles"]) || EMPTY_SITE_STYLES.heading_styles,
    };
  } catch {
    return EMPTY_SITE_STYLES;
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { pageId } = await params;
  const supabase = getSupabaseServer();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (!page) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true });

  const visibleSections = ((sections || []) as Section[]).filter((s) => s.is_visible);
  const siteStyles = await getSiteStyles();

  return (
    <main>
      {visibleSections.map((section) => (
        <SectionRenderer key={section.id} section={section} siteStyles={siteStyles} />
      ))}
    </main>
  );
}
