import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
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
      {/* PROFESSIONAL ADMIN HEADER */}
      <nav className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">CVR Admin</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Canteen Management System</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2"
            onClick={() => { localStorage.clear(); window.location.reload(); }}
          >
            <LogOut size={18} /> <span className="text-xs font-bold uppercase">Logout</span>
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-white border p-1.5 shadow-sm inline-flex mb-8">
            <TabsTrigger value="orders" className="px-12 py-2.5 font-bold uppercase text-xs tracking-widest">Active Orders</TabsTrigger>
            <TabsTrigger value="menu" className="px-12 py-2.5 font-bold uppercase text-xs tracking-widest">Canteen Menu</TabsTrigger>
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
                      <Badge className={order.paid ? "bg-emerald-100 text-emerald-700 border-none shadow-sm" : "bg-rose-100 text-rose-700 border-none shadow-sm"}>
                        {order.paid ? "PAYMENT DONE" : "PENDING"}
                      </Badge>
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
        </Tabs>
      </div>
    </div>
  );
}