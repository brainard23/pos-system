import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxId?: string;
  paymentTerms: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    }
  },
  taxId: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    required: [true, 'Payment terms are required'],
    enum: ['immediate', 'net15', 'net30', 'net60']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
supplierSchema.index({ name: 'text', email: 'text' });
supplierSchema.index({ 'address.city': 1, 'address.country': 1 });

export default mongoose.model<ISupplier>('Supplier', supplierSchema); 