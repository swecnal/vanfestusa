import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServer();

  // Find all sections with section_type = "navbar" and join with pages
  const { data: sections, error } = await supabase
    .from("sections")
    .select("data, page_id, pages!inner(id, title, slug)")
    .eq("section_type", "navbar");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build usage map: navbarId -> array of pages
  const usage: Record<string, Array<{ id: string; title: string; slug: string }>> = {};
  for (const s of sections || []) {
    const navbarId = (s.data as Record<string, unknown>)?.navbarId as string;
    if (!navbarId) continue;
    const page = s.pages as unknown as { id: string; title: string; slug: string };
    if (!page) continue;
    if (!usage[navbarId]) usage[navbarId] = [];
    // Avoid duplicates (a page can only have one navbar section, but be safe)
    if (!usage[navbarId].some((p) => p.id === page.id)) {
      usage[navbarId].push({ id: page.id, title: page.title, slug: page.slug });
    }
  }

  return NextResponse.json({ usage });
}
