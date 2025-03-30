import type React from "react"
import Link from "next/link"

interface UserContentSectionProps {
  title: string
  emptyMessage: string
  emptyLinkText: string
  emptyLinkUrl: string
  filterOptions?: string[]
  children?: React.ReactNode
  isEmpty: boolean
}

export default function UserContentSection({
  title,
  emptyMessage,
  emptyLinkText,
  emptyLinkUrl,
  filterOptions = ["Score", "Activity", "Newest"],
  children,
  isEmpty,
}: UserContentSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-normal">{title}</h3>
        {filterOptions.length > 0 && (
          <div className="flex border rounded-md overflow-hidden text-sm">
            {filterOptions.map((option, index) => (
              <button
                key={option}
                className={`px-2 py-1 ${index === 0 ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border rounded-md p-6 flex items-center justify-center min-h-[100px]">
        {!isEmpty ? (
          children
        ) : (
          <div className="text-gray-500 text-center">
            {emptyMessage}{" "}
            <Link href={emptyLinkUrl} className="text-blue-500 hover:text-blue-600">
              {emptyLinkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

