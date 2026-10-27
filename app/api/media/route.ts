import { NextRequest, NextResponse } from "next/server"
import { adminRequest, config } from "@/lib/supabase-admin"

export const runtime = "nodejs"
const BUCKET = "treksor-media"
const TYPES = new Set(["image/jpeg","image/png","image/webp","video/mp4","video/quicktime","video/webm","audio/wav"])
const MAX = 50 * 1024 * 1024
function storageHeaders(token: string) { const { key } = config(); return { apikey: key, Authorization: `Bearer ${token}` } }
export async function GET() {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/list/${BUCKET}`, { method: "POST", headers: { ...storageHeaders(admin.token), "Content-Type": "application/json" }, body: JSON.stringify({ prefix: "", limit: 100, sortBy: { column: "created_at", order: "desc" } }), cache: "no-store" })
  if (!response.ok) return NextResponse.json({ error: "Unable to load media" }, { status: 502 })
  const files = await response.json() as { name: string; id: string; created_at: string; metadata?: { mimetype?: string; size?: number } }[]
  const labelsResponse = await admin.request("media_labels?select=*")
  const labels = labelsResponse.ok ? await labelsResponse.json() : []
  const previews = await Promise.all(files.filter(file => file.id).map(async file => {
    const sign = await fetch(`${url}/storage/v1/object/sign/${BUCKET}/${encodeURIComponent(file.name)}`, { method:"POST", headers:{ ...storageHeaders(admin.token), "Content-Type":"application/json" }, body:JSON.stringify({ expiresIn: 900 }), cache:"no-store" })
    const result = sign.ok ? await sign.json() as { signedURL?: string } : {}
    const signed = result.signedURL
    return { displayName:labels.find((label:any)=>label.path===file.name)?.display_name || file.name, exerciseSlug:labels.find((label:any)=>label.path===file.name)?.exercise_slug || "", name:file.name, createdAt:file.created_at, type:file.metadata?.mimetype ?? "", size:file.metadata?.size ?? 0, url: signed ? (signed.startsWith("http") ? signed : `${url}/storage/v1${signed.startsWith("/") ? "" : "/"}${signed}`) : null }
  }))
  return NextResponse.json({ files: previews })
}
export async function POST(request: NextRequest) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file" }, { status: 400 })
  const mime = /\.wav$/i.test(file.name) && ["audio/wav","audio/x-wav","audio/wave","audio/vnd.wave","audio/x-pn-wav","application/octet-stream", ""].includes(file.type) ? "audio/wav" : file.type
  if (!TYPES.has(mime) || file.size === 0 || file.size > MAX) return NextResponse.json({ error: "Use JPG, PNG, WebP, MP4, MOV, WebM or WAV up to 50 MB" }, { status: 400 })
  const bytes = new Uint8Array(await file.arrayBuffer())
  const wav = bytes.length>=12 && String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WAVE"
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png = bytes.slice(0,8).every((b,i)=>b===[137,80,78,71,13,10,26,10][i])
  const webp = String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP"
  const mp4 = String.fromCharCode(...bytes.slice(4,8)) === "ftyp"
  const webm = bytes[0]===0x1a && bytes[1]===0x45 && bytes[2]===0xdf && bytes[3]===0xa3
  if (!(mime==="image/jpeg"&&jpg || mime==="image/png"&&png || mime==="image/webp"&&webp || ["video/mp4","video/quicktime"].includes(mime)&&mp4 || mime==="video/webm"&&webm || mime==="audio/wav"&&wav)) return NextResponse.json({ error: "File content does not match its format" }, { status: 400 })
  const ext = ({ "image/jpeg":"jpg","image/png":"png","image/webp":"webp","video/mp4":"mp4","video/quicktime":"mov","video/webm":"webm","audio/wav":"wav" } as Record<string,string>)[mime]
  const name = `${crypto.randomUUID()}.${ext}`
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, { method:"POST", headers: { ...storageHeaders(admin.token), "Content-Type":mime, "x-upsert":"false" }, body: bytes })
  if (!response.ok) return NextResponse.json({ error: "Upload failed. Check storage permissions or file size." }, { status: 502 })
  const label = await admin.request("media_labels", {method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({path:name,display_name:file.name.slice(0,200)})})
  if(!label.ok) return NextResponse.json({name, warning:"Uploaded; rename this file in Media."},{status:201})
  return NextResponse.json({ name }, { status: 201 })
}
export async function DELETE(request: NextRequest) {
  const admin = await adminRequest("")
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name } = await request.json().catch(()=>({ name: "" }))
  if (typeof name !== "string" || !/^[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|webm|wav)$/.test(name)) return NextResponse.json({ error: "Invalid file" }, { status: 400 })
  const { url } = config()
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, { method:"DELETE", headers: storageHeaders(admin.token) })
  if (!response.ok) return NextResponse.json({ error: "Delete failed" }, { status: 502 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
 const admin=await adminRequest("");if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401})
 const body=await request.json().catch(()=>null)
 if(!body||typeof body.name!=="string"||!/^[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|webm|wav)$/.test(body.name)||typeof body.displayName!=="string"||!body.displayName.trim()||body.displayName.length>200||typeof body.exerciseSlug!=="string"||! /^[a-z0-9-]{0,120}$/.test(body.exerciseSlug))return NextResponse.json({error:"Invalid name or exercise"},{status:400})
 const result=await admin.request("media_labels?on_conflict=path",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({path:body.name,display_name:body.displayName.trim(),exercise_slug:body.exerciseSlug||null})})
 return result.ok?NextResponse.json({ok:true}):NextResponse.json({error:"Unable to save. An exercise can have only one linked video."},{status:400})
}
