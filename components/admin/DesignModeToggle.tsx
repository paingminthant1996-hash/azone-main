"use client";

import { useDesignMode } from "@/lib/contexts/DesignModeContext";
import { Palette, Save, X, Loader2, Check, Undo2, Redo2 } from "lucide-react";
import { isAdmin } from "@/lib/auth/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DesignModeToggle() {
  const { isDesignMode, toggleDesignMode, saveChanges, undo, redo, canUndo, canRedo } = useDesignMode();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await isAdmin();
      setIsAdminUser(admin);
    };
    checkAdmin();
  }, []);

  if (!isAdminUser) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveChanges();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {isDesignMode && (
          <>
            {/* Undo/Redo Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-2"
            >
              <motion.button
                onClick={undo}
                disabled={!canUndo}
                className={`px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors font-medium text-sm ${
                  canUndo
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={redo}
                disabled={!canRedo}
                className={`px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors font-medium text-sm ${
                  canRedo
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
            
            {/* Save Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors font-medium ${
                saveSuccess
                  ? "bg-green-600 text-white"
                  : saving
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              title="Save Changes (Ctrl+S)"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </>
        )}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={toggleDesignMode}
          className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors font-medium ${
            isDesignMode
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-azone-purple hover:bg-azone-purple/80 text-white"
          }`}
        >
          {isDesignMode ? (
            <>
              <X className="w-4 h-4" />
              Exit Design Mode
            </>
          ) : (
            <>
              <Palette className="w-4 h-4" />
              Design Mode
            </>
          )}
        </motion.button>
      </div>
    </AnimatePresence>
  );
}
