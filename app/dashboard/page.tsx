import Link from "next/link"
import { getEditorialSignals } from "@/lib/editorial-signals"
import { adminRequest } from "@/lib/supabase-admin"
import { ArrowRight, BarChart3, FileText, Lightbulb, Users, Mountain, Sparkles, Smartphone, Clock3, Globe2, ExternalLink } from "lucide-react"

type Article = { id: string; title: string; publish_date: string; status: string }
type Thought = { id: string; thought: string; publish_date: string; status: string }

async function loadContent() {
  const admin = await adminRequest("")
  if (!admin) return { articles: [] as Article[], thoughts: [] as Thought[] }
  const [a, t] = await Promise.all([
    admin.request("articles?select=id,title,publish_date,status&order=created_at.desc&limit=3"),
    admin.request("power_thoughts?select=id,thought,publish_date,status&order=publish_date.desc&limit=3"),
  ])
  return {
    articles: a.ok ? (await a.json()) as Article[] : [],
    thoughts: t.ok ? (await t.json()) as Thought[] : [],
  }
}

function dateLabel(value: string) {
  const date = /^\\d{4}-\\d{2}-\\d{2}/.test(value) ? new Date(value.slice(0, 10) + "T12:00:00Z") : new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date)
}

function Panel({ title, href, icon, children }: { title: string; href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141b1f]/90 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-3 text-base font-semibold text-white"><span className="text-[#e0ad58]">{icon}</span>{title}</h3>
        <Link href={href} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#e5b45f] hover:text-[#ffcf7a]">View all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {children}
    </section>
  )
}

export default async function DashboardPage() {
  const [{ articles, thoughts }, signals] = await Promise.all([loadContent(), getEditorialSignals()])
  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_85%_25%,rgba(174,96,33,0.27),transparent_42%),linear-gradient(115deg,#10171a_40%,#30241d_100%)] px-6 py-9 sm:px-9 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#e4b35f]">Admin Dashboard</p>
          <h1 className="font-serif text-4xl tracking-tight text-white sm:text-6xl">Welcome back!</h1>
          <p className="mt-4 text-base text-zinc-300">Manage your content and inspire the Treksor community.</p>
        </div>
        <Mountain aria-hidden="true" className="absolute -bottom-12 right-4 h-60 w-60 text-[#b78343]/10 sm:right-12 sm:h-72 sm:w-72" strokeWidth={0.65} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Downloads · iOS", icon: Smartphone, detail: "Connect App Store Connect" },
          { label: "Downloads · Android", icon: Smartphone, detail: "Connect Google Play Console" },
          { label: "Active Users", icon: Users, detail: "App analytics not connected" },
          { label: "Avg. Session Time", icon: Clock3, detail: "App analytics not connected" },
        ].map(metric => (
          <section key={metric.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#141b1f] p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3a2d1c] text-[#e5b45f]"><metric.icon className="h-5 w-5" /></span>
            <div className="min-w-0"><p className="text-sm text-zinc-300">{metric.label}</p><p className="mt-1 text-2xl font-semibold text-white">—</p><p className="mt-1 text-xs text-zinc-500">{metric.detail}</p></div>
          </section>
        ))}
      </div>
      <Link href="/dashboard/audience" className="inline-flex items-center gap-2 text-sm text-[#e5b45f] hover:text-[#ffcf7a]">Audience & analytics setup <ArrowRight className="h-4 w-4" /></Link>

      <section className="rounded-2xl border border-white/10 bg-[#141b1f] p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e5b45f]">Editorial radar</p><h2 className="mt-2 font-serif text-3xl text-white">Ideas worth exploring</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Recent public headlines related to men's wellbeing, relationships, fitness and purpose. Use these as inspiration, not as evidence of what Treksor users are searching for.</p></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400"><Globe2 className="h-4 w-4 text-[#e5b45f]" /> Public news · refreshed every 30 min</span>
        </div>
        {signals.length ? <div className="grid gap-3 md:grid-cols-2">{signals.map(signal => (
          <a key={signal.link} href={signal.link} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[#d5a652]/50 hover:bg-white/[0.06]">
            <div><p className="line-clamp-2 text-sm font-medium leading-6 text-zinc-100 group-hover:text-[#eac57f]">{signal.title}</p><p className="mt-2 text-xs text-zinc-500">{signal.source}{signal.published ? " · " + dateLabel(signal.published) : ""}</p></div><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#d5a652]" />
          </a>
        ))}</div> : <p className="rounded-xl border border-dashed border-white/15 px-5 py-8 text-sm text-zinc-400">Live headlines are temporarily unavailable. Try again later.</p>}
        <div className="mt-5 flex flex-wrap gap-2">{["Mental resilience", "Healthy relationships", "Physical wellbeing", "Life purpose", "Stress & balance", "Confidence"].map(topic => <span key={topic} className="rounded-full border border-[#ad8247]/30 bg-[#ad8247]/10 px-3 py-1.5 text-xs text-[#e6bc78]">{topic}</span>)}</div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,129,52,0.28),transparent_45%),linear-gradient(110deg,#121a1e,#33261e)] px-6 py-9 sm:px-10 sm:py-11">
        <Sparkles className="mb-4 h-5 w-5 text-[#e3b15d]" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Treksor Mission</p>
        <h2 className="mt-3 font-serif text-3xl text-white sm:text-5xl">Inspire. Explore. Grow.</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300">Create and share content that motivates people to live a more intentional life.</p>
        <Mountain aria-hidden="true" className="absolute -bottom-16 right-4 h-64 w-64 text-[#e7b45c]/10 sm:right-14" strokeWidth={0.5} />
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Recent Articles" href="/dashboard/articles" icon={<FileText className="h-5 w-5" />}>
          {articles.length === 0 ? <div className="py-9 text-center"><p className="text-sm text-zinc-400">No articles published yet.</p><Link href="/dashboard/articles/create" className="mt-3 inline-block text-sm text-[#e6b45c]">Create an article →</Link></div> : (
            <div className="divide-y divide-white/10">{articles.map(article => (
              <div key={article.id} className="flex items-center gap-3 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#352b1e] text-[#e1b05b]"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-zinc-100">{article.title}</p><p className="mt-1 text-xs text-zinc-500">{dateLabel(article.publish_date)}</p></div>
                <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs text-emerald-300">{article.status}</span>
              </div>
            ))}</div>
          )}
        </Panel>
        <Panel title="Recent Power Thoughts" href="/dashboard/power-thoughts" icon={<Lightbulb className="h-5 w-5" />}>
          {thoughts.length === 0 ? <div className="py-9 text-center"><p className="text-sm text-zinc-400">No power thoughts published yet.</p><Link href="/dashboard/power-thoughts/create" className="mt-3 inline-block text-sm text-[#e6b45c]">Create a thought →</Link></div> : (
            <div className="divide-y divide-white/10">{thoughts.map(thought => (
              <div key={thought.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm text-zinc-200">“{thought.thought}”</p><p className="mt-1 text-xs text-zinc-500">{dateLabel(thought.publish_date)}</p></div>
                <span className="shrink-0 rounded-full bg-emerald-900/40 px-3 py-1 text-xs text-emerald-300">{thought.status}</span>
              </div>
            ))}</div>
          )}
        </Panel>
      </div>
      <p className="flex items-center justify-center gap-2 text-xs text-zinc-600"><BarChart3 className="h-3.5 w-3.5" /> Metrics will appear when analytics are connected.</p>
    </main>
  )
}
