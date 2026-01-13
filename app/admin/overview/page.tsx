"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { getAllTemplates } from "@/lib/db/queries";
import { getTotalRevenue, getCustomerStats } from "@/lib/db/analytics";
import { getAllPurchases } from "@/lib/db/purchases";
import { Template } from "@/lib/types";
import { StatisticsCards } from "@/components/dashboard/statistics-cards";
import { RecentTemplates } from "@/components/dashboard/recent-templates";
import { ClientMessages } from "@/components/dashboard/client-messages";

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
        
        // Fetch all data in parallel with error handling
        const results = await Promise.allSettled([
          getAllTemplates(),
          getTotalRevenue(),
          getAllPurchases(),
        ]);
        
        const templates = results[0].status === 'fulfilled' ? (results[0].value as Template[]) : [];
        const revenue = results[1].status === 'fulfilled' ? (results[1].value as number) : 0;
        const purchases = results[2].status === 'fulfilled' ? (results[2].value as any[]) : [];

        // Calculate metrics safely
        let customerStats = null;
        try {
          customerStats = await getCustomerStats();
        } catch (err) {
          // Ignore customer stats error
        }
        
        setMetrics({
          totalTemplates: Array.isArray(templates) ? templates.length : 0,
          livePreviews: Array.isArray(templates) ? templates.length : 0, // Using template count as placeholder
          customerInquiries: Array.isArray(purchases) ? purchases.length : 0,
          totalRevenue: typeof revenue === 'number' ? revenue : 0,
        });

        // Get 5 most recent templates
        if (Array.isArray(templates)) {
          setRecentTemplates(templates.slice(0, 5));
        }

        // Get 4 most recent purchases as "client messages"
        if (Array.isArray(purchases)) {
          setRecentPurchases(purchases.slice(0, 4));
        }
      } catch (error) {
        // Better error handling
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Failed to fetch overview data:", errorMessage);
        // Set default values on error
        setMetrics({
          totalTemplates: 0,
          livePreviews: 0,
          customerInquiries: 0,
          totalRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <StatisticsCards
            totalTemplates={metrics.totalTemplates}
            livePreviews={metrics.livePreviews}
            customerInquiries={metrics.customerInquiries}
            totalRevenue={metrics.totalRevenue}
          />
        </motion.div>

        {/* Bottom Section: Recent Templates & Client Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RecentTemplates templates={recentTemplates} />
          </motion.div>

          {/* Client Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ClientMessages purchases={recentPurchases} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
