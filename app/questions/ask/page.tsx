"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { questionService } from "@/services/question-service"
import { tagService } from "@/services/tag-service"
import LoginModal from "@/components/login-modal"

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [suggestedTags, setSuggestedTags] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingTags, setIsSearchingTags] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  // Handle tag search
  const handleTagSearch = async (query: string) => {
    setTagInput(query)

    if (query.length < 2) {
      setSuggestedTags([])
      return
    }

    setIsSearchingTags(true)

    try {
      const tags = await tagService.searchTags(query)
      setSuggestedTags(tags)
    } catch (err) {
      console.error("Failed to search tags:", err)
    } finally {
      setIsSearchingTags(false)
    }
  }

  // Add a tag to selected tags
  const addTag = (tag: string) => {
    if (selectedTags.includes(tag) || selectedTags.length >= 5) return

    setSelectedTags([...selectedTags, tag])
    setTagInput("")
    setSuggestedTags([])
  }

  // Remove a tag from selected tags
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Incomplete question",
        description: "Please provide both a title and content for your question",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const question = await questionService.createQuestion({
        title,
        content,
        tags: selectedTags,
      })

      toast({
        title: "Question posted",
        description: "Your question has been posted successfully",
      })

      // Redirect to the new question
      router.push(`/questions/${question.id}`)
    } catch (err) {
      toast({
        title: "Failed to post question",
        description: "An error occurred while posting your question",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show login modal if not logged in
  if (!authLoading && !user) {
    return (
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in to ask a question</h1>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
              Log in
            </Button>
            <Button onClick={() => router.push("/?signup=true")}>Sign up</Button>
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSignupClick={() => {
            setIsLoginModalOpen(false)
            router.push("/?signup=true")
          }}
        />
      </div>
    )
  }

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ask a public question</h1>
        <p className="text-gray-600">Get help from the Stack Overflow community by asking a clear, specific question</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <h2 className="font-bold mb-2">Writing a good question</h2>
        <ul className="list-disc pl-5 text-sm">
          <li>Summarize your problem in a one-line title</li>
          <li>Describe your problem in more detail</li>
          <li>Describe what you've tried</li>
          <li>Add "tags" which help surface your question to members of the community</li>
          <li>Review your question and post it to the site</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg font-medium">
            Title
          </Label>
          <p className="text-sm text-gray-600">Be specific and imagine you're asking a question to another person</p>
          <Input
            id="title"
            placeholder="e.g. How do I center a div with Tailwind CSS?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={150}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-lg font-medium">
            Body
          </Label>
          <p className="text-sm text-gray-600">
            Include all the information someone would need to answer your question
          </p>
          <div className="border rounded-md">
            <div className="border-b p-2 bg-gray-50 flex gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-8">
                Bold
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8">
                Italic
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8">
                Code
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8">
                Link
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8">
                Quote
              </Button>
            </div>
            <textarea
              id="content"
              className="w-full p-3 min-h-[200px] outline-none"
              placeholder="Describe your problem in detail. What have you tried? What didn't work?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-lg font-medium">
            Tags
          </Label>
          <p className="text-sm text-gray-600">Add up to 5 tags to describe what your question is about</p>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md mb-1">
              {selectedTags.map((tag) => (
                <div key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <Input
                id="tags"
                placeholder={selectedTags.length === 0 ? "e.g. javascript, react, tailwind" : ""}
                value={tagInput}
                onChange={(e) => handleTagSearch(e.target.value)}
                className={`border-0 p-0 ${selectedTags.length > 0 ? "flex-1 min-w-[100px]" : "w-full"}`}
                disabled={selectedTags.length >= 5}
              />
            </div>

            {suggestedTags.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                {isSearchingTags ? (
                  <div className="p-2 text-center">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Searching...
                  </div>
                ) : (
                  <ul>
                    {suggestedTags.map((tag) => (
                      <li
                        key={tag.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addTag(tag.name)}
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {selectedTags.length >= 5 && <p className="text-sm text-orange-500">You've reached the maximum of 5 tags.</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post your question"
            )}
          </Button>
          <Link href="/questions">
            <Button type="button" variant="outline">
              Discard
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

