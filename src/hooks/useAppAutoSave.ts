import { useEffect, useCallback } from 'react';
import { useAutoSave } from '@/contexts/AutoSaveContext';

export function useAppAutoSave<T>(appId: string, data: T, delay: number = 1000) {
  const { autoSaveEnabled, saveData, loadData } = useAutoSave();

  // Auto-save data with debouncing
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const timeoutId = setTimeout(() => {
      saveData(appId, data);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, appId, autoSaveEnabled, saveData, delay]);

  // Load data on mount
  const loadSavedData = useCallback(async () => {
    if (autoSaveEnabled) {
      return await loadData(appId);
    }
    return null;
  }, [appId, autoSaveEnabled, loadData]);

  return { loadSavedData, autoSaveEnabled };
}
