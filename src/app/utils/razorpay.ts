import { RAZORPAY_CONFIG, DEMO_MODE } from '../config/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number;
  orderId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (options: RazorpayOptions) => {
  const { amount, orderId, userName, userEmail, userPhone, onSuccess, onFailure } = options;

  // Demo mode - simulate successful payment
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating Razorpay payment');
    console.log('Amount:', amount);
    console.log('Order ID:', orderId);
    
    // Simulate payment processing delay
    setTimeout(() => {
      const mockResponse = {
        razorpay_payment_id: 'pay_demo_' + Date.now(),
        razorpay_order_id: orderId,
        razorpay_signature: 'demo_signature_' + Date.now(),
      };
      console.log('✅ Demo payment successful:', mockResponse);
      onSuccess(mockResponse);
    }, 1500);
    
    return;
  }

  // Real Razorpay integration
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    onFailure({ error: 'Failed to load Razorpay SDK' });
    return;
  }

  const razorpayOptions = {
    key: RAZORPAY_CONFIG.key,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: RAZORPAY_CONFIG.description,
    image: RAZORPAY_CONFIG.image,
    order_id: orderId,
    handler: function (response: any) {
      console.log('✅ Payment successful:', response);
      onSuccess(response);
    },
    prefill: {
      name: userName,
      email: userEmail,
      contact: userPhone || '',
    },
    theme: RAZORPAY_CONFIG.theme,
    modal: {
      ondismiss: function () {
        console.log('❌ Payment cancelled by user');
        onFailure({ error: 'Payment cancelled by user' });
      },
    },
  };

  try {
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    console.error('Razorpay error:', error);
    onFailure(error);
  }
};
