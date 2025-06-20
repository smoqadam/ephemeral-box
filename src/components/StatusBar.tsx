"use client";

import { useState, useEffect } from "react";
import { useExport } from "@/contexts/ExportContext";

interface StatusBarProps {
  activeApp?: string | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ activeApp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { exportAllApps } = useExport();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl h-10 px-6 flex items-center justify-between border-b border-gray-200/50 z-50">
      <div className="text-sm font-medium text-gray-700 flex items-center">
        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
        <span className="font-semibold">Ephemeral OS</span>
        {activeApp && (
          <>
            <span className="mx-3 text-gray-400">→</span>
            <span className="text-gray-600">{activeApp}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={exportAllApps}
          className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Export All
        </button>
        <div className="text-sm text-gray-500 font-medium">
          {formattedDate}
        </div>
        <div className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
