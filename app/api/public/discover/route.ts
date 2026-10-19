import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"
export const dynamic="force-dynamic"
export async function GET(req:NextRequest) {
 const type=req.nextUrl.searchParams.get("type")
 if(type!=="events"&&type!=="exercises")return NextResponse.json({error:"Invalid type"},{status:400})
 const {url,key}=config()
 const endpoint=new URL(`${url}/rest/v1/${type==="events"?"community_events":"workout_exercises"}`)
 endpoint.searchParams.set("select",type==="events"?"id,title,description,category,city,meeting_point,starts_at,capacity,organizer_name":"id,name,muscle_group,location,equipment,instructions,video_path,sets,reps,rest_seconds")
 endpoint.searchParams.set("status","eq.published")
 if(type==="events")endpoint.searchParams.set("starts_at",`gt.${new Date().toISOString()}`)
 endpoint.searchParams.set("limit","100")
 endpoint.searchParams.set("order",type==="events"?"starts_at.asc":"name.asc")
 const r=await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:"no-store"})
 return r.ok?NextResponse.json({data:await r.json()},{headers:{"Cache-Control":"public,max-age=60"}}):NextResponse.json({error:"Unavailable"},{status:502})
}
