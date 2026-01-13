"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, Eye, MessageSquare, TrendingUp } from "lucide-react"

interface StatisticsCardsProps {
  totalTemplates?: number
  livePreviews?: number
  customerInquiries?: number
  totalRevenue?: number
}

export function StatisticsCards({
  totalTemplates = 0,
  livePreviews = 0,
  customerInquiries = 0,
  totalRevenue = 0,
}: StatisticsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const stats = [
    {
      label: "Total Templates",
      value: totalTemplates.toString(),
      icon: BarChart3,
      gradient: "from-purple-900/20 to-purple-800/20",
      accentColor: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      label: "Live Previews",
      value: livePreviews.toLocaleString(),
      icon: Eye,
      gradient: "from-blue-500/20 to-blue-500/5",
      accentColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Customer Inquiries",
      value: customerInquiries.toString(),
      icon: MessageSquare,
      gradient: "from-blue-500/20 to-blue-500/5",
      accentColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      gradient: "from-blue-500/20 to-blue-500/5",
      accentColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`bg-gradient-to-br ${stat.gradient} border-gray-800/50 backdrop-blur-sm overflow-hidden group hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bgColor} border border-gray-800/50 ${stat.accentColor}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
