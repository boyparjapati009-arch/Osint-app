import React from 'react';
import { NumberResponse, NumberData } from '../types';

interface NumberResultsCardProps {
  details: NumberResponse;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-3 border-b border-slate-700/50 break-words">
    <p className="text-sm text-slate-400">{label.replace(/[\u{1F600}-\u{1F64F}]/gu, '').trim()}</p>
    <p className="text-md font-medium text-slate-100">{value || '-'}</p>
  </div>
);

const NumberResultsCard: React.FC<NumberResultsCardProps> = ({ details }) => {
  if (details.status !== 'success' || typeof details.data === 'string') {
    return null;
  }

  const numberData = details.data as NumberData;

  return (
    <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-rose-500/50 to-pink-500/50 hover:shadow-2xl hover:shadow-rose-500/20 transition-shadow duration-500 animate-result-appear">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-400">
          Number Details for {details.number}
        </h2>
        <div className="space-y-2">
          {Object.entries(numberData).map(([key, value]) => (
            <DetailItem key={key} label={key} value={value || ''} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberResultsCard;
