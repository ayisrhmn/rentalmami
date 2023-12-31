import express from 'express';
import { AuthController } from '../controllers';

const router = express.Router();

router.get('/login', AuthController.login);

export default router;
