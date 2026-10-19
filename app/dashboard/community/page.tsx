"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
const initial={"title":"","city":"","meeting_point":"","organizer_name":"Treksor","starts_at":"","capacity":12,"description":"","category":"Hiking","status":"draft"}
const fields=[["title","Event title","text"],["city","City","text"],["meeting_point","Meeting point","text"],["organizer_name","Organizer","text"],["starts_at","Start date and time","datetime-local"],["capacity","Capacity","number"],["description","Description","text"]]
const choices={"category":["Hiking","Camping","Fitness","Wellness","Other"],"status":["draft","published"]}
const columns=["title","city","category","starts_at","status"]
export default function ManagementPage(){
 const [form,setForm]=useState<any>(initial)
 const [rows,setRows]=useState<any[]>([])
 const [busy,setBusy]=useState(false)
 const [message,setMessage]=useState("")
 async function load(){const r=await fetch("/api/community/events",{cache:"no-store"});if(r.ok)setRows((await r.json()).data||[]);else setMessage("Unable to load records")}
 useEffect(()=>{void load()},[])
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("")
  try{const payload={...form,starts_at:new Date(form.starts_at).toISOString(),capacity:Number(form.capacity)};const r=await fetch("/api/community/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||"Save failed");setForm(initial);setMessage("Saved successfully");await load()}catch(e){setMessage(e instanceof Error?e.message:"Save failed")}finally{setBusy(false)}
 }
 return <main className="space-y-8 text-zinc-100">
 <div><p className="text-xs uppercase tracking-[0.24em] text-[#d5a652]">Treksor Studio</p><h1 className="mt-2 font-serif text-4xl">Community Management</h1><p className="mt-3 max-w-2xl text-sm text-zinc-400">Create and publish local experiences. Organizer approval, registration controls and moderation are upcoming.</p></div>
 <section className="rounded-2xl border border-white/10 bg-[#121719] p-6"><h2 className="mb-5 text-xl font-semibold">Create new</h2>
 <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
 {fields.map(([name,label,type])=><label key={name} className="space-y-2 text-sm text-zinc-300"><span className="block">{label}</span><input required={["title","city","starts_at","name"].includes(name)} type={type} min={type==="number"?1:undefined} value={form[name]??""} onChange={e=>setForm({...form,[name]:e.target.value})} className="w-full rounded-lg border border-white/15 bg-[#090e11] px-3 py-3 text-white"/></label>)}
 {Object.entries(choices).map(([name,options])=><label key={name} className="space-y-2 text-sm text-zinc-300"><span className="block">{name.replace("_"," ")}</span><select value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} className="w-full rounded-lg border border-white/15 bg-[#090e11] px-3 py-3 text-white">{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>)}
 <div className="flex items-center gap-4 md:col-span-2"><button disabled={busy} className="rounded-lg bg-[#d5a652] px-6 py-3 font-semibold text-black disabled:opacity-50">{busy?"Saving...":"Save"}</button><span role="status" className="text-sm text-zinc-300">{message}</span></div>
 </form></section>
 <section className="rounded-2xl border border-white/10 bg-[#121719] p-6"><h2 className="mb-4 text-xl font-semibold">Records ({rows.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{columns.map(c=><th key={c} className="border-b border-white/10 px-3 py-3 capitalize text-zinc-400">{c.replace("_"," ")}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id}>{columns.map(c=><td key={c} className="border-b border-white/5 px-3 py-3">{String(row[c]??"")}</td>)}</tr>)}</tbody></table></div>{!rows.length&&<p className="py-5 text-sm text-zinc-500">No records yet.</p>}</section>
 </main>
}