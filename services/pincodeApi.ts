import { PincodeResponse } from '../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const PINCODE_API_URL = 'https://api.postalpincode.in/pincode/';

export const fetchPincodeDetails = async (pincode: string): Promise<PincodeResponse> => {
  try {
    const response = await fetch(`${PINCODE_API_URL}${pincode}`);
    
    // If the HTTP response itself is an error (e.g., 404, 500), we'll go to the Gemini response.
    if (!response.ok) {
      console.error(`Pincode API responded with an error (Status: ${response.status})`);
      const geminiMessage = await generatePincodeNotFoundResponse(pincode);
      return { Status: 'Generated', Message: geminiMessage, PostOffice: null };
    }
    
    const data: unknown = await response.json();
    
    // The API returns an array with a single response object.
    if (Array.isArray(data) && data.length > 0) {
      const apiResponse = data[0] as PincodeResponse;
      
      // If the API indicates success and provides post offices, return the data.
      if (apiResponse.Status === 'Success' && apiResponse.PostOffice && apiResponse.PostOffice.length > 0) {
        return apiResponse;
      }
    }

    // If we reach here, it means the pincode was not found (e.g., Status='Error', empty PostOffice, or invalid format).
    // So, we generate a helpful response.
    const geminiMessage = await generatePincodeNotFoundResponse(pincode);
    return { Status: 'Generated', Message: geminiMessage, PostOffice: null };
  } catch (error) {
    // This catches network errors or JSON parsing errors.
    console.error('Error during pincode fetch or processing:', error);
    const geminiMessage = await generatePincodeNotFoundResponse(pincode);
    return { Status: 'Generated', Message: geminiMessage, PostOffice: null };
  }
};

export const generatePincodeNotFoundResponse = async (pincode: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `The user searched for the Indian pincode '${pincode}', but it was not found in the official database. 
  Please provide a helpful and detailed response of approximately 500 words for the user. 
  The response should be empathetic and informative. 
  Start by acknowledging their search for pincode ${pincode} was unsuccessful.
  Then, explain common reasons why a pincode might not be found. This could include:
  1. It's a newly created pincode and not yet in all databases.
  2. The pincode is incorrect or has a typo.
  3. The pincode belongs to a very specific or restricted area (like a military base) and might not be publicly listed.
  4. The pincode has been discontinued or replaced.

  Next, offer actionable suggestions for the user. They could:
  1. Double-check the pincode for any typing errors.
  2. Try searching for the name of the post office or locality instead.
  3. Consult an official source like the India Post website.
  4. Provide a brief explanation of how to find pincodes on the India Post website (e.g., "You can visit the official India Post website and use their 'Find Pincode' tool...").

  Finally, include some interesting general information about the Indian Postal Index Number (PIN) system. You can mention things like:
  - It was introduced in 1972.
  - The 6-digit structure and what each digit signifies (first digit for region, second for sub-region, third for sorting district, last three for individual post office).
  - The total number of PIN regions in India.

  Maintain a helpful, friendly, and comprehensive tone throughout. Do not use markdown formatting. Structure the response in clear paragraphs.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return `We couldn't find any information for the pincode ${pincode}. Please double-check the number and try again. The Indian Postal Index Number (PIN) system is a 6-digit code used by India Post. The first digit represents one of the 9 PIN regions in the country. The second digit indicates the sub-region, and the third, in combination with the first two, points to the sorting district. The last three digits are assigned to individual post offices.`;
  }
};