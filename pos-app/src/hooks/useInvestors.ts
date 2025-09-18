import { useState, useCallback } from 'react';
import { createInvestor, fetchInvestors, fetchInvestorPerformance, updateInvestorById, deleteInvestorById, Investor, NewInvestor } from '../services/investorService';
import toast from 'react-hot-toast';

export function useInvestors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [performance, setPerformance] = useState<Array<Investor & { monthlyPayment: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadInvestors = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchInvestors();
      setInvestors(data);
    } catch (e) {
      toast.error('Failed to load investors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPerformance = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchInvestorPerformance();
      setPerformance(data);
    } catch (e) {
      toast.error('Failed to load performance');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addInvestor = useCallback(async (payload: NewInvestor) => {
    try {
      setIsLoading(true);
      const created = await createInvestor(payload);
      setInvestors(prev => [created, ...prev]);
      toast.success('Investor added');
    } catch (e) {
      toast.error('Failed to add investor');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editInvestor = useCallback(async (id: string, payload: Partial<NewInvestor>) => {
    try {
      setIsLoading(true);
      const updated = await updateInvestorById(id, payload);
      setInvestors(prev => prev.map(i => i._id === id ? updated : i));
      toast.success('Investor updated');
    } catch (e) {
      toast.error('Failed to update investor');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeInvestor = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await deleteInvestorById(id);
      setInvestors(prev => prev.filter(i => i._id !== id));
      toast.success('Investor deleted');
    } catch (e) {
      toast.error('Failed to delete investor');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { investors, performance, isLoading, loadInvestors, loadPerformance, addInvestor, editInvestor, removeInvestor };
}


