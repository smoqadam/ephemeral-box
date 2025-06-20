"use client";

import { useState, useEffect } from "react";

interface StatusBarProps {
  activeApp: string | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ activeApp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the date: Day, Month Date, Year
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Format the time: HH:MM:SS AM/PM
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md h-9 px-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
        <span>OS Ephemeral</span>
        {activeApp && (
          <>
            <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
            <span className="text-gray-600 dark:text-gray-300">{activeApp}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-5">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </div>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
