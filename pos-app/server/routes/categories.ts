import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Category from '../models/Category';
import { protect as auth } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters long'),
];

// Get all categories
router.get('/', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Create category
router.post('/', [auth, validateCategory], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, description, parent } = req.body;

    // Check if category with name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ message: 'Category with this name already exists' });
      return;
    }

    const category = new Category({
      name,
      description,
      parent: parent || null
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

export default router; 