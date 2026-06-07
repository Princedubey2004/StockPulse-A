import { Router } from 'express';
import { alertController } from './alert.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, alertController.createAlert);
router.get('/', requireAuth, alertController.getUserAlerts);

export default router;
