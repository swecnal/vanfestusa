import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Route admin subdomain to /admin routes
  if (hostname.startsWith("admin.")) {
    const url = request.nextUrl.clone();

    // API routes pass through
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Already on /admin path
    if (pathname.startsWith("/admin")) {
      // Allow login page without auth
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }
      // Check for session cookie
      const sessionCookie = request.cookies.get("vf_session");
      if (!sessionCookie?.value) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.next();
    }

    // Rewrite root to /admin
    if (pathname === "/") {
      url.pathname = "/admin";
    } else {
      url.pathname = `/admin${pathname}`;
    }

    // Check auth for non-login pages
    if (url.pathname !== "/admin/login") {
      const sessionCookie = request.cookies.get("vf_session");
      if (!sessionCookie?.value) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.rewrite(url);
  }

  // Protect /admin routes on main domain too (for local dev)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("vf_session");
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.png|apple-touch-icon\\.png|images/).*)",
  ],
};
