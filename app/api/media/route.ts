import { NextRequest, NextResponse } from "next/server"
import { adminRequest, config } from "@/lib/supabase-admin"

export const runtime = "nodejs"
const BUCKET = "treksor-media"
const TYPES = new Set(["image/jpeg","image/png","image/webp","video/mp4","video/quicktime","video/webm"])
const MAX = 25 * 1024 * 1024
function storageHeaders(token: string) { const { key } = config(); return { apikey: key, Authorization: `Bearer ${token}` } }
export async function GET() {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/list/${BUCKET}`, { method: "POST", headers: { ...storageHeaders(admin.token), "Content-Type": "application/json" }, body: JSON.stringify({ prefix: "", limit: 100, sortBy: { column: "created_at", order: "desc" } }), cache: "no-store" })
  if (!response.ok) return NextResponse.json({ error: "Unable to load media" }, { status: 502 })
  const files = await response.json() as { name: string; id: string; created_at: string; metadata?: { mimetype?: string; size?: number } }[]
  const previews = await Promise.all(files.filter(file => file.id).map(async file => {
    const sign = await fetch(`${url}/storage/v1/object/sign/${BUCKET}/${encodeURIComponent(file.name)}`, { method:"POST", headers:{ ...storageHeaders(admin.token), "Content-Type":"application/json" }, body:JSON.stringify({ expiresIn: 900 }), cache:"no-store" })
    const result = sign.ok ? await sign.json() as { signedURL?: string } : {}
    const signed = result.signedURL
    return { name:file.name, createdAt:file.created_at, type:file.metadata?.mimetype ?? "", size:file.metadata?.size ?? 0, url: signed ? (signed.startsWith("http") ? signed : `${url}/storage/v1${signed.startsWith("/") ? "" : "/"}${signed}`) : null }
  }))
  return NextResponse.json({ files: previews })
}
export async function POST(request: NextRequest) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file" }, { status: 400 })
  if (!TYPES.has(file.type) || file.size === 0 || file.size > MAX) return NextResponse.json({ error: "Use JPG, PNG, WebP, MP4, MOV or WebM up to 25 MB" }, { status: 400 })
  const bytes = new Uint8Array(await file.arrayBuffer())
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png = bytes.slice(0,8).every((b,i)=>b===[137,80,78,71,13,10,26,10][i])
  const webp = String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP"
  const mp4 = String.fromCharCode(...bytes.slice(4,8)) === "ftyp"
  const webm = bytes[0]===0x1a && bytes[1]===0x45 && bytes[2]===0xdf && bytes[3]===0xa3
  if (!(file.type==="image/jpeg"&&jpg || file.type==="image/png"&&png || file.type==="image/webp"&&webp || ["video/mp4","video/quicktime"].includes(file.type)&&mp4 || file.type==="video/webm"&&webm)) return NextResponse.json({ error: "File content does not match its format" }, { status: 400 })
  const ext = ({ "image/jpeg":"jpg","image/png":"png","image/webp":"webp","video/mp4":"mp4","video/quicktime":"mov","video/webm":"webm" } as Record<string,string>)[file.type]
  const name = `${crypto.randomUUID()}.${ext}`
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, { method:"POST", headers: { ...storageHeaders(admin.token), "Content-Type":file.type, "x-upsert":"false" }, body: bytes })
  if (!response.ok) return NextResponse.json({ error: "Upload failed. Check storage permissions or file size." }, { status: 502 })
  return NextResponse.json({ name }, { status: 201 })
}
export async function DELETE(request: NextRequest) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name } = await request.json().catch(()=>({ name: "" }))
  if (typeof name !== "string" || !/^[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|webm)$/.test(name)) return NextResponse.json({ error: "Invalid file" }, { status: 400 })
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, { method:"DELETE", headers: storageHeaders(admin.token) })
  if (!response.ok) return NextResponse.json({ error: "Delete failed" }, { status: 502 })
  return NextResponse.json({ ok: true })
}
