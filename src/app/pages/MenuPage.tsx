import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { FoodItem, CartItem } from '../types';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

export function MenuPage() {
  // 1. Always initialize with an empty array [] to prevent '.map' is undefined errors
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/menu`);
        
        // 2. Check if response is successful
        if (!res.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await res.json();

        // 3. Only update state if data is an actual array
        if (Array.isArray(data)) {
          setFoodItems(data);
        } else {
          console.error('Backend did not return an array:', data);
          setFoodItems([]); // Fallback
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error("Could not load menu. Using offline mode.");
        setFoodItems([]); 
      }
    };

    fetchMenu();
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (item: FoodItem) => {
    const totalItems = cart.reduce((sum, current) => sum + current.quantity, 0);
    if (totalItems >= 10) {
      toast.error("You can only add up to 10 items to your cart.");
      return;
    }

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      updateCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updateCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`Added ${item.name}`);
  };

  // 4. Added defensive check (foodItems || []) to ensure map always works
  const categories = ['All', ...Array.from(new Set((foodItems || []).map(item => item.category)))];

  const renderFoodItems = (category: string) => {
    const items = category === 'All' 
      ? foodItems 
      : foodItems.filter(item => item.category === category);

    if (items.length === 0) {
      return <div className="py-10 text-center text-gray-500">No items found in this category.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.name}</CardTitle>
                <Badge variant="secondary">₹{item.price}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => addToCart(item)} className="w-full bg-orange-600 hover:bg-orange-700">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-4 py-8 max-w-[1440px] mx-auto">
      <Toaster />
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Browse Menu</h2>
        <p className="text-gray-600">Fresh food from your campus canteen</p>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto">
          {categories.map(c => (
            <TabsTrigger key={c} value={c} className="px-6 py-2">
              {c}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(c => (
          <TabsContent key={c} value={c}>
            {renderFoodItems(c)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}