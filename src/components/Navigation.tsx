
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useMobile } from '@/hooks/use-mobile';
import { Home, LineChart, FileText, Settings, LogOut, User, Menu, Sun, Moon, UserCircle, BookOpen } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { settings, toggleDarkMode } = useUserSettings();
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-4 w-4 mr-2" />
    },
    { 
      name: 'Markets', 
      path: '/stocks/AAPL', 
      icon: <LineChart className="h-4 w-4 mr-2" />
    },
    { 
      name: 'Learning', 
      path: '/learning', 
      icon: <BookOpen className="h-4 w-4 mr-2" />
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <UserCircle className="h-4 w-4 mr-2" />
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold mr-8">TradeHub</Link>
          
          {!isMobile && (
            <nav className="flex space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={isActive(item.path) ? "" : "text-muted-foreground"}
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            title={settings?.dark_mode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {settings?.dark_mode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-2 mt-8">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className={isActive(item.path) ? "" : "text-muted-foreground justify-start"}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  ))}
                  <DropdownMenuSeparator />
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start mt-4"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
