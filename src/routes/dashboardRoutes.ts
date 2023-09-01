import express from 'express';
import { DashboardController } from '../controllers';

const router = express.Router();

router.get('/overview', DashboardController.overview);

export default router;
