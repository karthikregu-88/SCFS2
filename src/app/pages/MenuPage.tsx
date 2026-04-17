import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { mockFoodItems } from '../data/mockData';
import { FoodItem, CartItem } from '../types';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';

export function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const categories = ['All', ...Array.from(new Set(mockFoodItems.map(item => item.category)))];

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Trigger a storage event to update cart count in header
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (item: FoodItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const newCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      updateCart(newCart);
      toast.success(`Added another ${item.name} to cart`);
    } else {
      const newCart = [...cart, { ...item, quantity: 1 }];
      updateCart(newCart);
      toast.success(`${item.name} added to cart`);
    }
  };

  const removeFromCart = (item: FoodItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem && existingItem.quantity > 1) {
      const newCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      updateCart(newCart);
      toast.info(`Removed one ${item.name} from cart`);
    } else {
      const newCart = cart.filter(cartItem => cartItem.id !== item.id);
      updateCart(newCart);
      toast.info(`${item.name} removed from cart`);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const renderFoodItems = (category: string) => {
    const items = category === 'All' 
      ? mockFoodItems 
      : mockFoodItems.filter(item => item.category === category);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg">{item.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm">{item.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-sm sm:text-base">₹{item.price}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {quantity === 0 ? (
                  <Button
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                    className="w-full bg-orange-600 hover:bg-orange-700 h-10 sm:h-11"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      onClick={() => removeFromCart(item)}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-base sm:text-lg px-4">{quantity}</span>
                    <Button
                      onClick={() => addToCart(item)}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] mx-auto">
      <Toaster />
      
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Browse Menu</h2>
        <p className="text-sm sm:text-base text-gray-600">Choose from our delicious selection of campus favorites</p>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-6 sm:mb-8 flex flex-wrap h-auto gap-1 sm:gap-0 p-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            {renderFoodItems(category)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}