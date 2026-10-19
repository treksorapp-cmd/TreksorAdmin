import {NextRequest,NextResponse} from "next/server"
import {adminRequest} from "@/lib/supabase-admin"
import {articleForUi,categories,uploadImage} from "@/lib/treksor-articles"
const uuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
export async function GET(_req:NextRequest,{params}:{params:Promise<{_id:string}>}){
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 if(!uuid((await params)._id))return NextResponse.json({error:"Invalid ID"},{status:400})
 const r=await a.request(`articles?id=eq.${(await params)._id}&select=*`)
 if(!r.ok)return NextResponse.json({error:"Unable to load"},{status:502})
 const rows=await r.json();return rows.length?NextResponse.json({article:articleForUi(rows[0],a.url)}):NextResponse.json({error:"Not found"},{status:404})
}
export async function PATCH(req:NextRequest,{params}:{params:Promise<{_id:string}>}){
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 if(!uuid((await params)._id))return NextResponse.json({error:"Invalid ID"},{status:400})
 let f:FormData;try{f=await req.formData()}catch{return NextResponse.json({error:"Invalid form"},{status:400})}
 const title=f.get("title"),description=f.get("description"),body=f.get("body"),category=f.get("category")
 if(typeof title!=="string"||!title.trim()||title.length>200||typeof description!=="string"||description.length>2000||typeof body!=="string"||body.length>200000||typeof category!=="string"||!categories.includes(category as any))return NextResponse.json({error:"Invalid fields"},{status:400})
 const image=await uploadImage(a,f.get("image"));if(image.error)return NextResponse.json({error:image.error},{status:400})
 const fields:any={title:title.trim(),description,body,category,updated_at:new Date().toISOString()};if(image.path)fields.image_path=image.path
 const r=await a.request(`articles?id=eq.${(await params)._id}`,{method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(fields)})
 if(!r.ok)return NextResponse.json({error:"Unable to update"},{status:400})
 const rows=await r.json();return rows.length?NextResponse.json({article:articleForUi(rows[0],a.url)}):NextResponse.json({error:"Not found"},{status:404})
}
export async function DELETE(_req:NextRequest,{params}:{params:Promise<{_id:string}>}){
 const a=await adminRequest("");if(!a)return NextResponse.json({error:"Unauthorized"},{status:401})
 if(!uuid((await params)._id))return NextResponse.json({error:"Invalid ID"},{status:400})
 const r=await a.request(`articles?id=eq.${(await params)._id}`,{method:"DELETE"})
 return r.ok?NextResponse.json({success:true}):NextResponse.json({error:"Unable to delete"},{status:502})
}
