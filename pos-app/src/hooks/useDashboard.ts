import { useState } from 'react';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dasboard', {
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
      toast.error(error instanceof Error ? error.message : 'Failed to fetch categories');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

 

  return {
    fetchData,
  };
}; 