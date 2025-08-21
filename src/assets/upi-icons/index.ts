// UPI App Icons
export { default as GooglePayIcon } from './GooglePay.svg';
export { default as PhonePeIcon } from './PhonePe.svg';
export { default as PaytmIcon } from './Paytm.svg';
export { default as BHIMIcon } from './BHIM.svg';
export { default as AmazonPayIcon } from './AmazonPay.svg';
export { default as MobiKwikIcon } from './MobiKwik.svg';
export { default as CREDIcon } from './CRED.svg';
export { default as AirtelMoneyIcon } from './AirtelMoney.svg';
export { default as FreechargeIcon } from './Freecharge.svg';

// Icon mapping for easy access
export const upiAppIcons = {
  'Google Pay': GooglePayIcon,
  'PhonePe': PhonePeIcon,
  'Paytm': PaytmIcon,
  'BHIM': BHIMIcon,
  'Amazon Pay': AmazonPayIcon,
  'MobiKwik': MobiKwikIcon,
  'CRED': CREDIcon,
  'Airtel Money': AirtelMoneyIcon,
  'Freecharge': FreechargeIcon,
} as const;

// Get icon for a specific app
export const getUPIAppIcon = (appName: string) => {
  return upiAppIcons[appName as keyof typeof upiAppIcons] || null;
};




