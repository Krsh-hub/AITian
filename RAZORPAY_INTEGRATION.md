# Razorpay Payment Gateway Integration

This document outlines the complete Razorpay payment gateway integration for CourseCraft platform.

## 🚀 Overview

The integration provides a complete payment solution for course enrollments with:
- Secure payment processing via Razorpay
- Real-time payment verification
- Automatic enrollment management
- Comprehensive payment tracking
- Admin dashboard for payment analytics

## 📋 Prerequisites

1. **Razorpay Account**: Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **API Keys**: Get your test and live API keys from Razorpay dashboard
3. **Supabase Setup**: Ensure your Supabase project is configured

## 🔧 Environment Variables

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Getting Razorpay Keys

1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate a new key pair
4. Copy the **Key ID** and **Key Secret**
5. For testing, use test keys; for production, use live keys

## 🗄️ Database Schema

The integration creates two new tables:

### `course_enrollments`
```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES auth.users(id),
  courseId UUID REFERENCES courses(id),
  enrolledAt TIMESTAMP,
  paymentId TEXT,
  orderId TEXT,
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(20),
  paymentMethod VARCHAR(50),
  transactionId TEXT,
  metadata JSONB,
  UNIQUE(userId, courseId)
);
```

### `payment_transactions`
```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES auth.users(id),
  courseId UUID REFERENCES courses(id),
  enrollmentId UUID REFERENCES course_enrollments(id),
  razorpayOrderId TEXT,
  razorpayPaymentId TEXT,
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(20),
  paymentMethod VARCHAR(50),
  description TEXT,
  receipt TEXT,
  notes JSONB,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## 🏗️ Architecture

### Components

1. **PaymentService** (`src/services/paymentService.ts`)
   - Handles Razorpay API interactions
   - Creates payment orders
   - Verifies payment signatures
   - Manages checkout flow

2. **EnrollmentService** (`src/services/enrollmentService.ts`)
   - Manages course enrollments
   - Tracks payment transactions
   - Provides enrollment statistics

3. **RazorpayPaymentButton** (`src/components/RazorpayPaymentButton.tsx`)
   - Frontend payment button component
   - Handles payment flow
   - Provides user feedback

### Payment Flow

1. **User clicks "Enroll Now"**
   - Button checks user authentication
   - Creates Razorpay order
   - Opens Razorpay checkout modal

2. **Payment Processing**
   - User completes payment in Razorpay modal
   - Payment is processed by Razorpay
   - Success/failure callback is triggered

3. **Payment Verification**
   - Payment signature is verified
   - Enrollment is created in database
   - User is redirected to success page

4. **Enrollment Completion**
   - Course access is granted
   - Payment transaction is recorded
   - User receives confirmation

## 🎯 Usage

### Basic Payment Button

```tsx
import RazorpayPaymentButton from '@/components/RazorpayPaymentButton';

<RazorpayPaymentButton
  courseId="course-123"
  courseTitle="React Masterclass"
  amount={2999}
  onSuccess={(response) => {
    console.log('Payment successful', response);
  }}
  onFailure={(error) => {
    console.error('Payment failed', error);
  }}
/>
```

### Custom Payment Button

```tsx
<RazorpayPaymentButton
  courseId="course-123"
  courseTitle="React Masterclass"
  amount={2999}
  className="custom-button-class"
  onSuccess={handlePaymentSuccess}
  onFailure={handlePaymentFailure}
>
  <CustomIcon className="mr-2 h-4 w-4" />
  Buy Now - ₹2,999
</RazorpayPaymentButton>
```

### Programmatic Payment

```tsx
import { paymentService } from '@/services/paymentService';

// Create payment order
const response = await paymentService.processCourseEnrollment(
  courseId,
  userId,
  amount,
  userEmail,
  userName
);

// Initialize checkout
paymentService.initializeRazorpayCheckout(
  response.transactionId,
  amount,
  'INR',
  'CourseCraft',
  `Purchase: ${courseTitle}`,
  { email: userEmail, name: userName },
  onSuccess,
  onFailure
);
```

## 🔒 Security Features

### Payment Verification
- HMAC SHA256 signature verification
- Server-side payment validation
- Secure order creation

### Access Control
- Row Level Security (RLS) policies
- User-specific data access
- Admin-only payment analytics

### Error Handling
- Comprehensive error handling
- User-friendly error messages
- Payment failure recovery

## 📊 Admin Features

### Enrollment Statistics
```tsx
import { enrollmentService } from '@/services/enrollmentService';

const stats = await enrollmentService.getEnrollmentStats();
console.log({
  totalEnrollments: stats.totalEnrollments,
  totalRevenue: stats.totalRevenue,
  recentEnrollments: stats.recentEnrollments
});
```

### Payment Tracking
- View all payment transactions
- Track payment status
- Monitor enrollment analytics

## 🧪 Testing

### Test Mode
1. Use Razorpay test keys
2. Test with test card numbers
3. Verify payment flow end-to-end

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 🚀 Deployment

### Production Checklist
- [ ] Switch to live Razorpay keys
- [ ] Update environment variables
- [ ] Test payment flow with real cards
- [ ] Configure webhooks (optional)
- [ ] Set up monitoring and alerts

### Webhook Configuration (Optional)
1. Configure webhook URL in Razorpay dashboard
2. Handle payment status updates
3. Implement retry logic for failed webhooks

## 🐛 Troubleshooting

### Common Issues

#### Payment Button Not Working
- Check Razorpay keys are correct
- Verify environment variables are loaded
- Check browser console for errors

#### Payment Verification Fails
- Ensure key secret is correct
- Check signature verification logic
- Verify payment data format

#### Enrollment Not Created
- Check database permissions
- Verify RLS policies
- Check enrollment service logs

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG=razorpay:*
```

## 📞 Support

For issues or questions:
1. Check Razorpay documentation
2. Review error logs
3. Contact development team
4. Check Supabase logs for database issues

## 🔄 Updates

### Version History
- **v1.0.0**: Initial implementation
- Complete payment flow
- Database integration
- Admin features

### Future Enhancements
- Subscription payments
- Installment plans
- Multiple payment methods
- Advanced analytics
- Automated refunds
