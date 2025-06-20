"use client";

import { useState } from "react";
import Sidebar from "@/components/Dock";
import StatusBar from "@/components/StatusBar";
import WelcomeScreen from "@/components/WelcomeScreen";
import { ExportProvider } from "@/contexts/ExportContext";
import { AutoSaveProvider, useAutoSave } from "@/contexts/AutoSaveContext";

// Import apps
import TodoApp from "@/apps/Todo";
import NotepadApp from "@/apps/Notepad";
import MarkdownPreviewer from "@/apps/MarkdownPreviewer";
import Sketchpad from "@/apps/Sketchpad";
import Calculator from "@/apps/Calculator";
import UnitConverter from "@/apps/UnitConverter";
import Timer from "@/apps/Timer";
import TextDiff from "@/apps/TextDiff";
import RegexTester from "@/apps/RegexTester";
import BreathingGuide from "@/apps/BreathingGuide";
import DataScratchpad from "@/apps/DataScratchpad";

function AppContent() {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const { autoSaveEnabled } = useAutoSave();

  const apps = [
    { id: "todo", title: "Task Manager", icon: "./icons/todo.svg", component: TodoApp },
    { id: "notepad", title: "Notes", icon: "./icons/notepad.svg", component: NotepadApp },
    { id: "markdown", title: "Markdown Previewer", icon: "./icons/markdown.svg", component: MarkdownPreviewer },
    { id: "sketchpad", title: "Sketchpad", icon: "./icons/sketchpad.svg", component: Sketchpad },
    { id: "calculator", title: "Calculator", icon: "./icons/calculator.svg", component: Calculator },
    { id: "converter", title: "Unit Converter", icon: "./icons/converter.svg", component: UnitConverter },
    { id: "timer", title: "Timer", icon: "./icons/timer.svg", component: Timer },
    { id: "textdiff", title: "Text Diff", icon: "./icons/diff.svg", component: TextDiff },
    { id: "regex", title: "Regex Tester", icon: "./icons/regex.svg", component: RegexTester },
    { id: "breathing", title: "Breathing Guide", icon: "./icons/breathing.svg", component: BreathingGuide },
    { id: "scratchpad", title: "Data Scratchpad", icon: "./icons/scratchpad.svg", component: DataScratchpad },
  ];

  const switchApp = (appId: string) => {
    setActiveAppId(appId === activeAppId ? null : appId);
  };

  const closeApp = () => {
    setActiveAppId(null);
  };

  const minimizeApp = () => {
    setActiveAppId(null);
  };

  // Get the active app component
  const ActiveComponent = activeAppId 
    ? apps.find(app => app.id === activeAppId)?.component 
    : null;

  const activeAppTitle = activeAppId
    ? apps.find(app => app.id === activeAppId)?.title
    : null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex flex-col">
      {/* Auto-save warning banner */}
      {autoSaveEnabled && (
        <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-center text-sm font-medium relative z-50">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>WARNING: Auto-save is enabled - Your data will be stored in the browser and persist between sessions!</span>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-xs transition-colors"
          >
            Refresh to Reset
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          apps={apps} 
          onAppClick={switchApp} 
          activeAppId={activeAppId} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Status Bar */}
          <StatusBar 
            activeApp={activeAppTitle}
            onCloseApp={closeApp}
            onMinimizeApp={minimizeApp}
          />
          
          {/* App Content Area */}
          <div className="flex-1 overflow-hidden">
            {ActiveComponent ? (
              <div className="w-full h-full p-8">
                <div className="w-full h-full bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full p-8">
                    <ActiveComponent />
                  </div>
                </div>
              </div>
            ) : (
              <WelcomeScreen />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AutoSaveProvider>
      <ExportProvider>
        <AppContent />
      </ExportProvider>
    </AutoSaveProvider>
  );
}
