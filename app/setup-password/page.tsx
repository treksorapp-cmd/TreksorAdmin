"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

export default function SetupPasswordPage() {
  const [token, setToken] = useState("")
  const [linkError, setLinkError] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const query = new URLSearchParams(window.location.search)
    const accessToken = fragment.get("access_token")
    const error = fragment.get("error_description") || query.get("error_description")
    if (accessToken) setToken(accessToken)
    else setLinkError(error || "This invitation link is missing or expired. Request a new invitation.")
    window.history.replaceState(null, "", window.location.pathname)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirm) { setMessage("Passwords do not match."); return }
    if (password.length < 12) { setMessage("Use at least 12 characters."); return }
    setBusy(true)
    setMessage("")
    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to set password.")
      setDone(true)
      setPassword("")
      setConfirm("")
      setToken("")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to set password.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Treksor Admin</h1>
        <p className="mt-2 text-gray-600">Set your administrator password</p>
        {done ? (
          <div className="mt-6">
            <p>Password saved. You can now sign in.</p>
            <Link className="mt-4 inline-block underline" href="/login">Go to sign in</Link>
          </div>
        ) : linkError ? (
          <p role="alert" className="mt-6 text-red-700">{linkError}</p>
        ) : !token ? (
          <p className="mt-6">Checking invitation…</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              New password (12 characters minimum)
              <input type="password" autoComplete="new-password" required minLength={12}
                value={password} onChange={event => setPassword(event.target.value)}
                className="mt-1 w-full rounded border p-2" />
            </label>
            <label className="block text-sm font-medium">
              Confirm password
              <input type="password" autoComplete="new-password" required minLength={12}
                value={confirm} onChange={event => setConfirm(event.target.value)}
                className="mt-1 w-full rounded border p-2" />
            </label>
            {message && <p role="alert" className="text-red-700">{message}</p>}
            <button type="submit" disabled={busy} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
              {busy ? "Saving…" : "Set password"}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
