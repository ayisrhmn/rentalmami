import express from 'express';
import { UserController } from '../controllers';

const router = express.Router();

router.get('/users', UserController.gets);
router.get('/users/:id', UserController.get);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

export default router;
