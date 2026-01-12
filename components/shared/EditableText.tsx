"use client";

import { useState, useEffect, useRef } from "react";
import { useDesignMode } from "@/lib/contexts/DesignModeContext";
import { Edit2, Check, X } from "lucide-react";

interface EditableTextProps {
  id: string;
  defaultText: string;
  className?: string;
  onSave?: (text: string) => void;
  multiline?: boolean;
}

export function EditableText({
  id,
  defaultText,
  className = "",
  onSave,
  multiline = false,
}: EditableTextProps) {
  const { isDesignMode, updateElement } = useDesignMode();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultText);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (!multiline && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    updateElement(id, text);
    onSave?.(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(defaultText);
    setIsEditing(false);
  };

  // If not in design mode, just display the text
  if (!isDesignMode) {
    return <span className={className}>{defaultText}</span>;
  }

  // If editing, show input/textarea with save/cancel buttons
  if (isEditing) {
    return (
      <div className="relative inline-flex items-start gap-2 max-w-full">
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSave();
              }
            }}
            className={`${className} border-2 border-azone-purple bg-gray-900 px-3 py-2 rounded-lg text-white min-w-[200px] min-h-[60px] resize-y focus:outline-none focus:ring-2 focus:ring-azone-purple/50 shadow-lg`}
            rows={3}
            placeholder="Enter text..."
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className={`${className} border-2 border-azone-purple bg-gray-900 px-3 py-2 rounded-lg text-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-azone-purple/50 shadow-lg`}
            placeholder="Enter text..."
          />
        )}
        <div className="flex flex-col gap-1 mt-1">
          <button
            onClick={handleSave}
            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors shadow-md"
            title="Save (Enter or Ctrl+Enter)"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors shadow-md"
            title="Cancel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Keyboard shortcut hint */}
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 whitespace-nowrap">
          Press Enter to save, Esc to cancel
        </div>
      </div>
    );
  }

  // If in design mode but not editing, show editable indicator
  return (
    <span
      data-design-mode="true"
      className={`${className} relative group cursor-pointer hover:bg-azone-purple/10 px-1 py-0.5 rounded transition-all duration-200 inline-block border border-transparent hover:border-azone-purple/30`}
      onClick={() => setIsEditing(true)}
      title="Click to edit (Design Mode)"
    >
      {text}
      <Edit2 className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-azone-purple bg-gray-900 rounded p-0.5 transition-opacity shadow-lg z-10" />
      {/* Pulsing indicator dot */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-azone-purple rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity z-10" />
    </span>
  );
}
