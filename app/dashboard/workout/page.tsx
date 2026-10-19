"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
const initial={"name":"","equipment":"","instructions":"","video_path":"","muscle_group":"Chest","location":"Gym","status":"draft"}
const fields=[["name","Exercise name","text"],["equipment","Equipment","text"],["instructions","Instructions","text"],["video_path","Video storage path (optional)","text"]]
const choices={"muscle_group":["Chest","Back","Shoulders","Arms","Legs","Glutes","Core"],"location":["Gym","Home","Both"],"status":["draft","published"]}
const columns=["name","muscle_group","location","status"]
export default function ManagementPage(){
 const [form,setForm]=useState<any>(initial)
 const [rows,setRows]=useState<any[]>([])
 const [busy,setBusy]=useState(false)
 const [message,setMessage]=useState("")
 async function load(){const r=await fetch("/api/workout/exercises",{cache:"no-store"});if(r.ok)setRows((await r.json()).data||[]);else setMessage("Unable to load records")}
 useEffect(()=>{void load()},[])
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("")
  try{const payload={...form};const r=await fetch("/api/workout/exercises",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||"Save failed");setForm(initial);setMessage("Saved successfully");await load()}catch(e){setMessage(e instanceof Error?e.message:"Save failed")}finally{setBusy(false)}
 }
 return <main className="space-y-8 text-zinc-100">
 <div><p className="text-xs uppercase tracking-[0.24em] text-[#d5a652]">Treksor Studio</p><h1 className="mt-2 font-serif text-4xl">Workout Library</h1><p className="mt-3 max-w-2xl text-sm text-zinc-400">Build a video-backed exercise catalog for Gym and Home. Attach uploaded media by its storage path.</p></div>
 <section className="rounded-2xl border border-white/10 bg-[#121719] p-6"><h2 className="mb-5 text-xl font-semibold">Create new</h2>
 <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
 {fields.map(([name,label,type])=><label key={name} className="space-y-2 text-sm text-zinc-300"><span className="block">{label}</span><input required={["title","city","starts_at","name"].includes(name)} type={type} min={type==="number"?1:undefined} value={form[name]??""} onChange={e=>setForm({...form,[name]:e.target.value})} className="w-full rounded-lg border border-white/15 bg-[#090e11] px-3 py-3 text-white"/></label>)}
 {Object.entries(choices).map(([name,options])=><label key={name} className="space-y-2 text-sm text-zinc-300"><span className="block">{name.replace("_"," ")}</span><select value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} className="w-full rounded-lg border border-white/15 bg-[#090e11] px-3 py-3 text-white">{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>)}
 <div className="flex items-center gap-4 md:col-span-2"><button disabled={busy} className="rounded-lg bg-[#d5a652] px-6 py-3 font-semibold text-black disabled:opacity-50">{busy?"Saving...":"Save"}</button><Link href="/dashboard/media" className="text-sm text-[#d5a652] underline">Upload videos in Media</Link><span role="status" className="text-sm text-zinc-300">{message}</span></div>
 </form></section>
 <section className="rounded-2xl border border-white/10 bg-[#121719] p-6"><h2 className="mb-4 text-xl font-semibold">Records ({rows.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{columns.map(c=><th key={c} className="border-b border-white/10 px-3 py-3 capitalize text-zinc-400">{c.replace("_"," ")}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id}>{columns.map(c=><td key={c} className="border-b border-white/5 px-3 py-3">{String(row[c]??"")}</td>)}</tr>)}</tbody></table></div>{!rows.length&&<p className="py-5 text-sm text-zinc-500">No records yet.</p>}</section>
 </main>
}