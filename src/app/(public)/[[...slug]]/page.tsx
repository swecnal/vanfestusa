import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Section } from "@/lib/types";
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

async function getSiteStyles(): Promise<SiteStyles> {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["button_styles", "link_styles"]);

    if (!rows) return EMPTY_SITE_STYLES;

    const map: Record<string, unknown> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }

    return {
      button_styles: (map.button_styles as SiteStyles["button_styles"]) || EMPTY_SITE_STYLES.button_styles,
      link_styles: (map.link_styles as SiteStyles["link_styles"]) || EMPTY_SITE_STYLES.link_styles,
    };
  } catch {
    return EMPTY_SITE_STYLES;
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = "/" + (slug?.join("/") || "");
  const page = await getPage(pageSlug);

  if (!page) notFound();

  const sections = (page.sections as Section[]).filter((s) => s.is_visible);
  const siteStyles = await getSiteStyles();

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} siteStyles={siteStyles} />
      ))}
    </>
  );
}
