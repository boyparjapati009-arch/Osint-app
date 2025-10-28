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
  const { history, addToHistory, clearHistory } = useHistory<PincodeResponse>('pincodeHistory');

  const executeSearch = useCallback(async (pincodeToSearch: string) => {
    if (!/^\d{6}$/.test(pincodeToSearch)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetails(null);

    try {
      const data = await fetchPincodeDetails(pincodeToSearch);
      setDetails(data);
      addToHistory({ query: pincodeToSearch, result: data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
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
    setDetails(item.result);
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
        {details && !isLoading && !error && <PincodeResultsCard details={details} query={pincode} />}
      </div>
    </>
  );
};

export default PincodeScreen;