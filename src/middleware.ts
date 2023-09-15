import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  if (pathname === "/") {
    return NextResponse.redirect("/posts", { status: 301 })
  }

  if (pathname === "/auth") {
    if (data.session) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } else if (pathname === "/posts/create") {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
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
  } else if (pathname.startsWith("/jobs/")) {
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/auth:path*",
    "/posts/create",
    "/home:path*",
    "/inquiry",
    "/concerts/create",
    "/jobs/create",
    "/jobs/:path*",
  ],
}
