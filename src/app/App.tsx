import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { Toaster } from 'sonner';

// Import Pages
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/MenuPage';

// Import Components (Lines 7 & 8 are here)
import { StaffDashboard } from './components/StaffDashboard'; 
import { Navbar } from './components/Navbar'; 
// This MUST match the export name exactly
import { AdminNavbar } from './components/AdminNavbar';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  // If not logged in, show login page
  if (!user) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" richColors />
      
      {/* Role-based UI Switcher */}
      {user.role === 'canteen' ? <AdminNavbar /> : <Navbar />}

      <main>
        <Routes>
          <Route 
            path="/menu" 
            element={user.role === 'student' ? <MenuPage /> : <Navigate to="/staff" replace />} 
          />
          <Route 
            path="/staff" 
            element={user.role === 'canteen' ? <StaffDashboard /> : <Navigate to="/menu" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user.role === 'canteen' ? "/staff" : "/menu"} replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}