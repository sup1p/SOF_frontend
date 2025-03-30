"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  MessageSquare,
  Tag,
  Bookmark,
  Search,
  Bell,
  Trophy,
  HelpCircle,
  Menu,
  Clock,
  Calendar,
  MapPin,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for our data model
interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  memberSince: string
  lastSeen: string
  visitStreak: string
  location: string
  stats: {
    reputation: number
    reached: number
    answers: number
    questions: number
  }
  about: string
  answers: Answer[]
  questions: Question[]
  tags: UserTag[]
  reputationChanges: ReputationChange[]
}

interface Answer {
  id: string
  title: string
  score: number
  date: string
  accepted: boolean
}

interface Question {
  id: string
  title: string
  score: number
  date: string
  views: number
  answered: boolean
}

interface UserTag {
  name: string
  score: number
  posts: number
}

interface ReputationChange {
  id: string
  type: string
  change: number
  date: string
  description: string
}

// Mock data for demonstration
const mockUserProfile: UserProfile = {
  id: "30059115",
  username: "user30059115",
  displayName: "narutofun",
  avatarUrl: "/placeholder.svg?height=200&width=200",
  memberSince: "3 days",
  lastSeen: "this week",
  visitStreak: "3 days, 3 consecutive",
  location: "kazakhstan",
  stats: {
    reputation: 1,
    reached: 0,
    answers: 0,
    questions: 0,
  },
  about: "",
  answers: [],
  questions: [],
  tags: [],
  reputationChanges: [],
}

