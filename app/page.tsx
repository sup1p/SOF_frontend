import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Search, Star, Users, MessageSquare, Tag } from "lucide-react"

export default function Home() {
  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">
            Find the best answer to your technical question, help others answer theirs
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Stack Overflow is the largest, most trusted online community for developers to learn, share their
            programming knowledge, and build their careers.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Join the community
            </Button>
            <Button size="lg" variant="outline">
              Learn more
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/placeholder.svg?height=300&width=400"
            alt="Stack Overflow Community"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Search className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-xl font-bold">Find the right answer</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Get your technical questions answered by millions of developers ready to help.
          </p>
          <Link href="/questions" className="text-blue-500 hover:text-blue-600 flex items-center">
            Browse questions <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-xl font-bold">Join the community</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with fellow developers, share knowledge, and build your reputation.
          </p>
          <Link href="/users" className="text-blue-500 hover:text-blue-600 flex items-center">
            View top users <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Tag className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-xl font-bold">Explore topics</h2>
          </div>
          <p className="text-gray-600 mb-4">Discover questions and answers organized by technologies and languages.</p>
          <Link href="/tags" className="text-blue-500 hover:text-blue-600 flex items-center">
            Browse tags <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Card>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Questions</h2>
          <Link href="/questions" className="text-blue-500 hover:text-blue-600">
            View all questions
          </Link>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex gap-3">
                <div className="text-center min-w-16">
                  <div className="text-gray-600 border px-2 py-1 rounded-md mb-1">
                    {Math.floor(Math.random() * 50)} votes
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md ${i % 3 === 0 ? "bg-green-100 text-green-800 border border-green-300" : "border text-gray-600"}`}
                  >
                    {Math.floor(Math.random() * 10)} answers
                  </div>
                </div>
                <div>
                  <Link href={`/questions/${i}`} className="text-blue-500 hover:text-blue-600 font-medium">
                    {
                      [
                        "How to center a div with CSS Grid?",
                        "Understanding async/await in JavaScript",
                        "Best practices for React hooks",
                        "Docker vs Kubernetes: When to use what?",
                      ][i - 1]
                    }
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["javascript", "react", "css", "docker", "kubernetes", "async"]
                      .slice(0, 3 + (i % 3))
                      .map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Join the Stack Overflow community</h2>
          <Button className="bg-blue-500 hover:bg-blue-600">Sign up</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-bold">Get answers to your questions</h3>
              <p className="text-gray-600">Quickly find solutions to your technical problems</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Star className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-bold">Earn reputation</h3>
              <p className="text-gray-600">Get recognized for your contributions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-bold">Build your network</h3>
              <p className="text-gray-600">Connect with developers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

