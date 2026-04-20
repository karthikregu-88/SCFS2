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
        setOrders(data.filter((o: any) => o.name === currentUser.name));
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
        {orders.map((order: any) => {
          return (
            <Card key={order.id}>
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>{order.time}</CardDescription>
                  </div>
                  <Badge className={order.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {order.paid ? (
                      <><CheckCircle className="h-3 w-3 mr-1 inline" /> Payment Done</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1 inline" /> Pending Payment</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span>{item.name} x {item.qty}</span>
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