"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FixSiteNamePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    updatedCount?: number;
  } | null>(null);
  const [secret, setSecret] = useState("");
  const router = useRouter();

  const handleFix = async () => {
    if (!secret) {
      setResult({ success: false, message: "Please enter admin secret" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/fix-sitename", {
        method: "POST",
        headers: {
          "x-admin-secret": secret,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Site name fixed successfully",
          updatedCount: data.updatedCount,
        });
        // Refresh page after 2 seconds
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to fix site name",
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-azone-black p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Fix Site Name</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-4">
            This will update site_name in database from "Azone.store" (or any variation) to "Azone".
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter admin secret (default: delete-all-templates-secret)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-azone-purple"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: delete-all-templates-secret (or set ADMIN_DELETE_SECRET env var)
            </p>
          </div>

          <button
            onClick={handleFix}
            disabled={loading || !secret}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Fixing..." : "Fix Site Name to Azone"}
          </button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-900/20 border-green-700 text-green-400"
                : "bg-red-900/20 border-red-700 text-red-400"
            }`}
          >
            <p className="font-medium">{result.message}</p>
            {result.updatedCount !== undefined && (
              <p className="text-sm mt-1">Updated: {result.updatedCount} record(s)</p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ <strong>Note:</strong> This updates the database. The site name will change from "Azone.store" to "Azone" immediately after fixing.
          </p>
        </div>
      </div>
    </div>
  );
}
