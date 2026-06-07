import { getIO } from '../../sockets/socketManager';
import { redisClient, marketPubClient } from '../../config/redis';
import { prisma, checkDbConnection } from '../../config/db';
import { IMarketDataProvider, StockData } from './IMarketDataProvider';
import { MockMarketDataProvider } from './MockMarketDataProvider';

export class MarketDataService {
  private provider: IMarketDataProvider;
  private updateInterval: NodeJS.Timeout | null = null;
  private snapshotInterval: NodeJS.Timeout | null = null;
  private symbols: string[];
  private isDbConnected: boolean = false;

  constructor(provider: IMarketDataProvider) {
    this.provider = provider;
    this.symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN'];
  }

  public async start() {
    console.log('[MarketDataService] Starting...');
    await this.provider.initialize();
    
    this.isDbConnected = await checkDbConnection();

    // Loop for real-time fetches and Redis caching
    this.updateInterval = setInterval(() => {
      this.tick();
    }, 2000);

    // Loop for historical snapshot persistence into Postgres
    this.snapshotInterval = setInterval(() => {
      this.saveHistoricalSnapshots();
    }, 60000); // Every 1 minute
  }

  public async stop() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (this.snapshotInterval) clearInterval(this.snapshotInterval);
    await this.provider.shutdown();
    console.log('[MarketDataService] Stopped.');
  }

  private async tick() {
    try {
      const latestPrices = await this.provider.fetchLatestPrices(this.symbols);

      const pipeline = redisClient.pipeline();
      
      for (const stock of latestPrices) {
        // Cache the latest tick
        pipeline.hset('market:prices', stock.symbol, JSON.stringify(stock));

        // Publish event for Alert System decoupled from the main loop
        marketPubClient.publish('market:price_updates', JSON.stringify({
          symbol: stock.symbol,
          price: stock.price
        })).catch(err => console.error('[MarketDataService] Pub/Sub publish error:', err));

        // Publish live updates to individual socket rooms
        try {
          const io = getIO();
          io.to(`stock:${stock.symbol}`).emit('stock_update', stock);
        } catch (e) {
          // Socket might not be ready
        }
      }

      await pipeline.exec();

      await this.broadcastOverview();
    } catch (error) {
      console.error('[MarketDataService] Error during tick', error);
    }
  }

  private async broadcastOverview() {
    try {
      const allStocksHash = await redisClient.hgetall('market:prices');
      const allStocks: StockData[] = Object.values(allStocksHash).map(val => JSON.parse(val));

      if (allStocks.length === 0) return;

      const sortedByPerformance = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);
      const topGainers = sortedByPerformance.slice(0, 3);
      const topLosers = sortedByPerformance.slice(-3).reverse();
      const mostActive = [...allStocks].sort((a, b) => b.volume - a.volume).slice(0, 3);

      try {
        const io = getIO();
        io.to('market_overview').emit('market_overview_update', {
          topGainers,
          topLosers,
          mostActive,
          all: allStocks
        });
      } catch (e) {}

    } catch (error) {
      console.error('[MarketDataService] Error broadcasting overview', error);
    }
  }

  private async saveHistoricalSnapshots() {
    if (!this.isDbConnected) return; // Skip silently if running without DB

    try {
      console.log('[MarketDataService] Saving historical snapshots to DB...');
      const allStocksHash = await redisClient.hgetall('market:prices');
      const allStocks: StockData[] = Object.values(allStocksHash).map(val => JSON.parse(val));

      if (allStocks.length === 0) return;

      const snapshotData = allStocks.map(stock => ({
        symbol: stock.symbol,
        price: stock.price,
        volume: stock.volume,
      }));

      await prisma.historicalPrice.createMany({
        data: snapshotData
      });

    } catch (error) {
      console.error('[MarketDataService] Error saving historical snapshots', error);
      // If it fails (e.g. database goes offline or schema missing), we disable DB to prevent spam
      this.isDbConnected = false;
    }
  }
}

// Export a singleton using the Mock provider for now.
export const marketService = new MarketDataService(new MockMarketDataProvider());
