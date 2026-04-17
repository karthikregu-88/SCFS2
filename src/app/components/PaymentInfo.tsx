import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Lock, CreditCard, Smartphone } from 'lucide-react';

export function PaymentInfo() {
  return (
    <Card className="mt-6 sm:mt-8">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          Secure Payment with Razorpay
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Safe and secure payment gateway trusted by millions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm mb-1">Multiple Payment Options</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">
                Credit/Debit Cards, UPI, Net Banking, Wallets
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm mb-1">256-bit Encryption</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">
                Your payment information is completely secure
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
              <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm mb-1">UPI Payments</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">
                Pay instantly with Google Pay, PhonePe, Paytm
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 border-t">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="text-xs">
              <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Cards" className="h-3 sm:h-4" />
            </Badge>
            <span className="text-[10px] sm:text-xs text-gray-400">Powered by</span>
            <img 
              src="https://cdn.razorpay.com/logo.svg" 
              alt="Razorpay" 
              className="h-4 sm:h-5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}