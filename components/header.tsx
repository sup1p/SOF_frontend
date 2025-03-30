"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Bell, Trophy, HelpCircle, Menu, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginModal from "@/components/login-modal"
import SignupModal from "@/components/signup-modal"

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    // Optionally redirect to home page
    router.push("/")
  }

  const handleProfileClick = () => {
    if (user) {
      router.push(`/users/${user.id}`)
    }
  }

  // Fixed function for handling Ask Question click for non-authenticated users
  const handleAskQuestionClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
    } else {
      router.push("/questions/ask")
    }
  }

  // Function to handle direct navigation to ask question page for authenticated users
  const navigateToAskQuestion = () => {
    router.push("/questions/ask")
  }

  return (
    <header className="flex items-center px-4 h-14 border-t-4 border-orange-400 border-b shadow-sm">
      <div className="flex items-center gap-4 mr-4">
        <Link href="/" className="flex items-center">
          <svg
            width="32"
            height="37"
            viewBox="0 0 32 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7"
          >
            <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB" />
            <path
              d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.8.7-2.8-16.1-3.3-.7 2.8 16.1 3.3ZM23 30H7v-3h16v3Z"
              fill="#F48024"
            />
          </svg>
          <span className="ml-1 text-xl font-normal">
            stack<span className="font-bold">overflow</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4 text-sm">
          <Link href="#" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
            Products
          </Link>
          <Link href="#" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
            OverflowAI
          </Link>
        </nav>
      </div>

      <div className="relative flex-1 max-w-xl">
        <div className="flex items-center border border-gray-300 rounded px-2 focus-within:border-blue-300 focus-within:shadow-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search..." className="w-full py-1 px-2 outline-none text-sm" />
        </div>
      </div>

      {/* Fixed Ask Question button section */}
      {user ? (
        // For authenticated users, using onClick with router for navigation
        <Button 
          className="hidden md:block ml-2 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={navigateToAskQuestion}
        >
          Ask Question
        </Button>
      ) : (
        // For non-authenticated users, show login modal
        <Button
          className="hidden md:block ml-2 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleAskQuestionClick}
        >
          Ask Question
        </Button>
      )}

      <div className="flex items-center ml-4 space-x-2">
        {user ? (
          // User is logged in - show profile and notifications
          <>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <div className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              </div>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Trophy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                  <div className="flex items-center gap-2">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.displayName}
                        width={24}
                        height={24}
                        className="rounded-none" // Changed from rounded-sm to rounded-none for square avatar
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-none flex items-center justify-center text-xs">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.reputation || 1}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-semibold">{user.displayName}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
                <DropdownMenuItem>Activity</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-gray-600">
              <Menu className="h-5 w-5" />
            </Button>
          </>
        ) : (
          // User is not logged in - show login/signup buttons
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-500 border-blue-500 hover:bg-blue-50"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Log in
            </Button>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsSignupModalOpen(true)}
            >
              Sign up
            </Button>
          </>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false)
          setIsSignupModalOpen(true)
        }}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </header>
  )
}