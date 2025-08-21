import { PaymentMethod, UPIDetails } from "@/types/payment";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "upi",
    name: "UPI Payment",
    type: "upi",
    icon: "💳",
    description: "Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)"
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    type: "card",
    icon: "💳",
    description: "Pay using Visa, MasterCard, RuPay, or American Express"
  },
  {
    id: "netbanking",
    name: "Net Banking",
    type: "netbanking",
    icon: "🏦",
    description: "Pay using your bank's internet banking"
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    type: "wallet",
    icon: "📱",
    description: "Pay using Paytm, PhonePe, or other digital wallets"
  }
];

export const upiDetails: UPIDetails = {
  upiId: "aitians@paytm",
  merchantName: "CourseCraft Learning Platform",
  merchantCode: "COURSECRAFT"
};

export const supportedUPIApps = [
  { 
    name: "Google Pay", 
    icon: "🔵", 
    color: "bg-blue-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png",
    brandColor: "#4285F4",
    description: "Fast & secure payments"
  },
  { 
    name: "PhonePe", 
    icon: "🟣", 
    color: "bg-purple-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png",
    brandColor: "#5F259F",
    description: "India's most trusted UPI app"
  },
  { 
    name: "Paytm", 
    icon: "🔵", 
    color: "bg-blue-600",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png",
    brandColor: "#002E6E",
    description: "Pay with Paytm wallet"
  },
  { 
    name: "BHIM", 
    icon: "🟡", 
    color: "bg-yellow-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/BHIM_logo.svg/1200px-BHIM_logo.svg.png",
    brandColor: "#FFD700",
    description: "Official UPI app by NPCI"
  },
  { 
    name: "Amazon Pay", 
    icon: "🟠", 
    color: "bg-orange-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Amazon_Pay_logo.svg/1200px-Amazon_Pay_logo.svg.png",
    brandColor: "#FF9900",
    description: "Amazon's digital payment solution"
  },
  { 
    name: "MobiKwik", 
    icon: "🟢", 
    color: "bg-green-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/MobiKwik_logo.svg/1200px-MobiKwik_logo.svg.png",
    brandColor: "#00A651",
    description: "Digital wallet & UPI payments"
  },
  { 
    name: "CRED", 
    icon: "🟣", 
    color: "bg-purple-600",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/CRED_logo.svg/1200px-CRED_logo.svg.png",
    brandColor: "#6B46C1",
    description: "Credit card bill payments"
  },
  { 
    name: "Airtel Money", 
    icon: "🔴", 
    color: "bg-red-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Airtel_logo.svg/1200px-Airtel_logo.svg.png",
    brandColor: "#E60000",
    description: "Airtel's digital payment app"
  },
  { 
    name: "Freecharge", 
    icon: "🟡", 
    color: "bg-yellow-400",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Freecharge_logo.svg/1200px-Freecharge_logo.svg.png",
    brandColor: "#FFB800",
    description: "Quick & easy payments"
  }
];

// Popular UPI apps for quick access
export const popularUPIApps = [
  "Google Pay",
  "PhonePe", 
  "Paytm",
  "BHIM"
];

// UPI app categories
export const upiAppCategories = [
  {
    category: "Popular",
    apps: ["Google Pay", "PhonePe", "Paytm", "BHIM"]
  },
  {
    category: "E-commerce",
    apps: ["Amazon Pay", "Flipkart Pay", "CRED"]
  },
  {
    category: "Telecom",
    apps: ["Airtel Money", "JioMoney", "Vi Pay"]
  },
  {
    category: "Others",
    apps: ["MobiKwik", "Freecharge", "PayZapp"]
  }
];
