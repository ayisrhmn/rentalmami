import express from 'express';
import { UnitController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/units', isLogin, UnitController.gets);
router.get('/units/:id', isLogin, UnitController.get);
router.post('/units', isLogin, UnitController.create);
router.put('/units/:id', isLogin, UnitController.update);
router.delete('/units/:id', isLogin, UnitController.delete);

export default router;
