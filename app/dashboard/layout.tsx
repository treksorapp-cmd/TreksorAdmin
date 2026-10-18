import type React from "react"
import { redirect } from "next/navigation"
import { adminRequest } from "@/lib/supabase-admin"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await adminRequest("")
  if (!admin) redirect("/login")
  return (
    <SidebarProvider className="dark min-h-screen bg-[#090e11] text-zinc-100" style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-[#090e11]">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5 lg:px-9">
          <SidebarTrigger className="text-[#d5a652] hover:bg-white/10 hover:text-[#f1c778]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d5a652]">Treksor Admin</span>
          <div className="ml-auto flex min-w-0 items-center gap-3 text-sm text-zinc-300">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#30261b] font-semibold text-[#e7b95f]">T</span>
            <span className="hidden truncate sm:block">{admin.user.email}</span>
          </div>
        </header>
        <div className="min-w-0 flex-1 px-5 py-8 lg:px-9 lg:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
