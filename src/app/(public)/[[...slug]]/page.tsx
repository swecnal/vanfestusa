import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Section, SavedNavbar } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";

// No caching — CMS changes appear immediately
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

async function getPage(slug: string) {
  const supabase = getSupabaseServer();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!page) return null;

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true });

  return { ...page, sections: sections || [] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = "/" + (slug?.join("/") || "");
  const page = await getPage(pageSlug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.description || undefined,
  };
}

async function getSiteStylesAndNavbars(): Promise<{ siteStyles: SiteStyles; navbars: SavedNavbar[] }> {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["button_styles", "link_styles", "heading_styles", "navbars"]);

    if (!rows) return { siteStyles: EMPTY_SITE_STYLES, navbars: [] };

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
      navbars: (map.navbars as SavedNavbar[]) || [],
    };
  } catch {
    return { siteStyles: EMPTY_SITE_STYLES, navbars: [] };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = "/" + (slug?.join("/") || "");
  const page = await getPage(pageSlug);

  if (!page) notFound();

  const sections = (page.sections as Section[]).filter((s) => s.is_visible);
  const { siteStyles, navbars } = await getSiteStylesAndNavbars();
  const hasNavbarSection = sections.some((s) => s.section_type === "navbar");

  return (
    <>
      {hasNavbarSection && (
        <style dangerouslySetInnerHTML={{ __html: "#layout-navbar{display:none!important}" }} />
      )}
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} siteStyles={siteStyles} navbars={navbars} />
      ))}
    </>
  );
}
