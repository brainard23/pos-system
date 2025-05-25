import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required']
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
categorySchema.index({ name: 'text' });
categorySchema.index({ parent: 1 });

export default mongoose.model<ICategory>('Category', categorySchema); 