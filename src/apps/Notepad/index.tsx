"use client";

import { useState, useEffect } from "react";
import { useExport } from "@/contexts/ExportContext";

const NotepadApp = () => {
  const [content, setContent] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(true);
  const { registerApp, unregisterApp } = useExport();

  useEffect(() => {
    // Load from localStorage
    const savedContent = localStorage.getItem("notepad-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  useEffect(() => {
    // Register export function
    const exportData = () => ({
      content,
      lastModified: new Date().toISOString()
    });
    
    registerApp("notepad", exportData);
    
    return () => {
      unregisterApp("notepad");
    };
  }, [content, registerApp, unregisterApp]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const saveContent = () => {
    localStorage.setItem("notepad-content", content);
    setSaved(true);
    
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={saveContent}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            💾 Save
          </button>
          <button
            onClick={clearContent}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-sm rounded-xl transition-all duration-200 font-medium"
          >
            🗑️ Clear
          </button>
          <button
            onClick={exportNotepad}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            📤 Export
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${saved ? "bg-emerald-500" : "bg-orange-500"} animate-pulse`}></div>
          <span className={`text-sm font-medium ${saved ? "text-emerald-600" : "text-orange-600"}`}>
            {saved ? "Saved" : "Unsaved"}
          </span>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={saveContent}
          className="w-full h-full p-6 bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-800 placeholder-gray-400 resize-none transition-all duration-200 text-base leading-relaxed"
          placeholder="Start writing your thoughts here... ✨"
        />
        
        {/* Character count */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200">
          {content.length} characters
        </div>
      </div>
    </div>
  );
};

export default NotepadApp;
