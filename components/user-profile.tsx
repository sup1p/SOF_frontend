"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, MapPin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserStatsCard from "./user-stats-card"
import UserContentSection from "./user-content-section"
import { formatDistanceToNow } from "date-fns"

interface UserProfileProps {
  userProfile: {
    id: string
    username: string
    displayName: string
    avatar_url?: string
    reputation: number
    location?: string
    about?: string
    member_since: string
    last_seen?: string
    visit_streak?: string
  }
  userQuestions: any[]
  userAnswers: any[]
  userTags: any[]
  userReputation: any[]
  isCurrentUser: boolean
  onEditProfile: () => void
}

export default function UserProfile({
  userProfile,
  userQuestions,
  userAnswers,
  userTags,
  userReputation,
  isCurrentUser,
  onEditProfile,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main className="px-6 py-4">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* User avatar and info */}
          <div className="flex-shrink-0">
            <Image
              src={userProfile.avatar_url || "/placeholder.svg?height=154&width=154"}
              alt={userProfile.displayName}
              width={154}
              height={154}
              className="border border-gray-300 rounded-none" // Added rounded-none for square avatar
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
                    Member for {formatDistanceToNow(new Date(userProfile.member_since))}
                  </div>
                  {userProfile.last_seen && (
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Last seen {userProfile.last_seen}
                    </div>
                  )}
                  {userProfile.visit_streak && (
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Visited {userProfile.visit_streak}
                    </div>
                  )}
                </div>

                {userProfile.location && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {userProfile.location}
                  </div>
                )}
              </div>

              {isCurrentUser && (
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onEditProfile}>
                  <Edit className="h-4 w-4" />
                  Edit profile
                </Button>
              )}
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
                <UserStatsCard
                  stats={{
                    reputation: userProfile.reputation,
                    reached: 0, // This would come from the API
                    answers: userAnswers.length,
                    questions: userQuestions.length,
                  }}
                />
              </div>

              {/* About */}
              <div>
                <h3 className="text-xl font-normal mb-4">About</h3>
                <div className="border rounded-md p-4 min-h-[150px] flex items-center justify-center text-center">
                  {userProfile.about ? (
                    <div>{userProfile.about}</div>
                  ) : (
                    <div className="text-gray-500">
                      {isCurrentUser ? (
                        <>
                          Your about me section is currently blank. Would you like to add one?{" "}
                          <Button variant="link" className="p-0 h-auto" onClick={onEditProfile}>
                            Edit profile
                          </Button>
                        </>
                      ) : (
                        `${userProfile.displayName} has not written an about me section yet.`
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Four sections: Answers, Questions, Tags, Reputation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Answers */}
              <UserContentSection
                title="Answers"
                emptyMessage={isCurrentUser ? "You have not" : `${userProfile.displayName} has not`}
                emptyLinkText="answered"
                emptyLinkUrl="/questions"
                filterOptions={["Score", "Activity", "Newest"]}
                isEmpty={userAnswers.length === 0}
              >
                <ul className="w-full divide-y">
                  {userAnswers.map((answer) => (
                    <li key={answer.id} className="py-3">
                      <Link href={`/questions/${answer.question_id}`} className="text-blue-500 hover:text-blue-600">
                        {answer.question_title}
                      </Link>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Score: {answer.vote_count}</span>
                        <span className="text-gray-500">{formatDistanceToNow(new Date(answer.created_at))} ago</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </UserContentSection>

              {/* Questions */}
              <UserContentSection
                title="Questions"
                emptyMessage={isCurrentUser ? "You have not" : `${userProfile.displayName} has not`}
                emptyLinkText="asked"
                emptyLinkUrl="/questions/ask"
                filterOptions={["Score", "Activity", "Newest", "Views"]}
                isEmpty={userQuestions.length === 0}
              >
                <ul className="w-full divide-y">
                  {userQuestions.map((question) => (
                    <li key={question.id} className="py-3">
                      <Link href={`/questions/${question.id}`} className="text-blue-500 hover:text-blue-600">
                        {question.title}
                      </Link>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Score: {question.vote_count}</span>
                        <span className="text-gray-500">{formatDistanceToNow(new Date(question.created_at))} ago</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </UserContentSection>

              {/* Tags */}
              <UserContentSection
                title="Tags"
                emptyMessage={isCurrentUser ? "You have not" : `${userProfile.displayName} has not`}
                emptyLinkText="participated"
                emptyLinkUrl="/tags"
                filterOptions={[]}
                isEmpty={userTags.length === 0}
              >
                <ul className="w-full divide-y">
                  {userTags.map((tag) => (
                    <li key={tag.id} className="py-3">
                      <Link
                        href={`/tags/${tag.name}`}
                        className="text-blue-500 hover:text-blue-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        {tag.name}
                      </Link>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Score: {tag.score}</span>
                        <span className="text-gray-500">{tag.posts} posts</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </UserContentSection>

              {/* Reputation */}
              <UserContentSection
                title="Reputation"
                emptyMessage={isCurrentUser ? "You have no recent" : `${userProfile.displayName} has no recent`}
                emptyLinkText="reputation changes"
                emptyLinkUrl="#"
                filterOptions={[]}
                isEmpty={userReputation.length === 0}
              >
                <ul className="w-full divide-y">
                  {userReputation.map((change) => (
                    <li key={change.id} className="py-3">
                      <div className="flex justify-between">
                        <span>{change.description}</span>
                        <span className={change.change > 0 ? "text-green-600" : "text-red-600"}>
                          {change.change > 0 ? `+${change.change}` : change.change}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{formatDistanceToNow(new Date(change.date))} ago</div>
                    </li>
                  ))}
                </ul>
              </UserContentSection>
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
  )
}

