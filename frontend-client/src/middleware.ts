import { auth } from "@/auth/config"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import {
  canAccessCandidateArea,
  requiresCandidateRole,
} from "@/common/security/frontendSecurity.mjs"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const protectedPrefixes = ["/profile", "/candidate"]
  const requiresSession = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (requiresSession && !session) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  if (requiresCandidateRole(pathname) && !canAccessCandidateArea(session)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
