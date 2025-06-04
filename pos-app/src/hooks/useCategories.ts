import { useState } from 'react';
import toast from 'react-hot-toast';
import { Category, NewCategory } from '../types/product';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch categories');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: NewCategory) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add category');
      }

      const data = await response.json();
      await fetchCategories(); // Refresh the category list
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add category');
      throw error;
    }
  };

  return {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
  };
}; 