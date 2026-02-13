"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; deletedCount?: number } | null>(null);
  const [secret, setSecret] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!secret) {
      setResult({ success: false, message: "Please enter admin secret" });
      return;
    }

    if (!confirm("Are you sure you want to delete ALL templates? This action cannot be undone!")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/delete-all-templates", {
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
          message: data.message || "Templates deleted successfully",
          deletedCount: data.deletedCount,
        });
        // Refresh page after 2 seconds
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to delete templates",
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
        <h1 className="text-3xl font-bold text-white mb-6">Delete All Templates</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
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
            onClick={handleDelete}
            disabled={loading || !secret}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Deleting..." : "Delete All Templates"}
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
            {result.deletedCount !== undefined && (
              <p className="text-sm mt-1">Deleted: {result.deletedCount} templates</p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ <strong>Warning:</strong> This will permanently delete ALL templates from the database.
            This action cannot be undone!
          </p>
        </div>
      </div>
    </div>
  );
}
