import type React from "react"
import { redirect } from "next/navigation"
import { adminRequest } from "@/lib/supabase-admin"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default async function DashboardLayout({children}:{children:React.ReactNode}) {
 const admin=await adminRequest("")
 if(!admin) redirect("/login")
 return <SidebarProvider><AppSidebar/><SidebarInset><header className="flex h-16 shrink-0 items-center gap-2 border-b px-4"><SidebarTrigger className="-ml-1"/><h1 className="text-lg font-semibold">Treksor Dashboard</h1></header><div className="flex flex-1 flex-col gap-4 p-4">{children}</div></SidebarInset></SidebarProvider>
}
