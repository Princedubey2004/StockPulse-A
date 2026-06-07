import { Response, NextFunction } from 'express';
import { alertService } from './alert.service';
import { AuthRequest } from '../../middleware/authMiddleware';

export class AlertController {
  public async createAlert(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { symbol, condition, targetPrice } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!symbol || !condition || !targetPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (condition !== 'ABOVE' && condition !== 'BELOW') {
        return res.status(400).json({ error: 'Condition must be ABOVE or BELOW' });
      }

      const alert = await alertService.createAlert(userId, symbol, condition, targetPrice);
      
      return res.status(201).json({ message: 'Alert created successfully', alert });
    } catch (error) {
      next(error);
    }
  }

  public async getUserAlerts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const alerts = await alertService.getUserAlerts(userId);
      
      return res.status(200).json(alerts);
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();
