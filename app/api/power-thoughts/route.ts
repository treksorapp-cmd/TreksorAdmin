import { NextRequest, NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"
import { validDate } from "@/lib/treksor-articles"
export async function GET() {
 const admin=await adminRequest("")
 if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401})
 const result=await admin.request("power_thoughts?select=id,thought,publish_date,status,created_at&order=publish_date.desc")
 if(!result.ok) return NextResponse.json({error:"Unable to load thoughts"},{status:502})
 const rows=await result.json()
 return NextResponse.json({data:rows.map((r:any)=>({_id:r.id,thought:r.thought,date:r.publish_date,status:r.status,createdAt:r.created_at}))})
}
export async function POST(request:NextRequest) {
 const admin=await adminRequest("")
 if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401})
 let body:any
 try {body=await request.json()} catch {return NextResponse.json({error:"Invalid JSON"},{status:400})}
 if(typeof body.thought!=="string"||body.thought.trim().length<1||body.thought.trim().length>250||!validDate(body.date))
  return NextResponse.json({error:"Invalid thought or date"},{status:400})
 const result=await admin.request("power_thoughts",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({thought:body.thought.trim(),publish_date:body.date,status:"published"})})
 if(!result.ok) return NextResponse.json({error:"Unable to save thought"},{status:result.status===409?409:400})
 return NextResponse.json({data:await result.json()},{status:201})
}
