# Razorpay Setup Guide

Follow these steps to complete the Razorpay payment gateway integration.

## 🚀 Quick Setup

### 1. Get Razorpay API Keys

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up for a new account
   - Complete KYC verification

2. **Generate API Keys**
   - Go to **Settings** → **API Keys**
   - Click **Generate Key Pair**
   - Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Create a `.env` file in your project root and add:

```env
# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 3. Run Database Migration

Since Supabase CLI is not installed, manually run the SQL migration:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/006_course_enrollments_clean.sql`
4. Click **Run** to execute the migration

**Note:** This migration will drop and recreate the tables to ensure correct column names. If you have existing data, please backup first.

### 4. Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test with Razorpay test cards:**
   - **Success Card**: 4111 1111 1111 1111
   - **Failure Card**: 4000 0000 0000 0002
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

3. **Test the payment flow:**
   - Go to any course page
   - Click "Enroll Now"
   - Complete payment with test card
   - Verify enrollment is created

## 🔧 Configuration Details

### Test vs Production Keys

- **Test Mode**: Use test keys for development
- **Production Mode**: Switch to live keys for production

### Webhook Setup (Optional)

For production, set up webhooks:

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`

## 🧪 Testing Checklist

- [ ] Payment button appears on course pages
- [ ] Razorpay modal opens when clicked
- [ ] Test payment succeeds with test card
- [ ] Enrollment is created in database
- [ ] Success page shows payment details
- [ ] User can access enrolled courses

## 🚀 Production Deployment

### 1. Switch to Live Keys

Replace test keys with live keys in your `.env` file:

```env
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
VITE_RAZORPAY_KEY_SECRET=your_live_key_secret
```

### 2. Update Environment Variables

Set production environment variables in your hosting platform (Vercel, Netlify, etc.)

### 3. Test with Real Cards

- Test with small amounts first
- Verify all payment flows work
- Check enrollment creation

## 🐛 Troubleshooting

### Common Issues

1. **Payment Button Not Working**
   - Check browser console for errors
   - Verify Razorpay keys are correct
   - Ensure environment variables are loaded

2. **Payment Verification Fails**
   - Check key secret is correct
   - Verify signature verification
   - Check payment data format

3. **Enrollment Not Created**
   - Check Supabase database permissions
   - Verify RLS policies are correct
   - Check enrollment service logs

### Debug Mode

Add debug logging to your environment:

```env
DEBUG=razorpay:*
```

## 📞 Support

- **Razorpay Documentation**: [docs.razorpay.com](https://docs.razorpay.com/)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Project Issues**: Check the project repository

## ✅ Completion Checklist

- [ ] Razorpay account created
- [ ] API keys generated
- [ ] Environment variables configured
- [ ] Database migration executed
- [ ] Payment flow tested
- [ ] Success page working
- [ ] Enrollment system functional
- [ ] Production keys ready (if deploying)

Your Razorpay integration is now complete! 🎉
