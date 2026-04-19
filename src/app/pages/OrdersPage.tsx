import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Clock, CheckCircle, ChefHat, Package } from 'lucide-react';
import { Order } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/orders');
      if (response.ok) {
        const data = await response.json();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        // Filter orders for the logged-in user
        setOrders(data.filter((o: any) => o.userName === currentUser.name));
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Order Received', icon: Clock, color: 'bg-yellow-100 text-yellow-800', description: 'Waiting to be prepared' };
      case 'preparing':
        return { label: 'Preparing', icon: ChefHat, color: 'bg-blue-100 text-blue-800', description: 'Staff is cooking your food' };
      case 'ready':
        return { label: 'Ready for Pickup', icon: Package, color: 'bg-green-100 text-green-800', description: 'Collect at the counter' };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle, color: 'bg-gray-100 text-gray-800', description: 'Order finished' };
      default:
        return { label: 'Unknown', icon: Clock, color: 'bg-gray-100', description: '' };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="w-full px-4 py-8 max-w-[1440px] mx-auto text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">No orders yet</h3>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          return (
            <Card key={order.id}>
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>{new Date(order.timestamp).toLocaleTimeString()}</CardDescription>
                  </div>
                  <Badge className={statusInfo.color}><StatusIcon className="h-3 w-3 mr-1" />{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-orange-600">₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}