import { useState, useCallback } from 'react';
import { HistoryItem } from '../types';

const MAX_HISTORY_SIZE = 10;

export const useHistory = <T>(storageKey: string) => {
  const [history, setHistory] = useState<HistoryItem<T>[]>(() => {
    try {
      const storedHistory = window.localStorage.getItem(storageKey);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  });

  const addToHistory = useCallback((newItem: HistoryItem<T>) => {
    if (!newItem || !newItem.query) return;

    setHistory(prevHistory => {
      // Remove item if it already exists to move it to the front
      const filteredHistory = prevHistory.filter(h => h.query !== newItem.query);
      // Add the new item to the beginning
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
      
      return newHistory;
    });
  }, [storageKey]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }, [storageKey]);

  return { history, addToHistory, clearHistory };
};
