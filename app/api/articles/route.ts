import {NextRequest,NextResponse} from "next/server"
import {adminRequest} from "@/lib/supabase-admin"
import {articleForUi,categories,validDate,uploadImage} from "@/lib/treksor-articles"
export async function GET(){
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 const r=await a.request("articles?select=*&order=created_at.desc")
 return r.ok?NextResponse.json({data:(await r.json()).map((x:any)=>articleForUi(x,a.url))}):NextResponse.json({error:"Unable to load"},{status:502})
}
export async function POST(req:NextRequest){
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 let f:FormData;try{f=await req.formData()}catch{return NextResponse.json({error:"Invalid form"},{status:400})}
 const title=f.get("title"),description=f.get("description"),body=f.get("body"),category=f.get("category"),date=f.get("date"),status=f.get("status")
 if(typeof title!=="string"||!title.trim()||title.length>200||typeof description!=="string"||description.length>2000||typeof body!=="string"||body.length>200000||typeof category!=="string"||!categories.includes(category as any)||!validDate(date)||!["draft","published"].includes(String(status)))return NextResponse.json({error:"Invalid fields"},{status:400})
 const image=await uploadImage(a,f.get("image"));if(image.error)return NextResponse.json({error:image.error},{status:400})
 const r=await a.request("articles",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({title:title.trim(),description,body,category,publish_date:date,image_path:image.path,status})})
 return r.ok?NextResponse.json({data:articleForUi((await r.json())[0],a.url)},{status:201}):NextResponse.json({error:"Unable to save article"},{status:400})
}
