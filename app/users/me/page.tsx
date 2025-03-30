"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function MyProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to user's profile page if logged in
    if (!isLoading && user) {
      router.push(`/users/${user.id}`)
    }

    // Redirect to login if not logged in
    if (!isLoading && !user) {
      router.push("/?login=true")
    }
  }, [user, isLoading, router])

  // Show loading while checking auth status
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
      <span>Redirecting...</span>
    </div>
  )
}

