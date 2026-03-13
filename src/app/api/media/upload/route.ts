import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();
  const storagePath = `uploads/${timestamp}-${safeName}`;

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("site-images")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("site-images").getPublicUrl(storagePath);

  // Save to media_assets table
  const { data: asset, error: dbError } = await supabase
    .from("media_assets")
    .insert({
      filename: file.name,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: "",
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ asset }, { status: 201 });
}
