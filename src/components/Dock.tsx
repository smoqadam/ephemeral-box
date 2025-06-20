"use client";

import { useState } from 'react';
import React from 'react';

interface App {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType;
}

interface SidebarProps {
  apps: App[];
  onAppClick: (appId: string) => void;
  activeAppId: string | null;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ apps, onAppClick, activeAppId }) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const getAppIcon = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app?.icon) {
      return (
        <img 
          src={app.icon} 
          alt={app.title}
          className="w-6 h-6"
        />
      );
    }
    
    // Fallback icon
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
  };

  const getAppColor = (appId: string) => {
    const colors: Record<string, string> = {
      todo: 'from-emerald-500 to-emerald-600',
      notepad: 'from-blue-500 to-blue-600'
    };
    return colors[appId] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Apps */}
      <div className="flex flex-col space-y-3 flex-1">
        {apps.map((app) => {
          const isActive = app.id === activeAppId;
          const isHovered = hoveredApp === app.id;

          return (
            <div key={app.id} className="relative">
              <button
                onClick={() => onAppClick(app.id)}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className={`
                  relative w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${isActive 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {getAppIcon(app.id)}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-800 rounded-r"></div>
                )}
              </button>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {app.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings */}
      <div className="mt-auto">
        <button className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
