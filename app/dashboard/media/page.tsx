import { Images, ImageIcon, Film, ShieldCheck } from "lucide-react"

export default function MediaPage() {
  return <main className="mx-auto max-w-6xl space-y-7 pb-12">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e5b45f]">Content studio</p>
      <h1 className="mt-3 font-serif text-4xl text-white">Media library</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">A dedicated home for Treksor photography, video and footage. Media will be organized here independently from articles.</p>
    </div>
    <section className="rounded-2xl border border-[#b88a47]/30 bg-[#171c1e] p-7 sm:p-10">
      <div className="flex items-center gap-3 text-[#e5b45f]"><Images className="h-7 w-7" /><span className="text-sm font-semibold uppercase tracking-widest">Your future media library</span></div>
      <h2 className="mt-5 text-2xl font-semibold text-white">Photos and videos in one place</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300">The library interface is ready to organize. Uploading is not enabled yet: secure storage, permissions and file-size limits must be connected and tested first. No files will be sent or lost through an unfinished upload form.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-5"><ImageIcon className="h-7 w-7 text-[#e5b45f]" /><h3 className="mt-3 font-semibold text-white">Photography</h3><p className="mt-2 text-sm text-zinc-400">Hero images, portraits, backgrounds and article visuals.</p></div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-5"><Film className="h-7 w-7 text-[#e5b45f]" /><h3 className="mt-3 font-semibold text-white">Footage & video</h3><p className="mt-2 text-sm text-zinc-400">Clips, brand films and video assets for future pages.</p></div>
      </div>
      <p className="mt-7 flex items-start gap-2 text-xs leading-6 text-zinc-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#e5b45f]" /> Secure uploads will be available only to authenticated Treksor administrators after storage setup.</p>
    </section>
  </main>
}
