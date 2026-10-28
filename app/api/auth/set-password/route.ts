import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  // The public HTTPS origin differs from Next.js internal origin behind Railway proxy.
  const host = request.headers.get("host")
  let validOrigin = false
  try {
    const parsed = origin ? new URL(origin) : null
    validOrigin = !!parsed && !!host && parsed.host === host &&
      (process.env.NODE_ENV === "production" ? parsed.protocol === "https:" : ["http:", "https:"].includes(parsed.protocol))
  } catch { validOrigin = false }
  if (!validOrigin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  try {
    const { accessToken, password } = await request.json()
    if (typeof accessToken !== "string" || accessToken.length > 4096 ||
        typeof password !== "string" || password.length < 12 || password.length > 128)
      return NextResponse.json({ error: "Use a password of at least 12 characters" }, { status: 400 })
    const { url, key } = config()
    const headers = { apikey: key, Authorization: `Bearer ${accessToken}` }
    const verification = await fetch(`${url}/auth/v1/user`, { headers, cache: "no-store" })
    if (!verification.ok) return NextResponse.json({ error: "Link expired or invalid" }, { status: 401 })
    const user = await verification.json()
    const membership = await fetch(
      `${url}/rest/v1/admin_members?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,
      { headers, cache: "no-store" }
    )
    if (!membership.ok || !(await membership.json()).length)
      return NextResponse.json({ error: "Administrator authorization pending" }, { status: 403 })
    const update = await fetch(`${url}/auth/v1/user`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      cache: "no-store",
    })
    if (!update.ok) return NextResponse.json({ error: "Could not set password. Request a new invitation." }, { status: 400 })
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Unable to set password" }, { status: 500 })
  }
}
