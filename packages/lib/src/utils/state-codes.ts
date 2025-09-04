// State abbreviation mapping for subscriber ID generation
export const STATE_ABBREVIATIONS: Record<string, string> = {
  'andhra pradesh': 'AP',
  'arunachal pradesh': 'AR',
  'assam': 'AS',
  'bihar': 'BR',
  'chhattisgarh': 'CG',
  'goa': 'GA',
  'gujarat': 'GJ',
  'haryana': 'HR',
  'himachal pradesh': 'HP',
  'jharkhand': 'JH',
  'karnataka': 'KA',
  'kerala': 'KL',
  'madhya pradesh': 'MP',
  'maharashtra': 'MH',
  'manipur': 'MN',
  'meghalaya': 'ML',
  'mizoram': 'MZ',
  'nagaland': 'NL',
  'odisha': 'OD',
  'punjab': 'PB',
  'rajasthan': 'RJ',
  'sikkim': 'SK',
  'tamil nadu': 'TN',
  'telangana': 'TG',
  'tripura': 'TR',
  'uttar pradesh': 'UP',
  'uttarakhand': 'UK',
  'west bengal': 'WB',
  'andaman and nicobar islands': 'AN',
  'chandigarh': 'CH',
  'dadra and nagar haveli and daman and diu': 'DN',
  'delhi': 'DL',
  'jammu and kashmir': 'JK',
  'ladakh': 'LA',
  'lakshadweep': 'LD',
  'puducherry': 'PY'
};

export function getStateAbbreviation(state: string): string {
  const normalizedState = state.toLowerCase().trim();
  return STATE_ABBREVIATIONS[normalizedState] || 'XX';
}

export function generateSubscriberId(state: string, phoneNumber: string): string {
  const stateCode = getStateAbbreviation(state);
  const currentYear = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
  const last4Digits = phoneNumber.replace(/\D/g, '').slice(-4); // Last 4 digits of phone number
  
  return `${stateCode}${currentYear}${last4Digits}`;
}

export function validateSubscriberId(id: string): boolean {
  // Format: 2 letters (state) + 2 digits (year) + 4 digits (phone)
  const pattern = /^[A-Z]{2}\d{6}$/;
  return pattern.test(id);
}
