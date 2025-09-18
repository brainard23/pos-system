import { useState } from 'react';
import { API_URL } from '@/services/api';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch');
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch dashboard');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

 

  return {
    fetchData,
    isLoading,
  };
}; 