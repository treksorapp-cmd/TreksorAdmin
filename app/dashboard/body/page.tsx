import Link from "next/link"
import { ArrowRight } from "lucide-react"

const sections = [{"name":"Workout Library","href":"/dashboard/workout","desc":"Manage exercises, instructions and demonstration videos."},{"name":"Media Library","href":"/dashboard/media","desc":"Upload workout demonstrations and visual assets."}]

export default function PillarPage() {
  return <main className="mx-auto max-w-6xl space-y-8 pb-12 text-foreground">
    <header className="rounded-2xl border border-[#D7B877]/20 bg-[linear-gradient(120deg,#19222C,#111820)] px-7 py-10 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D7B877]">Treksor pillars</p>
      <h1 className="mt-3 font-sans text-5xl text-foreground">Body</h1>
      <p className="mt-4 max-w-2xl text-secondary-foreground">Build physical strength, fitness and sustainable wellbeing.</p>
    </header>
    <section className="grid gap-4 md:grid-cols-2" aria-label="Body management">
      {sections.map(section => <Link key={section.href} href={section.href} className="group rounded-2xl border border-white/10 bg-[#111820] p-6 transition hover:border-[#D7B877]/60">
        <div className="flex items-center justify-between gap-4"><h2 className="font-sans text-2xl text-foreground">{section.name}</h2><ArrowRight className="h-5 w-5 text-[#D7B877] transition group-hover:translate-x-1" /></div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.desc}</p>
      </Link>)}
    </section>
    <p className="text-sm text-muted-foreground">Additional pillar-specific tools will appear here as they are implemented. Shared editorial tools remain accessible from the main navigation.</p>
  </main>
}
