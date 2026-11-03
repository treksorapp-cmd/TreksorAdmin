import Link from "next/link"
import { ArrowRight } from "lucide-react"

const sections = [{"name":"Articles","href":"/dashboard/articles","desc":"Develop content about rest, meditation and balance."},{"name":"Power Thoughts","href":"/dashboard/power-thoughts","desc":"Create mindful prompts and reflections."}]

export default function PillarPage() {
  return <main className="mx-auto max-w-6xl space-y-8 pb-12 text-foreground">
    <header className="rounded-2xl border border-[#D7B877]/20 bg-[linear-gradient(120deg,#19222C,#111820)] px-7 py-10 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D7B877]">Treksor pillars</p>
      <h1 className="mt-3 font-sans text-5xl text-foreground">Balance</h1>
      <p className="mt-4 max-w-2xl text-secondary-foreground">Cultivate recovery, mindfulness and inner wellbeing.</p>
    </header>
    <section className="grid gap-4 md:grid-cols-2" aria-label="Balance management">
      {sections.map(section => <Link key={section.href} href={section.href} className="group rounded-2xl border border-white/10 bg-[#111820] p-6 transition hover:border-[#D7B877]/60">
        <div className="flex items-center justify-between gap-4"><h2 className="font-sans text-2xl text-foreground">{section.name}</h2><ArrowRight className="h-5 w-5 text-[#D7B877] transition group-hover:translate-x-1" /></div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.desc}</p>
      </Link>)}
    </section>
    <p className="text-sm text-muted-foreground">Additional pillar-specific tools will appear here as they are implemented. Shared editorial tools remain accessible from the main navigation.</p>
  </main>
}
