import apiClient from "@/lib/api-client"
import type { User } from "@/components/auth-provider"
import Cookies from "js-cookie"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>("/auth/login/", credentials)

    // Store token and user data
    localStorage.setItem("auth_token", response.data.token)
    localStorage.setItem("stackoverflow_user", JSON.stringify(response.data.user))

    // Also set the token as a cookie for middleware to access
    Cookies.set("auth_token", response.data.token, { path: "/" })

    return response.data.user
  },

  // Register new user
  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post<AuthResponse>("/auth/register/", data)

    // Store token and user data
    localStorage.setItem("auth_token", response.data.token)
    localStorage.setItem("stackoverflow_user", JSON.stringify(response.data.user))

    // Also set the token as a cookie for middleware to access
    Cookies.set("auth_token", response.data.token, { path: "/" })

    return response.data.user
  },

  // Logout user
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout/")

    // Clear stored data
    localStorage.removeItem("auth_token")
    localStorage.removeItem("stackoverflow_user")

    // Also remove the cookie
    Cookies.remove("auth_token", { path: "/" })
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/user/")
    return response.data
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },
}

