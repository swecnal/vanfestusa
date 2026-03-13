import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageId: string; sectionId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { sectionId } = await params;
  const body = await request.json();

  const supabase = getSupabaseServer();
  const { data: section, error } = await supabase
    .from("sections")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sectionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ section });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ pageId: string; sectionId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { sectionId } = await params;
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
