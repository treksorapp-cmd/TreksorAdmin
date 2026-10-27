import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
  if (!id || !/^[a-z0-9-]{1,120}$/.test(id)) {
    return NextResponse.json({ error: "Invalid exercise" }, { status: 400 })
  }
  const { url, key } = config()
  const headers = { apikey: key, Authorization: "Bearer " + key }
  const labels=await fetch(url+"/rest/v1/media_labels?select=path&exercise_slug=eq."+encodeURIComponent(id),{headers,cache:"no-store"})
  const assignments=labels.ok?await labels.json():[]
  let filename=assignments[0]?.path
  if(!filename && /^[a-f0-9-]{36}$/.test(id)){
   const response=await fetch(url+"/rest/v1/workout_exercises?select=video_path&id=eq."+id+"&status=eq.published",{headers,cache:"no-store"})
   if(response.ok)filename=(await response.json())[0]?.video_path
  }
  if (typeof filename !== "string" || !/^[a-f0-9-]{36}\.(mp4|mov|webm)$/.test(filename)) {
    return NextResponse.json({ error: "Video unavailable" }, { status: 404 })
  }
  const signed = await fetch(url + "/storage/v1/object/sign/treksor-media/" + filename, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 900 }),
    cache: "no-store"
  })
  if (!signed.ok) return NextResponse.json({ error: "Video unavailable" }, { status: 502 })
  const path = (await signed.json()).signedURL
  if (typeof path !== "string") return NextResponse.json({ error: "Video unavailable" }, { status: 502 })
  const playback = path.startsWith("http") ? path : url + "/storage/v1" + (path.startsWith("/") ? "" : "/") + path
  return NextResponse.json({ url: playback }, { headers: { "Cache-Control": "no-store" } })
}
