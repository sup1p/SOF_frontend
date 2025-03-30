"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { tagService } from "@/services/tag-service"
import QuestionItem from "@/components/question-item"
import Pagination from "@/components/pagination"
import { useSearchParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

import { useParams } from "next/navigation"

export default function TagDetailPage() {
  const params = useParams()
  const tagName = params?.name as string
  const [tag, setTag] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Get current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 10

  useEffect(() => {
    const fetchTagAndQuestions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch tag details
        const tagData = await tagService.getTagByName(tagName)
        setTag(tagData)

        // Fetch questions for this tag
        const questionsData = await tagService.getTagQuestions(tagName, currentPage, pageSize)
        setQuestions(questionsData.results)
        setTotalQuestions(questionsData.count)
      } catch (err) {
        console.error("Failed to fetch tag details:", err)
        setError("Failed to load tag information. The tag may not exist.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTagAndQuestions()
  }, [tagName, currentPage])

  const handlePageChange = (page: number) => {
    // Clone current search parameters
    const queryParams = new URLSearchParams(searchParams.toString())
    // Update the "page" parameter
    queryParams.set("page", page.toString())
  
    // Use the route param (tagName) for your path
    router.push(`/tags/${tagName}?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !tag) {
    return (
      <div className="px-6 py-4 max-w-5xl mx-auto">
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error || "Tag not found"}</div>
        <Link href="/tags">
          <Button variant="outline">Back to Tags</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-normal mb-2">Questions tagged [{tag.name}]</h1>
            <p className="text-gray-600 max-w-3xl">{tag.description || `Questions related to ${tag.name}`}</p>
          </div>
          <Link href="/questions/ask">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Ask Question</Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 text-blue-600 px-2 py-1 rounded text-sm">{tag.name}</div>
          <span className="text-sm text-gray-600">
            {tag.count.toLocaleString()} {tag.count === 1 ? "question" : "questions"}
          </span>
        </div>
      </div>

      {/* Questions list */}
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
                user: question.author.display_name,
                userId: question.author.id,
                reputation: question.author.reputation,
                asked: formatDistanceToNow(new Date(question.created_at)) + " ago",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No questions found with this tag.</div>
      )}

      {/* Pagination */}
      {questions.length > 0 && (
        <Pagination
          activePage={currentPage}
          setActivePage={handlePageChange}
          totalPages={Math.ceil(totalQuestions / pageSize)}
        />
      )}
    </div>
  )
}

