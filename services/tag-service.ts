import apiClient from "@/lib/api-client"
import type { PaginatedResponse } from "./question-service"

export interface Tag {
  id: string
  name: string
  description?: string
  count: number
}

export interface TagFilters {
  page?: number
  page_size?: number
  search?: string
  sort_by?: "popular" | "name" | "newest"
}

export const tagService = {
  // Get all tags with optional filters
  async getTags(filters: TagFilters = {}): Promise<PaginatedResponse<Tag>> {
    const response = await apiClient.get<PaginatedResponse<Tag>>("/tags/", { params: filters })
    return response.data
  },

  // Get a single tag by ID
  async getTag(id: string): Promise<Tag> {
    const response = await apiClient.get<Tag>(`/tags/${id}/`)
    return response.data
  },

  // Get a single tag by name
  async getTagByName(name: string): Promise<Tag> {
    const response = await apiClient.get<Tag>(`/tags/name/${name}/`)
    return response.data
  },

  // Search tags by name (for autocomplete)
  async searchTags(query: string): Promise<Tag[]> {
    const response = await apiClient.get<Tag[]>("/tags/search/", { params: { q: query } })
    return response.data
  },

  // Get questions for a specific tag
  async getTagQuestions(tagName: string, page = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get<PaginatedResponse<any>>(`/tags/name/${tagName}/questions/`, {
      params: { page, page_size: pageSize },
    })
    return response.data
  },
}

