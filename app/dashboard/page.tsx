import HomeImageApprovals from "@/components/home-image-approvals";
import Link from "next/link"
import { getEditorialSignals } from "@/lib/editorial-signals"
import { adminRequest } from "@/lib/supabase-admin"
import { ArrowRight, FileText, Lightbulb, Sparkles, Globe2, ExternalLink, PenLine, CalendarCheck2, Dumbbell, Brain, Leaf, Target } from "lucide-react"

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
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111820]/90 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-3 text-base font-semibold text-foreground"><span className="text-[#D7B877]">{icon}</span>{title}</h3>
        <Link href={href} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#D7B877] hover:text-[#D7B877]">View all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {children}
    </section>
  )
}

export default async function DashboardPage() {
  const [{ articles, thoughts }, signals] = await Promise.all([loadContent(), getEditorialSignals()])
  const now = new Date()
  const calendar = [
    { month: 3, day: 8, name: "International Women’s Day", angle: "Healthy relationships and appreciation" },
    { month: 6, day: 15, name: "Men’s Health Awareness (June)", angle: "Health checks, fitness and wellbeing" },
    { month: 9, day: 10, name: "World Suicide Prevention Day", angle: "Support, connection and asking for help" },
    { month: 10, day: 10, name: "World Mental Health Day", angle: "Emotional resilience and mental wellbeing" },
    { month: 11, day: 1, name: "Movember · Men’s Health Month", angle: "Prevention, mental health and wellbeing" },
    { month: 11, day: 19, name: "International Men’s Day", angle: "Positive role models and healthy masculinity" },
  ].map(event => {
    const year = now.getUTCFullYear()
    const candidate = Date.UTC(year, event.month - 1, event.day)
    const when = new Date(candidate < Date.UTC(year, now.getUTCMonth(), now.getUTCDate()) ? Date.UTC(year + 1, event.month - 1, event.day) : candidate)
    return { ...event, when }
  }).sort((a, b) => a.when.getTime() - b.when.getTime()).slice(0, 3)
  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-12">
      <HomeImageApprovals />

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111820] px-6 py-12 sm:px-9 sm:py-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#10171b_5%,rgba(16,23,27,0.92)_40%,rgba(16,23,27,0.35)_100%),url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=75)] bg-cover bg-center opacity-80" />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#D7B877]">Admin Dashboard</p>
          <h1 className="font-sans text-4xl tracking-tight text-foreground sm:text-6xl">Welcome back!</h1>
          <p className="mt-4 text-base text-secondary-foreground">Manage your content and inspire the Treksor community.</p>
        </div>
      </section>


      <section aria-labelledby="pillars-heading" className="space-y-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D7B877]">Improve. Connect. Experience.</p><h2 id="pillars-heading" className="mt-2 font-sans text-3xl text-foreground">The four pillars</h2><p className="mt-2 text-sm text-muted-foreground">Develop each dimension of Treksor independently.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {name:"Body",href:"/dashboard/body",description:"Training and physical wellbeing",icon:Dumbbell},
            {name:"Mind",href:"/dashboard/mind",description:"Mental strength and learning",icon:Brain},
            {name:"Balance",href:"/dashboard/balance",description:"Mindfulness and recovery",icon:Leaf},
            {name:"Purpose",href:"/dashboard/purpose",description:"Goals and personal direction",icon:Target},
          ].map(pillar => <Link key={pillar.name} href={pillar.href} className="group rounded-2xl border border-[#D7B877]/20 bg-[#111820] p-6 transition hover:border-[#D7B877]/70"><pillar.icon className="h-7 w-7 text-[#D7B877]" /><h3 className="mt-5 font-sans text-2xl text-foreground">{pillar.name}</h3><p className="mt-2 min-h-10 text-sm text-muted-foreground">{pillar.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D7B877]">Manage pillar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/articles/create" className="group rounded-2xl border border-[#D7B877]/30 bg-[linear-gradient(125deg,#19222C,#111820)] p-6 transition hover:border-[#D7B877]"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7B877]">Write with intention</p><h2 className="mt-3 font-sans text-2xl text-foreground">Create an article</h2><p className="mt-2 text-sm text-muted-foreground">Turn one meaningful insight into something that helps someone today.</p><ArrowRight className="mt-5 h-5 w-5 text-[#D7B877] transition group-hover:translate-x-1"/></Link>
        <Link href="/dashboard/power-thoughts/create" className="group rounded-2xl border border-white/10 bg-[#111820] p-6 transition hover:border-[#D7B877]/50"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7B877]">One powerful idea</p><h2 className="mt-3 font-sans text-2xl text-foreground">Create a Power Thought</h2><p className="mt-2 text-sm text-muted-foreground">A few thoughtful words can change the direction of a day.</p><ArrowRight className="mt-5 h-5 w-5 text-[#D7B877] transition group-hover:translate-x-1"/></Link>
        <Link href="/dashboard/media" className="group rounded-2xl border border-white/10 bg-[#111820] p-6 transition hover:border-[#D7B877]/50"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7B877]">Shape the atmosphere</p><h2 className="mt-3 font-sans text-2xl text-foreground">Explore your media</h2><p className="mt-2 text-sm text-muted-foreground">Bring your visual stories, photography and footage into one studio.</p><ArrowRight className="mt-5 h-5 w-5 text-[#D7B877] transition group-hover:translate-x-1"/></Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[#D7B877]/20 bg-[linear-gradient(125deg,rgba(39,29,19,.96),rgba(17,24,26,.96)),url(https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=75)] bg-cover bg-center p-7 sm:p-9">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#D7B877]"><Sparkles className="h-4 w-4"/> Editorial spark</div>
          <h2 className="mt-5 max-w-lg font-sans text-3xl leading-tight text-foreground sm:text-4xl">What does a stronger tomorrow look like?</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-secondary-foreground">A starting point for a thoughtful piece: explore one practical habit that helps men feel more grounded, connected or purposeful.</p>
          <Link href="/dashboard/articles/create" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D7B877] px-5 py-3 text-sm font-bold text-[#02050C] hover:bg-[#D7B877]"><PenLine className="h-4 w-4"/> Start writing <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-[#111820] p-6"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#19222C] text-[#D7B877]"><FileText className="h-6 w-6"/></span><div><p className="text-sm text-muted-foreground">Recent articles</p><p className="mt-1 text-3xl font-semibold text-foreground">{articles.length}</p><p className="text-xs text-muted-foreground">Showing your latest 3</p></div></div>
          <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-[#111820] p-6"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#19222C] text-[#D7B877]"><Lightbulb className="h-6 w-6"/></span><div><p className="text-sm text-muted-foreground">Recent Power Thoughts</p><p className="mt-1 text-3xl font-semibold text-foreground">{thoughts.length}</p><p className="text-xs text-muted-foreground">Showing your latest 3</p></div></div>
          <Link href="/dashboard/audience" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111820] p-5 text-sm text-secondary-foreground transition hover:border-[#D7B877]/50"><CalendarCheck2 className="h-6 w-6 text-[#D7B877]"/><span className="flex-1"><strong className="block text-foreground">Audience insights</strong><span className="text-xs text-muted-foreground">Connect mobile analytics to see real usage.</span></span><ArrowRight className="h-4 w-4 text-[#D7B877]"/></Link>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111820] p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D7B877]">Editorial radar</p><h2 className="mt-2 font-sans text-3xl text-foreground">Ideas worth exploring</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Recent public headlines related to men's wellbeing, relationships, fitness and purpose. Use these as inspiration, not as evidence of what Treksor users are searching for.</p></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-muted-foreground"><Globe2 className="h-4 w-4 text-[#D7B877]" /> Public news · refreshed every 30 min</span>
        </div>
        {signals.length ? <div className="grid gap-3 md:grid-cols-2">{signals.map(signal => (
          <a key={signal.link} href={signal.link} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[#D7B877]/50 hover:bg-white/[0.06]">
            <div><p className="line-clamp-2 text-sm font-medium leading-6 text-foreground group-hover:text-[#D7B877]">{signal.title}</p><p className="mt-2 text-xs text-muted-foreground">{signal.source}{signal.published ? " · " + dateLabel(signal.published) : ""}</p></div><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#D7B877]" />
          </a>
        ))}</div> : <p className="rounded-xl border border-dashed border-white/15 px-5 py-8 text-sm text-muted-foreground">Live headlines are temporarily unavailable. Try again later.</p>}
        <div className="mt-5 flex flex-wrap gap-2">{["Mental resilience", "Healthy relationships", "Physical wellbeing", "Life purpose", "Stress & balance", "Confidence"].map(topic => <span key={topic} className="rounded-full border border-[#D7B877]/30 bg-[#D7B877]/10 px-3 py-1.5 text-xs text-[#D7B877]">{topic}</span>)}</div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111820] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D7B877]">Content calendar</p>
        <h2 className="mt-2 font-sans text-3xl text-foreground">Upcoming moments</h2>
        <p className="mt-2 text-sm text-muted-foreground">Awareness dates to spark thoughtful Articles and Power Thoughts. Dates are editorial references, not trending-search data.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{calendar.map(event => <div key={event.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-semibold text-[#D7B877]">{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(event.when)}</p>
          <h3 className="mt-3 font-medium text-foreground">{event.name}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{event.angle}</p>
        </div>)}</div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Recent Articles" href="/dashboard/articles" icon={<FileText className="h-5 w-5" />}>
          {articles.length === 0 ? <div className="py-9 text-center"><p className="text-sm text-muted-foreground">No articles published yet.</p><Link href="/dashboard/articles/create" className="mt-3 inline-block text-sm text-[#D7B877]">Create an article</Link></div> : (
            <div className="divide-y divide-white/10">{articles.map(article => (
              <div key={article.id} className="flex items-center gap-3 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#19222C] text-[#D7B877]"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{article.title}</p><p className="mt-1 text-xs text-muted-foreground">{dateLabel(article.publish_date)}</p></div>
                <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs text-emerald-300">{article.status}</span>
              </div>
            ))}</div>
          )}
        </Panel>
        <Panel title="Recent Power Thoughts" href="/dashboard/power-thoughts" icon={<Lightbulb className="h-5 w-5" />}>
          {thoughts.length === 0 ? <div className="py-9 text-center"><p className="text-sm text-muted-foreground">No power thoughts published yet.</p><Link href="/dashboard/power-thoughts/create" className="mt-3 inline-block text-sm text-[#D7B877]">Create a thought</Link></div> : (
            <div className="divide-y divide-white/10">{thoughts.map(thought => (
              <div key={thought.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm text-foreground">“{thought.thought}”</p><p className="mt-1 text-xs text-muted-foreground">{dateLabel(thought.publish_date)}</p></div>
                <span className="shrink-0 rounded-full bg-emerald-900/40 px-3 py-1 text-xs text-emerald-300">{thought.status}</span>
              </div>
            ))}</div>
          )}
        </Panel>
      </div>

    </main>
  )
}
