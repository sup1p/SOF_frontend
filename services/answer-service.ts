import apiClient from "@/lib/api-client"
import type { PaginatedResponse } from "./question-service"

export interface Answer {
  id: string
  question_id: string
  content: string
  created_at: string
  updated_at: string
  vote_count: number
  is_accepted: boolean
  author: {
    id: string
    username: string
    displayName: string
    avatar_url?: string
    reputation: number
  }
}

export interface AnswerFilters {
  question_id?: string
  page?: number
  page_size?: number
  author?: string
  sort_by?: "votes" | "newest" | "oldest"
}

export interface AnswerCreateData {
  question_id: string
  content: string
}

export interface AnswerUpdateData {
  content?: string
}

export const answerService = {
  // Get all answers for a question
  async getAnswers(filters: AnswerFilters = {}): Promise<PaginatedResponse<Answer>> {
    const response = await apiClient.get<PaginatedResponse<Answer>>("/answers/", { params: filters })
    return response.data
  },

  // Get a single answer by ID
  async getAnswer(id: string): Promise<Answer> {
    const response = await apiClient.get<Answer>(`/answers/${id}/`)
    return response.data
  },

  // Create a new answer
  async createAnswer(data: AnswerCreateData): Promise<Answer> {
    const response = await apiClient.post<Answer>("/answers/", data)
    return response.data
  },

  // Update an existing answer
  async updateAnswer(id: string, data: AnswerUpdateData): Promise<Answer> {
    const response = await apiClient.patch<Answer>(`/answers/${id}/`, data)
    return response.data
  },

  // Delete an answer
  async deleteAnswer(id: string): Promise<void> {
    await apiClient.delete(`/answers/${id}/`)
  },

  // Vote on an answer (upvote or downvote)
  async voteAnswer(id: string, voteType: "upvote" | "downvote"): Promise<Answer> {
    const response = await apiClient.post<Answer>(`/answers/${id}/vote/`, { vote_type: voteType })
    return response.data
  },

  // Accept an answer (only question author can do this)
  async acceptAnswer(id: string): Promise<Answer> {
    const response = await apiClient.post<Answer>(`/answers/${id}/accept/`, {})
    return response.data
  },
}

