import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Clock, CheckCircle, ChefHat, Package } from 'lucide-react';
import { Order } from '../types';
import { mockOrders } from '../data/mockData';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
    
    // Simulate real-time order updates
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    const userOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
    setOrders(userOrders);
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Order Received',
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Your order has been received and is waiting to be prepared',
        };
      case 'preparing':
        return {
          label: 'Preparing',
          icon: ChefHat,
          color: 'bg-blue-100 text-blue-800',
          description: 'Your order is being prepared by our kitchen staff',
        };
      case 'ready':
        return {
          label: 'Ready for Pickup',
          icon: Package,
          color: 'bg-green-100 text-green-800',
          description: 'Your order is ready! Please collect it from the counter',
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          color: 'bg-gray-100 text-gray-800',
          description: 'Order completed',
        };
    }
  };

  const formatTime = (date: Date) => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const hours = orderDate.getHours();
    const minutes = orderDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  if (orders.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
        <Card className="max-w-md mx-auto mt-12 sm:mt-20">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <Package className="h-16 sm:h-20 w-16 sm:w-20 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">Your order history will appear here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Orders</h2>
        <p className="text-sm sm:text-base text-gray-600">Track your current and past orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Order #{order.id}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{formatTime(order.timestamp)}</CardDescription>
                  </div>
                  <Badge className={`${statusInfo.color} self-start text-xs sm:text-sm`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                {/* Status Timeline */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <StatusIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-blue-900 text-sm sm:text-base">{statusInfo.label}</p>
                    <p className="text-xs sm:text-sm text-blue-700">{statusInfo.description}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">Total Amount</span>
                  <span className="font-bold text-lg sm:text-xl text-orange-600">₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}