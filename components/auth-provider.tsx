"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/auth-service"
import { useRouter } from "next/navigation"

// Define the user type
export interface User {
  id: string
  username: string
  displayName: string
  avatar_url?: string
  reputation?: number
}

// Define the auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, password2: string, username: string) => Promise<void>
  logout: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // Clear invalid auth data
        localStorage.removeItem("auth_token")
        localStorage.removeItem("stackoverflow_user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authService.login({ email, password })
      setUser(userData)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string, password2: string, username: string) => {
    setIsLoading(true)
    try {
      // Check if passwords match (this is also checked in the UI, but double-checking here)
      if (password !== password2) {
        throw new Error("Passwords don't match")
      }

      const userData = await authService.register({
        email,
        password,
        password2,
        username,
      })
      setUser(userData)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if the API call fails, clear local data
      localStorage.removeItem("auth_token")
      localStorage.removeItem("stackoverflow_user")
      setUser(null)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

