import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/staff')}>
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight leading-none">CVR Admin</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-rose-500 font-bold uppercase text-[10px] gap-2">
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </nav>
  );
}