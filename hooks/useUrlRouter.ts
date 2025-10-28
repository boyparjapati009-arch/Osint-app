import { useState, useEffect, useCallback } from 'react';

type View = 'home' | 'aadhaar' | 'number' | 'combined' | 'sim' | 'pincode';

export interface UrlQuery {
  type: 'aadhaar' | 'number';
  value: string;
}

export const useUrlRouter = () => {
  const [view, setView] = useState<View>('home');
  const [urlQuery, setUrlQuery] = useState<UrlQuery | null>(null);

  useEffect(() => {
    const processHash = () => {
      const hash = window.location.hash.substring(1);
      
      let queryType: 'aadhaar' | 'number' | null = null;
      let queryValue: string | null = null;

      if (hash.startsWith('aadhaar=')) {
        queryType = 'aadhaar';
        queryValue = hash.substring('aadhaar='.length);
      } else if (hash.startsWith('numberinfo=')) {
        queryType = 'number';
        queryValue = hash.substring('numberinfo='.length);
      }

      if (queryType && queryValue) {
        setView(queryType);
        setUrlQuery({ type: queryType, value: queryValue });
      }
    };

    processHash();

    window.addEventListener('hashchange', processHash);
    return () => {
      window.removeEventListener('hashchange', processHash);
    };
  }, []);

  const handleBack = useCallback(() => {
    setView('home');
    setUrlQuery(null);
    if (window.location.hash) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }, []);

  return { view, setView, urlQuery, handleBack };
};