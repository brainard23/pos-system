import { API_URL } from '../config';
import { Transaction, NewTransaction, TransactionFilters, Discount } from '../types/transaction';

/**
 * Fetches all transactions with optional filters
 * @param filters - Optional filters to apply to the transactions
 * @returns Promise containing array of transactions
 */
export async function fetchTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  // Ensure we fetch enough records for summary calculations
  if (!filters?.startDate && !filters?.endDate) {
    queryParams.set('page', '1');
    queryParams.set('limit', '1000');
  }
  if (filters?.startDate) queryParams.append('startDate', filters.startDate);
  if (filters?.endDate) queryParams.append('endDate', filters.endDate);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
  if (filters?.searchQuery) queryParams.append('search', filters.searchQuery);

  const response = await fetch(`${API_URL}/transactions?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch transactions');
  }

  const data = await response.json();
  // Normalize: backend may return { transactions, ...pagination }
  // or a raw array. Always return an array of Transaction.
  if (Array.isArray(data)) return data as Transaction[];
  if (Array.isArray(data?.transactions)) return data.transactions as Transaction[];
  return [];
}

/**
 * Creates a new transaction
 * @param transaction - The transaction data to create
 * @returns Promise containing the created transaction
 */
export async function createTransaction(transaction: NewTransaction): Promise<Transaction> {
  console.log('Creating transaction with data:', JSON.stringify(transaction, null, 2));
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Transaction creation failed:', error);
    throw new Error(error.message || 'Failed to create transaction');
  }

  return response.json();
}

/**
 * Validates a discount code
 * @param code - The discount code to validate
 * @returns Promise containing the discount if valid
 */
export async function validateDiscountCode(code: string): Promise<Discount> {
  const response = await fetch(`${API_URL}/transactions/validate-discount`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid discount code');
  }

  return response.json();
}

/**
 * Cancels a transaction
 * @param transactionId - The ID of the transaction to cancel
 * @returns Promise containing the cancelled transaction
 */
export async function cancelTransaction(transactionId: string): Promise<Transaction> {
  const response = await fetch(`${API_URL}/transactions/${transactionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel transaction');
  }

  return response.json();
} 