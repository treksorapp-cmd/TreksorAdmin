import { NextRequest, NextResponse } from "next/server"
import { adminRequest, config } from "@/lib/supabase-admin"

export async function POST(request: NextRequest) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Iniciá sesión nuevamente" }, { status: 401 })
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body
    if (typeof currentPassword !== "string" || !currentPassword || currentPassword.length > 128 ||
        typeof newPassword !== "string" || newPassword.length < 12 || newPassword.length > 128 ||
        newPassword === currentPassword)
      return NextResponse.json({ error: "Usá una contraseña nueva de 12 a 128 caracteres" }, { status: 400 })

    const { url, key } = config()
    const verify = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: admin.user.email, password: currentPassword }),
      cache: "no-store",
    })
    if (!verify.ok) return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 401 })
    const session = await verify.json()
    if (session.user?.id !== admin.user.id)
      return NextResponse.json({ error: "No se pudo verificar tu cuenta" }, { status: 403 })

    const update = await fetch(`${url}/auth/v1/user`, {
      method: "PUT",
      headers: { apikey: key, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
      cache: "no-store",
    })
    if (!update.ok) return NextResponse.json({ error: "No se pudo actualizar la contraseña" }, { status: 400 })

    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
    response.cookies.delete("treksor_access")
    response.cookies.delete("treksor_refresh")
    return response
  } catch {
    return NextResponse.json({ error: "No se pudo cambiar la contraseña" }, { status: 500 })
  }
}
