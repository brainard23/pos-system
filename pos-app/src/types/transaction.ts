import { Product } from './product';

export type PaymentMethod = 'cash' | 'card' | 'credit_card';

export interface TransactionItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Discount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface Transaction {
  _id: string;
  items: TransactionItem[];
  subtotal: number;
  discount?: Discount;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface NewTransaction {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  discountCode?: string;
  paymentMethod: PaymentMethod;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  status?: Transaction['status'];
  paymentMethod?: PaymentMethod;
  searchQuery?: string;
} 