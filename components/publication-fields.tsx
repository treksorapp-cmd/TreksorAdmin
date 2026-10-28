"use client"
import { useId, useState } from "react"
import { publicationAction, publicationState, PublicationStatus } from "@/lib/publication"
import { Button } from "@/components/ui/button"
export function PublicationFields({ status, date, onStatus, onDate }: {
  status: PublicationStatus; date: string; onStatus: (value: PublicationStatus) => void; onDate: (value: string) => void
}) {
  const id = useId()
  return <div className="space-y-3 rounded-xl border border-input p-4">
    <label htmlFor={`${id}-status`} className="block text-sm font-medium">App visibility</label>
    <select id={`${id}-status`} value={status} onChange={e => onStatus(e.target.value as PublicationStatus)} className="w-full rounded-md border border-input bg-background p-3 text-foreground">
      <option value="draft">Draft — private</option><option value="published">Publish / schedule in the app</option>
    </select>
    <label htmlFor={`${id}-date`} className="block text-sm font-medium">Publication date</label>
    <input id={`${id}-date`} type="date" required value={date} onChange={e => onDate(e.target.value)} className="w-full rounded-md border border-input bg-background p-3 text-foreground" />
    <p className="text-sm text-muted-foreground">{status === "draft" ? "Private draft. Choosing a date alone does not publish it." : "Publishes on this date at 12:00 AM Brisbane time (AEST, UTC+10). Today or an earlier date publishes immediately. The app retrieves it on its next refresh."}</p>
  </div>
}
export function PublicationControl({ type, id, status, date, onSaved }: { type: "articles" | "thoughts"; id: string; status: PublicationStatus; date: string; onSaved: () => unknown }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(status)
  const [day, setDay] = useState(date)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  async function save() {
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/publication/${type}/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: value, date: day }) })
      if (!response.ok) throw new Error("Unable to save publication settings. Please retry.")
      setEditing(false); onSaved()
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save") }
    finally { setBusy(false) }
  }
  return <div className="mt-4 space-y-3 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full border border-input px-3 py-1">{publicationState(status, date)}</span><Button type="button" variant="outline" size="sm" onClick={() => { setValue(status); setDay(date); setEditing(!editing) }}>Publication settings</Button></div>
    <p className="text-muted-foreground">{date} · Brisbane (AEST)</p>
    {editing && <fieldset disabled={busy} className="space-y-3"><PublicationFields status={value} date={day} onStatus={setValue} onDate={setDay} /><Button type="button" disabled={busy || !day} onClick={() => void save()}>{busy ? "Saving…" : publicationAction(value, day)}</Button></fieldset>}
    {error && <p role="alert" className="text-red-400">{error}</p>}
  </div>
}
