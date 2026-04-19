import { ShoppingCart, LogOut, Utensils } from 'lucide-react';
import { Button } from './ui/button'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

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
        <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
          <ShoppingCart size={22} className="text-gray-600" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-100 font-bold uppercase text-[10px]">
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </nav>
  );
}