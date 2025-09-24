import { supabase } from '@/integrations/supabase/client';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  payment_id?: string;
  order_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  metadata?: any;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  course_id?: string;
  enrollment_id?: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  payment_method?: string;
  description?: string;
  receipt?: string;
  notes?: any;
  created_at: string;
  updated_at: string;
}

export class EnrollmentService {
  private static instance: EnrollmentService;
  
  private constructor() {}
  
  public static getInstance(): EnrollmentService {
    if (!EnrollmentService.instance) {
      EnrollmentService.instance = new EnrollmentService();
    }
    return EnrollmentService.instance;
  }

  // Check if user is enrolled in a course
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id, status')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'completed')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  }

  // Get user's enrollments
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            image,
            price
          )
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      return [];
    }
  }

  // Create enrollment record
  async createEnrollment(enrollmentData: Partial<Enrollment>): Promise<Enrollment | null> {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([enrollmentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      return null;
    }
  }

  // Update enrollment status
  async updateEnrollmentStatus(
    enrollmentId: string, 
    status: Enrollment['status'],
    paymentId?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (paymentId) {
        updateData.paymentId = paymentId;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .update(updateData)
        .eq('id', enrollmentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      return false;
    }
  }

  // Create payment transaction record
  async createPaymentTransaction(transactionData: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      return null;
    }
  }

  // Update payment transaction status
  async updatePaymentTransactionStatus(
    transactionId: string,
    status: PaymentTransaction['status'],
    razorpayPaymentId?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (razorpayPaymentId) {
        updateData.razorpayPaymentId = razorpayPaymentId;
      }

      const { error } = await supabase
        .from('payment_transactions')
        .update(updateData)
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating payment transaction status:', error);
      return false;
    }
  }

  // Get payment transaction by Razorpay order ID
  async getPaymentTransactionByOrderId(razorpayOrderId: string): Promise<PaymentTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching payment transaction:', error);
      return null;
    }
  }

  // Handle successful payment and enrollment
  async handleSuccessfulPayment(
    userId: string,
    courseId: string,
    orderId: string,
    paymentId: string,
    amount: number,
    transactionId: string
  ): Promise<boolean> {
    try {
      // Call the database function to handle enrollment
      const { data, error } = await supabase.rpc('handle_successful_enrollment', {
        p_user_id: userId,
        p_course_id: courseId,
        p_order_id: orderId,
        p_payment_id: paymentId,
        p_amount: amount,
        p_transaction_id: transactionId
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error handling successful payment:', error);
      return false;
    }
  }

  // Get enrollment statistics for admin
  async getEnrollmentStats(): Promise<{
    totalEnrollments: number;
    totalRevenue: number;
    recentEnrollments: number;
  }> {
    try {
      // Get total enrollments
      const { count: totalEnrollments, error: countError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (countError) throw countError;

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('course_enrollments')
        .select('amount')
        .eq('status', 'completed');

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData?.reduce((sum, enrollment) => sum + enrollment.amount, 0) || 0;

      // Get recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentEnrollments, error: recentError } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('enrolled_at', thirtyDaysAgo.toISOString());

      if (recentError) throw recentError;

      return {
        totalEnrollments: totalEnrollments || 0,
        totalRevenue,
        recentEnrollments: recentEnrollments || 0
      };
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
      return {
        totalEnrollments: 0,
        totalRevenue: 0,
        recentEnrollments: 0
      };
    }
  }
}

// Export singleton instance
export const enrollmentService = EnrollmentService.getInstance();
