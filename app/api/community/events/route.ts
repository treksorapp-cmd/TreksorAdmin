import { NextRequest, NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"
export async function GET() {
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 const r=await a.request("community_events?select=*&order=starts_at.asc")
 return r.ok?NextResponse.json({data:await r.json()}):NextResponse.json({error:"Unable to load events"},{status:502})
}
export async function POST(req:NextRequest) {
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400})}
 if(typeof b.title!=="string"||b.title.trim().length<3||b.title.length>160||typeof b.city!=="string"||!b.city.trim()||!["Hiking","Camping","Fitness","Wellness","Other"].includes(b.category)||!Number.isInteger(b.capacity)||b.capacity<1||b.capacity>500||typeof b.starts_at!=="string"||!Number.isFinite(Date.parse(b.starts_at))||Date.parse(b.starts_at)<=Date.now()||!["draft","published"].includes(b.status))return NextResponse.json({error:"Invalid event fields"},{status:400})
 const r=await a.request("community_events",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({title:b.title.trim(),description:String(b.description||"").slice(0,5000),category:b.category,city:b.city.trim().slice(0,120),meeting_point:String(b.meeting_point||"").slice(0,200),starts_at:b.starts_at,capacity:b.capacity,status:b.status,organizer_name:String(b.organizer_name||"Treksor").slice(0,100)})})
 return r.ok?NextResponse.json({data:(await r.json())[0]},{status:201}):NextResponse.json({error:"Unable to save event"},{status:400})
}
