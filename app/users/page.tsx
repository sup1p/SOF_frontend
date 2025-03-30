"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2 } from "lucide-react"
import Pagination from "@/components/pagination"
import { userService } from "@/services/user-service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  // Get current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 12

  // Get current search query from URL
  const urlSearchQuery = searchParams.get("q") || ""

  useEffect(() => {
    // Set the search input value from URL
    setSearchQuery(urlSearchQuery)
  }, [urlSearchQuery])

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const filters: {
          page: number
          page_size: number
          search: string
          sort_by: "name" | "newest" | "reputation"
        } = {
          page: currentPage,
          page_size: pageSize,
          search: urlSearchQuery,
          sort_by: "reputation",
        }

        const response = await userService.getUsers(filters)
        setUsers(response.results)
        setTotalUsers(response.count)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        setError("Failed to load users. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, urlSearchQuery])

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
    router.push(`/users?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/users?${params.toString()}`)
  }
  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal">Users</h1>
        <div className="relative max-w-xs">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Filter by user"
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {/* Users grid */}
      {!isLoading && !error && (
        <>
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {users.map((user) => (
                <div key={user.id} className="border rounded-md p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 rounded-none">
                      {" "}
                      {/* Added rounded-none for square avatar */}
                      <AvatarImage
                        src={
                          user.avatar_url || `/placeholder.svg?height=48&width=48&text=${user.displayName.charAt(0)}`
                        }
                      />
                      <AvatarFallback className="rounded-none">
                        {user.displayName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/users/${user.id}`} className="font-medium text-blue-500 hover:text-blue-600">
                        {user.displayName}
                      </Link>
                      <div className="text-sm text-gray-600">{user.location || "No location"}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-700 mb-2">{user.reputation.toLocaleString()}</div>
                  <div className="flex gap-1 mb-3">
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
                      {user.gold_badges || 0}
                    </div>
                    <div className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <span className="h-2 w-2 bg-gray-400 rounded-full mr-1"></span>
                      {user.silver_badges || 0}
                    </div>
                    <div className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <span className="h-2 w-2 bg-amber-600 rounded-full mr-1"></span>
                      {user.bronze_badges || 0}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {user.top_tags &&
                        user.top_tags.map((tag: any) => (
                          <Link
                            key={tag.id}
                            href={`/tags/${tag.name}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                          >
                            {tag.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No users found matching your criteria.</div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <Pagination
              activePage={currentPage}
              setActivePage={handlePageChange}
              totalPages={Math.ceil(totalUsers / pageSize)}
            />
          )}
        </>
      )}
    </div>
  )
}

