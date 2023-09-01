import express from 'express';
import { UnitController } from '../controllers';

const router = express.Router();

router.get('/units', UnitController.gets);
router.get('/units/:id', UnitController.get);
router.post('/units', UnitController.create);
router.put('/units/:id', UnitController.update);
router.delete('/units/:id', UnitController.delete);

export default router;
