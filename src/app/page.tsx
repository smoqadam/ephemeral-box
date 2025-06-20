"use client";

import { useState } from "react";
import Dock from "@/components/Dock";
import StatusBar from "@/components/StatusBar";
import WelcomeScreen from "@/components/WelcomeScreen";
import { AppWindow } from "@/types";

// Import apps
import TodoApp from "@/apps/Todo";
import NotepadApp from "@/apps/Notepad";

export default function Home() {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const apps = [
    { id: "todo", title: "Todo List", icon: "/icons/todo.svg", component: TodoApp },
    { id: "notepad", title: "Notepad", icon: "/icons/notepad.svg", component: NotepadApp },
  ];

  const switchApp = (appId: string) => {
    setActiveAppId(appId === activeAppId ? null : appId);
  };

  // Get the active app component
  const ActiveComponent = activeAppId 
    ? apps.find(app => app.id === activeAppId)?.component 
    : null;

  const activeAppTitle = activeAppId
    ? apps.find(app => app.id === activeAppId)?.title
    : null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex flex-col">
      {/* Status Bar */}
      <StatusBar activeApp={activeAppTitle} />
      
      {/* App Content Area */}
      <div className="relative flex-grow w-full">
        {ActiveComponent ? (
          <div className="w-full h-full p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
            <ActiveComponent />
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </div>
      
      {/* Dock */}
      <Dock 
        apps={apps} 
        onAppClick={switchApp} 
        activeAppId={activeAppId} 
      />
    </div>
  );
}
