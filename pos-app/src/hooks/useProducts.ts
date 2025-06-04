import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Product, NewProduct } from '../types/product';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing products with search and pagination
 * @returns Object containing products state and management functions
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce the search query to prevent too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  /**
   * Fetches products based on current page and search query
   */
  const fetchProducts = useCallback(async () => {
    try {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/products?page=${currentPage}&search=${encodeURIComponent(debouncedSearchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal, // Add the signal to the fetch request
        }
      );
      
      if (!response.ok) {
        // Don't show error toast if the request was aborted
        if (signal.aborted) return;
        
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
      }

      const data = await response.json();
      // Don't update state if the request was aborted
      if (signal.aborted) return;

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      // Don't show error toast if the request was aborted
      if (error instanceof Error && error.name === 'AbortError') return;
      
      toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
      throw error;
    } finally {
      // Only update loading state if this is still the current request
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [currentPage, debouncedSearchQuery]);

  // Cleanup function to abort any pending request when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Adds a new product
   * @param product - The product data to add
   */
  const addProduct = useCallback(async (product: NewProduct) => {
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
  }, [fetchProducts]);

  /**
   * Updates an existing product
   * @param id - The ID of the product to update
   * @param product - The updated product data
   */
  const updateProduct = useCallback(async (id: string, product: Partial<NewProduct>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      const data = await response.json();
      await fetchProducts(); // Refresh the product list
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
      throw error;
    }
  }, [fetchProducts]);

  /**
   * Deletes a product
   * @param id - The ID of the product to delete
   */
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }

      await fetchProducts(); // Refresh the product list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
      throw error;
    }
  }, [fetchProducts]);

  // Fetch products when page or debounced search query changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    currentPage,
    totalPages,
    searchQuery,
    isLoading,
    setCurrentPage,
    setSearchQuery,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
} 