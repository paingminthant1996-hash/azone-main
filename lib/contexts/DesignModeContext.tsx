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

  const saveChanges = useCallback(async () => {
    // Save to database via API
    const updates = Object.fromEntries(editableElements);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to save changes");
    }

    // Clear editable elements after successful save
    setEditableElements(new Map());
    // Reset history
    setHistory([{ elements: new Map(), timestamp: Date.now() }]);
    setHistoryIndex(0);
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
