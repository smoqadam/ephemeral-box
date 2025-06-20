"use client";

import { useState, useEffect, useMemo } from "react";
import { useExport } from "@/contexts/ExportContext";
import { useAppAutoSave } from "@/hooks/useAppAutoSave";
import { useAutoSave } from "@/contexts/AutoSaveContext";

const NotepadApp = () => {
  const [content, setContent] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(true);
  const { registerApp, unregisterApp } = useExport();
  const { autoSaveEnabled } = useAutoSave();
  const { loadSavedData } = useAppAutoSave("notepad", content, 1000);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      const savedContent = await loadSavedData();
      if (savedContent) {
        setContent(savedContent);
      }
    };
    loadData();
  }, [loadSavedData]);

  // Clear localStorage data if auto-save is disabled
  useEffect(() => {
    if (!autoSaveEnabled) {
      localStorage.removeItem("notepad-content");
    }
  }, [autoSaveEnabled]);

  const exportData = useMemo(() => () => ({
    content,
    lastModified: new Date().toISOString()
  }), [content]);

  useEffect(() => {
    registerApp("notepad", exportData);
    
    return () => {
      unregisterApp("notepad");
    };
  }, [exportData, registerApp, unregisterApp]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(autoSaveEnabled); // Only mark as saved if auto-save is enabled
  };

  const saveContent = () => {
    if (autoSaveEnabled) {
      // Auto-save will handle this
      setSaved(true);
    } else {
      // Manual save to temporary state only (no persistence)
      setSaved(true);
    }
    
    // Show saved indicator briefly
    setTimeout(() => {
      if (saved) setSaved(true);
    }, 2000);
  };

  const clearContent = () => {
    if (window.confirm("Are you sure you want to clear all content?")) {
      setContent("");
      localStorage.removeItem("notepad-content");
      setSaved(true);
    }
  };

  const exportNotepad = () => {
    const data = {
      content,
      lastModified: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `notepad-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-slate-900">Notes</h1>
          {!autoSaveEnabled && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Auto-save disabled
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <button
              onClick={saveContent}
              className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
              disabled={autoSaveEnabled}
            >
              Save
            </button>
            <button
              onClick={clearContent}
              className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              Clear
            </button>
            <button
              onClick={exportNotepad}
              className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              Export
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${saved ? "bg-slate-800" : "bg-slate-400"}`}></div>
            <span className={`text-sm ${saved ? "text-slate-800" : "text-slate-500"}`}>
              {autoSaveEnabled ? (saved ? "Auto-saved" : "Saving...") : (saved ? "Saved" : "Unsaved")}
            </span>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={autoSaveEnabled ? undefined : saveContent}
          className="w-full h-full p-6 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900 placeholder-slate-400 resize-none transition-colors text-base leading-relaxed"
          placeholder="Start writing..."
        />
        
        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          {content.length.toLocaleString()} characters
        </div>
      </div>
    </div>
  );
};

export default NotepadApp;
