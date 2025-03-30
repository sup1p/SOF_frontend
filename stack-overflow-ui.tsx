"use client"

import { useState } from "react"
import { Search, Home, MessageSquare, Tag, Users, ChevronDown, Filter } from "lucide-react"
import Link from "next/link"

export default function StackOverflowUI() {
  const [activePage, setActivePage] = useState(1)
  const [activeTab, setActiveTab] = useState("Newest")

  const questions = [
    {
      id: 1,
      votes: 0,
      answers: 0,
      views: 2,
      title: "In Ansible, How would I replace a single word in an XML record?",
      description:
        "I've seen questions along the lines of \"How do I swap 'server=host1' to 'server=host2'\" within my config file? when that's the entire line of that file. I have a XML file that...",
      tags: ["regex", "ansible"],
      user: "David C",
      reputation: 1,
      asked: "57 secs ago",
    },
    {
      id: 2,
      votes: 0,
      answers: 0,
      views: 5,
      title: "Newtonsoft JSON schema generates invalid schema with prefixItems instead of items in version 2020-12",
      description:
        'I\'m updating a C# admin for Spark EA to generate JSON schema\'s from a model. One of the changes is to allow the option to choose for the version 2020-12: "$schema": "https://json-schema..."',
      tags: ["c#", "json.net", "jsonschema"],
      user: "Geert Bellekens",
      reputation: "13.8k",
      asked: "1 min ago",
    },
    {
      id: 3,
      votes: 0,
      answers: 0,
      views: 4,
      title: "Microsoft Entra ID Repeatedly Asking for MFA in Android Studio",
      description:
        "As of today Microsoft Entra ID has been repeatedly asking me for MFA when I try to push code to devops in Android Studio. I copy the code provided, click on the link to Microsoft login page, enter the...",
      tags: ["android", "android-studio", "azure-devops", "microsoft-entra-id"],
      user: "Zachary Bell",
      reputation: 610,
      asked: "2 mins ago",
    },
    {
      id: 4,
      votes: 0,
      answers: 0,
      views: 4,
      title: "No sys file after compiling driver - only obj",
      description:
        "I tried to start my adventure with drivers and copied this code, but after compiling I got nothing but the obj file. I checked answers about this and found that I need latest build tools but even ...",
      tags: ["c", "windows", "windows-driver"],
      user: "wzzzawzzz",
      reputation: 17,
      asked: "2 mins ago",
    },
  ]

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
              About
            </Link>
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
            <input type="text" placeholder="Search..." className="w-full py-1 px-2 outline-none text-sm" />
          </div>
        </div>

        <div className="flex items-center ml-4 space-x-2">
          <Link href="#" className="text-blue-500 border border-blue-500 rounded px-3 py-1 text-sm hover:bg-blue-50">
            Log in
          </Link>
          <Link href="#" className="bg-blue-500 text-white rounded px-3 py-1 text-sm hover:bg-blue-600">
            Sign up
          </Link>
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
                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-sm bg-gray-200 border-r-4 border-orange-400 font-bold"
                >
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
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-normal">Newest Questions</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">Ask Question</button>
          </div>

          <div className="text-sm text-gray-600 mb-4">24,249,075 questions</div>

          {/* Tabs */}
          <div className="flex justify-between mb-6">
            <div className="flex border rounded-md overflow-hidden">
              {["Newest", "Active", "Bountied", "Unanswered", "More"].map((tab, index) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 text-sm ${
                    activeTab === tab ? "bg-gray-100 font-medium" : "bg-white hover:bg-gray-50"
                  } ${tab === "Bountied" ? "flex items-center" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Bountied" && (
                    <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5">65</span>
                  )}
                  {tab === "More" && <ChevronDown className="h-4 w-4 ml-1 inline" />}
                </button>
              ))}
            </div>
            <button className="flex items-center border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
          </div>

          {/* Questions list */}
          <div className="divide-y">
            {questions.map((question) => (
              <div key={question.id} className="py-4 grid grid-cols-[auto_1fr] gap-x-4">
                <div className="flex flex-col items-end text-xs text-gray-500 w-16">
                  <div>{question.votes} votes</div>
                  <div>{question.answers} answers</div>
                  <div>{question.views} views</div>
                </div>

                <div>
                  <h3 className="mb-1">
                    <Link href="#" className="text-blue-500 hover:text-blue-600">
                      {question.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{question.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {question.tags.map((tag) => (
                        <Link
                          key={tag}
                          href="#"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>

                    <div className="flex items-center text-xs">
                      <div className="flex items-center">
                        {question.id === 3 && (
                          <div className="w-5 h-5 bg-purple-100 flex items-center justify-center rounded mr-1">
                            <span className="text-purple-600 text-xs">Z</span>
                          </div>
                        )}
                        {question.id === 4 && (
                          <div className="w-5 h-5 bg-green-100 flex items-center justify-center rounded mr-1">
                            <span className="text-green-600 text-xs">w</span>
                          </div>
                        )}
                        {question.id === 2 && (
                          <div className="w-5 h-5 bg-black flex items-center justify-center rounded mr-1">
                            <span className="text-white text-xs">G</span>
                          </div>
                        )}
                        {question.id === 1 && (
                          <div className="w-5 h-5 bg-teal-100 flex items-center justify-center rounded mr-1">
                            <span className="text-teal-600 text-xs">D</span>
                          </div>
                        )}
                        <Link href="#" className="text-blue-500 hover:text-blue-600">
                          {question.user}
                        </Link>
                        <span className="mx-1 text-gray-500">{question.reputation}</span>
                        <span className="text-gray-500">asked {question.asked}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded border ${
                    activePage === page
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              ))}
              <span className="w-8 h-8 flex items-center justify-center">...</span>
              <button className="px-3 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
                1616605
              </button>
              <button className="px-3 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
                Next
              </button>
            </div>

            <div className="flex items-center text-sm">
              <button className="w-8 h-8 flex items-center justify-center rounded border bg-orange-500 text-white border-orange-500">
                15
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
                30
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
                50
              </button>
              <span className="ml-2 text-gray-600">per page</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

