import { NextResponse, type NextRequest } from "next/server";

const STUDIO_PREFIXES = ["/studio", "/api/studio"];

export function middleware(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const pathname = request.nextUrl.pathname;
  const isStudio = STUDIO_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProd && isStudio) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};
