"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { getDownloadUrl } from "@/lib/auth/purchases";
import { createClient } from "@/lib/auth/supabase-client";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const templateId = searchParams.get("template_id");
  
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDownloadLink() {
      if (!sessionId || !templateId) {
        setError("Missing session information");
        setLoading(false);
        return;
      }

      try {
        // Get user session
        const { user, error: sessionError } = await getSession();
        if (sessionError || !user) {
          setError("Please sign in to download your purchase");
          setLoading(false);
          return;
        }

        // Find purchase by stripe_session_id
        const supabase = createClient();
        const { data: purchase, error: purchaseError } = await supabase
          .from("purchases_v2")
          .select("template_version_id")
          .eq("stripe_session_id", sessionId)
          .eq("user_id", user.id)
          .eq("granted", true)
          .eq("refunded", false)
          .single();

        if (purchaseError || !purchase) {
          // Purchase might not be recorded yet, wait a bit and retry
          setTimeout(async () => {
            const { data: retryPurchase, error: retryError } = await supabase
              .from("purchases_v2")
              .select("template_version_id")
              .eq("stripe_session_id", sessionId)
              .eq("user_id", user.id)
              .eq("granted", true)
              .eq("refunded", false)
              .single();

            if (retryError || !retryPurchase) {
              setError("Purchase not found. Please check your account downloads page.");
              setLoading(false);
              return;
            }

            // Get download URL
            const { url, error: downloadError } = await getDownloadUrl(
              user.id,
              retryPurchase.template_version_id
            );

            if (downloadError || !url) {
              setError(downloadError || "Failed to generate download link");
              setLoading(false);
              return;
            }

            setDownloadLink(url);
            setLoading(false);
          }, 2000);
          return;
        }

        // Get download URL
        const { url, error: downloadError } = await getDownloadUrl(
          user.id,
          purchase.template_version_id
        );

        if (downloadError || !url) {
          setError(downloadError || "Failed to generate download link");
          setLoading(false);
          return;
        }

        setDownloadLink(url);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch download link:", err);
        setError(err.message || "Failed to load download link");
        setLoading(false);
      }
    }

    fetchDownloadLink();
  }, [sessionId, templateId]);

  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-azone-black flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="bg-gray-950/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/50">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.15] tracking-tight">
              Purchase{" "}
              <span className="bg-gradient-to-r from-azone-purple via-purple-400 to-azone-purple bg-clip-text text-transparent">
                Successful
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Thank you for your purchase! Your template is ready to download.
            </p>
          </motion.div>

          {/* Download Section */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-azone-purple"></div>
              <p className="text-gray-400 mt-4">Preparing your download...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          ) : downloadLink ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Download Button */}
              <motion.button
                onClick={handleDownload}
                className="w-full py-4 px-6 bg-azone-purple text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.05,
                }}
              >
                {/* Purple Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-azone-purple via-purple-600 to-azone-purple opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Template
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300 ease-out" />
                </div>
              </motion.button>

              {/* Info Box */}
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-azone-purple mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-400 leading-relaxed">
                    <p className="mb-2">
                      <strong className="text-white">What&apos;s included:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                      <li>Full source code</li>
                      <li>Production-ready components</li>
                      <li>Commercial license</li>
                      <li>Technical documentation</li>
                      <li>Lifetime updates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/templates"
                  className="flex-1 py-3 px-6 bg-transparent border-2 border-gray-800 text-gray-300 rounded-xl font-semibold text-base transition-all duration-300 hover:border-gray-700 hover:text-white text-center"
                >
                  Browse More Templates
                </Link>
                <Link
                  href="/"
                  className="flex-1 py-3 px-6 bg-transparent border-2 border-gray-800 text-gray-300 rounded-xl font-semibold text-base transition-all duration-300 hover:border-gray-700 hover:text-white text-center"
                >
                  Go Home
                </Link>
              </div>
            </motion.div>
          ) : null}

          {/* Receipt Info */}
          {sessionId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-8 border-t border-gray-800/50"
            >
              <p className="text-xs text-gray-600 text-center font-mono">
                Session ID: {sessionId.slice(0, 20)}...
              </p>
              <p className="text-xs text-gray-600 text-center mt-2">
                A receipt has been sent to your email
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

