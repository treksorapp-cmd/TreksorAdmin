"use client"

import { Home, FileText, LogOut, Lightbulb, Mountain, KeyRound } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Artículos", url: "/dashboard/articles", icon: FileText },
  { title: "Power Thoughts", url: "/dashboard/power-thoughts", icon: Lightbulb },
  { title: "Cambiar contraseña", url: "/dashboard/change-password", icon: KeyRound },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) throw new Error("No se pudo cerrar la sesión")
      router.replace("/login")
      router.refresh()
    } catch {
      window.alert("No se pudo cerrar la sesión. Intentá nuevamente.")
    }
  }

  return (
    <Sidebar className="border-r border-zinc-800 bg-[#171c1a] text-white">
      <SidebarHeader className="p-5">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-1 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c5e5a0] text-[#1b271b]"><Mountain className="h-5 w-5" /></span>
          <span><span className="block text-lg font-bold tracking-tight text-white">TREKSOR<span className="text-[#c5e5a0]">.</span></span><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Admin studio</span></span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Espacio de trabajo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map(item => {
                const active = item.url === "/dashboard" ? pathname === item.url : pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} className={active ? "h-11 rounded-xl bg-[#c5e5a0] font-semibold text-[#1b271b] hover:bg-[#d6efb9] hover:text-[#1b271b]" : "h-11 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white"}>
                      <Link href={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <Button variant="ghost" className="h-11 w-full justify-start rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white" onClick={() => void handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
