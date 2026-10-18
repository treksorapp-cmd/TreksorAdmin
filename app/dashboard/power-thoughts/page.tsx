"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpRight, Lightbulb, Plus, Loader2, Trash2, Sparkles, CalendarDays } from "lucide-react"

interface PowerThought {
  _id: string
  thought: string
  date: string
}

function displayDate(value: string) {
  const date = new Date(value.slice(0, 10) + "T12:00:00")
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

export default function PowerThoughtsPage() {
  const [thoughts, setThoughts] = useState<PowerThought[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchThoughts = useCallback(async () => {
    try {
      const response = await fetch("/api/power-thoughts", { cache: "no-store" })
      if (!response.ok) throw new Error("Unable to load power thoughts")
      const data = await response.json()
      setThoughts(data.data || [])
    } catch {
      toast({ title: "Error", description: "Unable to load power thoughts.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => { void fetchThoughts() }, [fetchThoughts])

  async function deleteThought(id: string) {
    if (!window.confirm("Delete this thought? This cannot be undone.")) return
    try {
      const response = await fetch(`/api/power-thoughts/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Unable to delete")
      setThoughts(previous => previous.filter(item => item._id !== id))
      toast({ title: "Thought deleted" })
    } catch {
      toast({ title: "Error", description: "Unable to delete el pensamiento.", variant: "destructive" })
    }
  }

  const create = () => router.push("/dashboard/power-thoughts/create")

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-[#151b1e] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#e0b25d]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-40 w-40 rounded-full bg-[#e0b25d]/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e0b25d]"><Sparkles className="h-4 w-4" /> Inspiration library</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Power Thoughts<span className="text-[#e0b25d]">.</span></h2>
            <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">Short ideas that strengthen your mindset and inspire progress.</p>
          </div>
          <Button onClick={create} className="h-12 rounded-xl bg-[#e0b25d] px-5 font-semibold text-[#211a12] hover:bg-[#f4cd83]">
            <Plus className="mr-2 h-4 w-4" /> New Power Thought <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Content</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">Your Power Thoughts</h3>
          <p className="mt-1 text-sm text-zinc-400">Manage the messages that inspire your community.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-[#141b1f] px-5 py-3 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#372a1b] text-[#e0b25d]"><Lightbulb className="h-5 w-5" /></span>
          <span><span className="block text-2xl font-bold leading-none text-white">{isLoading ? "—" : thoughts.length}</span><span className="text-xs text-zinc-400">Published</span></span>
        </div>
      </section>

      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center gap-3 text-zinc-400" role="status"><Loader2 className="h-5 w-5 animate-spin" /> Loading Power Thoughts...</div>
      ) : thoughts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-[#141b1f] px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#372a1b] text-[#e0b25d]"><Lightbulb className="h-8 w-8" /></div>
          <h4 className="text-xl font-semibold text-white">Every great idea starts here.</h4>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">No Power Thoughts yet. Create the first one and start building your inspiration library.</p>
          <Button onClick={create} className="mt-6 rounded-xl bg-[#d8a957] px-5 text-[#211a12] hover:bg-[#eac17a]"><Plus className="mr-2 h-4 w-4" /> Create first thought</Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {thoughts.map((thought, index) => (
            <article key={thought._id} className="group flex min-h-56 flex-col justify-between rounded-2xl border border-white/10 bg-[#141b1f] p-6 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#372a1b] text-[#e0b25d]"><Lightbulb className="h-4 w-4" /></span>
                  <span className="text-xs font-semibold tracking-widest text-zinc-400">#{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-zinc-200">“{thought.thought}”</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="flex items-center gap-2 text-xs text-zinc-400"><CalendarDays className="h-3.5 w-3.5" />{displayDate(thought.date)}</span>
                <button type="button" onClick={() => void deleteThought(thought._id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600" aria-label="Delete thought" title="Delete thought"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
