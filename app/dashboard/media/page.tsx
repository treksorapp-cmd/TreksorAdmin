"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Film, ImageIcon, RefreshCw, Trash2, UploadCloud } from "lucide-react"
type Media = { name: string; type: string; size: number; createdAt: string; url: string | null }
export default function MediaPage() {
  const [files,setFiles]=useState<Media[]>([])
  const [kind,setKind]=useState<"photos"|"videos">("photos")
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState("")
  const input=useRef<HTMLInputElement>(null)
  const load=useCallback(async()=>{try{const r=await fetch("/api/media",{cache:"no-store"});if(!r.ok)throw Error("Could not load media");setFiles((await r.json()).files)}catch(e){setMessage(e instanceof Error?e.message:"Unable to load files")}},[])
  useEffect(()=>{void load()},[load])
  async function upload(file?:File) {
    if(!file)return
    setBusy(true);setMessage("")
    try{const form=new FormData();form.append("file",file);const r=await fetch("/api/media",{method:"POST",body:form});const data=await r.json();if(!r.ok)throw Error(data.error||"Upload failed");setMessage("Upload completed successfully");await load()}catch(e){setMessage(e instanceof Error?e.message:"Upload failed")}finally{setBusy(false);if(input.current)input.current.value=""}
  }
  async function remove(name:string){
    if(!window.confirm("Delete this file permanently?"))return
    setBusy(true);setMessage("")
    try{const r=await fetch("/api/media",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});if(!r.ok)throw Error("Unable to delete file");await load()}catch(e){setMessage(e instanceof Error?e.message:"Unable to delete file")}finally{setBusy(false)}
  }
  const visible=files.filter(file=>kind==="photos"?file.type.startsWith("image/"):file.type.startsWith("video/"))
  return <main className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="rounded-2xl border border-white/10 bg-[linear-gradient(115deg,#14191a,#33271b)] p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5b45f]">Treksor creative studio</p>
      <h1 className="mt-3 font-serif text-4xl text-white">Media library</h1>
      <p className="mt-3 text-sm text-zinc-300">A private home for your photography and footage. Select a collection to upload and manage your files.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2">
      <button onClick={()=>setKind("photos")} className={`rounded-2xl border p-6 text-left transition-colors ${kind==="photos"?"border-[#dcb16b] bg-[#3b2b1b]":"border-white/10 bg-[#141b1f] hover:border-white/30"}`}><ImageIcon className="h-8 w-8 text-[#e5b45f]"/><h2 className="mt-4 text-xl font-semibold text-white">Photos</h2><p className="mt-2 text-sm text-zinc-400">JPG, PNG and WebP</p></button>
      <button onClick={()=>setKind("videos")} className={`rounded-2xl border p-6 text-left transition-colors ${kind==="videos"?"border-[#dcb16b] bg-[#3b2b1b]":"border-white/10 bg-[#141b1f] hover:border-white/30"}`}><Film className="h-8 w-8 text-[#e5b45f]"/><h2 className="mt-4 text-xl font-semibold text-white">Videos & footage</h2><p className="mt-2 text-sm text-zinc-400">MP4, MOV and WebM</p></button>
    </div>
    <section className="rounded-2xl border border-white/10 bg-[#141b1f] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-xl font-semibold text-white">{kind==="photos"?"Your photos":"Your footage"}</h2><p className="mt-1 text-sm text-zinc-400">Private storage · 25 MB maximum per file</p></div>
        <div className="flex gap-2"><button onClick={()=>void load()} className="rounded-lg border border-white/20 p-3 text-zinc-300" aria-label="Refresh files"><RefreshCw className="h-4 w-4"/></button><button disabled={busy} onClick={()=>input.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-[#e5b45f] px-5 py-3 text-sm font-bold text-[#15120d] disabled:opacity-50"><UploadCloud className="h-4 w-4"/>{busy?"Working…":"Upload file"}</button></div>
      </div>
      <input ref={input} type="file" className="hidden" accept={kind==="photos"?"image/jpeg,image/png,image/webp":"video/mp4,video/quicktime,video/webm"} onChange={e=>void upload(e.target.files?.[0])}/>
      {message&&<p role="status" className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-[#e5b45f]">{message}</p>}
      {visible.length===0?<div className="mt-8 rounded-xl border border-dashed border-white/15 p-12 text-center"><UploadCloud className="mx-auto h-9 w-9 text-[#e5b45f]"/><p className="mt-4 text-sm text-zinc-300">No {kind} uploaded yet. Select Upload file to get started.</p></div>:<div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map(file=><div key={file.name} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-[#24282a]">{file.url?(kind==="photos"?<img src={file.url} alt="Uploaded Treksor media" className="h-full w-full object-cover"/>:<video src={file.url} controls preload="metadata" className="h-full w-full"/>):(kind==="photos"?<ImageIcon className="h-10 w-10 text-[#e5b45f]"/>:<Film className="h-10 w-10 text-[#e5b45f]"/>)}</div><p className="mt-3 truncate text-xs text-zinc-300">{file.name}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-zinc-500">{(file.size/1024/1024).toFixed(1)} MB</span><button disabled={busy} onClick={()=>void remove(file.name)} aria-label="Delete file" className="text-zinc-400 hover:text-red-400"><Trash2 className="h-4 w-4"/></button></div></div>)}</div>}
    </section>
  </main>
}
