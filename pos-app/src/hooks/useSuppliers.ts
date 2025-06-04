import { useState } from 'react';
import toast from 'react-hot-toast';
import { Supplier, NewSupplier } from '../types/product';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch suppliers');
      }

      const data = await response.json();
      setSuppliers(data);
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch suppliers');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addSupplier = async (supplier: NewSupplier) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add supplier');
      }

      const data = await response.json();
      await fetchSuppliers(); // Refresh the supplier list
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add supplier');
      throw error;
    }
  };

  return {
    suppliers,
    isLoading,
    fetchSuppliers,
    addSupplier,
  };
}; 