export default function UserProfile() {
  // In a real app, you would fetch this data from an API
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile)
  const [activeTab, setActiveTab] = useState("profile")

  // Function to handle editing the profile
  const handleEditProfile = () => {
    console.log("Edit profile clicked")
    // In a real app, this would navigate to an edit form or open a modal
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center px-4 h-14 border-t-4 border-orange-400 border-b shadow-sm">
        <div className="flex items-center gap-4 mr-4">
          <Link href="/" className="flex items-center">
            <svg
              width="32"
              height="37"
              viewBox="0 0 32 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7"
            >
              <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB" />
              <path
                d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.8.7-2.8-16.1-3.3-.7 2.8 16.1 3.3ZM23 30H7v-3h16v3Z"
                fill="#F48024"
              />
            </svg>
            <span className="ml-1 text-xl font-normal">
              stack<span className="font-bold">overflow</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            <Link href="#" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              Products
            </Link>
            <Link href="#" className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              OverflowAI
            </Link>
          </nav>
        </div>

        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center border border-gray-300 rounded px-2 focus-within:border-blue-300 focus-within:shadow-sm">
            <Search className="h-4 w-4 text-gray-400" />
            <input type="text" defaultValue="user30059115" className="w-full py-1 px-2 outline-none text-sm" />
          </div>
        </div>

        <div className="flex items-center ml-4 space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <div className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Trophy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-44 border-r">
          <nav className="py-4 sticky top-0">
            <ul className="space-y-1">
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Questions
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saves
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* User avatar and info */}
            <div className="flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BCB0F22EE-6F7A-4E95-A878-301A2F1A31EC%7D-9ll5EzLZSsz3ri6mN2OAWxOhuz6I7E.png"
                alt={userProfile.displayName}
                width={154}
                height={154}
                className="border border-gray-300"
              />
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-normal mb-1">{userProfile.username}</h1>
                  <h2 className="text-xl text-gray-600 mb-3">{userProfile.displayName}</h2>

                  <div className="flex flex-wrap gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Member for {userProfile.memberSince}
                    </div>
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Last seen {userProfile.lastSeen}
                    </div>
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Visited {userProfile.visitStreak}
                    </div>
                  </div>

                  {userProfile.location && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {userProfile.location}
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4" />
                  Edit profile
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger
                value="profile"
                className="px-4 py-2 rounded-none data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="px-4 py-2 rounded-none data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="saves"
                className="px-4 py-2 rounded-none data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Saves
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="px-4 py-2 rounded-none data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats */}
                <div>
                  <h3 className="text-xl font-normal mb-4">Stats</h3>
                  <div className="border rounded-md p-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl">{userProfile.stats.reputation}</div>
                      <div className="text-sm text-gray-600">reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{userProfile.stats.reached}</div>
                      <div className="text-sm text-gray-600">reached</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{userProfile.stats.answers}</div>
                      <div className="text-sm text-gray-600">answers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{userProfile.stats.questions}</div>
                      <div className="text-sm text-gray-600">questions</div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div>
                  <h3 className="text-xl font-normal mb-4">About</h3>
                  <div className="border rounded-md p-4 min-h-[150px] flex items-center justify-center text-center">
                    {userProfile.about ? (
                      <div>{userProfile.about}</div>
                    ) : (
                      <div className="text-gray-500">
                        Your about me section is currently blank. Would you like to add one?{" "}
                        <Link href="#" className="text-blue-500 hover:text-blue-600" onClick={handleEditProfile}>
                          Edit profile
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Four sections: Answers, Questions, Tags, Reputation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Answers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-normal">Answers</h3>
                    <div className="flex border rounded-md overflow-hidden text-sm">
                      <button className="px-2 py-1 bg-gray-100 font-medium">Score</button>
                      <button className="px-2 py-1 hover:bg-gray-50">Activity</button>
                      <button className="px-2 py-1 hover:bg-gray-50">Newest</button>
                    </div>
                  </div>
                  <div className="border rounded-md p-6 flex items-center justify-center min-h-[100px]">
                    {userProfile.answers.length > 0 ? (
                      <ul className="w-full divide-y">
                        {userProfile.answers.map((answer) => (
                          <li key={answer.id} className="py-3">
                            <Link href="#" className="text-blue-500 hover:text-blue-600">
                              {answer.title}
                            </Link>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Score: {answer.score}</span>
                              <span className="text-gray-500">{answer.date}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center">
                        You have not{" "}
                        <Link href="#" className="text-blue-500 hover:text-blue-600">
                          answered
                        </Link>{" "}
                        any questions
                      </div>
                    )}
                  </div>
                </div>

                {/* Questions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-normal">Questions</h3>
                    <div className="flex border rounded-md overflow-hidden text-sm">
                      <button className="px-2 py-1 bg-gray-100 font-medium">Score</button>
                      <button className="px-2 py-1 hover:bg-gray-50">Activity</button>
                      <button className="px-2 py-1 hover:bg-gray-50">Newest</button>
                      <button className="px-2 py-1 hover:bg-gray-50">Views</button>
                    </div>
                  </div>
                  <div className="border rounded-md p-6 flex items-center justify-center min-h-[100px]">
                    {userProfile.questions.length > 0 ? (
                      <ul className="w-full divide-y">
                        {userProfile.questions.map((question) => (
                          <li key={question.id} className="py-3">
                            <Link href="#" className="text-blue-500 hover:text-blue-600">
                              {question.title}
                            </Link>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Score: {question.score}</span>
                              <span className="text-gray-500">{question.date}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center">
                        You have not{" "}
                        <Link href="#" className="text-blue-500 hover:text-blue-600">
                          asked
                        </Link>{" "}
                        any questions
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xl font-normal mb-4">Tags</h3>
                  <div className="border rounded-md p-6 flex items-center justify-center min-h-[100px]">
                    {userProfile.tags.length > 0 ? (
                      <ul className="w-full divide-y">
                        {userProfile.tags.map((tag) => (
                          <li key={tag.name} className="py-3">
                            <Link href="#" className="text-blue-500 hover:text-blue-600 bg-gray-100 px-2 py-1 rounded">
                              {tag.name}
                            </Link>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Score: {tag.score}</span>
                              <span className="text-gray-500">{tag.posts} posts</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center">
                        You have not{" "}
                        <Link href="#" className="text-blue-500 hover:text-blue-600">
                          participated
                        </Link>{" "}
                        in any tags
                      </div>
                    )}
                  </div>
                </div>

                {/* Reputation */}
                <div>
                  <h3 className="text-xl font-normal mb-4">Reputation</h3>
                  <div className="border rounded-md p-6 flex items-center justify-center min-h-[100px]">
                    {userProfile.reputationChanges.length > 0 ? (
                      <ul className="w-full divide-y">
                        {userProfile.reputationChanges.map((change) => (
                          <li key={change.id} className="py-3">
                            <div className="flex justify-between">
                              <span>{change.description}</span>
                              <span className={change.change > 0 ? "text-green-600" : "text-red-600"}>
                                {change.change > 0 ? `+${change.change}` : change.change}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{change.date}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center">
                        You have no recent{" "}
                        <Link href="#" className="text-blue-500 hover:text-blue-600">
                          reputation changes
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="border rounded-md p-6 flex items-center justify-center min-h-[200px]">
                <div className="text-gray-500 text-center">Activity tab content would go here</div>
              </div>
            </TabsContent>

            <TabsContent value="saves">
              <div className="border rounded-md p-6 flex items-center justify-center min-h-[200px]">
                <div className="text-gray-500 text-center">Saves tab content would go here</div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="border rounded-md p-6 flex items-center justify-center min-h-[200px]">
                <div className="text-gray-500 text-center">Settings tab content would go here</div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

