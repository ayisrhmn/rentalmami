import express from 'express';
import { UserController } from '../controllers';
import { AuthMiddleware } from '../middleware';

const router = express.Router();
const { isLogin } = AuthMiddleware;

router.get('/users', isLogin, UserController.gets);
router.get('/users/:id', isLogin, UserController.get);
router.post('/users', isLogin, UserController.create);
router.put('/users/:id', isLogin, UserController.update);
router.delete('/users/:id', isLogin, UserController.delete);

export default router;
