import express from 'express';
import { body } from 'express-validator';
import { protect as auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';

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

// Routes
router.get('/', auth, getSuppliers);
router.get('/:id', auth, getSupplier);
router.post('/', [auth, validate(validateSupplier)], createSupplier);
router.put('/:id', [auth, validate(validateSupplier)], updateSupplier);
router.delete('/:id', auth, deleteSupplier);

export default router; 