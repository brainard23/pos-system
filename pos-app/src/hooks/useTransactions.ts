import { useState, useCallback } from 'react';
import { Transaction, NewTransaction, TransactionFilters, Discount } from '../types/transaction';
import { fetchTransactions, createTransaction, validateDiscountCode, cancelTransaction } from '../services/transactionService';
import toast from 'react-hot-toast';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);

  const loadTransactions = useCallback(async (filters?: TransactionFilters) => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions(filters);
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: NewTransaction) => {
    try {
      setIsLoading(true);
      const newTransaction = await createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaction completed successfully');
      return newTransaction;
    } catch (error) {
      toast.error('Failed to create transaction');
      console.error('Error creating transaction:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyDiscount = useCallback(async (code: string) => {
    try {
      const discount = await validateDiscountCode(code);
      setCurrentDiscount(discount);
      toast.success('Discount applied successfully');
      return discount;
    } catch (error) {
      toast.error('Invalid discount code');
      console.error('Error applying discount:', error);
      throw error;
    }
  }, []);

  const removeDiscount = useCallback(() => {
    setCurrentDiscount(null);
  }, []);

  const handleCancelTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true);
      const cancelledTransaction = await cancelTransaction(transactionId);
      setTransactions(prev => 
        prev.map(t => t._id === transactionId ? cancelledTransaction : t)
      );
      toast.success('Transaction cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel transaction');
      console.error('Error cancelling transaction:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    isLoading,
    currentDiscount,
    loadTransactions,
    addTransaction,
    applyDiscount,
    removeDiscount,
    handleCancelTransaction,
  };
} 