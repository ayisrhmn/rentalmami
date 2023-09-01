import express from 'express';
import { DashboardController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/overview', isLogin, DashboardController.overview);

export default router;
