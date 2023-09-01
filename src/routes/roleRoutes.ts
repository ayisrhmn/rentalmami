import express from 'express';
import { RoleController } from '../controllers';

const router = express.Router();

router.get('/roles', RoleController.gets);
router.get('/roles/:role_id', RoleController.get);
router.post('/roles', RoleController.create);
router.put('/roles/:role_id', RoleController.update);
router.delete('/roles/:role_id', RoleController.delete);

export default router;
