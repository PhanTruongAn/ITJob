// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname.startsWith("/pages/")) {
    return NextResponse.next();
  }
  const newPath = `/pages${pathname}`;
  return NextResponse.rewrite(new URL(newPath, request.url));
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
