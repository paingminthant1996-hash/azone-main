"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

interface HistoryState {
  elements: Map<string, string>;
  timestamp: number;
}

interface DesignModeContextType {
  isDesignMode: boolean;
  toggleDesignMode: () => void;
  editableElements: Map<string, string>;
  updateElement: (id: string, content: string) => void;
  saveChanges: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DesignModeContext = createContext<DesignModeContextType | undefined>(undefined);

const MAX_HISTORY = 50; // Maximum history states to keep

export function DesignModeProvider({ children }: { children: ReactNode }) {
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [editableElements, setEditableElements] = useState<Map<string, string>>(new Map());
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ elements: new Map(), timestamp: Date.now() }]);
      setHistoryIndex(0);
    }
  }, [history.length]);

  const toggleDesignMode = () => {
    setIsDesignMode(!isDesignMode);
    // Reset history when exiting design mode
    if (isDesignMode) {
      setHistory([{ elements: new Map(), timestamp: Date.now() }]);
      setHistoryIndex(0);
      setEditableElements(new Map());
    }
  };

  const updateElement = (id: string, content: string) => {
    setEditableElements((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, content);
      
      // Add to history
      const newHistoryState: HistoryState = {
        elements: new Map(newMap),
        timestamp: Date.now(),
      };
      
      setHistory((prevHistory) => {
        // Remove any states after current index (when user makes new change after undo)
        const trimmedHistory = prevHistory.slice(0, historyIndex + 1);
        const newHistory = [...trimmedHistory, newHistoryState];
        
        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          return newHistory.slice(-MAX_HISTORY);
        }
        
        return newHistory;
      });
      
      setHistoryIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, MAX_HISTORY - 1);
        return newIndex;
      });
      
      return newMap;
    });
  };

  const undo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        setEditableElements(new Map(history[newIndex].elements));
        return newIndex;
      }
      return prevIndex;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex < history.length - 1) {
        const newIndex = prevIndex + 1;
        setEditableElements(new Map(history[newIndex].elements));
        return newIndex;
      }
      return prevIndex;
    });
  }, [history]);

  // Map EditableText IDs to API field names
  const mapIdToFieldName = (id: string, value: string): Record<string, string> => {
    const mapping: Record<string, string> = {};
    
    // Site name mappings
    if (id === "header-site-name" || id === "footer-site-name") {
      mapping.siteName = value;
    }
    // Hero title mappings (multi-line, need to combine)
    else if (id.startsWith("hero-title-line-")) {
      // For hero title, we need to handle all lines together
      // This is a simplified approach - in production, you might want to collect all hero-title-line-* first
      const lineIndex = parseInt(id.split("-").pop() || "0");
      // For now, we'll save each line separately and the API should handle combining them
      // Or we can use heroTitleEn/heroTitleMm directly
      // This is a limitation - we need to know the current language
      // For now, let's assume English and save to heroTitleEn
      mapping.heroTitleEn = value;
    }
    // Hero subtitle
    else if (id === "hero-subtitle") {
      // Need to determine language - defaulting to English for now
      mapping.heroSubtitleEn = value;
    }
    // Hero CTA button
    else if (id === "hero-cta-button") {
      // Need to determine language - defaulting to English for now
      mapping.ctaButtonEn = value;
    }
    // Footer description
    else if (id === "footer-description") {
      // Need to determine language - defaulting to English for now
      mapping.footerTextEn = value;
    }
    
    return mapping;
  };

  const saveChanges = useCallback(async () => {
    if (editableElements.size === 0) {
      return; // Nothing to save
    }

    // Collect all updates
    const updates: Record<string, string> = {};
    
    // Get current language from settings
    let currentLang = "en";
    try {
      const settingsResponse = await fetch("/api/settings");
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        currentLang = settings.language || "en";
      }
    } catch (e) {
      console.error("Failed to fetch current language:", e);
    }

    // Collect hero title lines first
    const heroTitleLines: { index: number; value: string }[] = [];
    const otherUpdates: Record<string, string> = {};

    // First pass: collect hero title lines and other updates separately
    editableElements.forEach((value, id) => {
      // Site name mappings
      if (id === "header-site-name" || id === "footer-site-name") {
        otherUpdates.siteName = value;
      }
      // Hero title lines - collect them
      else if (id.startsWith("hero-title-line-")) {
        const lineNum = parseInt(id.split("-").pop() || "0");
        heroTitleLines.push({ index: lineNum, value });
      }
      // Hero subtitle
      else if (id === "hero-subtitle") {
        if (currentLang === "my") {
          otherUpdates.heroSubtitleMm = value;
        } else {
          otherUpdates.heroSubtitleEn = value;
        }
      }
      // Hero CTA button
      else if (id === "hero-cta-button") {
        if (currentLang === "my") {
          otherUpdates.ctaButtonMm = value;
        } else {
          otherUpdates.ctaButtonEn = value;
        }
      }
      // Footer description
      else if (id === "footer-description") {
        if (currentLang === "my") {
          otherUpdates.footerTextMm = value;
        } else {
          otherUpdates.footerTextEn = value;
        }
      }
    });

    // Combine hero title lines in order
    if (heroTitleLines.length > 0) {
      heroTitleLines.sort((a, b) => a.index - b.index);
      const fullTitle = heroTitleLines.map((line) => line.value).join("\n");
      if (currentLang === "my") {
        otherUpdates.heroTitleMm = fullTitle;
      } else {
        otherUpdates.heroTitleEn = fullTitle;
      }
    }

    // Merge all updates
    Object.assign(updates, otherUpdates);

    if (Object.keys(updates).length === 0) {
      console.warn("No valid fields to update");
      return;
    }

    // Save to database via API
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to save changes");
    }

    // Clear editable elements after successful save
    setEditableElements(new Map());
    // Reset history
    setHistory([{ elements: new Map(), timestamp: Date.now() }]);
    setHistoryIndex(0);
    
    // Reload page to reflect changes
    window.location.reload();
    
    return await response.json();
  }, [editableElements]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isDesignMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveChanges().catch(console.error);
      }
      // Ctrl+Z or Cmd+Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z or Cmd+Shift+Z to redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Ctrl+Y to redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDesignMode, saveChanges, undo, redo]);

  return (
    <DesignModeContext.Provider
      value={{
        isDesignMode,
        toggleDesignMode,
        editableElements,
        updateElement,
        saveChanges,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  const context = useContext(DesignModeContext);
  if (!context) {
    throw new Error("useDesignMode must be used within a DesignModeProvider");
  }
  return context;
}
