"use client";

import { useState, useEffect } from "react";

const NotepadApp = () => {
  const [content, setContent] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(true);

  useEffect(() => {
    // Load from localStorage
    const savedContent = localStorage.getItem("notepad-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <button
            onClick={saveContent}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={clearContent}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        <span className={`text-xs ${saved ? "text-green-500" : "text-gray-400"}`}>
          {saved ? "Saved" : "Unsaved"}
        </span>
      </div>
      
      <textarea
        value={content}
        onChange={handleChange}
        onBlur={saveContent}
        className="flex-1 p-3 w-full border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 resize-none"
        placeholder="Start typing your notes here..."
      />
    </div>
  );
};

export default NotepadApp;
