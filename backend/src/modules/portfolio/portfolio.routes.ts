import { Router } from 'express';
import { portfolioController } from './portfolio.controller';
import { validate } from '../../middleware/validate';
import { addHoldingSchema } from './portfolio.validation';

const router = Router();

router.post('/', validate(addHoldingSchema), portfolioController.addHolding);
router.get('/', portfolioController.getPortfolio);

export default router;
