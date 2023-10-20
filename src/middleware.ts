import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  if (pathname === "/create") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname === "/auth") {
    if (data.session) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } else if (pathname === "/inquiry") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname === "/concerts/create") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname === "/jobs/create") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname === "/educations/create") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname.startsWith("/jobs/")) {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  } else if (pathname === "/posts") {
    return NextResponse.redirect(new URL("/", req.url), { status: 301 })
  } else if (pathname === "/inspection") {
    return NextResponse.redirect(new URL("/", req.url))
  } else if (pathname === "/issues") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/posts",
    "/posts/:path*",
    "/auth:path*",
    "/create",
    "/home:path*",
    "/inquiry",
    "/concerts/create",
    "/jobs/create",
    "/jobs/:path*",
    "/educations/create",
  ],
}
