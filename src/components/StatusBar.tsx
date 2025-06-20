"use client";

import { useState, useEffect } from "react";
import { useExport } from "@/contexts/ExportContext";
import { useAutoSave } from "@/contexts/AutoSaveContext";

interface StatusBarProps {
  activeApp?: string | null;
  onMinimizeApp?: () => void;
  onCloseApp?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ activeApp, onMinimizeApp, onCloseApp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { exportAllApps } = useExport();
  const { autoSaveEnabled, toggleAutoSave } = useAutoSave();
  
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
    <div className="w-full bg-white h-12 px-6 flex items-center justify-between border-b border-slate-200 z-50">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
          <span className="font-medium text-slate-900">Ephemeral</span>
        </div>
        
        {activeApp && (
          <div className="flex items-center space-x-4">
            <div className="w-px h-4 bg-slate-300"></div>
            <span className="text-slate-600">{activeApp}</span>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={onMinimizeApp}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center"
                title="Minimize"
              >
                <div className="w-2 h-px bg-slate-600"></div>
              </button>
              <button
                onClick={onCloseApp}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-red-200 transition-colors flex items-center justify-center group"
                title="Close"
              >
                <svg className="w-3 h-3 text-slate-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={exportAllApps}
          className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm transition-colors"
        >
          Export All
        </button>
        
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <span>{formattedDate}</span>
          <span className="font-mono text-slate-700">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Auto Save:</span>
          <button
            onClick={toggleAutoSave}
            className={`
              relative inline-flex h-4 w-7 items-center rounded-full transition-colors
              ${autoSaveEnabled ? 'bg-red-500' : 'bg-slate-600'}
            `}
            title={`Auto Save ${autoSaveEnabled ? 'On' : 'Off'}`}
          >
            <span
              className={`
                inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                ${autoSaveEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}
              `}
            />
          </button>
          <span className={autoSaveEnabled ? 'text-red-500 font-medium' : 'text-slate-500'}>
            {autoSaveEnabled ? 'ON' : 'OFF'}
          </span>
          {autoSaveEnabled && (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
