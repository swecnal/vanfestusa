import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("get_visitor_stats");

    if (error) {
      // Table might not exist yet — return zeros
      return NextResponse.json({
        stats: { today: 0, week: 0, month: 0, year: 0, all_time: 0 },
      });
    }

    return NextResponse.json({ stats: data });
  } catch {
    return NextResponse.json({
      stats: { today: 0, week: 0, month: 0, year: 0, all_time: 0 },
    });
  }
}
