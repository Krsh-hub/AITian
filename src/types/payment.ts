export interface PaymentMethod {
  id: string;
  name: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet';
  icon: string;
  description: string;
}

export interface UPIDetails {
  upiId: string;
  merchantName: string;
  merchantCode?: string;
}

export interface PaymentRequest {
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  upiId?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  amount: number;
  timestamp: Date;
  message: string;
}


