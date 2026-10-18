"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (newPassword.length < 12 || newPassword.length > 128) return setError("La nueva contraseña debe tener entre 12 y 128 caracteres.")
    if (newPassword !== confirm) return setError("Las contraseñas nuevas no coinciden.")
    if (newPassword === currentPassword) return setError("Elegí una contraseña diferente de la actual.")
    setBusy(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "No se pudo cambiar la contraseña")
      setCurrentPassword("")
      setNewPassword("")
      setConfirm("")
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar la contraseña")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg space-y-6">
      <h2 className="text-2xl font-semibold">Cambiar contraseña</h2>
      {success ? (
        <div className="rounded-lg border p-6 space-y-4">
          <p role="status">Contraseña actualizada correctamente. Por seguridad, iniciá sesión nuevamente.</p>
          <Link className="inline-block rounded bg-zinc-900 px-4 py-2 text-white" href="/login">Ir a iniciar sesión</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-lg border p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Usá la contraseña temporal como contraseña actual. La nueva debe tener al menos 12 caracteres.</p>
          <label className="block space-y-2"><span>Contraseña actual</span>
            <input className="w-full rounded border p-2" type="password" autoComplete="current-password" required maxLength={128} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </label>
          <label className="block space-y-2"><span>Nueva contraseña</span>
            <input className="w-full rounded border p-2" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </label>
          <label className="block space-y-2"><span>Confirmar nueva contraseña</span>
            <input className="w-full rounded border p-2" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirm} onChange={e => setConfirm(e.target.value)} />
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50" type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar nueva contraseña"}</button>
        </form>
      )}
    </main>
  )
}
