# Razorpay Payment Integration Setup Guide

This Smart Campus Food Ordering System is integrated with Razorpay for secure payment processing.

## 🎭 Current Status: DEMO MODE

The application is currently running in **DEMO MODE**, which means:
- Payments are simulated (no real money is charged)
- No actual Razorpay account is required for testing
- Orders are created successfully after simulated payment
- Perfect for testing and demonstration purposes

## 🔧 Setting Up Real Razorpay Payments

To enable actual payment processing, follow these steps:

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a free account
3. Complete the verification process

### Step 2: Get API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Click on **Generate Test Key** (for testing) or **Generate Live Key** (for production)
4. Copy the **Key ID** (starts with `rzp_test_` or `rzp_live_`)

### Step 3: Configure the Application

1. Open `/src/app/config/razorpay.ts`
2. Replace `'rzp_test_YOUR_KEY_ID_HERE'` with your actual Key ID
3. Set `DEMO_MODE = false` to disable demo mode

```typescript
export const RAZORPAY_CONFIG = {
  key: 'rzp_test_ABC123XYZ456', // Your actual key here
  // ... other config
};

export const DEMO_MODE = false; // Set to false
```

### Step 4: Test the Integration

1. Add items to cart
2. Click "Pay" button
3. Razorpay checkout modal will open
4. Use test card details (for test mode):
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

### Step 5: Go Live (Production)

1. Complete KYC verification in Razorpay Dashboard
2. Generate **Live API Keys** (starts with `rzp_live_`)
3. Replace test key with live key in configuration
4. Test thoroughly before going live

## 💳 Supported Payment Methods

Razorpay supports:
- Credit/Debit Cards (Visa, Mastercard, RuPay, etc.)
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Net Banking (all major banks)
- Wallets (Paytm, PhonePe, Mobikwik, etc.)
- EMI options
- Cardless EMI

## 🔒 Security Features

- PCI DSS Level 1 compliant
- 256-bit SSL encryption
- 3D Secure authentication
- Fraud detection & prevention
- Automatic settlement to bank account

## 📊 Features Included

- ✅ Razorpay Checkout integration
- ✅ Payment success/failure handling
- ✅ Order creation after successful payment
- ✅ Demo mode for testing
- ✅ Mobile-responsive payment interface
- ✅ Support for all Indian payment methods

## 🛠️ Customization Options

You can customize the payment experience in `/src/app/config/razorpay.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  key: 'your_key_id',
  currency: 'INR',
  name: 'Your Campus Name',
  description: 'Food Order Payment',
  image: 'your_logo_url',
  theme: {
    color: '#ea580c', // Change to match your brand
  },
};
```

## 📞 Support & Resources

- **Razorpay Documentation:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Integration Guide:** [https://razorpay.com/docs/payment-gateway/web-integration/](https://razorpay.com/docs/payment-gateway/web-integration/)
- **Support:** [https://razorpay.com/support/](https://razorpay.com/support/)

## ⚠️ Important Notes

- Keep your API keys secure and never commit them to public repositories
- Use environment variables for production deployments
- Always use test mode during development
- Verify webhook signatures for security
- Implement proper error handling for failed payments
- Store payment transaction IDs for future reference

## 🎯 Next Steps

After setting up Razorpay:
1. Test with demo transactions
2. Verify order creation flow
3. Test payment failures and cancellations
4. Set up webhooks for payment notifications (optional)
5. Implement refund functionality (optional)

---

For any issues or questions, please refer to the Razorpay documentation or contact their support team.
