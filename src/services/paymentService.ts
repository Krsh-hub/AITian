import { PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment";
import { enrollmentService } from './enrollmentService';

// NOTE: The official Razorpay Node SDK cannot be used in the browser.
// All server-secret operations (creating orders, verifying signatures)
// must be done on a backend. Below we provide client-only fallbacks so
// the app can run without crashing in development/demo environments.

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface EnrollmentData {
  userId: string;
  courseId: string;
  amount: number;
  orderId: string;
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
}

// Complete Razorpay payment service
export class PaymentService {
  private static instance: PaymentService;
  
  private constructor() {}
  
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Create Razorpay order (client-side stub)
  async createRazorpayOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    // In production, call your backend to create the order using your secret key.
    // For local/dev without a backend, return a mock order so the UI can proceed.
    const receipt = data.receipt || `receipt_${Date.now()}`;
    return {
      id: `order_${Math.random().toString(36).slice(2)}`,
      entity: 'order',
      amount: (data.amount || 0) * 100,
      currency: data.currency || 'INR',
      receipt,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  // Verify Razorpay payment (client-side stub)
  async verifyRazorpayPayment(_data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    // In production, send the details to your backend to verify with your secret.
    return { success: true, message: 'Payment verification skipped in client-only mode' };
  }

  // Load Razorpay script
  loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  // Initialize Razorpay checkout
  initializeRazorpayCheckout(
    orderId: string,
    amount: number,
    currency: string = 'INR',
    name: string = 'CourseCraft',
    description: string = 'Course Purchase',
    prefill: {
      email?: string;
      contact?: string;
      name?: string;
    } = {},
    onSuccess?: (response: any) => void,
    onFailure?: (error: any) => void
  ) {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency,
      name,
      description,
      order_id: orderId,
      prefill,
      handler: onSuccess,
      modal: {
        ondismiss: onFailure,
      },
    };

    const RazorpayConstructor = (window as any).Razorpay;
    if (!RazorpayConstructor) {
      console.error('Razorpay SDK not loaded');
      onFailure?.(new Error('Razorpay SDK not loaded'));
      return;
    }
    const rzp = new RazorpayConstructor(options);
    rzp.open();
  }

  // Process course enrollment payment
  async processCourseEnrollment(
    courseId: string,
    userId: string,
    amount: number,
    userEmail: string,
    userName: string
  ): Promise<PaymentResponse> {
    try {
      // Create Razorpay order
      const order = await this.createRazorpayOrder({
        amount,
        currency: 'INR',
        receipt: `course_${courseId}_${userId}_${Date.now()}`,
        notes: {
          courseId,
          userId,
          type: 'course_enrollment'
        }
      });

      // Create payment transaction record
      const transaction = await enrollmentService.createPaymentTransaction({
        user_id: userId,
        course_id: courseId,
        razorpay_order_id: order.id,
        amount,
        currency: 'INR',
        status: 'created',
        description: `Course enrollment: ${courseId}`,
        receipt: order.receipt,
        notes: {
          courseId,
          userId,
          userEmail,
          userName
        }
      });

      if (!transaction) {
        throw new Error('Failed to create payment transaction record');
      }

      // Load Razorpay script
      await this.loadRazorpayScript();

      // Return order details for frontend to handle
      return {
        success: true,
        transactionId: order.id,
        message: "Order created successfully",
        redirectUrl: `/course/${courseId}/success`,
        orderData: order
      };
    } catch (error) {
      console.error("Course enrollment payment error:", error);
      return {
        success: false,
        message: "Failed to create payment order. Please try again."
      };
    }
  }

  // Legacy methods for backward compatibility
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    return this.processCourseEnrollment(
      paymentRequest.courseId,
      paymentRequest.customerEmail, // Using email as userId for now
      paymentRequest.amount,
      paymentRequest.customerEmail,
      paymentRequest.customerName
    );
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // Client-only stub: pretend success
    return {
      status: 'success',
      transactionId,
      amount: 0,
      timestamp: new Date(),
      message: 'Client-only payment status (stub)'
    };
  }

  // UPI methods for backward compatibility
  generateUPIPaymentLink(upiId: string, amount: number, merchantName: string, description: string): string {
    const params = new URLSearchParams({
      pa: upiId,
      pn: merchantName,
      am: amount.toString(),
      cu: 'INR',
      tn: description,
      tr: `TXN${Date.now()}`,
    });

    return `upi://pay?${params.toString()}`;
  }

  validateUPIId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
  }

  validatePaymentRequest(paymentRequest: PaymentRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentRequest.customerName?.trim()) {
      errors.push("Customer name is required");
    }

    if (!paymentRequest.customerEmail?.trim()) {
      errors.push("Customer email is required");
    } else if (!this.validateEmail(paymentRequest.customerEmail)) {
      errors.push("Invalid email format");
    }

    if (!paymentRequest.customerPhone?.trim()) {
      errors.push("Customer phone is required");
    } else if (!this.validatePhone(paymentRequest.customerPhone)) {
      errors.push("Invalid phone number format");
    }

    if (paymentRequest.amount <= 0) {
      errors.push("Invalid amount");
    }

    if (!paymentRequest.courseId?.trim()) {
      errors.push("Course ID is required");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();


