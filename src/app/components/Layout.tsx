import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, ClipboardList, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'staff' | 'canteen'>('student');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    } else {
      setIsLoggedIn(false);
    }

    // Update cart count
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartItems = JSON.parse(cart);
      const count = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  // Don't show header on login page
  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('/menu')}>
              <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div>
                <h1 className="font-bold text-base sm:text-xl text-gray-900">Campus Eats</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Smart Food Ordering</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {userRole === 'canteen' ? (
                <Button
                  variant={location.pathname === '/staff' ? 'default' : 'ghost'}
                  onClick={() => handleNavigate('/staff')}
                  className="gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant={location.pathname === '/menu' ? 'default' : 'ghost'}
                    onClick={() => handleNavigate('/menu')}
                  >
                    Menu
                  </Button>
                  <Button
                    variant={location.pathname === '/orders' ? 'default' : 'ghost'}
                    onClick={() => handleNavigate('/orders')}
                    className="gap-2"
                  >
                    <ClipboardList className="h-4 w-4" />
                    My Orders
                  </Button>
                  <Button
                    variant={location.pathname === '/cart' ? 'default' : 'ghost'}
                    onClick={() => handleNavigate('/cart')}
                    className="gap-2 relative"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-600">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </>
              )}
              
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                    Campus Eats
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-8">
                  {userRole === 'canteen' ? (
                    <Button
                      variant={location.pathname === '/staff' ? 'default' : 'outline'}
                      onClick={() => handleNavigate('/staff')}
                      className="w-full justify-start gap-3 h-12"
                    >
                      <ClipboardList className="h-5 w-5" />
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={location.pathname === '/menu' ? 'default' : 'outline'}
                        onClick={() => handleNavigate('/menu')}
                        className="w-full justify-start gap-3 h-12"
                      >
                        <UtensilsCrossed className="h-5 w-5" />
                        Menu
                      </Button>
                      <Button
                        variant={location.pathname === '/orders' ? 'default' : 'outline'}
                        onClick={() => handleNavigate('/orders')}
                        className="w-full justify-start gap-3 h-12"
                      >
                        <ClipboardList className="h-5 w-5" />
                        My Orders
                      </Button>
                      <Button
                        variant={location.pathname === '/cart' ? 'default' : 'outline'}
                        onClick={() => handleNavigate('/cart')}
                        className="w-full justify-start gap-3 h-12 relative"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Cart
                        {cartCount > 0 && (
                          <Badge className="ml-auto h-6 w-6 flex items-center justify-center p-0 bg-orange-600">
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                    </>
                  )}
                  
                  <div className="border-t my-2" />
                  
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}