import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { paymentService } from '@/services/paymentService';
import { enrollmentService } from '@/services/enrollmentService';
import { Loader2, CreditCard } from 'lucide-react';

interface RazorpayPaymentButtonProps {
  courseId: string;
  courseTitle: string;
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayPaymentButton({
  courseId,
  courseTitle,
  amount,
  onSuccess,
  onFailure,
  className = '',
  children
}: RazorpayPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this course.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create payment order
      const paymentResponse = await paymentService.processCourseEnrollment(
        courseId,
        user.id,
        amount,
        user.email || '',
        user.user_metadata?.full_name || user.email || ''
      );

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message);
      }

      // Initialize Razorpay checkout
      paymentService.initializeRazorpayCheckout(
        paymentResponse.transactionId,
        amount,
        'INR',
        'CourseCraft',
        `Purchase: ${courseTitle}`,
        {
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email || '',
        },
        async (response: any) => {
          // Payment successful
          try {
            // Verify payment
            const verificationResponse = await paymentService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.success) {
              // Handle successful enrollment
              const enrollmentSuccess = await enrollmentService.handleSuccessfulPayment(
                user.id,
                courseId,
                response.razorpay_order_id,
                response.razorpay_payment_id,
                amount,
                response.razorpay_payment_id
              );

              if (enrollmentSuccess) {
                toast({
                  title: "Payment Successful!",
                  description: "You have been enrolled in the course successfully.",
                });

                if (onSuccess) {
                  onSuccess(response);
                }
              } else {
                throw new Error('Failed to complete enrollment');
              }
            } else {
              throw new Error(verificationResponse.message);
            }
          } catch (verificationError) {
            console.error('Payment verification failed:', verificationError);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if the amount was deducted.",
              variant: "destructive",
            });

            if (onFailure) {
              onFailure(verificationError);
            }
          }
        },
        (error: any) => {
          // Payment failed or cancelled
          console.error('Payment failed:', error);
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled or failed. Please try again.",
            variant: "destructive",
          });

          if (onFailure) {
            onFailure(error);
          }
        }
      );
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });

      if (onFailure) {
        onFailure(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Buy Course - ₹${amount}`}
        </>
      )}
    </Button>
  );
}
