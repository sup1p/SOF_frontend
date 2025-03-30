"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { userService } from "@/services/user-service"
import UserProfile from "@/components/user-profile"
import EditProfileModal from "@/components/edit-profile-modal"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const [userProfile, setUserProfile] = useState<any>(null)
  const [userQuestions, setUserQuestions] = useState<any[]>([])
  const [userAnswers, setUserAnswers] = useState<any[]>([])
  const [userTags, setUserTags] = useState<any[]>([])
  const [userReputation, setUserReputation] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch user profile
        const userData = await userService.getUser(userId)
        setUserProfile(userData)

        // Fetch user questions
        const questionsData = await userService.getUserQuestions(userId)
        setUserQuestions(questionsData.results || [])

        // Fetch user answers
        const answersData = await userService.getUserAnswers(userId)
        setUserAnswers(answersData.results || [])

        // Fetch user tags
        const tagsData = await userService.getUserTags(userId)
        setUserTags(tagsData || [])

        // Fetch user reputation history
        const reputationData = await userService.getUserReputationHistory(userId)
        setUserReputation(reputationData.results || [])
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user profile. The user may not exist or you don't have permission to view it.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = async (profileData: any) => {
    try {
      if (user && String(user.id) === userId) {
        console.log("Saving profile...", profileData)

        const formData = new FormData()
        formData.append("displayName", profileData.displayName)
        formData.append("location", profileData.location)
        formData.append("about", profileData.about)
        if (profileData.avatar) {
          formData.append("avatar", profileData.avatar)
        }

        const updatedUser = await userService.updateProfile(formData)
        console.log("Saved!", updatedUser)

        setUserProfile({
          ...userProfile,
          displayName: updatedUser.displayName,
          location: updatedUser.location,
          about: updatedUser.about,
          avatar_url: updatedUser.avatar_url,
        })

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="px-6 py-4 max-w-5xl mx-auto">
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error || "User not found"}</div>
        <button
          onClick={() => router.push("/users")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Users
        </button>
      </div>
    )
  }

  // Check if this is the current user's profile
  const isCurrentUser = !!(user && String(user.id) === userId)

  return (
    <>
      <UserProfile
        userProfile={userProfile}
        userQuestions={userQuestions}
        userAnswers={userAnswers}
        userTags={userTags}
        userReputation={userReputation}
        isCurrentUser={isCurrentUser}
        onEditProfile={handleEditProfile}
      />

      {isCurrentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
          initialData={{
            displayName: userProfile.displayName,
            location: userProfile.location || "",
            about: userProfile.about || "",
          }}
        />
      )}
    </>
  )
}

