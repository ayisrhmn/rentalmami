import { Request, Response } from 'express';
import {
  Unit,
  PurchaseHeader,
  PurchaseDetail,
  SalesHeader,
  SalesDetail,
} from '../models';

interface ErrorType {
  message: string;
}

class PurchaseController {
  async overview(_req: Request, res: Response): Promise<void> {
    try {
      const total_units = await Unit.count();

      const units = await Unit.findAll();
      const unitsWithStock = await Promise.all(
        units.map(async (unit) => {
          const totalPurchase = await PurchaseDetail.sum('qty', {
            where: { units: unit.id },
          });
          const totalSales = await SalesDetail.sum('qty', {
            where: { units: unit.id },
          });
          return {
            ...unit.toJSON(),
            stock: totalPurchase - totalSales || 0,
          };
        }),
      );
      const total_stock = unitsWithStock.reduce((accumulator, unit) => {
        return accumulator + unit.stock;
      }, 0);

      const total_purchases = await PurchaseHeader.sum('grand_total');
      const total_sales = await SalesHeader.sum('grand_total');

      const overviewRes = [
        {
          title: 'Total Units',
          total: total_units || 0,
        },
        {
          title: 'Total Stock of Units',
          total: total_stock || 0,
        },
        {
          title: 'Total Purchases',
          total: total_purchases || 0,
        },
        {
          title: 'Total Sales',
          total: total_sales || 0,
        },
      ];

      res.status(200).json(overviewRes);
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while fetching the item.',
      });
    }
  }
}

export default new PurchaseController();
