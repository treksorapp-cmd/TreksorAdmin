import { NextRequest, NextResponse } from "next/server"
import { adminRequest } from "@/lib/supabase-admin"
export async function DELETE(_request:NextRequest,{params}:{params:Promise<{_id:string}>}) {
 const admin=await adminRequest("")
 if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401})
 if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test((await params)._id)) return NextResponse.json({error:"Invalid ID"},{status:400})
 const result=await admin.request(`power_thoughts?id=eq.${encodeURIComponent((await params)._id)}`,{method:"DELETE"})
 if(!result.ok) return NextResponse.json({error:"Unable to delete thought"},{status:502})
 return NextResponse.json({success:true})
}
