import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser, hashPassword } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user || user.role === "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  const body = await request.json();

  const supabase = getSupabaseServer();

  // Check target user
  const { data: targetUser } = await supabase
    .from("cms_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Only owner can modify admins
  if (targetUser.role === "owner") {
    return NextResponse.json(
      { error: "Cannot modify owner" },
      { status: 403 }
    );
  }
  if (targetUser.role === "admin" && user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.display_name) updates.display_name = body.display_name;
  if (body.email) updates.email = body.email.toLowerCase().trim();
  if (body.role && user.role === "owner") updates.role = body.role;
  if (body.must_change_password !== undefined)
    updates.must_change_password = body.must_change_password;
  if (body.password) {
    updates.password_hash = await hashPassword(body.password);
    updates.must_change_password = true;
  }

  const { data: updated, error } = await supabase
    .from("cms_users")
    .update(updates)
    .eq("id", userId)
    .select("id, email, display_name, role, must_change_password, last_login, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user || user.role === "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  // Can't delete yourself
  if (userId === user.id) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();

  // Check target user
  const { data: targetUser } = await supabase
    .from("cms_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetUser?.role === "owner") {
    return NextResponse.json(
      { error: "Cannot delete owner" },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("cms_users").delete().eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
