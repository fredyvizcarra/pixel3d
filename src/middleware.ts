import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminCookieName, verifyAdminSession } from "@/lib/admin-auth"

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(getAdminCookieName())?.value
  const session = await verifyAdminSession(token)

  if (pathname.startsWith("/admin/login")) {
    if (session) {
      const nextUrl = request.nextUrl.clone()
      nextUrl.pathname = "/admin/products"
      nextUrl.search = ""
      return NextResponse.redirect(nextUrl)
    }
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/admin/login"
    loginUrl.search = ""
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
