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
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 10;
    // const search = req.query.search as string || '';

    // const query = search
    //   ? {
    //       $or: [
    //         { name: { $regex: search, $options: 'i' } },
    //         { sku: { $regex: search, $options: 'i' } },
    //         { description: { $regex: search, $options: 'i' } },
    //       ],
    //     }
    //   : {};

    const total = await Product.countDocuments();
    // const products = await Product.find(query)
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    res.json({
    //   products,
    //   currentPage: page,
    //   totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};