import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';

export class AIController {
  public async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
      }

      const insights = await aiService.getStockInsights((symbol as string).toUpperCase());
      res.status(200).json(insights);
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
