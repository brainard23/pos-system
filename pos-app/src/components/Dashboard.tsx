import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  DollarSign,
  Receipt,
  AlertTriangle,
  Plus,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalTransactions: number;
  lowStockItems: number;
}

// Mock data for the profit chart
const profitData = [
  { month: 'Jan', profit: 4000 },
  { month: 'Feb', profit: 3000 },
  { month: 'Mar', profit: 5000 },
  { month: 'Apr', profit: 4500 },
  { month: 'May', profit: 6000 },
  { month: 'Jun', profit: 5500 },
  { month: 'Jul', profit: 7000 },
  { month: 'Aug', profit: 6500 },
  { month: 'Sep', profit: 8000 },
  { month: 'Oct', profit: 7500 },
  { month: 'Nov', profit: 9000 },
  { month: 'Dec', profit: 8500 },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalSales: 0,
    totalTransactions: 0,
    lowStockItems: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    // TODO: Fetch actual stats from the backend
    setStats({
      totalProducts: 150,
      totalSales: 25000,
      totalTransactions: 45,
      lowStockItems: 8,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            description="Active products in inventory"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Sales"
            value={`$${stats.totalSales.toLocaleString()}`}
            icon={DollarSign}
            description="Total revenue this month"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Transactions Today"
            value={stats.totalTransactions}
            icon={Receipt}
            description="Total transactions today"
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={AlertTriangle}
            description="Items need restocking"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Profit Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Profit Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={profitData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, 'Profit']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activity */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {[
                    {
                      action: 'New sale completed',
                      time: '2 minutes ago',
                      amount: '$150.00',
                      icon: ShoppingCart,
                    },
                    {
                      action: 'Product stock updated',
                      time: '15 minutes ago',
                      item: 'Product #123',
                      icon: Package,
                    },
                    {
                      action: 'New product added',
                      time: '1 hour ago',
                      item: 'New Item XYZ',
                      icon: Plus,
                    },
                    {
                      action: 'Low stock alert',
                      time: '2 hours ago',
                      item: 'Product #456',
                      icon: AlertCircle,
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary/10">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      {(activity.amount || activity.item) && (
                        <div className="text-sm font-medium">
                          {activity.amount || activity.item}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  onClick={() => navigate('/products/new')}
                  className="w-full justify-start gap-2"
                  size="lg"
                >
                  <Plus className="h-4 w-4" />
                  Add New Product
                </Button>
                <Button
                  onClick={() => navigate('/sales/new')}
                  className="w-full justify-start gap-2"
                  size="lg"
                  variant="secondary"
                >
                  <ShoppingCart className="h-4 w-4" />
                  New Sale
                </Button>
                <Button
                  onClick={() => navigate('/products/low-stock')}
                  className="w-full justify-start gap-2"
                  size="lg"
                  variant="outline"
                >
                  <AlertTriangle className="h-4 w-4" />
                  View Low Stock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 