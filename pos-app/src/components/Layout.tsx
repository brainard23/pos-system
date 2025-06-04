import { useEffect, useState } from 'react';
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
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">POS</span>
          </div>
          {!isCollapsed && <span className="font-semibold text-lg">POS System</span>}
        </div>
        {/* {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            
          >
            {isCollapsed ?  <X className="h-4 w-4" size={20}/> : '>'}
          </Button>
        )} */}
        {isMobile && (
          <Button
          variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
          >
            <X className="h-4 w-4" size={20}/>
          </Button>
        )}
      </div>

      <Separator className="my-2" />

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
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
                onClick={() => {
                  navigate(item.href);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className={cn("h-4 w-4", isCollapsed && "mr-0")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t">
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
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", isCollapsed && "mr-0")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r transition-all duration-300",
          isMobile
            ? "w-64 transform transition-transform"
            : isCollapsed
            ? "w-16"
            : "w-64",
          isMobile && !isMobileMenuOpen && "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile
            ? "pt-16"
            : isCollapsed
            ? "md:pl-16"
            : "md:pl-64"
        )}
      >
        <div className="container px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 