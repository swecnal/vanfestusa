import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import PreviewShell from "@/components/PreviewShell";
import type { Section } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ pageId: string }>;
}

async function getGlobalSettings() {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["button_styles", "link_styles", "heading_styles", "navbar_config", "footer_config", "vehicle_stream_config", "footer_builder_config", "navbar_builder_config"]);

    if (!rows) return { siteStyles: EMPTY_SITE_STYLES, navbarConfig: null, footerConfig: null, vehicleStreamConfig: null, footerBuilderConfig: null, navbarBuilderConfig: null };

    const map: Record<string, unknown> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }

    return {
      siteStyles: {
        button_styles: (map.button_styles as SiteStyles["button_styles"]) || EMPTY_SITE_STYLES.button_styles,
        link_styles: (map.link_styles as SiteStyles["link_styles"]) || EMPTY_SITE_STYLES.link_styles,
        heading_styles: (map.heading_styles as SiteStyles["heading_styles"]) || EMPTY_SITE_STYLES.heading_styles,
      },
      navbarConfig: map.navbar_config || null,
      footerConfig: map.footer_config || null,
      vehicleStreamConfig: map.vehicle_stream_config || null,
      footerBuilderConfig: map.footer_builder_config || null,
      navbarBuilderConfig: map.navbar_builder_config || null,
    };
  } catch {
    return { siteStyles: EMPTY_SITE_STYLES, navbarConfig: null, footerConfig: null, vehicleStreamConfig: null, footerBuilderConfig: null, navbarBuilderConfig: null };
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
  const { siteStyles, navbarConfig, footerConfig, vehicleStreamConfig, footerBuilderConfig, navbarBuilderConfig } = await getGlobalSettings();

  return (
    <PreviewShell
      initialSections={visibleSections}
      siteStyles={siteStyles}
      navbarConfig={navbarConfig}
      navbarBuilderConfig={navbarBuilderConfig}
      footerConfig={footerConfig}
      footerBuilderConfig={footerBuilderConfig}
      vehicleStreamConfig={vehicleStreamConfig}
      pageSlug={page.slug}
    />
  );
}
