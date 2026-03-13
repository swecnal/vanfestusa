import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;
  const supabase = getSupabaseServer();

  const { data: page, error } = await supabase
    .from("pages")
    .select("*, sections(*)")
    .eq("id", pageId)
    .single();

  if (error || !page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Sort sections by sort_order
  page.sections = (page.sections || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) =>
      a.sort_order - b.sort_order
  );

  return NextResponse.json({ page });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { pageId } = await params;
  const body = await request.json();

  const supabase = getSupabaseServer();
  const { data: page, error } = await supabase
    .from("pages")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", pageId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ page });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user || user.role === "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { pageId } = await params;
  const supabase = getSupabaseServer();

  const { error } = await supabase.from("pages").delete().eq("id", pageId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
