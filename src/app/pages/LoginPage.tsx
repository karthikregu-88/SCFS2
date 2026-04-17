import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UtensilsCrossed, User, Mail, Lock, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LoginPage() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState<'student' | 'staff' | 'canteen'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app, this would validate against backend
    const user = {
      id: '1',
      name: loginEmail.split('@')[0],
      email: loginEmail,
      role: loginEmail.includes('canteen') ? 'canteen' : 'student',
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (user.role === 'canteen') {
      navigate('/staff');
    } else {
      navigate('/menu');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock registration
    const user = {
      id: Date.now().toString(),
      name: registerName,
      email: registerEmail,
      role: role,
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (role === 'canteen') {
      navigate('/staff');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-full mb-3 sm:mb-4">
            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Campus Eats</h1>
          <p className="text-sm sm:text-base text-gray-600">Smart Campus Food Ordering System</p>
        </div>

        {/* Login/Register Tabs */}
        <Card>
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-sm sm:text-base">Register</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@campus.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-10 sm:h-11 text-sm sm:text-base">
                    Sign In
                  </Button>

                  <div className="text-xs sm:text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium mb-1">Demo accounts:</p>
                    <p>Student: student@campus.edu</p>
                    <p>Canteen Staff: canteen@campus.edu</p>
                    <p className="mt-1 text-gray-400">Any password will work</p>
                  </div>
                </form>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm sm:text-base">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm sm:text-base">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="student@campus.edu"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm sm:text-base">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm sm:text-base">Role</Label>
                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Faculty/Staff</SelectItem>
                        <SelectItem value="canteen">Canteen Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-10 sm:h-11 text-sm sm:text-base">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 bg-white rounded-lg border">
            <div className="text-xl sm:text-2xl mb-1">⚡</div>
            <p className="text-[10px] sm:text-xs text-gray-600">Quick Orders</p>
          </div>
          <div className="p-3 sm:p-4 bg-white rounded-lg border">
            <div className="text-xl sm:text-2xl mb-1">📱</div>
            <p className="text-[10px] sm:text-xs text-gray-600">Live Tracking</p>
          </div>
          <div className="p-3 sm:p-4 bg-white rounded-lg border">
            <div className="text-xl sm:text-2xl mb-1">💳</div>
            <p className="text-[10px] sm:text-xs text-gray-600">Easy Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}