import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, ChefHat, Package, CheckCircle, TrendingUp } from 'lucide-react';
import { Order } from '../types';
import { mockOrders } from '../data/mockData';

export function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
    
    // Auto-refresh orders
    const interval = setInterval(() => {
      loadOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
    setOrders(allOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const formatTime = (date: Date) => {
    const orderDate = new Date(date);
    const hours = orderDate.getHours();
    const minutes = orderDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      case 'completed': return null;
    }
  };

  const getNextStatusLabel = (currentStatus: Order['status']): string => {
    switch (currentStatus) {
      case 'pending': return 'Start Preparing';
      case 'preparing': return 'Mark as Ready';
      case 'ready': return 'Complete Order';
      default: return '';
    }
  };

  const renderOrderCard = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    
    return (
      <Card key={order.id} className="mb-4">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg">Order #{order.id}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {order.userName} • {formatTime(order.timestamp)}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base sm:text-lg px-3 py-1 self-start">
              ₹{order.total.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Badge variant="outline" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs flex-shrink-0">
                    {item.quantity}×
                  </Badge>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {nextStatus && (
            <Button
              onClick={() => updateOrderStatus(order.id, nextStatus)}
              className="w-full bg-orange-600 hover:bg-orange-700 h-10 sm:h-11 text-sm sm:text-base"
            >
              {getNextStatusLabel(order.status)}
            </Button>
          )}
          
          {order.status === 'completed' && (
            <div className="flex items-center justify-center gap-2 text-green-600 py-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Order Completed</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const pendingOrders = getOrdersByStatus('pending');
  const preparingOrders = getOrdersByStatus('preparing');
  const readyOrders = getOrdersByStatus('ready');
  const completedOrders = getOrdersByStatus('completed');

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage and process customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Preparing</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{preparingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Ready</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{readyOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="pending" className="relative text-xs sm:text-sm py-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">Pending</span>
            {pendingOrders.length > 0 && (
              <Badge className="bg-yellow-600 h-5 w-5 sm:h-auto sm:w-auto text-[10px] sm:text-xs p-0 sm:px-2">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative text-xs sm:text-sm py-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline">Preparing</span>
            <span className="sm:hidden">Prep</span>
            {preparingOrders.length > 0 && (
              <Badge className="bg-blue-600 h-5 w-5 sm:h-auto sm:w-auto text-[10px] sm:text-xs p-0 sm:px-2">{preparingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative text-xs sm:text-sm py-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span>Ready</span>
            {readyOrders.length > 0 && (
              <Badge className="bg-green-600 h-5 w-5 sm:h-auto sm:w-auto text-[10px] sm:text-xs p-0 sm:px-2">{readyOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Completed</span>
            <span className="sm:hidden">Done</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 sm:mt-6">
          {pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingOrders.map(renderOrderCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <Clock className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-600">No pending orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preparing" className="mt-4 sm:mt-6">
          {preparingOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {preparingOrders.map(renderOrderCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <ChefHat className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-600">No orders being prepared</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ready" className="mt-4 sm:mt-6">
          {readyOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {readyOrders.map(renderOrderCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <Package className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-600">No orders ready for pickup</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 sm:mt-6">
          {completedOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedOrders.map(renderOrderCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <CheckCircle className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-600">No completed orders</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}