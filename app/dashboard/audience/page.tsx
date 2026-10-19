import Link from "next/link"
import { ArrowLeft, Apple, Smartphone, Users, Clock3, Activity, ShieldCheck } from "lucide-react"

const cards = [
  { title: "iOS downloads", detail: "Connect App Store Connect reporting", icon: Apple },
  { title: "Android downloads", detail: "Connect Google Play Console reporting", icon: Smartphone },
  { title: "Registered users", detail: "Connect the production app's user database", icon: Users },
  { title: "Active users", detail: "Requires consent-aware app events", icon: Activity },
  { title: "Average session time", detail: "Requires app session start/end events", icon: Clock3 },
]

export default function AudiencePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#e2b15c]"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
      <header className="rounded-2xl border border-white/10 bg-[linear-gradient(120deg,#141b1f,#34251a)] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b15c]">Audience intelligence</p>
        <h1 className="mt-3 font-serif text-4xl text-white">Understand your community.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">Downloads, registered users, active users and time spent are different measurements. Each will be shown here once its verified source is connected.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(item => (
        <section key={item.title} className="rounded-2xl border border-white/10 bg-[#141b1f] p-6">
          <item.icon className="h-6 w-6 text-[#e2b15c]" />
          <h2 className="mt-5 text-base font-semibold text-white">{item.title}</h2>
          <p className="mt-3 text-4xl font-semibold text-white">—</p>
          <p className="mt-3 text-sm text-zinc-400">{item.detail}</p>
          <span className="mt-5 inline-block rounded-full border border-[#e2b15c]/30 px-3 py-1 text-xs text-[#e2b15c]">Not connected</span>
        </section>
      ))}</div>
      <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#141b1f] p-6"><ShieldCheck className="h-6 w-6 shrink-0 text-[#e2b15c]" /><div><h2 className="font-semibold text-white">Privacy-first measurement</h2><p className="mt-2 text-sm leading-7 text-zinc-400">Session analytics should be aggregated and should not collect private journal entries, chat content or sensitive personal information. No analytics SDK or mobile app changes have been made.</p></div></div>
    </main>
  )
}
