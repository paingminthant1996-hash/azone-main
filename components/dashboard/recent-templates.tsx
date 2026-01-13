"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Template } from "@/lib/types"
import Link from "next/link"

interface RecentTemplatesProps {
  templates?: Template[]
}

export function RecentTemplates({ templates = [] }: RecentTemplatesProps) {
  if (templates.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-800/30">
          <h2 className="text-lg font-semibold text-white">Recent Templates</h2>
        </div>
        <div className="p-12 text-center">
          <p className="text-gray-400">No templates found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-800/30">
        <h2 className="text-lg font-semibold text-white">Recent Templates</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800/30">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Template Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr
                key={template.id}
                className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-white">{template.title}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-300">
                    {template.createdAt
                      ? new Date(template.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="default"
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                  >
                    Live
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link
                    href={`/admin/templates/${template.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
