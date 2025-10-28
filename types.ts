export interface AadhaarMember {
  memName: string;
  relation: string;
}

export interface AadhaarDetails {
  address: string;
  homeDistName: string;
  homeStateName: string;
  schemeName: string;
  allowed_onorc: string;
  members: AadhaarMember[];
  [key: string]: any; 
}

export interface NumberData {
  '📱 Mobile': string;
  '👤 Name': string;
  '👨‍👩‍👧 Father': string;
  '🏠 Address': string;
  '📞 Alt Mobile': string;
  '📶 Circle/ISP': string;
  '🆔 Aadhar': string;
  '✉️ Email': string;
  [key: string]: string;
}

export interface NumberResponse {
  status: string;
  number: string;
  data: NumberData;
}

export interface AadhaarProtectResponse {
  aadhaar_numbers: string[];
}

export interface NumberProtectResponse {
  protected_numbers: string[];
}

export interface SimInfoFields {
  Complaints: string;
  Connection: string;
  Country: string;
  Helpline: string;
  Hometown: string;
  'IMEI number': string;
  'IP address': string[];
  Language: string;
  'MAC address': string;
  'Mobile Locations': string;
  'Mobile State': string;
  Number: string;
  'Owner Address': string;
  'Owner Name': string;
  'Owner Personality': string;
  'Refrence City': string;
  'SIM card': string;
  'Tower Locations': string;
  'Tracker Id': string;
  'Tracking History': string[];
  [key: string]: any;
}

export interface SimInfoResponse {
  fields: SimInfoFields;
  iframe_src: string;
  map: {
    lat: number;
    lng: number;
  };
  phone_number: string;
  source: string;
  success: boolean;
}

export interface PincodePostOffice {
  Name: string;
  Block: string;
  District: string;
  State: string;
  Pincode: string;
  BranchType: string;
}

export interface PincodeResponse {
  Status: string;
  Message: string;
  PostOffice: PincodePostOffice[] | null;
}


export interface CombinedDetails {
  numberDetails: NumberResponse;
  aadhaarDetails: AadhaarDetails;
}

export interface HistoryItem<T> {
  query: string;
  result: T;
}