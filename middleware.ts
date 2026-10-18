import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("treksor_access")?.value
  const refresh = request.cookies.get("treksor_refresh")?.value
  if (!refresh) return NextResponse.next()
  // JWT expiry is used only to decide when to refresh, never for authorization.
  let expiresSoon = !access
  if (access) {
    try {
      const payload = JSON.parse(atob(access.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      expiresSoon = typeof payload.exp !== "number" || payload.exp * 1000 < Date.now() + 120000
    } catch { expiresSoon = true }
  }
  if (!expiresSoon) return NextResponse.next()
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()
  try {
    const auth = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }), cache: "no-store",
    })
    if (!auth.ok) throw new Error("Refresh rejected")
    const session = await auth.json()
    const headers = new Headers(request.headers)
    headers.set("cookie", request.cookies.getAll().filter(c => c.name !== "treksor_access" && c.name !== "treksor_refresh").map(c => `${c.name}=${c.value}`).concat([
      `treksor_access=${session.access_token}`, `treksor_refresh=${session.refresh_token}`
    ]).join("; "))
    const response = NextResponse.next({ request: { headers } })
    const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" }
    response.cookies.set("treksor_access", session.access_token, { ...opts, maxAge: session.expires_in || 3600 })
    response.cookies.set("treksor_refresh", session.refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch {
    const response = NextResponse.next()
    response.cookies.delete("treksor_access")
    response.cookies.delete("treksor_refresh")
    return response
  }
}

export const config = { matcher: ["/dashboard/:path*", "/api/articles/:path*", "/api/power-thoughts/:path*", "/api/auth/session"] }
