import { AadhaarProtectResponse } from '../types';

const PROXY_URL = 'https://cors.eu.org/';
const AADHAAR_API_BASE_URL = 'https://apibymynk.vercel.app/fetch?key=onlymynk&aadhaar=';
const AADHAAR_PROTECT_URL = 'https://raw.githubusercontent.com/TheWhiteHat1/aadhar-protect-/refs/heads/main/aadhaarprotect%2Cjson';

export const fetchAadhaarProtectedList = async (): Promise<AadhaarProtectResponse> => {
  const response = await fetch(`${PROXY_URL}${AADHAAR_PROTECT_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch protected Aadhaar list.');
  }
  return response.json();
};

export const fetchAadhaarDetails = async (aadhaarNumber: string): Promise<any> => {
  const targetUrl = `${AADHAAR_API_BASE_URL}${aadhaarNumber}`;
  const response = await fetch(`${PROXY_URL}${targetUrl}`);
  if (!response.ok) {
    throw new Error(`Server responded with an error (Status: ${response.status})`);
  }
  return response.json();
};