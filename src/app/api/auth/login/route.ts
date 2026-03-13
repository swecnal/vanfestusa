import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  verifyPassword,
  createSession,
  getSessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    let step = "parse_body";
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    step = "supabase_query";
    const supabase = getSupabaseServer();
    const { data: user, error } = await supabase
      .from("cms_users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    step = "verify_password";
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    step = "create_session";
    const { token, expiresAt } = await createSession(user.id);

    step = "build_response";
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
      mustChangePassword: user.must_change_password,
    });

    response.headers.set("Set-Cookie", getSessionCookie(token, expiresAt));

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: `Internal server error`, debug: String(err) },
      { status: 500 }
    );
  }
}
