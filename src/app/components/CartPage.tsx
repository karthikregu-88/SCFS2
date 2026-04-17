import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { CartItem, Order } from '../types';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { DEMO_MODE } from '../config/razorpay';
import { PaymentInfo } from './PaymentInfo';

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    setCart(savedCart ? JSON.parse(savedCart) : []);
  };

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (itemId: string, change: number) => {
    const newCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    updateCart(newCart);
  };

  const removeItem = (itemId: string) => {
    const newCart = cart.filter(item => item.id !== itemId);
    updateCart(newCart);
    toast.info('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orderId = 'ORD' + Date.now();
    const totalAmount = calculateTotal();

    setIsProcessing(true);

    // Initiate Razorpay payment
    initiateRazorpayPayment({
      amount: totalAmount,
      orderId: orderId,
      userName: user.name || 'Guest',
      userEmail: user.email || 'guest@campus.edu',
      userPhone: user.phone || '9999999999',
      onSuccess: (response) => {
        // Payment successful - create order
        const newOrder: Order = {
          id: orderId,
          userId: user.id,
          userName: user.name,
          items: cart,
          total: totalAmount,
          status: 'pending',
          timestamp: new Date(),
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.unshift(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        updateCart([]);
        setIsProcessing(false);

        toast.success('Payment successful! Order placed', {
          description: `Order ID: ${orderId}`,
        });

        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      },
      onFailure: (error) => {
        setIsProcessing(false);
        console.error('Payment failed:', error);
        toast.error('Payment failed', {
          description: error?.error || 'Please try again',
        });
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
        <Toaster />
        <Card className="max-w-md mx-auto mt-12 sm:mt-20">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <ShoppingBag className="h-16 sm:h-20 w-16 sm:w-20 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center">Add items from the menu to get started</p>
            <Button onClick={() => navigate('/menu')} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
      <Toaster />
      
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
          <p className="text-sm sm:text-base text-gray-600">{cart.length} item(s) in your cart</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/menu')} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="font-semibold text-base sm:text-lg px-2 sm:px-4">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                        <p className="font-semibold text-base sm:text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-20">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">₹0.00</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold text-base sm:text-lg">Total</span>
                <span className="font-bold text-lg sm:text-xl text-orange-600">₹{calculateTotal().toFixed(2)}</span>
              </div>

              <Button 
                onClick={placeOrder}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 h-11 sm:h-12 text-base sm:text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Pay ₹{calculateTotal().toFixed(2)}
                  </>
                )}
              </Button>

              {DEMO_MODE && (
                <div className="text-[10px] sm:text-xs text-center text-gray-500 mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                  🎭 Demo Mode Active - No real payment required
                </div>
              )}

              <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Information */}
      <PaymentInfo />
    </div>
  );
}