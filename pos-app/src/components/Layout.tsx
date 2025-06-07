import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  LogOut,
  User,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
    },
    {
      name: 'Sales',
      href: '/sales',
      icon: ShoppingCart,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: Receipt,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-card border-r transition-all duration-300 flex flex-col",
          isCollapsed && "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">POS</span>
            </div>
            {!isCollapsed && <span className="font-semibold text-lg">POS System</span>}
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? '>' : '<'}
          </Button> */}
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1 py-2 px-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 text-secondary",
                    isCollapsed && "justify-center px-2",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className={cn("h-4 w-4", isCollapsed && "mr-0")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Profile & Logout */}
        <div className="mt-auto border-t p-2">
          <div className="p-4">
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                </div>
              )}
            </div>
          </div>
          <Separator />
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed && "justify-center px-2 m-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", isCollapsed && "mr-0")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 