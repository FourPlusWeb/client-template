import { NextResponse, type NextRequest } from "next/server";

const STUDIO_PREFIXES = ["/studio", "/api/studio"];

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function middleware(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const pathname = request.nextUrl.pathname;
  const isStudio = STUDIO_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProd && isStudio) {
    const password = process.env.STUDIO_PASSWORD;
    if (password) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Basic ")) {
        return new Response("Not found", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="Studio"' },
        });
      }
      const encoded = authHeader.slice(6);
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const colonIdx = decoded.indexOf(":");
      const provided =
        colonIdx !== -1 ? decoded.slice(colonIdx + 1) : "";
      if (!timingSafeCompare(provided, password)) {
        return new Response("Not found", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="Studio"' },
        });
      }
    } else {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};