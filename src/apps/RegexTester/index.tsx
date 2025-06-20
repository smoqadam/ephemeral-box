"use client";

import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Hello 123 World 456!");
  const [replaceValue, setReplaceValue] = useState("NUMBER");

  const regexResult = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(regex));
      const isValid = true;
      const replaced = testString.replace(regex, replaceValue);
      
      return {
        isValid,
        matches,
        replaced,
        error: null
      };
    } catch (error) {
      return {
        isValid: false,
        matches: [],
        replaced: "",
        error: error instanceof Error ? error.message : "Invalid regex"
      };
    }
  }, [pattern, flags, testString, replaceValue]);

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (matches.length === 0) return text;
    
    let result = text;
    let offset = 0;
    
    matches.forEach((match) => {
      if (match.index !== undefined) {
        const start = match.index + offset;
        const end = start + match[0].length;
        const before = result.slice(0, start);
        const matched = result.slice(start, end);
        const after = result.slice(end);
        
        result = before + `<mark class="bg-yellow-200 px-1 rounded">${matched}</mark>` + after;
        offset += 47; // Length of the mark tags
      }
    });
    
    return result;
  };

  const commonPatterns = [
    { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
    { name: "Phone", pattern: "\\+?[1-9]\\d{1,14}", flags: "g" },
    { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", flags: "g" },
    { name: "IP Address", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b", flags: "g" },
    { name: "Hex Color", pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}", flags: "g" },
    { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
    { name: "Numbers", pattern: "\\d+", flags: "g" },
    { name: "Words", pattern: "\\b\\w+\\b", flags: "g" },
  ];

  const flagOptions = [
    { key: "g", label: "Global", description: "Find all matches" },
    { key: "i", label: "Ignore Case", description: "Case insensitive" },
    { key: "m", label: "Multiline", description: "^ and $ match line breaks" },
    { key: "s", label: "Dot All", description: ". matches newlines" },
    { key: "u", label: "Unicode", description: "Unicode support" },
    { key: "y", label: "Sticky", description: "Match from lastIndex" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">Regex Tester</h1>
        
        {/* Common Patterns */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Quick Patterns</label>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setPattern(preset.pattern);
                  setFlags(preset.flags);
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Pattern and Test */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col">
          {/* Pattern Input */}
          <div className="p-4 border-b border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Regular Expression</label>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-500">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded font-mono text-sm ${
                  regexResult.isValid ? "border-slate-300" : "border-red-300 bg-red-50"
                }`}
                placeholder="Enter regex pattern..."
              />
              <span className="text-slate-500">/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-16 px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
                placeholder="flags"
              />
            </div>
            
            {regexResult.error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                Error: {regexResult.error}
              </div>
            )}

            {/* Flags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Flags</label>
              <div className="grid grid-cols-2 gap-2">
                {flagOptions.map((flag) => (
                  <label key={flag.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={flags.includes(flag.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags(prev => prev + flag.key);
                        } else {
                          setFlags(prev => prev.replace(flag.key, ""));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="font-mono">{flag.key}</span>
                    <span className="text-slate-600">{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Test String */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Test String</label>
            </div>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="flex-1 p-4 resize-none border-none outline-none font-mono text-sm"
              placeholder="Enter text to test against..."
            />
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="w-1/2 flex flex-col">
          {/* Matches */}
          <div className="flex-1 border-b border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-medium text-slate-700">
                Matches ({regexResult.matches.length})
              </h2>
            </div>
            <div className="p-4 overflow-auto" style={{ height: 'calc(50% - 60px)' }}>
              {regexResult.isValid && (
                <div 
                  className="font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(testString, regexResult.matches)
                  }}
                />
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="flex-1">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-medium text-slate-700">Match Details</h2>
            </div>
            <div className="p-4 overflow-auto" style={{ height: 'calc(50% - 60px)' }}>
              {regexResult.matches.length > 0 ? (
                <div className="space-y-2">
                  {regexResult.matches.map((match, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded text-sm">
                      <div className="font-medium">Match {index + 1}</div>
                      <div className="font-mono text-blue-600">"{match[0]}"</div>
                      <div className="text-slate-600">
                        Index: {match.index} - {(match.index || 0) + match[0].length - 1}
                      </div>
                      {match.length > 1 && (
                        <div className="text-slate-600">
                          Groups: {match.slice(1).map((group, i) => `$${i + 1}: "${group}"`).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">No matches found</div>
              )}
            </div>
          </div>

          {/* Replace */}
          <div className="border-t border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Replace With</label>
              <input
                type="text"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="Replacement text..."
              />
            </div>
            <div className="p-4 bg-slate-50">
              <div className="text-sm font-medium text-slate-700 mb-2">Result</div>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                {regexResult.replaced}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
