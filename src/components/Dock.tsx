import Image from 'next/image';
import { useState } from 'react';

interface DockProps {
  apps: {
    id: string;
    title: string;
    icon: string;
    component: React.ComponentType;
  }[];
  onAppClick: (appId: string) => void;
  activeAppId: string | null;
}

const Dock: React.FC<DockProps> = ({ apps, onAppClick, activeAppId }) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="h-20 w-full flex justify-center items-center pb-2">
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg border border-white/30 dark:border-gray-700/30">
        {apps.map((app) => {
          const isActive = app.id === activeAppId;
          const isHovered = hoveredApp === app.id;
          
          return (
            <div
              key={app.id}
              className={`relative group transition-transform duration-200 ${
                isHovered ? 'scale-110' : ''
              }`}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              onClick={() => onAppClick(app.id)}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200
                  ${isActive ? 'bg-gray-200/80 dark:bg-gray-700/70 ring-1 ring-gray-300 dark:ring-gray-600' : ''}
                  ${isHovered && !isActive ? 'bg-gray-100/70 dark:bg-gray-700/30' : ''}
                  hover:bg-gray-100/70 dark:hover:bg-gray-700/30`}
              >
                <Image src={app.icon} alt={app.title} width={32} height={32} className="w-7 h-7" />
              </div>
              
              {/* App title tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white text-xs py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {app.title}
              </div>
              
              {/* Indicator dot for active app */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
