import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Supplier from '../models/Supplier';
import { protect as auth } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateSupplier = [
  body('name').trim().notEmpty().withMessage('Supplier name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.country').trim().notEmpty().withMessage('Country is required'),
  body('address.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
];

// Get all suppliers
router.get('/', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
});

// Create supplier
router.post('/', [auth, validateSupplier], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, phone, address } = req.body;

    // Check if supplier with email already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      res.status(400).json({ message: 'Supplier with this email already exists' });
      return;
    }

    const supplier = new Supplier({
      name,
      email,
      phone,
      address
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
});

export default router; 