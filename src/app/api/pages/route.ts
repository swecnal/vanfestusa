import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: pages, error } = await supabase
    .from("pages")
    .select("*, sections(id)")
    .order("slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = pages.map((p) => ({
    ...p,
    section_count: p.sections?.length || 0,
    sections: undefined,
  }));

  return NextResponse.json({ pages: result });
}

export async function POST(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { slug, title, description } = await request.json();

  if (!slug || !title) {
    return NextResponse.json(
      { error: "Slug and title required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();
  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      slug,
      title,
      description: description || null,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ page }, { status: 201 });
}
