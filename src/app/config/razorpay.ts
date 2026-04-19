// Razorpay Configuration
// Replace these with your actual Razorpay credentials from https://dashboard.razorpay.com/

export const RAZORPAY_CONFIG = {
  // Test Key - Replace with your actual Key ID from Razorpay Dashboard
  key: 'rzp_test_Sf5D8XjC3opbXX',
  
  // For production, use live key
  // key: 'rzp_live_YOUR_KEY_ID_HERE',
  
  // Currency
  currency: 'INR',
  
  // Your business/company name
  name: 'Campus Eats',
  
  // Description
  description: 'Smart Campus Food Ordering',
  
  // Your logo URL
  image: 'https://cdn-icons-png.flaticon.com/512/3655/3655682.png',
  
  // Theme color
  theme: {
    color: '#ea580c', // Orange-600
  },
};

// Demo mode - When true, simulates payment without actual Razorpay integration
export const DEMO_MODE = false;

// Instructions for setting up Razorpay:
// 1. Sign up at https://razorpay.com/
// 2. Go to Settings > API Keys in the Razorpay Dashboard
// 3. Generate Test/Live API keys
// 4. Replace 'YOUR_KEY_ID_HERE' above with your actual Key ID
// 5. Set DEMO_MODE to false for real payment processing
// 6. For production, use Live keys instead of Test keys
