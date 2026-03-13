import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { sections } = await request.json();

  if (!Array.isArray(sections)) {
    return NextResponse.json(
      { error: "sections array required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  // Update each section's sort_order
  const updates = sections.map(
    (s: { id: string; sort_order: number }, i: number) =>
      supabase
        .from("sections")
        .update({ sort_order: s.sort_order ?? i, updated_at: new Date().toISOString() })
        .eq("id", s.id)
  );

  await Promise.all(updates);

  return NextResponse.json({ ok: true });
}
