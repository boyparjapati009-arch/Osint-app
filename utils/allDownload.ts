import { HistoryItem } from '../types';
import { formatResultToString } from './download';

const getHistoryFromStorage = <T>(key: string): HistoryItem<T>[] => {
  try {
    const storedHistory = window.localStorage.getItem(key);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return [];
  }
};

const formatHistoryCategory = (title: string, history: HistoryItem<any>[]): string => {
  if (!history || history.length === 0) {
    return `==============================\n${title.toUpperCase()}\n==============================\nNo history found for this category.`;
  }

  const header = `==============================\n${title.toUpperCase()}\n==============================`;
  
  const content = history.map((item, index) => {
    const itemHeader = `----------\nSearch #${index + 1}: ${item.query}\n----------`;
    const body = formatResultToString(item.result);
    return `${itemHeader}\n${body}`;
  }).join('\n\n');

  return `${header}\n\n${content}`;
};

export const downloadAllHistory = (): void => {
  const aadhaarHistory = getHistoryFromStorage('aadhaarHistory');
  const numberHistory = getHistoryFromStorage('numberHistory');
  const simInfoHistory = getHistoryFromStorage('simInfoHistory');
  const pincodeHistory = getHistoryFromStorage('pincodeHistory');
  const combinedHistory = getHistoryFromStorage('combinedHistory');

  if (aadhaarHistory.length === 0 && numberHistory.length === 0 && combinedHistory.length === 0 && simInfoHistory.length === 0 && pincodeHistory.length === 0) {
    alert("No search history found to download.");
    return;
  }

  const aadhaarContent = formatHistoryCategory('Aadhaar Search History', aadhaarHistory);
  const numberContent = formatHistoryCategory('Number Search History', numberHistory);
  const simInfoContent = formatHistoryCategory('SIM Info Search History', simInfoHistory);
  const pincodeContent = formatHistoryCategory('Pincode Info Search History', pincodeHistory);
  const combinedContent = formatHistoryCategory('Full Profile Search History', combinedHistory);
  
  const fullContent = [aadhaarContent, numberContent, simInfoContent, pincodeContent, combinedContent].join('\n\n\n');

  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'all-search-history.txt';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};