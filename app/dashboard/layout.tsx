import type React from "react"
import { redirect } from "next/navigation"
import { adminRequest } from "@/lib/supabase-admin"
import { CalendarDays } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await adminRequest("")
  if (!admin) redirect("/login")
  const today = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date())
  return (
    <SidebarProvider className="dark min-h-screen bg-[#02050C] text-foreground" style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-[#02050C]">
        <header className="relative flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5 lg:px-9">
          <SidebarTrigger className="text-[#D7B877] hover:bg-white/10 hover:text-[#D7B877]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7B877]">Treksor Admin</span>
          <span className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-secondary-foreground lg:flex"><CalendarDays className="h-4 w-4 text-[#D7B877]" />{today}</span>
          <div className="ml-auto flex min-w-0 items-center gap-3 text-sm text-secondary-foreground">
            
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#19222C] font-semibold text-[#D7B877]">T</span>
            <span className="hidden truncate sm:block">{admin.user.email}</span>
          </div>
        </header>
        <div className="min-w-0 flex-1 px-5 py-8 lg:px-9 lg:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
