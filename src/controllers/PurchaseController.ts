import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { PurchaseHeader, PurchaseDetail, Unit } from '../models';

interface DetailItem {
  id: string;
  qty: number;
  purchase_price: number;
  total: number;
  units: string;
}

interface ErrorType {
  message: string;
}

class PurchaseController {
  async gets(_req: Request, res: Response): Promise<void> {
    try {
      const items = await PurchaseHeader.findAll({
        include: [
          {
            model: PurchaseDetail,
            as: 'details',
            attributes: { exclude: ['purchase_headers', 'units'] },
            include: [
              {
                model: Unit,
                as: 'detail_unit',
                attributes: { exclude: ['price', 'created_at', 'updated_at'] },
              },
            ],
          },
        ],
      });

      res.status(200).json(items);
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while fetching the item.',
      });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await PurchaseHeader.findOne({
        where: { id },
        include: [
          {
            model: PurchaseDetail,
            as: 'details',
            attributes: { exclude: ['purchase_headers', 'units'] },
            include: [
              {
                model: Unit,
                as: 'detail_unit',
                attributes: { exclude: ['price', 'created_at', 'updated_at'] },
              },
            ],
          },
        ],
      });

      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while fetching the item.',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      // validation purchase headers
      await body('header.trx_code').isString().run(req);
      await body('header.supplier').notEmpty().isString().run(req);
      await body('header.supplier_address').notEmpty().isString().run(req);
      await body('header.trx_date').notEmpty().isDate().run(req);
      await body('header.trx_due_date').optional().run(req);
      await body('header.paid_off').notEmpty().isBoolean().run(req);
      await body('header.grand_total').notEmpty().isInt().run(req);

      // validation purchase details
      await body('details.*.qty').notEmpty().isInt().run(req);
      await body('details.*.purchase_price').notEmpty().isInt().run(req);
      await body('details.*.total').notEmpty().isInt().run(req);
      await body('details.*.units').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { header, details } = req.body;

      const newHeader = await PurchaseHeader.create(header);
      const detailItems = details.map((item: DetailItem) => ({
        ...item,
        purchase_headers: newHeader.id,
      }));
      await PurchaseDetail.bulkCreate(detailItems);

      res.status(201).json({ message: 'Item has been created successfully.' });
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while creating the item.',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      // validation purchase headers
      await body('header.trx_code').isString().run(req);
      await body('header.supplier').notEmpty().isString().run(req);
      await body('header.supplier_address').notEmpty().isString().run(req);
      await body('header.trx_date').notEmpty().isDate().run(req);
      await body('header.trx_due_date').optional().run(req);
      await body('header.paid_off').notEmpty().isBoolean().run(req);
      await body('header.grand_total').notEmpty().isInt().run(req);

      // validation purchase details
      await body('details.*.qty').notEmpty().isInt().run(req);
      await body('details.*.purchase_price').notEmpty().isInt().run(req);
      await body('details.*.total').notEmpty().isInt().run(req);
      await body('details.*.units').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { header, details } = req.body;

      const updatedHeader = await PurchaseHeader.update(header, {
        where: { id: id },
      });

      if (updatedHeader[0] === 1) {
        const existingDetails = await PurchaseDetail.findAll({
          where: { purchase_headers: id },
        });

        const updatedPromises = details.map(async (item: DetailItem) => {
          const existingDetail = existingDetails.find(
            (detail) => detail.id === item.id,
          );

          if (existingDetail) {
            await PurchaseDetail.update(
              {
                qty: item.qty,
                purchase_price: item.purchase_price,
                total: item.total,
                units: item.units,
              },
              {
                where: { id: item.id },
              },
            );
          } else {
            await PurchaseDetail.create({
              ...item,
              purchase_headers: id,
            });
          }
        });

        await Promise.all(updatedPromises);

        const detailIdsInRequest = details.map((item: DetailItem) => item.id);
        const detailIdsInDatabase = existingDetails.map((detail) => detail.id);

        const detailIdsToDelete = detailIdsInDatabase.filter(
          (detailId) => !detailIdsInRequest.includes(detailId),
        );

        if (detailIdsToDelete.length > 0) {
          await PurchaseDetail.destroy({
            where: { id: detailIdsToDelete },
          });
        }

        res
          .status(200)
          .json({ message: 'Item has been updated successfully.' });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while updating the item.',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await PurchaseDetail.destroy({ where: { purchase_headers: id } });

      const deletedHeaderCount = await PurchaseHeader.destroy({
        where: { id: id },
      });

      if (deletedHeaderCount > 0) {
        res
          .status(200)
          .json({ message: 'Item has been deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while deleting the item.',
      });
    }
  }
}

export default new PurchaseController();
