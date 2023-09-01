import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app.config';
import { User } from '../models';

interface ErrorType {
  message: string;
}

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { login_id, password } = req.body;

      User.findOne({ where: { login_id } })
        .then((user) => {
          if (user) {
            const checkPassword = bcrypt.compareSync(password, user.password);

            if (checkPassword) {
              const token = jwt.sign(
                {
                  user: {
                    login_id: user.login_id,
                    display_name: user.display_name,
                    email: user.email,
                    roles: user.roles,
                  },
                },
                appConfig.secretKey,
                { expiresIn: '1d' },
              );

              res.status(200).json({ message: 'success', data: { token } });
            } else {
              res.status(403).json({ message: 'Your Password is wrong' });
            }
          } else {
            res.status(403).json({ message: 'Your Login ID is not found' });
          }
        })
        .catch((err) => {
          const error = err as ErrorType;
          res.status(500).json({
            message: error.message
              ? error.message
              : 'An error occurred while login.',
          });

          next();
        });
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while login.',
      });
    }
  }
}

export default new AuthController();
