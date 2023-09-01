import express from 'express';
import { PurchaseController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/purchases', isLogin, PurchaseController.gets);
router.get('/purchases/:id', isLogin, PurchaseController.get);
router.post('/purchases', isLogin, PurchaseController.create);
router.put('/purchases/:id', isLogin, PurchaseController.update);
router.delete('/purchases/:id', isLogin, PurchaseController.delete);

export default router;
