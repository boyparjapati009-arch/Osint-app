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
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Number Info
        </button>
        <button
          onClick={onSelectSimInfo}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Sim Info
        </button>
        <button
          onClick={onSelectPincode}
          className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-lime-500 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Pincode Info
        </button>
         <button
          onClick={onSelectCombined}
          className="sm:col-span-2 w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Full Profile
        </button>
      </div>
      <div className="mt-12">
        <button
          onClick={handleDownloadAll}
          className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          Download All Search Info
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;