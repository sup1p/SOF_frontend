import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <AuthProvider>  {/* ✅ Теперь AuthProvider оборачивает ВСЁ */}
          <Header />      {/* ✅ Теперь Header использует useAuth() корректно */}
          <div className="flex">
            <Sidebar />    {/* ✅ Теперь Sidebar использует useAuth() корректно */}
            <main className="flex-1">{children}</main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
