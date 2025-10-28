import { NumberResponse, NumberProtectResponse } from '../types';

const PROXY_URL = 'https://cors.eu.org/';
const NUMBER_PROTECT_URL = 'https://raw.githubusercontent.com/TheWhiteHat1/protect/refs/heads/main/protect.json';

export const fetchNumberProtectedList = async (): Promise<NumberProtectResponse> => {
  const response = await fetch(`${PROXY_URL}${NUMBER_PROTECT_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch protected number list.');
  }
  return response.json();
};

export const fetchNumberDetails = async (phoneNumber: string): Promise<NumberResponse> => {
  const targetUrl = `https://rajvir.trd.cc.nf/info.php?number=${phoneNumber}&key=5bc2ef3cf7da1e52eedf1adf5a627b3d`;
  const response = await fetch(`${PROXY_URL}${targetUrl}`);
  if (!response.ok) {
    throw new Error(`Server responded with an error (Status: ${response.status})`);
  }
  return response.json();
};