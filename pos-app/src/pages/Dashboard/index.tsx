import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, DollarSign, Package, TrendingUp } from 'lucide-react';
import { DashboardStats, ProfitData, ActivityItem } from '@/types/dashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useRef, useState } from 'react';

// Mock data for development
const mockStats: DashboardStats = {
  totalSales: 12500,
  totalProducts: 156,
  totalTransactions: 89,
  lowStockItems: 12
};

const mockProfitData: ProfitData[] = [
  { month: 'Jan', profit: 4000 },
  { month: 'Feb', profit: 3000 },
  { month: 'Mar', profit: 2000 },
  { month: 'Apr', profit: 2780 },
  { month: 'May', profit: 1890 },
  { month: 'Jun', profit: 2390 },
  { month: 'Jul', profit: 3490 }
];

const mockActivity: ActivityItem[] = [
  {
    action: 'Sale',
    item: 'Product A',
    amount: '$120.00',
    time: '2 minutes ago',
    icon: TrendingUp
  },
  {
    action: 'Stock Update',
    item: 'Product B',
    amount: '+50 units',
    time: '1 hour ago',
    icon: Package
  },
  {
    action: 'New Product',
    item: 'Product C',
    amount: 'Added',
    time: '3 hours ago',
    icon: Activity
  },
  {
    action: 'Sale',
    item: 'Product D',
    amount: '$85.00',
    time: '5 hours ago',
    icon: TrendingUp
  }
];

/**
 * Dashboard page component displaying key metrics and recent activity
 * @returns The dashboard page component
 */
export default function DashboardPage() {

  const { fetchData }  = useDashboard();
    const [data, setData] = useState<DashboardStats | null>(null); 
    const hasFetched = useRef(false);

    console.log('Dashboard data:', data);
  useEffect(() => {
      if (hasFetched.current) return;
    hasFetched.current = true;

    const fetch = async () => {
      try {
        const result = await fetchData(); 
        setData(result); 
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className='shadow-lg border-gray-300'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue this month
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-lg border-gray-300'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground bg-amber-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-lg border-gray-300'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground bg-blue-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Total transactions this month
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-lg border-gray-300'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground bg-pink-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items needing restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Chart */}
      <Card className="col-span-2 shadow-lg border-gray-300">
        <CardHeader>
          <CardTitle>Profit Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProfitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Profit']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="col-span-2 shadow-lg border-gray-300">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <activity.icon className="h-4 w-4" />
                    {activity.action}
                  </TableCell>
                  <TableCell>{activity.item}</TableCell>
                  <TableCell>{activity.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 