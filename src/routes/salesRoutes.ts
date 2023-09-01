import express from 'express';
import { SalesController } from '../controllers';

const router = express.Router();

router.get('/sales', SalesController.gets);
router.get('/sales/:id', SalesController.get);
router.post('/sales', SalesController.create);
router.put('/sales/:id', SalesController.update);
router.delete('/sales/:id', SalesController.delete);

export default router;
