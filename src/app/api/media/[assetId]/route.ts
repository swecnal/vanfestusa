import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { assetId } = await params;
  const { alt_text } = await request.json();

  const supabase = getSupabaseServer();
  const { data: asset, error } = await supabase
    .from("media_assets")
    .update({ alt_text })
    .eq("id", assetId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ asset });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { assetId } = await params;
  const supabase = getSupabaseServer();

  // Get the asset to find storage path
  const { data: asset } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", assetId)
    .single();

  if (asset?.storage_path) {
    await supabase.storage
      .from("site-images")
      .remove([asset.storage_path]);
  }

  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", assetId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
