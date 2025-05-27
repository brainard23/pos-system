import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product';
import { protect as auth } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minStock').isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  body('supplier').notEmpty().withMessage('Supplier is required'),
  body('unit').isIn(['piece', 'kg', 'g', 'l', 'ml', 'box', 'pack']).withMessage('Invalid unit'),
];

// Get all products with pagination and search
router.get('/', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/', [auth, validateProduct], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      name,
      description,
      sku,
      barcode,
      category,
      price,
      cost,
      stock,
      minStock,
      supplier,
      unit,
    } = req.body;

    // Check if product with SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      res.status(400).json({ message: 'Product with this SKU already exists' });
      return;
    }

    // Check if product with barcode already exists (if provided)
    if (barcode) {
      const existingBarcode = await Product.findOne({ barcode });
      if (existingBarcode) {
        res.status(400).json({ message: 'Product with this barcode already exists' });
        return;
      }
    }

    const product = new Product({
      name,
      description,
      sku,
      barcode,
      category,
      price,
      cost,
      stock,
      minStock,
      supplier,
      unit,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

export default router; 