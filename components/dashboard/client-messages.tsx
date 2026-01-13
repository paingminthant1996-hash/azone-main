"use client"

import { Card } from "@/components/ui/card"
import { Circle } from "lucide-react"

interface Purchase {
  id: string
  user?: {
    email?: string
  }
  template?: {
    title?: string
  }
  purchased_at?: string | Date
}

interface ClientMessagesProps {
  purchases?: Purchase[]
}

export function ClientMessages({ purchases = [] }: ClientMessagesProps) {
  const formatTimeAgo = (date: string | Date) => {
    try {
      const now = new Date()
      const past = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(past.getTime())) {
        return "Unknown"
      }
      
      const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
      
      if (diffInSeconds < 0) return "Just now"
      if (diffInSeconds < 60) return "Just now"
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    } catch (error) {
      return "Unknown"
    }
  }

  if (purchases.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm h-full">
        <div className="p-6 border-b border-gray-800/30">
          <h2 className="text-lg font-semibold text-white">Client Messages</h2>
        </div>
        <div className="p-12 text-center">
          <p className="text-gray-400">No recent purchases</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm h-full">
      <div className="p-6 border-b border-gray-800/30">
        <h2 className="text-lg font-semibold text-white">Client Messages</h2>
      </div>
      <div className="divide-y divide-gray-800/30 max-h-[500px] overflow-y-auto">
        {purchases.map((purchase) => {
          const email = purchase.user?.email || "N/A"
          const name = email.split("@")[0] || "Customer"
          const subject = purchase.template?.title
            ? `Template purchase: ${purchase.template.title}`
            : "Purchase inquiry"
          const timeAgo = purchase.purchased_at ? formatTimeAgo(purchase.purchased_at) : "Unknown"
          const unread = true // You can add logic to determine if unread

          return (
            <div
              key={purchase.id}
              className="p-4 hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {unread && <Circle className="w-2 h-2 mt-2 flex-shrink-0 fill-blue-400 text-blue-400" />}
                {!unread && <div className="w-2 h-2 mt-2 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${unread ? "text-white" : "text-gray-400"}`}>
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 truncate mb-1">{email}</p>
                  <p className="text-sm text-gray-300 truncate group-hover:text-white transition-colors">
                    {subject}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-5">{timeAgo}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
