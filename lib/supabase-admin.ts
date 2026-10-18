import { cookies } from "next/headers"

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function config() {
  if (!url || !key) throw new Error("Supabase environment variables are missing")
  return { url, key }
}

export async function adminRequest(path: string, init: RequestInit = {}) {
  const { url, key } = config()
  const token = cookies().get("treksor_access")?.value
  if (!token) return null
  const headers = new Headers(init.headers)
  headers.set("apikey", key)
  headers.set("Authorization", `Bearer ${token}`)
  const verify = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: "no-store" })
  if (!verify.ok) return null
  const user = await verify.json()
  const membership = await fetch(`${url}/rest/v1/admin_members?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, { headers, cache: "no-store" })
  if (!membership.ok || !(await membership.json()).length) return null
  return { url, headers, token, user, request: (endpoint: string, options: RequestInit = {}) => {
    const h = new Headers(headers)
    new Headers(options.headers).forEach((v, k) => h.set(k, v))
    return fetch(`${url}/rest/v1/${endpoint}`, { ...options, headers: h, cache: "no-store" })
  } }
}
