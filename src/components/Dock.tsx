"use client";

import Image from 'next/image';
import { useState } from 'react';

interface App {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType;
}

interface DockProps {
  apps: App[];
  onAppClick: (appId: string) => void;
  activeAppId: string | null;
}

const Dock: React.FC<DockProps> = ({ apps, onAppClick, activeAppId }) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="flex justify-center pb-6 px-6 z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-3 shadow-2xl">
        <div className="flex space-x-2">
          {apps.map((app) => {
            const isActive = app.id === activeAppId;
            const isHovered = hoveredApp === app.id;

            return (
              <button
                key={app.id}
                onClick={() => onAppClick(app.id)}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className={`
                  relative group p-3 rounded-xl transition-all duration-300 transform hover:scale-110
                  ${isActive 
                    ? 'bg-gray-100 shadow-lg' 
                    : 'hover:bg-gray-50'
                  }
                `}
                title={app.title}
              >
                {/* App Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  app.id === 'todo' 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {app.title.charAt(0)}
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                    {app.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dock;
