import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: settings, error } = await supabase
    .from("global_settings")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert array to key-value object
  const result: Record<string, unknown> = {};
  for (const s of settings || []) {
    result[s.key] = s.value;
  }

  return NextResponse.json({ settings: result });
}

export async function PUT(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabaseServer();

  // Upsert each key-value pair
  const entries = Object.entries(body);
  for (const [key, value] of entries) {
    await supabase
      .from("global_settings")
      .upsert({ key, value }, { onConflict: "key" });
  }

  return NextResponse.json({ ok: true });
}
