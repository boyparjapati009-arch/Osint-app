import { SimInfoResponse } from '../types';

const PROXY_URL = 'https://cors.eu.org/';
const SIM_INFO_API_BASE_URL = 'https://ph-ng-pi.vercel.app/?number=';

export const fetchSimInfoDetails = async (phoneNumber: string): Promise<SimInfoResponse> => {
  const targetUrl = `${SIM_INFO_API_BASE_URL}${phoneNumber}`;
  const response = await fetch(`${PROXY_URL}${targetUrl}`);
  if (!response.ok) {
    throw new Error(`Server responded with an error (Status: ${response.status})`);
  }
  const data = await response.json();
  if (!data.success) {
      throw new Error('API returned an error or no data found.');
  }
  return data;
};
