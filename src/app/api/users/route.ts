import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSessionUser, hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user || user.role === "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseServer();
  const { data: users, error } = await supabase
    .from("cms_users")
    .select("id, email, display_name, role, must_change_password, last_login, created_at")
    .order("created_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const user = await getSessionUser(request);
  if (!user || user.role === "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, display_name, password, role } = await request.json();

  if (!email || !display_name || !password) {
    return NextResponse.json(
      { error: "Email, display name, and password required" },
      { status: 400 }
    );
  }

  // Editors can't create admins/owners
  const allowedRoles = user.role === "owner" ? ["admin", "editor"] : ["editor"];
  const newRole = allowedRoles.includes(role) ? role : "editor";

  const supabase = getSupabaseServer();
  const passwordHash = await hashPassword(password);

  const { data: newUser, error } = await supabase
    .from("cms_users")
    .insert({
      email: email.toLowerCase().trim(),
      display_name,
      password_hash: passwordHash,
      role: newRole,
      must_change_password: true,
    })
    .select("id, email, display_name, role, must_change_password, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: newUser }, { status: 201 });
}
