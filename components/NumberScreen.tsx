import React, { useState, useCallback, useEffect } from 'react';
import { NumberResponse, HistoryItem } from '../types';
import { fetchNumberDetails, fetchNumberProtectedList } from '../services/numberApi';
import { useHistory } from '../hooks/useHistory';
import SearchCard from './SearchCard';
import NumberResultsCard from './NumberResultsCard';
import Loader from './Loader';
import HistoryCard from './HistoryCard';
import { downloadHistoryAsTxt } from '../utils/download';

interface NumberScreenProps {
  initialQuery?: string;
}

const NumberScreen: React.FC<NumberScreenProps> = ({ initialQuery }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [details, setDetails] = useState<NumberResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const { history, addToHistory, clearHistory } = useHistory<NumberResponse>('numberHistory');

  const executeSearch = useCallback(async (numberToSearch: string) => {
    if (numberToSearch.length !== 10) {
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

      const data = await fetchNumberDetails(numberToSearch);
      
      if (data.status === 'success') {
        setDetails(data);
        addToHistory({ query: numberToSearch, result: data });
      } else {
        setError(data.data as string);
        setDetails(null);
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  useEffect(() => {
    if (initialQuery) {
      setPhoneNumber(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery, executeSearch]);

  const handleFormSubmit = () => {
    executeSearch(phoneNumber);
  };
  
  const handleHistoryClick = (item: HistoryItem<NumberResponse>) => {
    setPhoneNumber(item.query);
    setDetails(item.result);
    setError(null);
    setIsProtected(false);
  };

  const handleDownloadHistory = () => {
    downloadHistoryAsTxt(history, 'number-search-history.txt');
  };

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-rose-400 to-pink-500 text-transparent bg-clip-text">
          Number Info Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Enter a mobile number to fetch details.
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
        title="Recent Number Searches"
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
        {details && !isLoading && !isProtected && <NumberResultsCard details={details} />}
      </div>
    </>
  );
};

export default NumberScreen;
