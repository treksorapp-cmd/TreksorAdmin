import { adminRequest } from "@/lib/supabase-admin"
export const categories = ["Body","Mind","Balance","Purpose"] as const
export function validDate(v: unknown): v is string { return typeof v==="string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v+"T00:00:00Z")) }
export function articleForUi(r:any, url:string) {
 const image=r.image_path ? `${url}/storage/v1/object/public/article-images/${r.image_path}` : ""
 return {_id:r.id,title:r.title,description:r.description,body:r.body,category:r.category,image,createdAt:r.created_at,date:r.publish_date,status:r.status}
}
export async function uploadImage(admin:NonNullable<Awaited<ReturnType<typeof adminRequest>>>, image:FormDataEntryValue|null) {
 if(!(image instanceof File) || !image.size) return {path:null,error:null}
 if(image.size>5*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(image.type)) return {path:null,error:"Invalid image type or size"}
 const ext=image.type==="image/jpeg"?"jpg":image.type==="image/png"?"png":"webp"
 const path=`${crypto.randomUUID()}.${ext}`
 const result=await fetch(`${admin.url}/storage/v1/object/article-images/${path}`,{method:"POST",headers:{apikey:admin.headers.get("apikey")!,Authorization:admin.headers.get("Authorization")!,"Content-Type":image.type,"x-upsert":"false"},body:await image.arrayBuffer(),cache:"no-store"})
 return result.ok?{path,error:null}:{path:null,error:"Image upload failed"}
}
