import express from 'express';
import { SalesController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/sales', isLogin, SalesController.gets);
router.get('/sales/:id', isLogin, SalesController.get);
router.post('/sales', isLogin, SalesController.create);
router.put('/sales/:id', isLogin, SalesController.update);
router.delete('/sales/:id', isLogin, SalesController.delete);

export default router;
