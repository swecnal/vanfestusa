import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    await supabase.from("page_views").insert({ page_slug: slug });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Fail silently for tracking
  }
}
