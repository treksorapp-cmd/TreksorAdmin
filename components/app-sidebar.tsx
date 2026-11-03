"use client"

import { Home, FileText, LogOut, Lightbulb, KeyRound, Users, Plug, Images, Dumbbell, Compass, Brain, Leaf, Target } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Body", url: "/dashboard/body", icon: Dumbbell },
  { title: "Mind", url: "/dashboard/mind", icon: Brain },
  { title: "Balance", url: "/dashboard/balance", icon: Leaf },
  { title: "Purpose", url: "/dashboard/purpose", icon: Target },
  { title: "Community", url: "/dashboard/community", icon: Compass },
  { title: "Media", url: "/dashboard/media", icon: Images },
  { title: "Articles", url: "/dashboard/articles", icon: FileText },
  { title: "Power Thoughts", url: "/dashboard/power-thoughts", icon: Lightbulb },
  { title: "Audience", url: "/dashboard/audience", icon: Users },
  { title: "Integrations", url: "/dashboard/integrations", icon: Plug },
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
    <Sidebar className="border-r border-white/10 bg-[#02050C] text-foreground">
      <SidebarHeader className="items-center px-4 pb-10 pt-9">
        <Link href="/dashboard" className="flex flex-col items-center gap-2" aria-label="Treksor Dashboard">
          <span className="treksor-lockup"><img src="/treksor-mark.png" alt="" width="52" height="52"/><span><strong>TREKSOR</strong><small>Admin studio</small></span></span>
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
                    <SidebarMenuButton asChild isActive={active} className={active ? "h-12 rounded-xl bg-[#19222C] font-medium text-[#D7B877] hover:bg-[#19222C] hover:text-[#D7B877]" : "h-12 rounded-xl text-secondary-foreground hover:bg-white/10 hover:text-foreground"}>
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
          <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/change-password")} className="h-11 rounded-xl text-secondary-foreground hover:bg-white/10 hover:text-foreground">
            <Link href="/dashboard/change-password"><KeyRound className="h-4 w-4" /><span>Change Password</span></Link>
          </SidebarMenuButton>
        </SidebarMenuItem></SidebarMenu>
        <Button variant="ghost" className="h-11 w-full justify-start rounded-xl text-secondary-foreground hover:bg-white/10 hover:text-foreground" onClick={() => void handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <p className="px-3 pb-2 pt-5 text-[10px] uppercase leading-6 tracking-[0.2em] text-muted-foreground">Treksor<br />Inspire. Explore. Grow.</p>
      </SidebarFooter>
    </Sidebar>
  )
}
