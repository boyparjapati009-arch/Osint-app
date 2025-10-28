import { HistoryItem, AadhaarMember, PincodePostOffice, AadhaarDetails, NumberResponse, SimInfoResponse, PincodeResponse, CombinedDetails } from '../types';

// Generic object formatter for the text file
const formatObject = (obj: Record<string, any>): string => {
  if (!obj) return '';
  return Object.entries(obj)
    .filter(([key, value]) => key !== 'members' && value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : true))
    .map(([key, value]) => {
      const cleanKey = key.replace(/[\u{1F600}-\u{1F64F}]/gu, '').trim();
      if (Array.isArray(value)) {
        const arrayItems = value.filter(item => item).map(item => `    - ${item}`).join('\n');
        return `  ${cleanKey}:\n${arrayItems}`;
      }
      return `  ${cleanKey}: ${value || '-'}`;
    })
    .join('\n');
};

// Custom formatter to create a readable string from a result object
export const formatResultToString = (result: any): string => {
  if (!result) return "No data available.";
  
  // Handle CombinedDetails
  if (result.numberDetails && result.aadhaarDetails) {
    let combinedString = `--- Number Details ---\n${formatObject(result.numberDetails.data)}`;
    combinedString += `\n\n--- Aadhaar Details ---\n${formatObject(result.aadhaarDetails)}`;
    
    if (result.aadhaarDetails.members && result.aadhaarDetails.members.length > 0) {
      combinedString += '\n\n--- Member Details ---\n';
      result.aadhaarDetails.members.forEach((member: AadhaarMember, index: number) => {
        combinedString += `  Member ${index + 1}:\n    Name: ${member.memName}\n    Relation: ${member.relation}\n`;
      });
    }
    return combinedString;
  }
  
  // Handle NumberResponse
  if (result.data && result.status) {
    return `--- Number Details for ${result.number} ---\n${formatObject(result.data)}`;
  }
  
  // Handle AadhaarDetails
  if (result.address && result.homeStateName) {
    let aadhaarString = `--- Aadhaar Details ---\n${formatObject(result)}`;
    if (result.members && result.members.length > 0) {
      aadhaarString += '\n\n--- Member Details ---\n';
      result.members.forEach((member: AadhaarMember, index: number) => {
        aadhaarString += `  Member ${index + 1}:\n    Name: ${member.memName}\n    Relation: ${member.relation}\n`;
      });
    }
    return aadhaarString;
  }

  // Handle SimInfoResponse
  if (result.fields && result.success) {
    let simInfoString = `--- SIM Details for ${result.phone_number} ---\n${formatObject(result.fields)}`;
    if (result.iframe_src) {
        simInfoString += `\n\n  Map URL: ${result.iframe_src}`;
    }
    return simInfoString;
  }

  // Handle PincodeResponse
  if (result.Status && typeof result.PostOffice !== 'undefined') {
    if (result.Status === 'Success' && Array.isArray(result.PostOffice) && result.PostOffice.length > 0) {
      const commonDetails = result.PostOffice[0];
      let pincodeString = `--- Pincode Details for ${commonDetails.Pincode} ---\n`;
      pincodeString += `  District: ${commonDetails.District}\n`;
      pincodeString += `  State: ${commonDetails.State}\n\n`;
      pincodeString += `--- Post Offices ---\n`;
      result.PostOffice.forEach((office: PincodePostOffice, index: number) => {
        pincodeString += `  Office #${index + 1}:\n`;
        pincodeString += `    Name: ${office.Name}\n`;
        pincodeString += `    Block: ${office.Block}\n`;
        pincodeString += `    Branch Type: ${office.BranchType}\n`;
      });
      return pincodeString;
    }
    // Handle Pincode API error response
    return `Pincode Search Status: ${result.Status}\nMessage: ${result.Message || 'No details found.'}`;
  }
  
  return "Could not format data.";
};

export const downloadHistoryAsTxt = <T>(history: HistoryItem<T>[], filename: string): void => {
  if (!history || history.length === 0) {
    alert("No history to download.");
    return;
  }

  const fileContent = history.map((item, index) => {
    const itemHeader = `====================\nSearch #${index + 1}: ${item.query}\n====================`;
    const body = formatResultToString(item.result);
    return `${itemHeader}\n${body}`;
  }).join('\n\n');

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};