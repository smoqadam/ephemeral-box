"use client";

import { useState } from "react";
import Dock from "@/components/Dock";
import StatusBar from "@/components/StatusBar";
import WelcomeScreen from "@/components/WelcomeScreen";
import { ExportProvider } from "@/contexts/ExportContext";
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
    <ExportProvider>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Status Bar */}
        <StatusBar activeApp={activeAppTitle} />
        
        {/* App Content Area */}
        <div className="relative flex-grow w-full z-10">
          {ActiveComponent ? (
            <div className="w-full h-full p-6">
              <div className="w-full h-full bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full h-full p-6">
                  <ActiveComponent />
                </div>
              </div>
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
    </ExportProvider>
  );
}
