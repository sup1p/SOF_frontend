import apiClient from "@/lib/api-client"
import type { PaginatedResponse } from "./question-service"

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  avatar_url?: string
  reputation: number
  location?: string
  about?: string
  member_since: string
  last_seen?: string
  visit_streak?: string
  gold_badges?: number
  silver_badges?: number
  bronze_badges?: number
  top_tags?: { id: string; name: string }[]
}

export interface UserFilters {
  page?: number
  page_size?: number
  search?: string
  sort_by?: "reputation" | "newest" | "name"
}

export interface UserUpdateData {
  displayName?: string
  location?: string
  about?: string
  avatar_url?: string
}

export const userService = {
  // Get all users with optional filters
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>("/users/", { params: filters })
    return response.data
  },

  // Get a single user by ID
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}/`)
    return response.data
  },

  // Update current user profile
  async updateProfile(data: FormData): Promise<User> {
    const response = await apiClient.patch<User>("/users/me/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Get user's questions
  async getUserQuestions(userId: string, page = 1): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get<PaginatedResponse<any>>(`/users/${userId}/questions/`, {
      params: { page },
    })
    return response.data
  },

  // Get user's answers
  async getUserAnswers(userId: string, page = 1): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get<PaginatedResponse<any>>(`/users/${userId}/answers/`, {
      params: { page },
    })
    return response.data
  },

  // Get user's tags
  async getUserTags(userId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/users/${userId}/tags/`)
    return response.data
  },

  // Get user's reputation history
  async getUserReputationHistory(userId: string, page = 1): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get<PaginatedResponse<any>>(`/users/${userId}/reputation/`, {
      params: { page },
    })
    return response.data
  },
}

