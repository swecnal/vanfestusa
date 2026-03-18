import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { SECTION_DEFAULTS, DEFAULT_SECTION_SETTINGS } from "@/lib/section-defaults";
import type { SectionType } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;
  const supabase = getSupabaseServer();

  const { data: sections, error } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .order("sort_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sections });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { pageId } = await params;
  const { section_type, sort_order, data, settings } = await request.json();

  if (!section_type) {
    return NextResponse.json(
      { error: "section_type required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  // If no sort_order specified, append at end
  let order = sort_order;
  if (order === undefined || order === null) {
    const { data: existing } = await supabase
      .from("sections")
      .select("sort_order")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: false })
      .limit(1);

    order = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;
  }

  const defaultData =
    SECTION_DEFAULTS[section_type as SectionType] || {};

  const { data: section, error } = await supabase
    .from("sections")
    .insert({
      page_id: pageId,
      section_type,
      sort_order: order,
      data: data || defaultData,
      settings: settings || { ...DEFAULT_SECTION_SETTINGS },
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ section }, { status: 201 });
}
