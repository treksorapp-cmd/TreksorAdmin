"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Film, ImageIcon, RefreshCw, Trash2, UploadCloud } from "lucide-react"
type Media = { displayName:string; exerciseSlug:string; name: string; type: string; size: number; createdAt: string; url: string | null }
const exercises=[{"id": "barbell-wide-bench-press", "title": "Barbell Wide Bench Press"}, {"id": "cable-middle-fly", "title": "Cable Middle Fly"}, {"id": "dumbbell-lateral-raises", "title": "Dumbbell Lateral Raises"}, {"id": "standing-dumbbell-shoulder-press", "title": "Standing Dumbbell Shoulder Press"}, {"id": "dumbbell-incline-triceps-extension", "title": "Dumbbell Incline Triceps Extension"}, {"id": "cable-triceps-pushdown-ez-bar-close-grip", "title": "Cable Triceps Pushdown (EZ Bar, Close Grip)"}, {"id": "cable-bar-lateral-pulldown", "title": "Cable Bar Lateral Pulldown"}, {"id": "cable-seated-supine-grip-row", "title": "Cable Seated Supine Grip Row"}, {"id": "preacher-curl-ez-bar-wide-grip", "title": "Preacher Curl EZ Bar (Wide Grip)"}, {"id": "dumbbell-hammer-curl", "title": "Dumbbell Hammer Curl"}, {"id": "captains-chair-leg-raise", "title": "Captain\u2019s Chair Leg Raise"}, {"id": "dumbbell-side-bend", "title": "Dumbbell Side Bend"}, {"id": "seated-leg-curl-machine", "title": "Seated Leg Curl Machine"}, {"id": "lying-leg-curl-machine", "title": "Lying Leg Curl Machine"}, {"id": "dumbbell-rear-lunge-stretch", "title": "Dumbbell Rear Lunge Stretch"}, {"id": "alternate-arm-leg-plank", "title": "Alternate Arm-Leg Plank"}]
export default function MediaPage() {
  const [files,setFiles]=useState<Media[]>([])
  const [kind,setKind]=useState<"photos"|"videos"|"audio">("photos")
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
  async function rename(file:Media){
   const displayName=window.prompt("Video / file name",file.displayName);if(!displayName)return
   const exerciseSlug=file.exerciseSlug||""
   setBusy(true);try{const response=await fetch("/api/media",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:file.name,displayName,exerciseSlug})});const data=await response.json();if(!response.ok)throw Error(data.error);await load()}catch(error){setMessage(error instanceof Error?error.message:"Unable to save")}finally{setBusy(false)}
  }
  async function link(file:Media,exerciseSlug:string){setBusy(true);try{const response=await fetch("/api/media",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:file.name,displayName:file.displayName||file.name,exerciseSlug})});if(!response.ok)throw Error((await response.json()).error);await load()}catch(error){setMessage(error instanceof Error?error.message:"Unable to link video")}finally{setBusy(false)}}
  const visible=files.filter(file=>kind==="photos"?file.type.startsWith("image/"):kind==="audio"?file.type.startsWith("audio/"):file.type.startsWith("video/"))
  return <main className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="rounded-2xl border border-white/10 bg-[linear-gradient(115deg,#14191a,#33271b)] p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5b45f]">Treksor creative studio</p>
      <h1 className="mt-3 font-serif text-4xl text-white">Media library</h1>
      <p className="mt-3 text-sm text-zinc-300">A private home for your photography and footage. Select a collection to upload and manage your files.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      <button onClick={()=>setKind("photos")} className={`rounded-2xl border p-6 text-left transition-colors ${kind==="photos"?"border-[#dcb16b] bg-[#3b2b1b]":"border-white/10 bg-[#141b1f] hover:border-white/30"}`}><ImageIcon className="h-8 w-8 text-[#e5b45f]"/><h2 className="mt-4 text-xl font-semibold text-white">Photos</h2><p className="mt-2 text-sm text-zinc-400">JPG, PNG and WebP</p></button>
      <button onClick={()=>setKind("videos")} className={`rounded-2xl border p-6 text-left transition-colors ${kind==="videos"?"border-[#dcb16b] bg-[#3b2b1b]":"border-white/10 bg-[#141b1f] hover:border-white/30"}`}><Film className="h-8 w-8 text-[#e5b45f]"/><h2 className="mt-4 text-xl font-semibold text-white">Videos & footage</h2><p className="mt-2 text-sm text-zinc-400">MP4, MOV and WebM</p></button>
      <button onClick={()=>setKind("audio")} className={`rounded-2xl border p-6 text-left ${kind==="audio"?"border-[#dcb16b] bg-[#3b2b1b]":"border-white/10 bg-[#141b1f]"}`}><h2 className="text-xl font-semibold text-white">Audio & meditations</h2><p className="mt-2 text-sm text-zinc-400">WAV · Preview, rename and manage audio</p></button>
    </div>
    <section className="rounded-2xl border border-white/10 bg-[#141b1f] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-xl font-semibold text-white">{kind==="photos"?"Your photos":kind==="audio"?"Your audio":"Your footage"}</h2><p className="mt-1 text-sm text-zinc-400">Private storage · 50 MB maximum per file</p></div>
        <div className="flex gap-2"><button onClick={()=>void load()} className="rounded-lg border border-white/20 p-3 text-zinc-300" aria-label="Refresh files"><RefreshCw className="h-4 w-4"/></button><button disabled={busy} onClick={()=>input.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-[#e5b45f] px-5 py-3 text-sm font-bold text-[#15120d] disabled:opacity-50"><UploadCloud className="h-4 w-4"/>{busy?"Working…":"Upload file"}</button></div>
      </div>
      <input ref={input} type="file" className="hidden" accept={kind==="photos"?"image/jpeg,image/png,image/webp":kind==="audio"?".wav,audio/wav,audio/x-wav,audio/wave,audio/vnd.wave":"video/mp4,video/quicktime,video/webm"} onChange={e=>void upload(e.target.files?.[0])}/>
      {message&&<p role="status" className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-[#e5b45f]">{message}</p>}
      {visible.length===0?<div className="mt-8 rounded-xl border border-dashed border-white/15 p-12 text-center"><UploadCloud className="mx-auto h-9 w-9 text-[#e5b45f]"/><p className="mt-4 text-sm text-zinc-300">No {kind} uploaded yet. Select Upload file to get started.</p></div>:<div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map(file=><div key={file.name} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-[#24282a]">{file.url?(kind==="photos"?<img src={file.url} alt="Uploaded Treksor media" className="h-full w-full object-cover"/>:kind==="audio"?<audio src={file.url} controls preload="metadata" className="w-full"/>:<video src={file.url} controls preload="metadata" className="h-full w-full"/>):(kind==="photos"?<ImageIcon className="h-10 w-10 text-[#e5b45f]"/>:<Film className="h-10 w-10 text-[#e5b45f]"/>)}</div><p className="mt-3 truncate text-xs text-zinc-300">{file.displayName||file.name}</p><button disabled={busy} onClick={()=>void rename(file)} className="mt-2 text-sm text-[#e5b45f]">Rename</button>{kind==="videos"&&<label className="mt-3 block text-xs text-zinc-400">Exercise in the app<select disabled={busy} value={file.exerciseSlug||""} onChange={event=>void link(file,event.target.value)} className="mt-2 w-full rounded border border-white/20 bg-[#141b1f] p-2 text-white"><option value="">Not linked to an exercise</option>{exercises.map(exercise=><option key={exercise.id} value={exercise.id}>{exercise.title}</option>)}</select></label>}<div className="mt-3 flex items-center justify-between"><span className="text-xs text-zinc-500">{(file.size/1024/1024).toFixed(1)} MB</span><button disabled={busy} onClick={()=>void remove(file.name)} aria-label="Delete file" className="text-zinc-400 hover:text-red-400"><Trash2 className="h-4 w-4"/></button></div></div>)}</div>}
    </section>
  </main>
}
