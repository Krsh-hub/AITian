import React from 'react';

interface UPIIconProps {
  appName: string;
  size?: number;
  className?: string;
}

const UPIIcon: React.FC<UPIIconProps> = ({ appName, size = 24, className = '' }) => {
  const getIconPath = (name: string) => {
    const iconMap: Record<string, string> = {
      'Google Pay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png',
      'PhonePe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png',
      'Paytm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png',
      'BHIM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/BHIM_logo.svg/1200px-BHIM_logo.svg.png',
      'Amazon Pay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Amazon_Pay_logo.svg/1200px-Amazon_Pay_logo.svg.png',
      'MobiKwik': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/MobiKwik_logo.svg/1200px-MobiKwik_logo.svg.png',
      'CRED': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/CRED_logo.svg/1200px-CRED_logo.svg.png',
      'Airtel Money': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Airtel_logo.svg/1200px-Airtel_logo.svg.png',
      'Freecharge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Freecharge_logo.svg/1200px-Freecharge_logo.svg.png',
    };
    
    return iconMap[name] || '';
  };

  const iconPath = getIconPath(appName);

  if (!iconPath) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-gray-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">?</span>
      </div>
    );
  }

  return (
    <img
      src={iconPath}
      alt={`${appName} icon`}
      className={className}
      style={{ width: size, height: size }}
      onError={(e) => {
        // Fallback to emoji if SVG fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = `flex items-center justify-center rounded-full bg-gray-100 ${className}`;
        fallback.style.width = `${size}px`;
        fallback.style.height = `${size}px`;
        fallback.innerHTML = '💳';
        target.parentNode?.insertBefore(fallback, target);
      }}
    />
  );
};

export default UPIIcon;

