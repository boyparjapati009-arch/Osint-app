import React, { useState, useCallback, useEffect } from 'react';
import { AadhaarDetails, HistoryItem } from '../types';
import { fetchAadhaarDetails, fetchAadhaarProtectedList } from '../services/aadhaarApi';
import { useHistory } from '../hooks/useHistory';
import SearchCard from './SearchCard';
import AadhaarResultsCard from './AadhaarResultsCard';
import Loader from './Loader';
import HistoryCard from './HistoryCard';
import { downloadHistoryAsTxt } from '../utils/download';

interface AadhaarScreenProps {
  initialQuery?: string;
}

const AadhaarScreen: React.FC<AadhaarScreenProps> = ({ initialQuery }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');
  const [details, setDetails] = useState<AadhaarDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const { history, addToHistory, clearHistory } = useHistory<AadhaarDetails>('aadhaarHistory');

  const executeSearch = useCallback(async (numberToSearch: string) => {
    if (numberToSearch.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDetails(null);
    setIsProtected(false);
    
    try {
      // 1. Check protected list
      const protectedData = await fetchAadhaarProtectedList();
      if (protectedData.aadhaar_numbers?.includes(numberToSearch)) {
        setIsProtected(true);
        return;
      }

      // 2. Fetch Aadhaar details
      const data = await fetchAadhaarDetails(numberToSearch);
      
      if (data.status === false) {
        setError(data.msg || 'No results found. Please check the number and try again.');
        setDetails(null);
      } else {
        const aadhaarData = data.data || data;
        if (aadhaarData && aadhaarData.address) {
          let members = [];
          if (Array.isArray(aadhaarData.memberDetailsList)) {
            members = aadhaarData.memberDetailsList.map((apiMember: any) => ({
              memName: apiMember.memberName,
              relation: apiMember.releationship_name,
            }));
          }
          const newDetails = { ...aadhaarData, members };
          setDetails(newDetails);
          addToHistory({ query: numberToSearch, result: newDetails });
        } else {
          setError('Received an invalid response from the server. Please try again.');
          setDetails(null);
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  useEffect(() => {
    if (initialQuery) {
      setAadhaarNumber(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery, executeSearch]);

  const handleFormSubmit = () => {
    executeSearch(aadhaarNumber);
  };
  
  const handleHistoryClick = (item: HistoryItem<AadhaarDetails>) => {
    setAadhaarNumber(item.query);
    setDetails(item.result);
    setError(null);
    setIsProtected(false);
  };

  const handleDownloadHistory = () => {
    downloadHistoryAsTxt(history, 'aadhaar-search-history.txt');
  };

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Aadhaar Info Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Enter an Aadhaar number to fetch details.
        </p>
      </header>

      <SearchCard
        value={aadhaarNumber}
        setValue={setAadhaarNumber}
        onSearch={handleFormSubmit}
        isLoading={isLoading}
        placeholder="Enter 12-digit Aadhaar Number"
        maxLength={12}
        pattern="\d{12}"
        title="Aadhaar number must be 12 digits."
      />

      <HistoryCard
        history={history}
        onItemClick={handleHistoryClick}
        onClear={clearHistory}
        title="Recent Aadhaar Searches"
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
              <p className="font-medium text-yellow-400">This Aadhaar number is protected and details cannot be shown.</p>
            </div>
        )}
        {details && !isLoading && !isProtected && <AadhaarResultsCard details={details} />}
      </div>
    </>
  );
};

export default AadhaarScreen;
