import { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Utensils } from 'lucide-react';
import { Button } from './ui/button'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const cart = JSON.parse(saved);
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 text-orange-600 font-bold text-xl cursor-pointer" onClick={() => navigate('/menu')}>
        <Utensils size={24} />
        <span className="font-black uppercase tracking-tighter">Campus Eats</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orders')} className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
          <ShoppingCart size={22} className="text-gray-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-100 font-bold uppercase text-[10px]">
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </nav>
  );
}