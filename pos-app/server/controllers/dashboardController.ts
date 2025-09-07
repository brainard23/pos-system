import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';

/**
 * Get all products with pagination and search
 * @param req Request object containing query parameters for pagination and search
 * @param res Response object
 * @param next NextFunction for error handling
 */
export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lowStockThreshold = 5;

    const total = await Product.countDocuments();
    const lowStockItems = await Product.countDocuments({ stock: { $lt: lowStockThreshold } });

    res.json({
      lowStockItems: lowStockItems,
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};