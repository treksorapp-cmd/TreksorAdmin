import { NextRequest, NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"
import { validDate } from "@/lib/treksor-articles"
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { type, id } = await params
  if (!["articles", "thoughts"].includes(type) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return NextResponse.json({ error: "Invalid content" }, { status: 400 })
  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }
  if (!body || !validDate(body.date) || !["draft", "published"].includes(body.status)) return NextResponse.json({ error: "Invalid publication settings" }, { status: 400 })
  const table = type === "articles" ? "articles" : "power_thoughts"
  const response = await admin.request(`${table}?id=eq.${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ status: body.status, publish_date: body.date, updated_at: new Date().toISOString() }) })
  if (!response.ok) return NextResponse.json({ error: "Unable to save" }, { status: 502 })
  const rows = await response.json()
  return rows.length ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 })
}
