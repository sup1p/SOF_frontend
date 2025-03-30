import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface QuestionItemProps {
  question: {
    id: number | string
    votes: number
    answers: number
    views: number
    title: string
    description: string
    tags: { id: string; name: string }[]
    user?: string
    userId?: string
    reputation?: number | string
    asked: string
  }
}

export default function QuestionItem({ question }: QuestionItemProps) {
  return (
    <div className="py-4 grid grid-cols-[auto_1fr] gap-x-4">
      <div className="flex flex-col items-end text-xs w-16">
        <div
          className={`${
        question.votes > 0 ? "text-green-600" : question.votes < 0 ? "text-red-600" : "text-gray-500"}
        `}>
          {question.votes} votes
        </div>
        <div
          className={`${
        question.answers > 0 ? "text-green-600 border border-green-500 px-1 rounded" : "text-gray-500"}
        `}>
          {question.answers} answers
        </div>
        <div className="text-gray-500">{question.views} views</div>
      </div>

      <div>
        <h3 className="mb-1">
          <Link href={`/questions/${question.id}`} className="text-blue-500 hover:text-blue-600">
            {question.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 mb-2">{question.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
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

          <div className="flex items-center text-xs">
            <div className="flex items-center">
              <Avatar className="w-5 h-5 mr-1 rounded-none">
                {question.user ? (
                  <>
                    <AvatarImage src={`/placeholder.svg?height=20&width=20&text=${question.user.charAt(0)}`} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600 rounded-none">
                      {question.user.charAt(0)}
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder.svg?height=20&width=20&text=?" />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600 rounded-none">?</AvatarFallback>
                  </>
                )}
              </Avatar>
              {question.user ? (
                <>
                  <Link href={`/users/${question.userId}`} className="text-blue-500 hover:text-blue-600">
                    {question.user}
                  </Link>
                  <span className="mx-1 text-gray-500">{question.reputation}</span>
                </>
              ) : (
                <span className="text-gray-500">Unknown User</span>
              )}
              <span className="text-gray-500">asked {question.asked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
