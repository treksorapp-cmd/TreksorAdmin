import Link from "next/link"
import { ArrowRight } from "lucide-react"

const sections = [{"name":"Workout Library","href":"/dashboard/workout","desc":"Manage exercises, instructions and demonstration videos."},{"name":"Media Library","href":"/dashboard/media","desc":"Upload workout demonstrations and visual assets."}]

export default function PillarPage() {
  return <main className="mx-auto max-w-6xl space-y-8 pb-12 text-zinc-100">
    <header className="rounded-2xl border border-[#d5a652]/20 bg-[linear-gradient(120deg,#292219,#11191c)] px-7 py-10 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d5a652]">Treksor pillars</p>
      <h1 className="mt-3 font-serif text-5xl text-white">Body</h1>
      <p className="mt-4 max-w-2xl text-zinc-300">Build physical strength, fitness and sustainable wellbeing.</p>
    </header>
    <section className="grid gap-4 md:grid-cols-2" aria-label="Body management">
      {sections.map(section => <Link key={section.href} href={section.href} className="group rounded-2xl border border-white/10 bg-[#141b1f] p-6 transition hover:border-[#d5a652]/60">
        <div className="flex items-center justify-between gap-4"><h2 className="font-serif text-2xl text-white">{section.name}</h2><ArrowRight className="h-5 w-5 text-[#d5a652] transition group-hover:translate-x-1" /></div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{section.desc}</p>
      </Link>)}
    </section>
    <p className="text-sm text-zinc-500">Additional pillar-specific tools will appear here as they are implemented. Shared editorial tools remain accessible from the main navigation.</p>
  </main>
}
