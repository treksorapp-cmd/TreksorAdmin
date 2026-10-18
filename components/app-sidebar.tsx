"use client"

import { Home, FileText, LogOut, Lightbulb, KeyRound, Zap } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Articles", url: "/dashboard/articles", icon: FileText },
  { title: "Power Thoughts", url: "/dashboard/power-thoughts", icon: Lightbulb },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) throw new Error("Unable to log out")
      router.replace("/login")
      router.refresh()
    } catch {
      window.alert("Unable to log out. Please try again.")
    }
  }

  return (
    <Sidebar className="border-r border-white/10 bg-[#101619] text-zinc-100">
      <SidebarHeader className="items-center px-4 pb-10 pt-9">
        <Link href="/dashboard" className="flex flex-col items-center gap-2" aria-label="Treksor Dashboard">
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#d6a34e] text-[#e8b760] shadow-[0_0_25px_rgba(212,157,61,0.15)]">
            <Zap className="h-12 w-12 -rotate-12 fill-[#d6a34e]/20" strokeWidth={1.7} />
          </span>
          <span className="font-serif text-2xl tracking-[0.08em] text-[#e3b45f]">TREKSOR</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">Admin studio</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map(item => {
                const active = item.url === "/dashboard" ? pathname === item.url : pathname.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} className={active ? "h-12 rounded-xl bg-[#382b1b] font-medium text-[#f0bf68] hover:bg-[#47351d] hover:text-[#f0bf68]" : "h-12 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white"}>
                      <Link href={item.url}><item.icon className="h-5 w-5" /><span>{item.title}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-white/10 p-3">
        <SidebarMenu><SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/change-password")} className="h-11 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white">
            <Link href="/dashboard/change-password"><KeyRound className="h-4 w-4" /><span>Change Password</span></Link>
          </SidebarMenuButton>
        </SidebarMenuItem></SidebarMenu>
        <Button variant="ghost" className="h-11 w-full justify-start rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white" onClick={() => void handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <p className="px-3 pb-2 pt-5 text-[10px] uppercase leading-6 tracking-[0.2em] text-zinc-600">Treksor<br />Inspire. Explore. Grow.</p>
      </SidebarFooter>
    </Sidebar>
  )
}
