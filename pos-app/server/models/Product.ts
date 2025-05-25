import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: mongoose.Types.ObjectId;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 0
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['piece', 'kg', 'g', 'l', 'ml', 'box', 'pack']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text', sku: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });

export default mongoose.model<IProduct>('Product', productSchema); 