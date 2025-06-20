"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppData {
  [appId: string]: any;
}

interface ExportContextType {
  registerApp: (appId: string, exportFn: () => any) => void;
  unregisterApp: (appId: string) => void;
  exportAllApps: () => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error("useExport must be used within an ExportProvider");
  }
  return context;
};

export const ExportProvider = ({ children }: { children: ReactNode }) => {
  const [appExporters, setAppExporters] = useState<Map<string, () => any>>(new Map());

  const registerApp = (appId: string, exportFn: () => any) => {
    setAppExporters(prev => new Map(prev).set(appId, exportFn));
  };

  const unregisterApp = (appId: string) => {
    setAppExporters(prev => {
      const newMap = new Map(prev);
      newMap.delete(appId);
      return newMap;
    });
  };

  const exportAllApps = () => {
    const allData: AppData = {};
    
    appExporters.forEach((exportFn, appId) => {
      allData[appId] = exportFn();
    });

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `ephemeral-tools-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ExportContext.Provider value={{ registerApp, unregisterApp, exportAllApps }}>
      {children}
    </ExportContext.Provider>
  );
};
