"use client";

import React, { createContext, useContext, useCallback, useRef } from 'react';

interface ExportFunction {
  (): any;
}

interface ExportContextType {
  registerApp: (appId: string, exportFunction: ExportFunction) => void;
  unregisterApp: (appId: string) => void;
  exportAllApps: () => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const ExportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const registeredApps = useRef<Map<string, ExportFunction>>(new Map());

  const registerApp = useCallback((appId: string, exportFunction: ExportFunction) => {
    registeredApps.current.set(appId, exportFunction);
  }, []);

  const unregisterApp = useCallback((appId: string) => {
    registeredApps.current.delete(appId);
  }, []);

  const exportAllApps = useCallback(() => {
    const allData: Record<string, any> = {};
    
    registeredApps.current.forEach((exportFn, appId) => {
      try {
        allData[appId] = exportFn();
      } catch (error) {
        console.error(`Failed to export data for app ${appId}:`, error);
      }
    });

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `ephemeral-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const value = {
    registerApp,
    unregisterApp,
    exportAllApps,
  };

  return (
    <ExportContext.Provider value={value}>
      {children}
    </ExportContext.Provider>
  );
};

export const useExport = () => {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error('useExport must be used within an ExportProvider');
  }
  return context;
};
