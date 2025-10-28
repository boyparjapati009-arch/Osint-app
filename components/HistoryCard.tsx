import React from 'react';
import { HistoryItem } from '../types';

interface HistoryCardProps {
  history: HistoryItem<any>[];
  onItemClick: (item: HistoryItem<any>) => void;
  onClear: () => void;
  title: string;
  onDownload?: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history, onItemClick, onClear, title, onDownload }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mt-6 animate-fade-in">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-slate-300">{title}</h3>
          <div className="flex items-center gap-3 sm:gap-4">
            {onDownload && (
              <button
                onClick={onDownload}
                className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                aria-label="Download search history"
              >
                Download
              </button>
            )}
            <button
              onClick={onClear}
              className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors duration-200"
              aria-label="Clear all search history"
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {history.map((item) => (
            <button
              key={item.query}
              onClick={() => onItemClick(item)}
              className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-sm font-medium transform hover:-translate-y-px"
            >
              {item.query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
