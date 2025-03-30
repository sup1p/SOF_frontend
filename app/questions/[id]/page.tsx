"use client"

import type React from "react"

import { useState, useEffect} from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, ArrowDown, Bookmark, History, ThumbsUp, ThumbsDown, Loader2, Check } from "lucide-react"
import { questionService, type Question } from "@/services/question-service"
import { answerService, type Answer } from "@/services/answer-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

import { useParams } from "next/navigation"

export default function QuestionDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [sortBy, setSortBy] = useState<"votes" | "newest" | "oldest">("votes")

  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch question and answers
  useEffect(() => {
    if (!id) return
  
    const fetchQuestionDetails = async () => {
      setIsLoading(true)
      setError(null)
  
      try {
        const questionData = await questionService.getQuestion(id)
        setQuestion(questionData)
  
        const answersData = await answerService.getAnswers({
          question_id: id,
          sort_by: sortBy,
        })
        setAnswers(answersData.results)
      } catch (err) {
        console.error("Failed to fetch question details:", err)
        setError("Failed to load question.")
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchQuestionDetails()
  }, [id, sortBy])
  

  // Handle voting on question
  const handleQuestionVote = async (voteType: "upvote" | "downvote") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedQuestion = await questionService.voteQuestion(id, voteType)
      setQuestion(updatedQuestion)
      toast({
        title: "Vote recorded",
        description: `Your ${voteType} has been recorded`,
      })
    } catch (err) {
      toast({
        title: "Vote failed",
        description: "You may have already voted or don't have enough reputation",
        variant: "destructive",
      })
    }
  }

  // Handle voting on answer
  const handleAnswerVote = async (answerId: string, voteType: "upvote" | "downvote") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedAnswer = await answerService.voteAnswer(answerId, voteType)
      setAnswers(answers.map((answer) => (answer.id === answerId ? updatedAnswer : answer)))
      toast({
        title: "Vote recorded",
        description: `Your ${voteType} has been recorded`,
      })
    } catch (err) {
      toast({
        title: "Vote failed",
        description: "You may have already voted or don't have enough reputation",
        variant: "destructive",
      })
    }
  }

  // Handle accepting an answer
  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || !question || user.id !== question.author.id) {
      toast({
        title: "Permission denied",
        description: "Only the question author can accept answers",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedAnswer = await answerService.acceptAnswer(answerId)

      // Update the answers list - mark this one as accepted and others as not
      setAnswers(
        answers.map((answer) => ({
          ...answer,
          is_accepted: answer.id === answerId,
        })),
      )

      toast({
        title: "Answer accepted",
        description: "You have marked this answer as accepted",
      })
    } catch (err) {
      toast({
        title: "Failed to accept answer",
        description: "An error occurred while accepting the answer",
        variant: "destructive",
      })
    }
  }

  // Handle submitting a new answer
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to post an answer",
        variant: "destructive",
      })
      return
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Empty answer",
        description: "Your answer cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsAnswerLoading(true)

    try {
      const createdAnswer = await answerService.createAnswer({
        question_id: id,
        content: newAnswer,
      })

      // Add the new answer to the list
      setAnswers([...answers, createdAnswer])

      // Clear the input
      setNewAnswer("")

      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully",
      })
    } catch (err) {
      toast({
        title: "Failed to post answer",
        description: "An error occurred while posting your answer",
        variant: "destructive",
      })
    } finally {
      setIsAnswerLoading(false)
    }
  }

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "votes" | "newest" | "oldest")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="px-6 py-4 max-w-5xl mx-auto">
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error || "Question not found"}</div>
        <Link href="/questions">
          <Button variant="outline">Back to Questions</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 max-w-5xl mx-auto">
      {/* Question header */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-normal">{question.title}</h1>
          <Link href="/questions/ask">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Ask Question</Button>
          </Link>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <div>Asked {formatDistanceToNow(new Date(question.created_at))} ago</div>
          <div>Modified {formatDistanceToNow(new Date(question.updated_at))} ago</div>
          <div>Viewed {question.view_count} times</div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-[auto_1fr] gap-4">
        {/* Voting */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-orange-500"
            onClick={() => handleQuestionVote("upvote")}
          >
            <ArrowUp className="h-8 w-8" />
          </Button>
          <div
            className={`text-xl font-bold ${
              question.vote_count > 0 ? "text-green-600" : question.vote_count < 0 ? "text-red-600" : "text-gray-700"
            }`}
          >
            {question.vote_count}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => handleQuestionVote("downvote")}
          >
            <ArrowDown className="h-8 w-8" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 mt-2">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <History className="h-5 w-5" />
          </Button>
        </div>

        {/* Question content */}
        <div>
          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.content }} />

          <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(question.tags) &&
            question.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/questions?tag=${tag.name}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Link href="#" className="text-blue-500 hover:text-blue-600 text-sm">
                Share
              </Link>
              {user && user.id === question.author.id && (
                <Link href={`/questions/${question.id}/edit`} className="text-blue-500 hover:text-blue-600 text-sm">
                  Edit
                </Link>
              )}
              <Link href="#" className="text-blue-500 hover:text-blue-600 text-sm">
                Follow
              </Link>
            </div>
            <div className="bg-blue-50 rounded-md p-3 flex items-start gap-3">
              <div className="text-xs text-gray-600">
                asked {formatDistanceToNow(new Date(question.created_at))} ago
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-none">
                  <AvatarImage src={question.author.avatar_url || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 rounded-none">
                    {question.author.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/users/${question.author.id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    {question.author.displayName}
                  </Link>
                  <div className="text-xs text-gray-600">{question.author.reputation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal">
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span>Sort by:</span>
                <select className="border rounded p-1" value={sortBy} onChange={handleSortChange}>
                  <option value="votes">Highest score (default)</option>
                  <option value="newest">Date modified (newest first)</option>
                  <option value="oldest">Date created (oldest first)</option>
                </select>
              </div>
            </div>

            {/* Answer list */}
            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map((answer) => (
                  <div key={answer.id} className="border-b pb-6">
                    <div className="grid grid-cols-[auto_1fr] gap-4">
                      <div className="flex flex-col items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-orange-500"
                          onClick={() => handleAnswerVote(answer.id, "upvote")}
                        >
                          <ArrowUp className="h-8 w-8" />
                        </Button>
                        <div
                          className={`text-xl font-bold ${
                            answer.vote_count > 0
                              ? "text-green-600"
                              : answer.vote_count < 0
                                ? "text-red-600"
                                : "text-gray-700"
                          }`}
                        >
                          {answer.vote_count}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleAnswerVote(answer.id, "downvote")}
                        >
                          <ArrowDown className="h-8 w-8" />
                        </Button>
                        {user && user.id === question.author.id && (
                          <Button
                            variant={answer.is_accepted ? "default" : "ghost"}
                            size="icon"
                            className={
                              answer.is_accepted ? "bg-green-500 text-white" : "text-gray-500 hover:text-green-500"
                            }
                            onClick={() => handleAcceptAnswer(answer.id)}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                        )}
                        {answer.is_accepted && user && user.id !== question.author.id && (
                          <div className="bg-green-500 text-white p-1 rounded-full">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: answer.content }} />

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 h-8">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 h-8">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Not helpful
                            </Button>
                            <Link
                              href="#"
                              className="text-blue-500 hover:text-blue-600 text-sm flex items-center h-8 px-2"
                            >
                              Share
                            </Link>
                            {user && user.id === answer.author.id && (
                              <Link
                                href={`/answers/${answer.id}/edit`}
                                className="text-blue-500 hover:text-blue-600 text-sm flex items-center h-8 px-2"
                              >
                                Edit
                              </Link>
                            )}
                          </div>
                          <div className="bg-blue-50 rounded-md p-3 flex items-start gap-3">
                            <div className="text-xs text-gray-600">
                              answered {formatDistanceToNow(new Date(answer.created_at))} ago
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 rounded-none">
                                <AvatarImage src={answer.author.avatar_url || "/placeholder.svg?height=32&width=32"} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 rounded-none">
                                  {answer.author.displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link
                                  href={`/users/${answer.author.id}`}
                                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                >
                                  {answer.author.displayName}
                                </Link>
                                <div className="text-xs text-gray-600">{answer.author.reputation}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No answers yet. Be the first to answer this question!
              </div>
            )}

            {/* Your Answer */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-normal mb-4">Your Answer</h2>

              {!user ? (
                <div className="text-center py-4 bg-gray-50 rounded-md">
                  <p className="mb-2">You need to be logged in to post an answer.</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline">Log in</Button>
                    <Button>Sign up</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAnswer}>
                  <div className="border rounded-md mb-4">
                    <div className="border-b p-2 bg-gray-50 flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8">
                        Bold
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        Italic
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        Code
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        Link
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        Quote
                      </Button>
                    </div>
                    <textarea
                      className="w-full p-3 min-h-[200px] outline-none"
                      placeholder="Write your answer here..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isAnswerLoading}>
                    {isAnswerLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Your Answer"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

