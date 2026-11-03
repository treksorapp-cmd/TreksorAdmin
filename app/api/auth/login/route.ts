import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/supabase-admin"
export async function POST(request: NextRequest) {
 try {
  const { email, password } = await request.json()
  if (typeof email !== "string" || typeof password !== "string" || !email || !password)
   return NextResponse.json({error:"Invalid credentials"},{status:400})
  const {url,key}=config()
  const auth=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:key},body:JSON.stringify({email,password}),cache:"no-store"})
  if(!auth.ok) return NextResponse.json({error:"Invalid credentials"},{status:401})
  const session=await auth.json()
  const membership=await fetch(`${url}/rest/v1/admin_members?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`,{headers:{apikey:key,Authorization:`Bearer ${session.access_token}`},cache:"no-store"})
  if(!membership.ok || !(await membership.json()).length) return NextResponse.json({error:"Administrator access required"},{status:403})
  const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}})
  response.cookies.set("treksor_access",session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:Math.min(session.expires_in||3600,3600)})
  response.cookies.set("treksor_refresh",session.refresh_token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7})
  return response
 }catch{return NextResponse.json({error:"Unable to sign in"},{status:500})}
}
