import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"

export async function GET() {
  const admin = await adminRequest("")
  return NextResponse.json({ authenticated: Boolean(admin) }, { status: admin ? 200 : 401, headers: { "Cache-Control": "no-store" } })
}
