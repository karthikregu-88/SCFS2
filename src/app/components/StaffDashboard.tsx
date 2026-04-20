import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Camera, 
  Mail, 
  User, 
  Trash2, 
  Plus, 
  Clock, 
  IndianRupee, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [formData, setFormData] = useState({ name: '', price: 0, image: '', category: 'Main Course', description: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Data Refresh Logic (Polling every 5 seconds)
  const refreshData = async () => {
    try {
      const menuRes = await fetch('http://localhost:8000/menu');
      if (menuRes.ok) {
        const data = await menuRes.json();
        setMenuItems(Array.isArray(data) ? data : []);
      }

      const orderRes = await fetch('http://localhost:8000/admin/orders');
      if (orderRes.ok) {
        const data = await orderRes.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Image Handling (Camera/Files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // 3. Menu CRUD Logic
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please add a photo of the dish");

    const res = await fetch('http://localhost:8000/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast.success("Dish published to canteen menu");
      setFormData({ name: '', price: 0, image: '', category: 'Main Course', description: '' });
      refreshData();
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-indigo-400 font-bold tracking-widest animate-pulse">
      INITIALIZING ADMIN PORTAL...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-white border p-1.5 shadow-sm inline-flex mb-8">
            <TabsTrigger value="orders" className="px-12 py-2.5 font-bold uppercase text-xs tracking-widest">Active Orders</TabsTrigger>
            <TabsTrigger value="menu" className="px-12 py-2.5 font-bold uppercase text-xs tracking-widest">Canteen Menu</TabsTrigger>
            <TabsTrigger value="analysis" className="px-12 py-2.5 font-bold uppercase text-xs tracking-widest">Analysis</TabsTrigger>
          </TabsList>

          {/* TAB 1: STUDENT ORDERS VIEW */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {orders.length === 0 ? (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No Active Orders found</p>
                </div>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
                    <div className={`h-1.5 w-full ${order.paid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    
                    <CardHeader className="flex flex-row justify-between items-center py-4 bg-slate-50/50 px-6">
                      <span className="text-[11px] font-black text-slate-400 tracking-widest">#{order.id}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-md border shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                          <Checkbox 
                            id={`delivered-${order.id}`} 
                            checked={order.status === 'completed'}
                            onCheckedChange={async (checked) => {
                              const newStatus = checked ? 'completed' : 'pending';
                              try {
                                await fetch(`http://localhost:8000/admin/orders/${order.id}/status`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: newStatus })
                                });
                                refreshData();
                                toast.success(`Order marked as ${checked ? 'Delivered' : 'Pending'}`);
                              } catch (e) {
                                toast.error('Failed to update status');
                              }
                            }}
                          />
                          <Label htmlFor={`delivered-${order.id}`} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-slate-600">
                            Delivered
                          </Label>
                        </div>
                        <Badge className={order.paid ? "bg-emerald-100 text-emerald-700 border-none shadow-sm" : "bg-rose-100 text-rose-700 border-none shadow-sm"}>
                          {order.paid ? "PAYMENT DONE" : "PENDING"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* Student Info Section */}
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                          <User size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{order.name}</p>
                          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <Mail size={12} /> {order.email}
                          </p>
                        </div>
                      </div>

                      {/* Items List Section */}
                      <div className="space-y-3 py-4 border-y border-slate-100">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Order Summary</p>
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700">{item.name}</span>
                            <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded-md font-black text-[10px]">x{item.qty}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Section */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
                          <Clock size={12} /> {order.time}
                        </div>
                        <div className="text-2xl font-black text-indigo-700 flex items-center tracking-tighter">
                          <IndianRupee size={18} className="mr-0.5" />{order.total}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB 2: MENU MANAGEMENT VIEW */}
          <TabsContent value="menu">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* ENTRY PANEL */}
              <Card className="lg:col-span-1 shadow-2xl border-none h-fit rounded-3xl overflow-hidden">
                <div className="bg-slate-900 p-6 text-white">
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <Plus size={20} className="text-indigo-400" /> Add Dish
                  </h2>
                </div>
                <CardContent className="p-6">
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <div 
                      className="group relative h-52 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <div className="bg-white p-4 rounded-full shadow-md mb-3 mx-auto w-fit">
                            <Camera className="text-indigo-500" size={24} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Snap or Upload Photo</p>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                    
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dish Name</Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Samosa" required className="bg-slate-50 border-none h-12" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</Label>
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="flex h-12 w-full rounded-md bg-slate-50 border-none px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Tiffins">Tiffins</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price (₹)</Label>
                      <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} placeholder="0" required className="bg-slate-50 border-none h-12" />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                      Publish Dish
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* LIST PANEL */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className="flex flex-row h-40 border-none shadow-md rounded-3xl overflow-hidden bg-white group hover:shadow-xl transition-all">
                    <div className="w-40 h-full overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tight">{item.name}</h3>
                          <Badge variant="secondary" className="text-[9px] font-bold mt-1 uppercase bg-slate-100">{item.category}</Badge>
                        </div>
                        <p className="text-xl font-black text-indigo-600 tracking-tighter">₹{item.price}</p>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                          onClick={async () => {
                            if(window.confirm("Remove this dish from the canteen?")) {
                              await fetch(`http://localhost:8000/menu/${item.id}`, { method: 'DELETE' });
                              refreshData();
                            }
                          }}
                        >
                          <Trash2 size={20}/>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          {/* TAB 3: ANALYSIS VIEW */}
          <TabsContent value="analysis">
            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                      <AlertCircle size={28} className="text-indigo-400" /> Item Popularity Ranking
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Most ordered items based on {selectedDate === 'All' ? 'all' : selectedDate} orders</p>
                  </div>
                  {(() => {
                    const uniqueDates = Array.from(new Set(orders.map(o => o.date).filter(Boolean)));
                    return (
                      <select 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 font-bold text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Time</option>
                        {uniqueDates.map(date => (
                          <option key={date as string} value={date as string}>{date}</option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
                <CardContent className="p-0">
                  {(() => {
                    const itemCounts: Record<string, number> = {};
                    const filteredOrders = selectedDate === 'All' ? orders : orders.filter(o => o.date === selectedDate);
                    filteredOrders.forEach(order => {
                      order.items?.forEach((item: any) => {
                        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
                      });
                    });
                    const rankedItems = Object.entries(itemCounts)
                      .map(([name, count]) => ({ name, count }))
                      .sort((a, b) => b.count - a.count);

                    if (rankedItems.length === 0) {
                      return (
                        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest">
                          No items have been ordered yet.
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-slate-100">
                        {rankedItems.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-md ${
                                index === 0 ? 'bg-amber-100 text-amber-600' :
                                index === 1 ? 'bg-slate-200 text-slate-600' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-indigo-50 text-indigo-600'
                              }`}>
                                #{index + 1}
                              </div>
                              <div>
                                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{item.name}</h3>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-indigo-600">{item.count}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Orders</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}