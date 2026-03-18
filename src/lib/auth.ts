import * as bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getSupabaseServer } from "./supabase/server";
import type { CmsUser } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vanfest-cms-secret-change-me"
);
const SESSION_DURATION_HOURS = 24;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = await createSessionToken(userId);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
  );

  const supabase = getSupabaseServer();
  await supabase.from("cms_sessions").insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  return { token, expiresAt };
}

export async function getSessionUser(
  request: Request
): Promise<CmsUser | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/vf_session=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const supabase = getSupabaseServer();
  const { data: session } = await supabase
    .from("cms_sessions")
    .select("*, user:cms_users(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!session?.user) return null;

  return session.user as CmsUser;
}

export async function destroySession(token: string): Promise<void> {
  const supabase = getSupabaseServer();
  await supabase.from("cms_sessions").delete().eq("token", token);
}

export function requireRole(
  user: CmsUser,
  roles: CmsUser["role"][]
): boolean {
  return roles.includes(user.role);
}

export function getSessionCookie(
  token: string,
  expiresAt: Date
): string {
  return `vf_session=${token}; Path=/; HttpOnly; SameSite=Strict; Expires=${expiresAt.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearSessionCookie(): string {
  return `vf_session=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
