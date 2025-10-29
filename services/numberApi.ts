import { NumberResponse, NumberProtectResponse, RawNumberDataItem, NumberData } from '../types';

const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const NUMBER_API_URL = 'https://ox.taitaninfo.workers.dev/';
const NUMBER_PROTECT_URL = 'https://raw.githubusercontent.com/TheWhiteHat1/protect/refs/heads/main/protect.json';

export const fetchNumberProtectedList = async (): Promise<NumberProtectResponse> => {
  const response = await fetch(`${PROXY_URL}${encodeURIComponent(NUMBER_PROTECT_URL)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch protected number list.');
  }
  return response.json();
};

export const fetchNumberDetails = async (phoneNumber: string): Promise<NumberResponse> => {
  const targetUrl = `${NUMBER_API_URL}?mobile=${phoneNumber}`;

  try {
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from the API.`);
    }

    const rawResponse: any = await response.json();
    
    const dataItems = rawResponse.data;

    if (dataItems && Array.isArray(dataItems) && dataItems.length > 0) {
      const details = dataItems[0];
      // Fix: Resolved a TypeScript type assertion error.
      // `Object.fromEntries` returns a generic object, so we must first cast to `unknown`
      // before casting to `RawNumberDataItem` to satisfy TypeScript's type checker.
      const trimmedDetails = Object.fromEntries(
        Object.entries(details).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      ) as unknown as RawNumberDataItem;

      const formattedData: NumberData = {
        ' Mobile': trimmedDetails.mobile || '-',
        ' Name': trimmedDetails.name || '-',
        ' Father': trimmedDetails.fname || '-',
        ' Address': trimmedDetails.address || '-',
        ' Alt Mobile': trimmedDetails.alt || '-',
        ' Circle/ISP': trimmedDetails.circle || '-',
        ' Aadhar': trimmedDetails.id || '-',
      };

      return { status: 'success', number: phoneNumber, data: formattedData };
    } else {
      return { status: 'error', number: phoneNumber, data: 'No results found for this number.' };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred while fetching number details.';
    return { status: 'error', number: phoneNumber, data: message };
  }
};