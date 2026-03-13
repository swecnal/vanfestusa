import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING";
  checks.supabase_key = process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING";
  checks.jwt_secret = process.env.JWT_SECRET ? "set" : "MISSING";

  // Check bcryptjs import
  try {
    const bcrypt = await import("bcryptjs");
    checks.bcryptjs_import = "ok";
    checks.bcryptjs_keys = Object.keys(bcrypt).join(",");
    checks.bcryptjs_hash_type = typeof bcrypt.hash;
    checks.bcryptjs_compare_type = typeof bcrypt.compare;
    if (typeof bcrypt.default === "object" && bcrypt.default !== null) {
      checks.bcryptjs_default_keys = Object.keys(bcrypt.default).join(",");
    }
    // Test hash
    const testHash = await (bcrypt.hash || bcrypt.default?.hash)("test", 10);
    checks.bcryptjs_hash_test = testHash ? "ok" : "FAILED";
  } catch (e) {
    checks.bcryptjs_error = String(e);
  }

  // Check jose import
  try {
    const jose = await import("jose");
    checks.jose_import = "ok";
    checks.jose_SignJWT = typeof jose.SignJWT;
  } catch (e) {
    checks.jose_error = String(e);
  }

  // Check supabase connection
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await supabase
      .from("cms_users")
      .select("email")
      .limit(1);
    if (error) {
      checks.supabase_query = `ERROR: ${error.message}`;
    } else {
      checks.supabase_query = `ok (${data?.length} rows)`;
    }
  } catch (e) {
    checks.supabase_error = String(e);
  }

  return NextResponse.json(checks);
}
