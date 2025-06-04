export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: {
    _id: string;
    name: string;
    description: string;
  };
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  unit: string;
  isActive: boolean;
}

export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  parent?: string;
  isActive: boolean;
}

export interface NewSupplier {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface NewCategory {
  name: string;
  description: string;
  parent?: string;
}

export interface NewProduct {
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: string;
  price: string;
  cost: number;
  stock: string;
  minStock: string;
  supplier: string;
  unit: string;
} 