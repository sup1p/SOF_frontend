"use client"

import { Loader2 } from "lucide-react"

console.log("📢 Loading component is rendered before AskQuestionPage.")

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )
}
