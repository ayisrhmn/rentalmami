import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { Unit, PurchaseDetail } from '../models';

interface ErrorType {
  message: string;
}

class UnitController {
  async gets(_req: Request, res: Response): Promise<void> {
    try {
      const items = await Unit.findAll();
      const unitsWithStock = await Promise.all(
        items.map(async (unit) => {
          const totalStock = await PurchaseDetail.sum('qty', {
            where: { units: unit.id },
          });
          return {
            ...unit.toJSON(),
            stock: totalStock || 0,
          };
        }),
      );

      res.status(200).json(unitsWithStock);
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
      const item = await Unit.findOne({
        where: { id },
      });
      const totalStock = await PurchaseDetail.sum('qty', {
        where: { units: id },
      });

      if (item) {
        res.status(200).json({
          ...item.toJSON(),
          stock: totalStock || 0,
        });
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
      await body('unit_code').isString().run(req);
      await body('unit_name').notEmpty().isString().run(req);
      await body('description').isString().run(req);
      await body('price').notEmpty().isInt().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const newItem = req.body;
      await Unit.create(newItem);

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
      await body('unit_code').isString().run(req);
      await body('unit_name').notEmpty().isString().run(req);
      await body('description').isString().run(req);
      await body('price').notEmpty().isInt().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const newItem = req.body;
      const updatedItem = await Unit.update(newItem, {
        where: { id },
      });

      if (updatedItem[0] === 1) {
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
      const deletedCount = await Unit.destroy({
        where: { id },
      });

      if (deletedCount === 1) {
        res.status(200).json({ message: 'Item deleted successfully' });
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

export default new UnitController();
