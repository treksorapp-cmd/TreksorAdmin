import { Instagram, Youtube, Share2, Globe2, LockKeyhole } from "lucide-react"

const services = [
  { name: "Instagram", detail: "Optional content publishing and audience insights", icon: Instagram },
  { name: "TikTok", detail: "Optional short-video publishing and audience insights", icon: Share2 },
  { name: "YouTube", detail: "Optional videos and channel analytics", icon: Youtube },
]

export default function IntegrationsPage() {
  return <main className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="rounded-2xl border border-white/10 bg-[linear-gradient(120deg,#141b1f,#33241c)] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b15c]">Connected ecosystem</p>
      <h1 className="mt-3 font-serif text-4xl text-white">Integrations</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300">Treksor is the home for your content. Social networks are optional distribution channels, not a requirement.</p>
    </header>
    <div className="grid gap-4 md:grid-cols-3">{services.map(service => <section key={service.name} className="rounded-2xl border border-white/10 bg-[#141b1f] p-6">
      <service.icon className="h-8 w-8 text-[#e2b15c]" /><h2 className="mt-5 text-xl font-semibold text-white">{service.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{service.detail}</p><span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400"><LockKeyhole className="h-3.5 w-3.5" /> Not connected</span>
    </section>)}</div>
    <div className="flex items-start gap-4 rounded-2xl border border-[#e2b15c]/20 bg-[#1b1b19] p-6"><Globe2 className="h-6 w-6 shrink-0 text-[#e2b15c]" /><div><h2 className="font-semibold text-white">Treksor on every screen</h2><p className="mt-2 text-sm leading-7 text-zinc-400">The admin website can be used on desktop and tablet. A public member experience across iPhone, Android and the web is a separate product development step, not yet connected or launched.</p></div></div>
  </main>
}
