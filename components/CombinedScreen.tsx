import React, { useState, useCallback } from 'react';
import { AadhaarDetails, CombinedDetails, NumberResponse, HistoryItem } from '../types';
import { fetchAadhaarDetails, fetchAadhaarProtectedList } from '../services/aadhaarApi';
import { fetchNumberDetails, fetchNumberProtectedList } from '../services/numberApi';
import { useHistory } from '../hooks/useHistory';
import SearchCard from './SearchCard';
import Loader from './Loader';
import HistoryCard from './HistoryCard';
import CombinedResultsCard from './CombinedResultsCard';
import { downloadHistoryAsTxt } from '../utils/download';

const CombinedScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [details, setDetails] = useState<CombinedDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const { history, addToHistory, clearHistory } = useHistory<CombinedDetails>('combinedHistory');

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
      // 1. Check if number is protected
      setLoadingStep('Checking protection status...');
      const protectedNumberData = await fetchNumberProtectedList();
      if (protectedNumberData.protected_numbers?.includes(numberToSearch)) {
        setIsProtected(true);
        setError('This number is protected and details cannot be shown.');
        return;
      }

      // 2. Fetch number details
      setLoadingStep(`Fetching details for ${numberToSearch}...`);
      const numberData = await fetchNumberDetails(numberToSearch);
      if (numberData.status?.toLowerCase() !== 'success' || !numberData.data || typeof numberData.data !== 'object') {
        const errorMessage = typeof numberData.data === 'string' ? numberData.data : 'Could not find details for this mobile number.';
        throw new Error(errorMessage);
      }

      // 3. Extract Aadhaar number
      const aadhaarNumber = numberData.data['🆔 Aadhar']?.replace(/\D/g, '');
      if (!aadhaarNumber || aadhaarNumber.length !== 12) {
        throw new Error('Aadhaar number not found or invalid for this mobile number.');
      }

      // 4. Check if Aadhaar is protected
      setLoadingStep(`Checking Aadhaar protection...`);
      const protectedAadhaarData = await fetchAadhaarProtectedList();
      if (protectedAadhaarData.aadhaar_numbers?.includes(aadhaarNumber)) {
        setIsProtected(true);
        throw new Error(`Aadhaar (${aadhaarNumber}) linked to this number is protected. Cannot display full profile.`);
      }

      // 5. Fetch Aadhaar details
      setLoadingStep(`Fetching details for Aadhaar: ${aadhaarNumber.slice(0, 4)}...`);
      const rawAadhaarData = await fetchAadhaarDetails(aadhaarNumber);
      if (rawAadhaarData.status === false) {
        throw new Error(rawAadhaarData.msg || 'Could not find details for the linked Aadhaar number.');
      }

      const aadhaarApiData = rawAadhaarData.data || rawAadhaarData;
      let members = [];
      if (Array.isArray(aadhaarApiData.memberDetailsList)) {
        members = aadhaarApiData.memberDetailsList.map((apiMember: any) => ({
          memName: apiMember.memberName,
          relation: apiMember.releationship_name,
        }));
      }
      const finalAadhaarDetails: AadhaarDetails = { ...aadhaarApiData, members };

      // 6. Combine and set state
      const combinedDetails = {
        numberDetails: numberData,
        aadhaarDetails: finalAadhaarDetails,
      };
      setDetails(combinedDetails);
      addToHistory({ query: numberToSearch, result: combinedDetails });

    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [addToHistory]);

  const handleFormSubmit = () => {
    executeSearch(phoneNumber);
  };

  const handleHistoryClick = (item: HistoryItem<CombinedDetails>) => {
    setPhoneNumber(item.query);
    setDetails(item.result);
    setError(null);
    setIsProtected(false);
  };

  const handleDownloadHistory = () => {
    downloadHistoryAsTxt(history, 'profile-search-history.txt');
  };

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
          Full Profile Finder
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Enter a mobile number to fetch the full profile.
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
        title="Recent Profile Searches"
        onDownload={handleDownloadHistory}
      />

      <div className="w-full mt-8">
        {isLoading && (
          <div className="text-center animate-fade-in">
            <Loader />
            <p className="mt-2 text-slate-400">{loadingStep}</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
            <p className="font-medium text-red-400">{error}</p>
          </div>
        )}
        {details && !isLoading && !isProtected && <CombinedResultsCard details={details} />}
      </div>
    </>
  );
};

export default CombinedScreen;