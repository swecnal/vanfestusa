import { NextResponse } from "next/server";
import { destroySession, clearSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/vf_session=([^;]+)/);

  if (match) {
    await destroySession(match[1]);
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
