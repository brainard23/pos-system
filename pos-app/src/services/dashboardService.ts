import { DashboardStats, ProfitData, ActivityItem } from '@/types/dashboard';

const API_URL = 'http://localhost:5000/api';

/**
 * Fetches dashboard statistics
 * @returns Promise containing dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch dashboard stats');
  }

  return response.json();
}

/**
 * Fetches profit data for the chart
 * @returns Promise containing profit data
 */
export async function fetchProfitData(): Promise<ProfitData[]> {
  const response = await fetch(`${API_URL}/dashboard/profit`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch profit data');
  }

  return response.json();
}

/**
 * Fetches recent activity data
 * @returns Promise containing recent activity items
 */
export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  const response = await fetch(`${API_URL}/dashboard/activity`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch recent activity');
  }

  return response.json();
} 