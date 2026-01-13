"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Eye, 
  MessageSquare, 
  DollarSign,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { getAllTemplates } from "@/lib/db/queries";
import { getTotalRevenue, getCustomerStats } from "@/lib/db/analytics";
import { getAllPurchases } from "@/lib/db/purchases";
import { Template } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTemplates: 0,
    livePreviews: 0,
    customerInquiries: 0,
    totalRevenue: 0,
  });
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [templates, revenue, purchases] = await Promise.all([
          getAllTemplates(),
          getTotalRevenue(),
          getAllPurchases(),
        ]);

        // Calculate metrics
        const customerStats = await getCustomerStats();
        
        setMetrics({
          totalTemplates: templates.length,
          livePreviews: templates.length, // Using template count as placeholder
          customerInquiries: purchases.length,
          totalRevenue: revenue,
        });

        // Get 5 most recent templates
        setRecentTemplates(templates.slice(0, 5));

        // Get 4 most recent purchases as "client messages"
        setRecentPurchases(purchases.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-azone-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-azone-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-azone-purple" />
            <h1 className="text-4xl font-bold text-white">Overview</h1>
          </div>
          <p className="text-gray-400">Welcome to your admin dashboard</p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Total Templates</div>
            <div className="text-3xl font-bold text-white">{metrics.totalTemplates}</div>
          </motion.div>

          {/* Live Previews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Live Previews</div>
            <div className="text-3xl font-bold text-white">{metrics.livePreviews.toLocaleString()}</div>
          </motion.div>

          {/* Customer Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Customer Inquiries</div>
            <div className="text-3xl font-bold text-white">{metrics.customerInquiries}</div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</div>
          </motion.div>
        </div>

        {/* Bottom Section: Recent Templates & Client Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Recent Templates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No templates found
                      </td>
                    </tr>
                  ) : (
                    recentTemplates.map((template) => (
                      <tr key={template.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{template.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                            {template.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {template.createdAt
                            ? new Date(template.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/50">
                            Live
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Client Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Client Messages</h2>
            </div>
            <div className="p-6 space-y-4">
              {recentPurchases.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No recent purchases</p>
              ) : (
                recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white">
                        {purchase.user?.email?.split("@")[0] || "Customer"}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {purchase.user?.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        {purchase.template?.title
                          ? `Template purchase: ${purchase.template.title}`
                          : "Purchase inquiry"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(purchase.purchased_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
