import express from 'express';
import { PurchaseController } from '../controllers';

const router = express.Router();

router.get('/purchases', PurchaseController.gets);
router.get('/purchases/:id', PurchaseController.get);
router.post('/purchases', PurchaseController.create);
router.put('/purchases/:id', PurchaseController.update);
router.delete('/purchases/:id', PurchaseController.delete);

export default router;
