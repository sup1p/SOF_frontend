"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import QuestionItem from "@/components/question-item"
import Pagination from "@/components/pagination"
import { questionService, type Question, type QuestionFilters } from "@/services/question-service"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns"

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState("newest")
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  // Get current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 10

  // Get current sort from URL or default to newest
  const currentSort = searchParams.get("sort") || "newest"

  // Get current search query from URL
  const urlSearchQuery = searchParams.get("q") || ""

  // Get tag filter from URL
  const tagFilter = searchParams.get("tag") || ""

  useEffect(() => {
    // Set the search input value from URL
    setSearchQuery(urlSearchQuery)

    // Set the active tab based on sort parameter
    setActiveTab(currentSort)
  }, [urlSearchQuery, currentSort])

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Build filters object
        const filters: QuestionFilters = {
          page: currentPage,
          page_size: pageSize,
          sort_by: currentSort as any,
        }

        // Add search query if present
        if (urlSearchQuery) {
          filters.search = urlSearchQuery
        }

        // Add tag filter if present
        if (tagFilter) {
          filters.tags = [tagFilter]
        }

        const response = await questionService.getQuestions(filters)
        setQuestions(response.results)
        setTotalQuestions(response.count)
      } catch (err) {
        console.error("Failed to fetch questions:", err)
        setError("Failed to load questions. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [currentPage, currentSort, urlSearchQuery, tagFilter])

  const handleTabChange = (tab: string) => {
    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", tab)
    params.set("page", "1") // Reset to first page on sort change
    router.push(`/questions?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }
    params.set("page", "1") // Reset to first page on new search
    router.push(`/questions?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/questions?${params.toString()}`)
  }

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-normal">Questions</h1>
        <Link href="/questions/ask">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Ask Question</Button>
        </Link>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {tagFilter && (
        <div className="mb-4 flex items-center">
          <span className="mr-2">Filtered by tag:</span>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
            {tagFilter}
            <Link href="/questions" className="ml-2 text-blue-600 hover:text-blue-800">
              ×
            </Link>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mb-4">
        {totalQuestions.toLocaleString()} {totalQuestions === 1 ? "question" : "questions"}
      </div>

      {/* Tabs */}
      <div className="flex justify-between mb-6">
        <div className="flex border rounded-md overflow-hidden">
          {[
            { id: "newest", label: "Newest" },
            { id: "active", label: "Active" },
            { id: "votes", label: "Votes" },
            { id: "unanswered", label: "Unanswered" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-3 py-1.5 text-sm ${
                activeTab === tab.id ? "bg-gray-100 font-medium" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {/* Questions list */}
      {!isLoading && !error && (
        <>
          {questions.length > 0 ? (
            <div className="divide-y">
              {questions.map((question) => (
                <QuestionItem
                  key={question.id}
                  question={{
                    id: question.id,
                    title: question.title,
                    description: question.content.substring(0, 200) + (question.content.length > 200 ? "..." : ""),
                    votes: question.vote_count,
                    answers: question.answer_count,
                    views: question.view_count,
                    tags: question.tags,
                    user: question.author.displayName,
                    userId: question.author.id,
                    reputation: question.author.reputation,
                    asked: formatDistanceToNow(new Date(question.created_at)) + " ago",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No questions found.{" "}
              {user ? (
                <Link href="/questions/ask" className="text-blue-500 hover:underline">
                  Ask the first question!
                </Link>
              ) : (
                <span>Try a different search or filter.</span>
              )}
            </div>
          )}

          {/* Pagination */}
          {questions.length > 0 && (
            <Pagination
              activePage={currentPage}
              setActivePage={handlePageChange}
              totalPages={Math.ceil(totalQuestions / pageSize)}
            />
          )}
        </>
      )}
    </div>
  )
}

