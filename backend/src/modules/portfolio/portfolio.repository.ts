import { prisma } from '../../config/db';

export class PortfolioRepository {
  public async upsertHolding(userId: string, symbol: string, quantity: number, averagePrice: number) {
    return prisma.portfolio.upsert({
      where: {
        userId_symbol: {
          userId,
          symbol
        }
      },
      update: {
        quantity: { increment: quantity },
        averagePrice // Note: In a real app, calculate true moving average. Simplified for demo.
      },
      create: {
        userId,
        symbol,
        quantity,
        averagePrice
      }
    });
  }

  public async getHoldingsByUserId(userId: string) {
    return prisma.portfolio.findMany({
      where: { userId }
    });
  }
}

export const portfolioRepository = new PortfolioRepository();
