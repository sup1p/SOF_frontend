import apiClient from "@/lib/api-client"

export interface Question {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  vote_count: number
  answer_count: number
  view_count: number
  tags: { id: string; name: string }[]
  author: {
    id: string
    username: string
    displayName: string
    avatar_url?: string
    reputation: number
  }
}

export interface Tag {
  id: string
  name: string
  description?: string
  count?: number
}

export interface QuestionFilters {
  page?: number
  page_size?: number
  search?: string
  tags?: string[]
  author?: string
  sort_by?: "newest" | "active" | "votes" | "unanswered"
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface QuestionCreateData {
  title: string
  content: string
  tags: string[]
}

export interface QuestionUpdateData {
  title?: string
  content?: string
  tags?: string[]
}

export const questionService = {
  // Get all questions with optional filters
  async getQuestions(filters: QuestionFilters = {}): Promise<PaginatedResponse<Question>> {
    const response = await apiClient.get<PaginatedResponse<Question>>("/questions/", { params: filters })
    return response.data
  },

  // Get a single question by ID
  async getQuestion(id: string): Promise<Question> {
    const response = await apiClient.get<Question>(`/questions/${id}/`)
    return response.data
  },

  // Create a new question
  async createQuestion(data: QuestionCreateData): Promise<Question> {
    const response = await apiClient.post<Question>("/questions/", data)
    return response.data
  },

  // Update an existing question
  async updateQuestion(id: string, data: QuestionUpdateData): Promise<Question> {
    const response = await apiClient.patch<Question>(`/questions/${id}/`, data)
    return response.data
  },

  // Delete a question
  async deleteQuestion(id: string): Promise<void> {
    await apiClient.delete(`/questions/${id}/`)
  },

  // Vote on a question (upvote or downvote)
  async voteQuestion(id: string, voteType: "upvote" | "downvote"): Promise<Question> {
    const response = await apiClient.post<Question>(`/questions/${id}/vote/`, { vote_type: voteType })
    return response.data
  },
}

