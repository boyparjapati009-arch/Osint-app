import React, { useState, useCallback } from 'react';
import { SimInfoResponse, HistoryItem } from '../types';
import { fetchSimInfoDetails } from '../services/simApi';
import { fetchNumberProtectedList } from '../services/numberApi';
import { useHistory } from '../hooks/useHistory';
import SearchCard from './SearchCard';
import SimInfoResultsCard from './SimInfoResultsCard';
import Loader from './Loader';
import HistoryCard from './HistoryCard';
import { downloadHistoryAsTxt } from '../utils/download';

const SimInfoScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [details, setDetails] = useState<SimInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const { history, addToHistory, clearHistory } = useHistory<SimInfoResponse>('simInfoHistory');

  const executeSearch = useCallback(async (numberToSearch: string) => {
    if (!/^\d{10}$/.test(numberToSearch)) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setDetails(null);
    setIsProtected(false);

    try {
      const protectedData = await fetchNumberProtectedList();
      if (protectedData.protected_numbers?.includes(numberToSearch)) {
        setIsProtected(true);
        return;
      }

      const data = await fetchSimInfoDetails(numberToSearch);
      
      setDetails(data);
      addToHistory({ query: numberToSearch, result: data });

    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred or number not found.');
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  const handleFormSubmit = () => {
    executeSearch(phoneNumber);
  };

  const handleHistoryClick = (item: HistoryItem<SimInfoResponse>) => {
    setPhoneNumber(item.query);
    setDetails(item.result);
    setError(null);
    setIsProtected(false);
  };

  const handleDownloadHistory = () => {
    downloadHistoryAsTxt(history, 'sim-info-search-history.txt');
  };

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
          SIM Info Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Enter a mobile number to fetch SIM details.
        </p>
      </header>

      <SearchCard
        value={phoneNumber}
        setValue={setPhoneNumber}
        onSearch={handleFormSubmit}
        isLoading={isLoading}
        placeholder="Enter 10-digit Mobile Number"
        maxLength={10}
        pattern="\d{10}"
        title="Number must be 10 digits."
      />
      
      <HistoryCard
        history={history}
        onItemClick={handleHistoryClick}
        onClear={clearHistory}
        title="Recent SIM Searches"
        onDownload={handleDownloadHistory}
      />

      <div className="w-full mt-8">
        {isLoading && <Loader />}
        {error && !isLoading && (
          <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
            <p className="font-medium text-red-400">{error}</p>
          </div>
        )}
        {isProtected && !isLoading && (
            <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl animate-fade-in">
              <p className="font-medium text-yellow-400">This number is protected and details cannot be shown.</p>
            </div>
        )}
        {details && !isLoading && !isProtected && <SimInfoResultsCard details={details} />}
      </div>
    </>
  );
};

export default SimInfoScreen;
