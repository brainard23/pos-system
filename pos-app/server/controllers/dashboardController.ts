import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Transaction from '../models/Transaction';

/**
 * Get all products with pagination and search
 * @param req Request object containing query parameters for pagination and search
 * @param res Response object
 * @param next NextFunction for error handling
 */
export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lowStockThreshold = 5;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const total = await Product.countDocuments();
    const lowStockItems = await Product.countDocuments({ stock: { $lt: lowStockThreshold } });
   const totalTransactions = await Transaction.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

        const sales = await Transaction.aggregate([
      {
        $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } }
      },
      {
        $group: { _id: null, totalSales: { $sum: "$total" } }
      }
    ]);

    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    console.log('Dashboard data: server', { totalTransactions, lowStockItems, total });
    res.json({
      totalSales: totalSales,
      totalTransactions: totalTransactions,
      lowStockItems: lowStockItems,
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};