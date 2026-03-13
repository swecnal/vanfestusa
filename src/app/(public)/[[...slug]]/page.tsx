import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Section } from "@/lib/types";

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

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = "/" + (slug?.join("/") || "");
  const page = await getPage(pageSlug);

  if (!page) notFound();

  const sections = (page.sections as Section[]).filter((s) => s.is_visible);

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
