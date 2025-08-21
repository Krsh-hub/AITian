import { PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment";

// This is a mock payment service - replace with actual payment gateway integration
export class PaymentService {
  private static instance: PaymentService;
  
  private constructor() {}
  
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock payment processing logic
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        return {
          success: true,
          transactionId,
          message: "Payment processed successfully!",
          redirectUrl: `/course/${paymentRequest.courseId}/success`
        };
      } else {
        return {
          success: false,
          message: "Payment failed. Please try again or contact support."
        };
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        message: "An error occurred while processing payment. Please try again."
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock payment status
      const statuses: Array<PaymentStatus['status']> = ['pending', 'success', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        status: randomStatus,
        transactionId,
        amount: 0, // This would come from the actual transaction
        timestamp: new Date(),
        message: `Payment status: ${randomStatus}`
      };
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("Failed to fetch payment status");
    }
  }

  generateUPIPaymentLink(upiId: string, amount: number, merchantName: string, description: string): string {
    const params = new URLSearchParams({
      pa: upiId, // Payee address (UPI ID)
      pn: merchantName, // Payee name
      am: amount.toString(), // Amount
      cu: 'INR', // Currency
      tn: description, // Transaction note
      tr: `TXN${Date.now()}`, // Transaction reference
    });

    return `upi://pay?${params.toString()}`;
  }

  validateUPIId(upiId: string): boolean {
    // Basic UPI ID validation
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


