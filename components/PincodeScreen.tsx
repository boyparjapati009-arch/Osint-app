import React, { useState, useCallback } from 'react';
import { PincodeResponse, HistoryItem } from '../types';
import { fetchPincodeDetails } from '../services/pincodeApi';
import { useHistory } from '../hooks/useHistory';
import SearchCard from './SearchCard';
import PincodeResultsCard from './PincodeResultsCard';
import Loader from './Loader';
import HistoryCard from './HistoryCard';
import { downloadHistoryAsTxt } from '../utils/download';

const PincodeScreen: React.FC = () => {
  const [pincode, setPincode] = useState<string>('');
  const [details, setDetails] = useState<PincodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const { history, addToHistory, clearHistory } = useHistory<PincodeResponse>('pincodeHistory');

  const executeSearch = useCallback(async (pincodeToSearch: string) => {
    if (!/^\d{6}$/.test(pincodeToSearch)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetails(null);
    setGeneratedText(null);

    try {
      const data = await fetchPincodeDetails(pincodeToSearch);
      
      // Add result to history regardless of status
      addToHistory({ query: pincodeToSearch, result: data });

      if (data.Status === 'Success') {
        setDetails(data);
      } else if (data.Status === 'Generated') {
        setGeneratedText(data.Message);
      } else {
        // Fallback for other non-success statuses from the API that might have slipped through
        setError(data.Message || 'Could not find pincode details.');
      }
    } catch (err) {
      // This will now only catch truly unexpected errors, not API "not found" cases.
      console.error("An unexpected error occurred during search execution:", err);
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  const handleFormSubmit = () => {
    executeSearch(pincode);
  };

  const handleHistoryClick = (item: HistoryItem<PincodeResponse>) => {
    setPincode(item.query);
    setError(null);
    
    if (item.result.Status === 'Generated' && item.result.Message) {
      setGeneratedText(item.result.Message);
      setDetails(null);
    } else {
      setDetails(item.result);
      setGeneratedText(null);
    }
  };

  const handleDownloadHistory = () => {
    downloadHistoryAsTxt(history, 'pincode-search-history.txt');
  };

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-lime-500 text-transparent bg-clip-text">
          Pincode Info Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Enter a pincode to fetch location details.
        </p>
      </header>

      <SearchCard
        value={pincode}
        setValue={setPincode}
        onSearch={handleFormSubmit}
        isLoading={isLoading}
        placeholder="Enter 6-digit Pincode"
        maxLength={6}
        pattern="\d{6}"
        title="Pincode must be 6 digits."
      />
      
      <HistoryCard
        history={history}
        onItemClick={handleHistoryClick}
        onClear={clearHistory}
        title="Recent Pincode Searches"
        onDownload={handleDownloadHistory}
      />

      <div className="w-full mt-8">
        {isLoading && <Loader />}
        {error && !isLoading && (
          <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
            <p className="font-medium text-red-400">{error}</p>
          </div>
        )}
        {generatedText && !isLoading && (
          <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 animate-result-appear">
             <div className="bg-slate-800/90 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">
                  Information for Pincode: {pincode}
                </h2>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{generatedText}</p>
             </div>
          </div>
        )}
        {details && !isLoading && !generatedText && <PincodeResultsCard details={details} />}
      </div>
    </>
  );
};

export default PincodeScreen;