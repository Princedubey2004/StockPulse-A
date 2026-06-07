import { Router } from 'express';
import { aiController } from './ai.controller';

const router = Router();

router.get('/insights/:symbol', aiController.getInsights);

export default router;
