import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"



export const metadata: Metadata = {
  title: "Treksor Dashboard",
  description: "Admin panel for Treksor",
  icons: { icon: "/treksor-mark.png", apple: "/treksor-mark.png" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
