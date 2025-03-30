interface UserStatsCardProps {
  stats: {
    reputation: number
    reached: number
    answers: number
    questions: number
  }
}

export default function UserStatsCard({ stats }: UserStatsCardProps) {
  return (
    <div className="border rounded-md p-4 grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl">{stats.reputation}</div>
        <div className="text-sm text-gray-600">reputation</div>
      </div>
      <div className="text-center">
        <div className="text-2xl">{stats.reached}</div>
        <div className="text-sm text-gray-600">reached</div>
      </div>
      <div className="text-center">
        <div className="text-2xl">{stats.answers}</div>
        <div className="text-sm text-gray-600">answers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl">{stats.questions}</div>
        <div className="text-sm text-gray-600">questions</div>
      </div>
    </div>
  )
}

