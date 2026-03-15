import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Route admin subdomain to /admin routes
  if (hostname.startsWith("admin.")) {
    const url = request.nextUrl.clone();

    // API routes and preview routes pass through
    if (pathname.startsWith("/api/") || pathname.startsWith("/preview/")) {
      return NextResponse.next();
    }

    // Already on /admin path
    if (pathname.startsWith("/admin")) {
      // Allow login and change-password pages without auth
      if (
        pathname === "/admin/login" ||
        pathname === "/admin/change-password"
      ) {
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

    // Check auth for non-login/change-password pages
    if (
      url.pathname !== "/admin/login" &&
      url.pathname !== "/admin/change-password"
    ) {
      const sessionCookie = request.cookies.get("vf_session");
      if (!sessionCookie?.value) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.rewrite(url);
  }

  // Protect /admin routes on main domain too (for local dev)
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/change-password"
  ) {
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
