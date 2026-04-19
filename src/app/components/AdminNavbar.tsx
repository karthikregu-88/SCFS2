import { LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// CRITICAL: The word 'export' must be here, and the name must be 'AdminNavbar'
export function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/staff')}
        >
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight leading-none">CVR Admin</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black uppercase tracking-tighter">System Admin</span>
            </div>
            <p className="text-sm font-bold text-white leading-none mt-1">{user.name || 'Staff'}</p>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 font-bold uppercase text-[10px] gap-2"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}