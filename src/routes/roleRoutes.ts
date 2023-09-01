import express from 'express';
import { RoleController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/roles', isLogin, RoleController.gets);
router.get('/roles/:id', isLogin, RoleController.get);
router.post('/roles', isLogin, RoleController.create);
router.put('/roles/:id', isLogin, RoleController.update);
router.delete('/roles/:id', isLogin, RoleController.delete);

export default router;
