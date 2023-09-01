import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcryptjs';
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
        where: { login_id: id },
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
      await body('login_id')
        .notEmpty()
        .isString()
        .isLength({ min: 6 })
        .withMessage('Login ID must be at least 6 characters')
        .run(req);
      await body('display_name').notEmpty().isString().run(req);
      await body('email').notEmpty().isEmail().run(req);
      await body('password')
        .notEmpty()
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .run(req);
      await body('is_active').notEmpty().isBoolean().run(req);
      await body('roles').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const newItem = req.body;
      await User.create({
        ...newItem,
        password: bcrypt.hashSync(newItem.password, 10),
      });

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
      await body('display_name').notEmpty().isString().run(req);
      await body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .run(req);
      await body('is_active').notEmpty().isBoolean().run(req);
      await body('roles').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { display_name, password, is_active, roles } = req.body;

      const objPayload =
        password && password.length > 0
          ? {
              display_name,
              password: bcrypt.hashSync(password, 10),
              is_active,
              roles,
            }
          : { display_name, is_active, roles };

      const updatedItem = await User.update(
        { ...objPayload },
        {
          where: { login_id: id },
        },
      );

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
        where: { login_id: id },
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
