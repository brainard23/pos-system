/**
 * User information for the dashboard
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Dashboard statistics data
 */
export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalTransactions: number;
  lowStockItems: number;
}

/**
 * Profit data for the chart
 */
export interface ProfitData {
  month: string;
  profit: number;
}

/**
 * Recent activity item
 */
export interface ActivityItem {
  action: string;
  time: string;
  amount?: string;
  item?: string;
  icon: React.ElementType;
}

/**
 * Props for the StatCard component
 */
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
} 