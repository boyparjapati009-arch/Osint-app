import { PincodeResponse } from '../types';

const PINCODE_API_URL = 'https://api.postalpincode.in/pincode/';

export const fetchPincodeDetails = async (pincode: string): Promise<PincodeResponse> => {
  const response = await fetch(`${PINCODE_API_URL}${pincode}`);

  if (!response.ok) {
    throw new Error(`Pincode API request failed with status: ${response.status}`);
  }
  
  const data: PincodeResponse[] = await response.json();
  
  // The API returns an array with a single response object.
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }

  // Fallback for unexpected API response format
  throw new Error('Received an invalid response from the Pincode API.');
};