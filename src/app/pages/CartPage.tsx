import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Fixed imports: pointed to ../components/ui/
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { CartItem } from '../types';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { DEMO_MODE } from '../config/razorpay';
import { PaymentInfo } from '../components/PaymentInfo';

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (itemId: string, change: number) => {
    if (change > 0) {
      const totalItems = cart.reduce((sum, current) => sum + current.quantity, 0);
      if (totalItems >= 10) {
        toast.error("You can only have up to 10 items in your cart.");
        return;
      }
    }

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
    updateCart(cart.filter(item => item.id !== itemId));
    toast.info('Item removed from cart');
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = () => {
    if (cart.length === 0) return toast.error('Your cart is empty');

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orderId = 'ORD-' + Date.now();
    const totalAmount = calculateTotal();

    setIsProcessing(true);

    initiateRazorpayPayment({
      amount: totalAmount,
      orderId: orderId,
      userName: user.name || 'Student',
      userEmail: user.email || 'student@campus.edu',
      userPhone: '9999999999',
      onSuccess: async (response) => {
        // Send data to Python Backend
        try {
          const backendResponse = await fetch('http://localhost:8000/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_name: user.name || "Student",
              user_email: user.email || "student@cvr.ac.in",
              items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
              total: totalAmount,
              payment_done: true,
              razorpay_id: response.razorpay_payment_id || "SIMULATED_ID"
            }),
          });

          if (backendResponse.ok) {
            updateCart([]);
            setIsProcessing(false);
            toast.success('Payment Successful! Sent to Canteen.');
            setTimeout(() => navigate('/orders'), 1500);
          }
        } catch (error) {
          setIsProcessing(false);
          toast.error("Order saved locally, but backend was unreachable.");
        }
      },
      onFailure: (error) => {
        setIsProcessing(false);
        toast.error('Payment failed');
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="w-full px-4 py-8 max-w-[1440px] mx-auto text-center">
        <Toaster />
        <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Your cart is empty</h3>
        <Button onClick={() => navigate('/menu')} className="mt-4 bg-orange-600">Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 max-w-[1440px] mx-auto">
      <Toaster />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-4 w-4" /></Button>
                      <span className="font-semibold px-4">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-orange-600">₹{calculateTotal().toFixed(2)}</span>
            </div>
            <Button onClick={placeOrder} disabled={isProcessing} className="w-full bg-orange-600 h-12 text-lg">
              {isProcessing ? "Processing..." : `Pay ₹${calculateTotal().toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
      <PaymentInfo />
    </div>
  );
}