import { useState } from 'react';
import { useNavigate } from 'react-router';
// Fixed relative paths to your components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { UtensilsCrossed, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Match the role to your routes
        if (user.role === 'canteen') {
          navigate('/staff');
        } else {
          navigate('/menu');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Server Offline", { description: "Is your Python backend running?" });
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
        </CardContent>
      </Card>
    </div>
  );
}