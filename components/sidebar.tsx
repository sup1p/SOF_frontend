"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <aside className="w-44 border-r">
      <nav className="py-4 sticky top-0">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={`flex items-center px-4 py-2 text-sm ${
                isActive("/") ? "bg-gray-200 border-r-4 border-orange-400 font-bold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/questions"
              className={`flex items-center px-4 py-2 text-sm ${
                isActive("/questions")
                  ? "bg-gray-200 border-r-4 border-orange-400 font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Questions
            </Link>
          </li>
          <li>
            <Link
              href="/tags"
              className={`flex items-center px-4 py-2 text-sm ${
                isActive("/tags")
                  ? "bg-gray-200 border-r-4 border-orange-400 font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </Link>
          </li>
          <li>
            <Link
              href="/users"
              className={`flex items-center px-4 py-2 text-sm ${
                isActive("/users")
                  ? "bg-gray-200 border-r-4 border-orange-400 font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

