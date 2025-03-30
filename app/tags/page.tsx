"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import Pagination from "@/components/pagination"
import { tagService, type TagFilters } from "@/services/tag-service"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [totalTags, setTotalTags] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("popular")

  const searchParams = useSearchParams()
  const router = useRouter()

  // Get current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 20

  // Get current search query from URL
  const urlSearchQuery = searchParams.get("q") || ""

  // Get current sort from URL
  const currentSort = searchParams.get("sort") || "popular"

  useEffect(() => {
    // Set the search input value from URL
    setSearchQuery(urlSearchQuery)
    setActiveFilter(currentSort)
  }, [urlSearchQuery, currentSort])

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const filters: TagFilters = {
          page: currentPage,
          page_size: pageSize,
          sort_by: currentSort as any,
        }

        if (urlSearchQuery) {
          filters.search = urlSearchQuery
        }

        const response = await tagService.getTags(filters)
        setTags(response.results)
        setTotalTags(response.count)
      } catch (err) {
        console.error("Failed to fetch tags:", err)
        setError("Failed to load tags. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [currentPage, currentSort, urlSearchQuery])

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
    router.push(`/tags?${params.toString()}`)
  }

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", filter)
    params.set("page", "1") // Reset to first page on filter change
    router.push(`/tags?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/tags?${params.toString()}`)
  }

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal">Tags</h1>
        <div className="relative max-w-xs">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Filter by tag name"
                className="pl-9 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags
          makes it easier for others to find and answer your question.
        </p>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === "popular" ? "default" : "outline"}
            className="text-sm"
            onClick={() => handleFilterChange("popular")}
          >
            Popular
          </Button>
          <Button
            variant={activeFilter === "name" ? "default" : "outline"}
            className="text-sm"
            onClick={() => handleFilterChange("name")}
          >
            Name
          </Button>
          <Button
            variant={activeFilter === "newest" ? "default" : "outline"}
            className="text-sm"
            onClick={() => handleFilterChange("newest")}
          >
            New
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {/* Tags grid */}
      {!isLoading && !error && (
        <>
          {tags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {tags.map((tag) => (
                <div key={tag.id} className="border rounded-md p-4">
                  <div className="mb-2">
                    <Link
                      href={`/tags/${tag.name}`}
                      className="bg-gray-100 hover:bg-gray-200 text-blue-600 text-sm px-2 py-1 rounded"
                    >
                      {tag.name}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{tag.count.toLocaleString()} questions</div>
                  <p className="text-sm text-gray-700">{tag.description || `Questions related to ${tag.name}`}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No tags found matching your criteria.</div>
          )}

          {/* Pagination */}
          {tags.length > 0 && (
            <Pagination
              activePage={currentPage}
              setActivePage={handlePageChange}
              totalPages={Math.ceil(totalTags / pageSize)}
            />
          )}
        </>
      )}
    </div>
  )
}

