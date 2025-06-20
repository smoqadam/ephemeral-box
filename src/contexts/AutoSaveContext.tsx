"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AutoSaveContextType {
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  saveData: (appId: string, data: any) => Promise<void>;
  loadData: (appId: string) => Promise<any>;
  clearAllData: () => Promise<void>;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(undefined);

const DB_NAME = 'EphemeralToolsDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';

export function AutoSaveProvider({ children }: { children: React.ReactNode }) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Initialize IndexDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => console.error('IndexDB error');
        
        request.onsuccess = () => {
          setDb(request.result);
        };
        
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, { keyPath: 'appId' });
          }
        };
      } catch (error) {
        console.error('Failed to initialize IndexDB:', error);
      }
    };

    initDB();
    
    // Load auto-save preference from localStorage
    const saved = localStorage.getItem('autoSaveEnabled');
    if (saved) {
      setAutoSaveEnabled(JSON.parse(saved));
    }
  }, []);

  const saveData = useCallback(async (appId: string, data: any) => {
    if (!autoSaveEnabled || !db) return;
    
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.put({ appId, data, timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }, [autoSaveEnabled, db]);

  const loadData = useCallback(async (appId: string) => {
    if (!autoSaveEnabled || !db) return null;
    
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(appId);
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result?.data || null);
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      return null;
    }
  }, [autoSaveEnabled, db]);

  const clearAllData = useCallback(async () => {
    if (!db) return;
    
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.clear();
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }, [db]);

  const toggleAutoSave = useCallback(() => {
    const newValue = !autoSaveEnabled;
    
    if (!newValue) {
      // Show warning and clear data when disabling
      const confirmed = window.confirm(
        'Disabling auto-save will clear all saved data. Are you sure you want to continue?'
      );
      
      if (confirmed) {
        clearAllData();
        setAutoSaveEnabled(false);
        localStorage.setItem('autoSaveEnabled', 'false');
      }
    } else {
      setAutoSaveEnabled(true);
      localStorage.setItem('autoSaveEnabled', 'true');
    }
  }, [autoSaveEnabled, clearAllData]);

  return (
    <AutoSaveContext.Provider value={{
      autoSaveEnabled,
      toggleAutoSave,
      saveData,
      loadData,
      clearAllData
    }}>
      {children}
    </AutoSaveContext.Provider>
  );
}

export function useAutoSave() {
  const context = useContext(AutoSaveContext);
  if (context === undefined) {
    throw new Error('useAutoSave must be used within an AutoSaveProvider');
  }
  return context;
}
