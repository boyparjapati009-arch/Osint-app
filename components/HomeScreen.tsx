import React from 'react';
import { downloadAllHistory } from '../utils/allDownload';

interface HomeScreenProps {
  onSelectAadhaar: () => void;
  onSelectNumber: () => void;
  onSelectCombined: () => void;
  onSelectSimInfo: () => void;
  onSelectPincode: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectAadhaar, onSelectNumber, onSelectCombined, onSelectSimInfo, onSelectPincode }) => {
  const handleDownloadAll = () => {
    downloadAllHistory();
  };

  return (
    <div className="text-center animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Info Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Securely fetch Aadhaar and Mobile Number details.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-md mx-auto">
        <button
          onClick={onSelectAadhaar}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Aadhaar Info
        </button>
        <button
          onClick={onSelectNumber}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Number Info
        </button>
        <button
          onClick={onSelectSimInfo}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          SIM Info
        </button>
        <button
          onClick={onSelectPincode}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-lime-500 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Pincode Info
        </button>
      </div>
      <div className="mt-6 w-full max-w-md mx-auto space-y-6">
        <button
            onClick={onSelectCombined}
            className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
            Full Profile
        </button>
        <button
            onClick={handleDownloadAll}
            className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-lg shadow-slate-600/20 hover:shadow-xl hover:shadow-slate-600/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
            Download All History
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;