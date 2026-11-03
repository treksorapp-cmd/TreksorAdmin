import { adminRequest } from "@/lib/supabase-admin"
export const categories = ["Body","Mind","Balance","Purpose"] as const
export function validDate(v: unknown): v is string { return typeof v==="string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v+"T00:00:00Z")) && new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v }
export function articleForUi(r:any, url:string) {
 const image=r.image_path ? `${url}/storage/v1/object/public/article-images/${r.image_path}` : ""
 return {_id:r.id,title:r.title,description:r.description,body:r.body,category:r.category,image,createdAt:r.created_at,date:r.publish_date,status:r.status}
}
export async function uploadImage(admin:NonNullable<Awaited<ReturnType<typeof adminRequest>>>, image:FormDataEntryValue|null) {
 if(!(image instanceof File) || !image.size) return {path:null,error:null}
 if(image.size>5*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(image.type)) return {path:null,error:"Invalid image type or size"}
 const bytes=new Uint8Array(await image.arrayBuffer())
 const jpeg=bytes.length>=3 && bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff
 const png=bytes.length>=8 && [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)
 const webp=bytes.length>=12 && String.fromCharCode(...bytes.slice(0,4))==="RIFF" && String.fromCharCode(...bytes.slice(8,12))==="WEBP"
 if (!((image.type==="image/jpeg" && jpeg)||(image.type==="image/png" && png)||(image.type==="image/webp" && webp))) return {path:null,error:"Image content does not match file type"}
 const ext=image.type==="image/jpeg"?"jpg":image.type==="image/png"?"png":"webp"
 const path=`${crypto.randomUUID()}.${ext}`
 const result=await fetch(`${admin.url}/storage/v1/object/article-images/${path}`,{method:"POST",headers:{apikey:admin.headers.get("apikey")!,Authorization:admin.headers.get("Authorization")!,"Content-Type":image.type,"x-upsert":"false"},body:bytes,cache:"no-store"})
 return result.ok?{path,error:null}:{path:null,error:"Image upload failed"}
}
