"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteSettings } from "@/lib/types";
import { translations, getTranslation } from "@/lib/translations";

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  t: (key: string) => string; // Translation function (backward compatibility)
  getText: (enValue: string | undefined, mmValue: string | undefined) => string; // Granular translation helper
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      let response;
      try {
        response = await fetch("/api/settings", {
          signal: controller.signal,
          cache: "no-store", // Prevent cache issues
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timeout. Please check your connection.");
        }
        throw fetchError;
      }

      // API now always returns 200 with data (real or defaults)
      // So we can safely parse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, use defaults
        console.warn("Failed to parse settings response, using defaults");
        data = {
          id: "default",
          themeColor: "#3b82f6",
          siteName: "My Store",
          language: "en",
          isMaintenanceMode: false,
        };
      }

      // Set settings (API always returns valid data now)
      setSettings(data);

      // Set CSS variable for theme color on root element with transition
      if (typeof document !== "undefined" && data.themeColor) {
        document.documentElement.style.setProperty("--primary-color", data.themeColor);
        document.documentElement.style.setProperty("--theme-color", data.themeColor);
        // Convert hex to RGB for Tailwind arbitrary values
        const hex = data.themeColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        document.documentElement.style.setProperty("--theme-color-rgb", `${r}, ${g}, ${b}`);
        // Set language attribute on html element
        document.documentElement.setAttribute("lang", data.language === "my" ? "my" : "en");
        document.body.setAttribute("lang", data.language === "my" ? "my" : "en");
      }
    } catch (err: any) {
      console.error("Error fetching settings:", err);
      // Don't set error state - just use defaults silently
      // This prevents blank page if settings API fails
      setError(null);
      // Set default values if fetch fails
      setSettings({
        id: "default",
        themeColor: "#3b82f6",
        siteName: "My Store",
        language: "en",
        isMaintenanceMode: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Helper function to get granular translation with fallback
  const getGranularTranslation = (
    enValue: string | undefined,
    mmValue: string | undefined
  ): string => {
    const language = settings?.language || "en";
    if (language === "my") {
      return mmValue || enValue || "";
    }
    return enValue || "";
  };

  // Translation function (kept for backward compatibility)
  const t = (key: string): string => {
    const language = settings?.language || "en";
    return getTranslation(key, language as "en" | "my");
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        t,
        getText: getGranularTranslation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
