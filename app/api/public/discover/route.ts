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
 if(!r.ok)return NextResponse.json({error:"Unavailable"},{status:502})
 const data=await r.json()
 if(type==="exercises"){
  const paths=Array.from(new Set(data.map((item:any)=>item.video_path).filter((path:unknown)=>typeof path==="string"&&/^[a-f0-9-]{36}\.(mp4|mov|webm)$/.test(path as string))))
  if(paths.length){
   const signed=await fetch(`${url}/storage/v1/object/sign/treksor-media`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({paths,expiresIn:900}),cache:"no-store"})
   if(signed.ok){const links=await signed.json();for(const item of data){const path=links.find((link:any)=>link.path===item.video_path)?.signedURL;if(typeof path==="string")item.videoUrl=path.startsWith("http")?path:`${url}/storage/v1${path}`}}
  }
 }
 return NextResponse.json({data},{headers:{"Cache-Control":"public,max-age=60"}})
}
