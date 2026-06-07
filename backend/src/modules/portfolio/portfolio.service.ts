import { portfolioRepository } from './portfolio.repository';
import { AppError } from '../../utils/AppError';
import { checkDbConnection } from '../../config/db';

export class PortfolioService {
  public async addHolding(userId: string, symbol: string, quantity: number, averagePrice: number) {
    const isDbConnected = await checkDbConnection();
    
    if (!isDbConnected) {
      console.warn('[PortfolioService] DB offline. Returning mock holding response.');
      return { id: 'mock-id', userId, symbol, quantity, averagePrice };
    }

    try {
      return await portfolioRepository.upsertHolding(userId, symbol.toUpperCase(), quantity, averagePrice);
    } catch (error) {
      throw new AppError('Database error while saving holding', 500);
    }
  }

  public async getPortfolio(userId: string) {
    const isDbConnected = await checkDbConnection();
    
    if (!isDbConnected) {
      return [
        { symbol: 'RELIANCE', quantity: 50, averagePrice: 2850.00 },
        { symbol: 'TCS', quantity: 30, averagePrice: 3800.00 },
        { symbol: 'INFY', quantity: 100, averagePrice: 1400.00 },
      ];
    }

    try {
      return await portfolioRepository.getHoldingsByUserId(userId);
    } catch (error) {
      throw new AppError('Database error while fetching portfolio', 500);
    }
  }
}

export const portfolioService = new PortfolioService();
