import express from 'express';
import { RoleController } from '../controllers';

const router = express.Router();

router.get('/roles', RoleController.gets);
router.get('/roles/:id', RoleController.get);
router.post('/roles', RoleController.create);
router.put('/roles/:id', RoleController.update);
router.delete('/roles/:id', RoleController.delete);

export default router;
