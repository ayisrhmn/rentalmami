import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app.config';
import { User } from '../models';

class AuthMiddleware {
  async isLogin(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token: string = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = jwt.verify(token, appConfig.secretKey);
      const user = await User.findOne({
        where: { login_id: data.user.login_id },
      });

      if (!user) {
        throw new Error();
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      res.status(401).json({
        message: 'Not authorized to access this resources.',
      });
    }
  }
}

export default new AuthMiddleware();
