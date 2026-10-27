import { NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"
import { publicationDay } from "@/lib/publication"
export const dynamic="force-dynamic"
export async function GET(){
 const {url,key}=config();const headers={apikey:key};
 const endpoints=[`articles?select=id,title,category,publish_date,updated_at&status=eq.published&publish_date=lte.${publicationDay()}`,`power_thoughts?select=id,thought,publish_date,updated_at&status=eq.published&publish_date=lte.${publicationDay()}`,"workout_exercises?select=id,name,created_at&status=eq.published","media_labels?select=path,exercise_slug,display_name&exercise_slug=not.is.null"]
 const result=await Promise.all(endpoints.map(async endpoint=>{const r=await fetch(`${url}/rest/v1/${endpoint}`,{headers,cache:"no-store"});return r.ok?await r.json():null}))
 if(result.some(rows=>rows===null))return NextResponse.json({error:"Updates unavailable"},{status:502})
 const items=[...result[0].map((a:any)=>({id:`article:${a.id}:${a.updated_at}`,title:a.title,pillar:a.category,href:a.category==="Body"?"/body/articles":a.category==="Mind"?"/mental/articles":a.category==="Balance"?"/spiritual/articles":"/(tabs)/articles"})),...result[1].map((a:any)=>({id:`thought:${a.id}:${a.updated_at}`,title:"New Power Thought",pillar:"Mind",href:"/mental/thoughts"})),...result[2].map((a:any)=>({id:`exercise:${a.id}:${a.created_at}`,title:a.name,pillar:"Body",href:"/body/workout/library"})),...result[3].map((a:any)=>({id:`video:${a.path}:${a.exercise_slug}`,title:`Video · ${a.display_name}`,pillar:"Body",href:"/body/workout/my-plan"}))]
 return NextResponse.json({items},{headers:{"Cache-Control":"no-store"}})
}
