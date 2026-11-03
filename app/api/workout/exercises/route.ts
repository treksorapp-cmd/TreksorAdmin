import { NextRequest, NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"
export async function GET() {
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 const r=await a.request("workout_exercises?select=*&order=created_at.desc")
 return r.ok?NextResponse.json({data:await r.json()}):NextResponse.json({error:"Unable to load exercises"},{status:502})
}
export async function POST(req:NextRequest) {
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400})}
 if(typeof b.name!=="string"||b.name.trim().length<2||b.name.length>120||!["Chest","Back","Shoulders","Arms","Legs","Glutes","Core"].includes(b.muscle_group)||!["Gym","Home","Both"].includes(b.location)||!["draft","published"].includes(b.status))return NextResponse.json({error:"Invalid exercise fields"},{status:400})
 const r=await a.request("workout_exercises",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({name:b.name.trim(),muscle_group:b.muscle_group,location:b.location,equipment:String(b.equipment||"").slice(0,200),instructions:String(b.instructions||"").slice(0,5000),sets:Number.isInteger(Number(b.sets))?Math.min(10,Math.max(1,Number(b.sets))):3,reps:typeof b.reps==="string"?b.reps.slice(0,30):"8-12",rest_seconds:Number.isInteger(Number(b.rest_seconds))?Math.min(600,Math.max(0,Number(b.rest_seconds))):90,video_path:typeof b.video_path==="string"&&b.video_path.trim()?b.video_path.trim():null,status:b.status})})
 return r.ok?NextResponse.json({data:(await r.json())[0]},{status:201}):NextResponse.json({error:"Unable to save exercise"},{status:400})
}
