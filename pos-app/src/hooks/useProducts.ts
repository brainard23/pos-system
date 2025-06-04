import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Product, NewProduct } from '../types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/products?page=${currentPage}&search=${searchQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: NewProduct) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add product');
      }

      const data = await response.json();
      await fetchProducts(); // Refresh the product list
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
      throw error;
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchProducts();
      return;
    }

  }, [searchQuery]);


  return {
    products,
    currentPage,
    totalPages,
    searchQuery,
    isLoading,
    setCurrentPage,
    setSearchQuery,
    fetchProducts,
    addProduct,
  };
}; 