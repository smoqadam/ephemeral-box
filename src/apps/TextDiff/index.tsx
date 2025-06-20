"use client";

import { useState, useMemo } from "react";

type DiffResult = {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
};

export default function TextDiff() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [diffMode, setDiffMode] = useState<"word" | "line">("line");

  const diffTexts = (text1: string, text2: string, mode: "word" | "line"): DiffResult[] => {
    const splitText1 = mode === "word" ? text1.split(/\s+/) : text1.split('\n');
    const splitText2 = mode === "word" ? text2.split(/\s+/) : text2.split('\n');
    
    const result: DiffResult[] = [];
    const dp: number[][] = [];
    
    // Initialize DP table
    for (let i = 0; i <= splitText1.length; i++) {
      dp[i] = [];
      for (let j = 0; j <= splitText2.length; j++) {
        if (i === 0) dp[i][j] = j;
        else if (j === 0) dp[i][j] = i;
        else if (splitText1[i - 1] === splitText2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    
    // Backtrack to find the actual diff
    let i = splitText1.length;
    let j = splitText2.length;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && splitText1[i - 1] === splitText2[j - 1]) {
        result.unshift({
          type: "unchanged",
          content: splitText1[i - 1],
          lineNumber: i
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
        result.unshift({
          type: "added",
          content: splitText2[j - 1],
          lineNumber: j
        });
        j--;
      } else if (i > 0) {
        result.unshift({
          type: "removed",
          content: splitText1[i - 1],
          lineNumber: i
        });
        i--;
      }
    }
    
    return result;
  };

  const diffResult = useMemo(() => {
    if (!leftText && !rightText) return [];
    return diffTexts(leftText, rightText, diffMode);
  }, [leftText, rightText, diffMode]);

  const stats = useMemo(() => {
    const added = diffResult.filter(item => item.type === "added").length;
    const removed = diffResult.filter(item => item.type === "removed").length;
    const unchanged = diffResult.filter(item => item.type === "unchanged").length;
    return { added, removed, unchanged };
  }, [diffResult]);

  const clearTexts = () => {
    setLeftText("");
    setRightText("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Text Diff Tool</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Mode:</label>
              <select
                value={diffMode}
                onChange={(e) => setDiffMode(e.target.value as "word" | "line")}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              >
                <option value="line">Line by Line</option>
                <option value="word">Word by Word</option>
              </select>
            </div>
            <button
              onClick={clearTexts}
              className="px-3 py-1 bg-slate-500 text-white rounded text-sm hover:bg-slate-600"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Stats */}
        {(leftText || rightText) && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">+{stats.added} added</span>
            <span className="text-red-600">-{stats.removed} removed</span>
            <span className="text-slate-600">{stats.unchanged} unchanged</span>
          </div>
        )}
      </div>

      {/* Input Areas */}
      <div className="flex-1 flex">
        {/* Left Text */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200">
            <h2 className="font-medium text-slate-700">Original Text</h2>
          </div>
          <textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            className="flex-1 p-4 resize-none border-none outline-none font-mono text-sm"
            placeholder="Paste your original text here..."
          />
        </div>

        {/* Right Text */}
        <div className="w-1/2 flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200">
            <h2 className="font-medium text-slate-700">Modified Text</h2>
          </div>
          <textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            className="flex-1 p-4 resize-none border-none outline-none font-mono text-sm"
            placeholder="Paste your modified text here..."
          />
        </div>
      </div>

      {/* Diff Results */}
      {diffResult.length > 0 && (
        <div className="h-1/3 border-t border-slate-200 flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200">
            <h2 className="font-medium text-slate-700">Differences</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-slate-50">
            <div className="font-mono text-sm space-y-1">
              {diffResult.map((item, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded ${
                    item.type === "added"
                      ? "bg-green-100 text-green-800"
                      : item.type === "removed"
                      ? "bg-red-100 text-red-800"
                      : "bg-white text-slate-700"
                  }`}
                >
                  <span className="inline-block w-6 text-xs text-slate-500 mr-2">
                    {item.type === "added" ? "+" : item.type === "removed" ? "-" : " "}
                  </span>
                  {item.content || "(empty line)"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
