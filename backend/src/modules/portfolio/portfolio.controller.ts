import { Request, Response, NextFunction } from 'express';
import { portfolioService } from './portfolio.service';

export class PortfolioController {
  public async addHolding(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol, quantity, averagePrice } = req.body;
      const userId = 'mock-user-123'; // Temporary until Auth

      const holding = await portfolioService.addHolding(userId, symbol, quantity, averagePrice);
      res.status(201).json({ message: 'Holding added successfully', holding });
    } catch (error) {
      next(error); // Pass to centralized error handler
    }
  }

  public async getPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = 'mock-user-123';
      const holdings = await portfolioService.getPortfolio(userId);
      res.status(200).json(holdings);
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
