import { NextRequest, NextResponse } from "next/server"
import { publicationDay, PUBLICATION_TIME_ZONE } from "@/lib/publication"
import { config } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type")
  if (type !== "articles" && type !== "thoughts") return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  const { url, key } = config()
  const table = type === "articles" ? "articles" : "power_thoughts"
  const endpoint = new URL(`${url}/rest/v1/${table}`)
  endpoint.searchParams.set("select", type === "articles" ? "id,title,description,body,category,image_path,publish_date,created_at" : "id,thought,publish_date,created_at")
  endpoint.searchParams.set("status", "eq.published")
  endpoint.searchParams.set("publish_date", `lte.${publicationDay()}`)
  endpoint.searchParams.set("order", "publish_date.desc,created_at.desc,id.desc")
  endpoint.searchParams.set("limit", "100")
  const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" })
  if (!response.ok) return NextResponse.json({ error: "Content temporarily unavailable" }, { status: 502 })
  const rows = await response.json()
  const data = type === "articles" ? rows.map((row: any) => ({
    _id: row.id, title: row.title, description: row.description, body: row.body, category: row.category,
    image: row.image_path ? `${url}/storage/v1/object/public/article-images/${encodeURIComponent(row.image_path)}` : "",
    createdAt: row.created_at, date: row.publish_date
  })) : rows.map((row: any) => ({ _id: row.id, thought: row.thought, date: row.publish_date, createdAt: row.created_at }))
  return NextResponse.json({ data, publicationDate: publicationDay(), timeZone: PUBLICATION_TIME_ZONE, total: data.length, page: 1, totalPages: 1 }, { headers: { "Cache-Control": "no-store" } })
}
