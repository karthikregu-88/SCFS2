import { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
// Fixed relative paths to your components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { UtensilsCrossed, Mail, Lock, Settings, Server } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [customIp, setCustomIp] = useState(localStorage.getItem('SERVER_IP') || '');
  const COLLEGE_DOMAIN = "@cvr.ac.in";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith(COLLEGE_DOMAIN)) {
      toast.error("Invalid Domain", {
        description: `Please use your official ${COLLEGE_DOMAIN} email.`
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Match the role to your routes
        if (user.role === 'canteen') {
          window.location.href = '/staff';
        } else {
          window.location.href = '/menu';
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Server Offline", { description: "Is your Python backend running? Check Server Configuration." });
      setShowSettings(true);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UtensilsCrossed className="h-12 w-12 text-orange-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Campus Eats</h1>
          <p className="text-sm text-gray-500">Log in with {COLLEGE_DOMAIN}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder={`name${COLLEGE_DOMAIN}`}
                  className="pl-10"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password"
                  type="password" 
                  className="pl-10"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
              Sign In
            </Button>
          </form>

          {/* SERVER SETTINGS TOGGLE */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto transition-colors focus:outline-none"
            >
              <Settings size={14} />
              {showSettings ? "Hide Server Settings" : "Server Configuration"}
            </button>
          </div>

          {/* SERVER SETTINGS PANEL */}
          {showSettings && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <Label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
                <Server size={14} /> Backend Override URL
              </Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="e.g. http://192.168.0.x:8000" 
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  className="text-xs h-8"
                />
                <Button 
                  type="button" 
                  size="sm"
                  className="h-8 bg-slate-800 hover:bg-slate-900"
                  onClick={() => {
                    if (customIp.trim()) {
                      localStorage.setItem('SERVER_IP', customIp.trim());
                    } else {
                      localStorage.removeItem('SERVER_IP');
                    }
                    toast.success("Settings saved! Reloading...");
                    setTimeout(() => window.location.reload(), 1000);
                  }}
                >
                  Save
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                Testing on a physical phone? Find your computer's local Wi-Fi IP address and enter it here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}