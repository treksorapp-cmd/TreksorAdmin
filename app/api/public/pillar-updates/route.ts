import { NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"
import { publicationDay } from "@/lib/publication"
export const dynamic="force-dynamic"
export async function GET(){
 const {url,key}=config();const headers={apikey:key};
 const endpoints=[`articles?select=id,title,description,image_path,category,publish_date,updated_at&status=eq.published&publish_date=lte.${publicationDay()}&order=publish_date.desc&limit=100`,`power_thoughts?select=id,thought,publish_date,updated_at&status=eq.published&publish_date=lte.${publicationDay()}&order=publish_date.desc&limit=60`,"workout_exercises?select=id,name,created_at&status=eq.published&limit=100","media_labels?select=path,exercise_slug,display_name&exercise_slug=not.is.null&limit=100"]
 const result=await Promise.all(endpoints.map(async endpoint=>{const r=await fetch(`${url}/rest/v1/${endpoint}`,{headers,cache:"no-store"});return r.ok?await r.json():null}))
 if(result.some(rows=>rows===null))return NextResponse.json({error:"Updates unavailable"},{status:502})
 const items=[
  ...result[0].map((a:any)=>({id:`article:${a.id}:${a.updated_at}`,kind:"article",title:a.title,summary:a.description,pillar:a.category,publishedAt:a.publish_date,image:a.image_path?`${url}/storage/v1/object/public/article-images/${a.image_path}`:null,href:`${a.category==="Body"?"/body/articles":a.category==="Mind"?"/mental/articles":a.category==="Balance"?"/spiritual/articles":"/(tabs)/articles"}/${a.id}`})),
  ...result[1].map((a:any)=>({id:`thought:${a.id}:${a.updated_at}`,kind:"thought",title:a.thought,pillar:"Mind",publishedAt:a.publish_date,href:"/mental/thoughts"})),
  ...result[2].map((a:any)=>({id:`exercise:${a.id}:${a.created_at}`,kind:"exercise",title:a.name,pillar:"Body",publishedAt:a.created_at,href:`/body/workout/details?id=${a.id}`})),
  ...result[3].map((a:any)=>({id:`video:${a.path}:${a.exercise_slug}`,kind:"video",title:a.display_name,pillar:"Body",href:`/body/workout/details?id=${encodeURIComponent(a.exercise_slug)}`}))
 ].sort((a,b)=>(b.publishedAt||"").localeCompare(a.publishedAt||""))
 return NextResponse.json({items},{headers:{"Cache-Control":"no-store"}})
}
