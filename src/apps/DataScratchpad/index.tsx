"use client";

import { useState, useEffect, useMemo } from "react";

type DataFormat = "raw" | "json" | "csv" | "xml" | "base64" | "url" | "lines";

export default function DataScratchpad() {
  const [content, setContent] = useState("");
  const [activeFormat, setActiveFormat] = useState<DataFormat>("raw");
  const [history, setHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Save to history when content changes
  useEffect(() => {
    if (content.trim() && !history.includes(content.trim())) {
      setHistory(prev => [content.trim(), ...prev.slice(0, 9)]); // Keep last 10
    }
  }, [content]);

  const formatContent = (text: string, format: DataFormat): string => {
    if (!text.trim()) return "";

    try {
      switch (format) {
        case "json":
          const parsed = JSON.parse(text);
          return JSON.stringify(parsed, null, 2);
        
        case "csv":
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) return text;
          
          // Try to detect delimiter
          const delimiters = [',', '\t', ';', '|'];
          let bestDelimiter = ',';
          let maxColumns = 0;
          
          delimiters.forEach(delim => {
            const columns = lines[0].split(delim).length;
            if (columns > maxColumns) {
              maxColumns = columns;
              bestDelimiter = delim;
            }
          });

          return lines.map(line => {
            const cells = line.split(bestDelimiter);
            return cells.map(cell => `"${cell.trim()}"`).join(' | ');
          }).join('\n');

        case "xml":
          // Basic XML formatting
          let formatted = text.replace(/></g, '>\n<');
          let indent = 0;
          return formatted.split('\n').map(line => {
            if (line.includes('</') && !line.includes('</'+ line.split('</')[1].split('>')[0] + '>')) {
              indent--;
            }
            const result = '  '.repeat(Math.max(0, indent)) + line.trim();
            if (line.includes('<') && !line.includes('</') && !line.includes('/>')) {
              indent++;
            }
            return result;
          }).join('\n');

        case "base64":
          if (isBase64(text)) {
            try {
              return atob(text);
            } catch {
              return "Invalid Base64";
            }
          } else {
            return btoa(text);
          }

        case "url":
          try {
            return decodeURIComponent(text);
          } catch {
            return encodeURIComponent(text);
          }

        case "lines":
          return text.split(/\s+/).filter(item => item.trim()).join('\n');

        default:
          return text;
      }
    } catch (error) {
      return `Error formatting as ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const isBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  const formattedContent = useMemo(() => {
    return formatContent(content, activeFormat);
  }, [content, activeFormat]);

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return history;
    return history.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const analyzeContent = (text: string) => {
    if (!text.trim()) return null;

    const analysis = {
      length: text.length,
      lines: text.split('\n').length,
      words: text.split(/\s+/).filter(w => w).length,
      chars: text.replace(/\s/g, '').length,
      isJson: false,
      isUrl: false,
      isEmail: false,
      isBase64: false,
      containsNumbers: /\d/.test(text),
      containsSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(text)
    };

    // Check if it's JSON
    try {
      JSON.parse(text);
      analysis.isJson = true;
    } catch {}

    // Check if it's a URL
    try {
      new URL(text.trim());
      analysis.isUrl = true;
    } catch {}

    // Check if it's an email
    analysis.isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());

    // Check if it's Base64
    analysis.isBase64 = isBase64(text.trim());

    return analysis;
  };

  const contentAnalysis = useMemo(() => analyzeContent(content), [content]);

  const clearContent = () => {
    setContent("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedContent);
  };

  const loadFromHistory = (item: string) => {
    setContent(item);
  };

  const downloadContent = () => {
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratchpad-${activeFormat}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatOptions: { key: DataFormat; label: string; description: string }[] = [
    { key: "raw", label: "Raw", description: "Original content" },
    { key: "json", label: "JSON", description: "Format/Parse JSON" },
    { key: "csv", label: "CSV", description: "Table format" },
    { key: "xml", label: "XML", description: "Format XML" },
    { key: "base64", label: "Base64", description: "Encode/Decode" },
    { key: "url", label: "URL", description: "Encode/Decode URLs" },
    { key: "lines", label: "Lines", description: "Split to lines" },
  ];

  return (
    <div className="h-full flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-slate-800">Data Scratchpad</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!content.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-slate-300"
              >
                Copy
              </button>
              <button
                onClick={downloadContent}
                disabled={!content.trim()}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-slate-300"
              >
                Download
              </button>
              <button
                onClick={clearContent}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex flex-wrap gap-1">
            {formatOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setActiveFormat(option.key)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeFormat === option.key
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
                title={option.description}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Input */}
          <div className="w-1/2 border-r border-slate-200 flex flex-col">
            <div className="p-3 bg-slate-100 border-b border-slate-200">
              <h2 className="font-medium text-slate-700">Input</h2>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 resize-none border-none outline-none font-mono text-sm"
              placeholder="Paste anything here... JSON, CSV, XML, URLs, Base64, or any text data"
            />
          </div>

          {/* Output */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 bg-slate-100 border-b border-slate-200">
              <h2 className="font-medium text-slate-700">
                Output ({formatOptions.find(f => f.key === activeFormat)?.label})
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-slate-50">
              <pre className="font-mono text-sm whitespace-pre-wrap text-slate-800">
                {formattedContent || "Formatted content will appear here..."}
              </pre>
            </div>
          </div>
        </div>

        {/* Analysis Bar */}
        {contentAnalysis && (
          <div className="p-3 bg-slate-100 border-t border-slate-200">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span>Length: {contentAnalysis.length}</span>
              <span>Lines: {contentAnalysis.lines}</span>
              <span>Words: {contentAnalysis.words}</span>
              <span>Characters: {contentAnalysis.chars}</span>
              {contentAnalysis.isJson && <span className="text-green-600">✓ JSON</span>}
              {contentAnalysis.isUrl && <span className="text-blue-600">✓ URL</span>}
              {contentAnalysis.isEmail && <span className="text-purple-600">✓ Email</span>}
              {contentAnalysis.isBase64 && <span className="text-orange-600">✓ Base64</span>}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - History */}
      <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-medium text-slate-700 mb-3">History</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder="Search history..."
          />
        </div>

        <div className="flex-1 overflow-auto p-2">
          {filteredHistory.length > 0 ? (
            <div className="space-y-2">
              {filteredHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => loadFromHistory(item)}
                  className="w-full p-3 bg-white border border-slate-200 rounded text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="font-mono text-xs text-slate-600 truncate">
                    {item.length > 100 ? item.substring(0, 100) + "..." : item}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.length} chars • {item.split('\n').length} lines
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm mt-8">
              {searchTerm ? "No matching history" : "No history yet"}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => setContent(new Date().toISOString())}
              className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              Insert Timestamp
            </button>
            <button
              onClick={() => setContent(Math.random().toString(36).substring(2, 15))}
              className="w-full px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
            >
              Generate ID
            </button>
            <button
              onClick={() => setContent('{\n  "key": "value",\n  "array": [1, 2, 3],\n  "nested": {\n    "property": true\n  }\n}')}
              className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
            >
              Sample JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
