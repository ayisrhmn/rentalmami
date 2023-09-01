import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { User } from '../models';

interface ErrorType {
  message: string;
}

class UserController {
  async gets(req: Request, res: Response): Promise<void> {
    try {
      const { is_dev } = req.body;

      const items = await User.findAll();
      const filtered = items.filter((item) => item.roles !== 'developer');

      res.status(200).json(is_dev ? items : filtered);
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
      const item = await User.findOne({
        where: { id },
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
      await body('username').notEmpty().isString().run(req);
      await body('display_name').notEmpty().isString().run(req);
      await body('email').notEmpty().isString().run(req);
      await body('is_active').notEmpty().isBoolean().run(req);
      await body('roles').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const newItem = req.body;
      await User.create(newItem);

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
      await body('username').notEmpty().isString().run(req);
      await body('display_name').notEmpty().isString().run(req);
      await body('email').notEmpty().isString().run(req);
      await body('is_active').notEmpty().isBoolean().run(req);
      await body('roles').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;

      const updatedItem = await User.update(req.body, {
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
      const deletedCount = await User.destroy({
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

export default new UserController();
