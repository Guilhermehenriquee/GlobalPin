import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "titanor_session";

export function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const hasSession = Boolean(request.cookies.get(sessionCookieName));

  if (isAdminRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
