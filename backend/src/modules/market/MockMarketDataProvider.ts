import { IMarketDataProvider, StockData } from './IMarketDataProvider';

const INITIAL_STOCKS: StockData[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2900.50, change: 0, changePercent: 0, isUp: true, volume: 1500000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3950.88, change: 0, changePercent: 0, isUp: true, volume: 1200000 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1420.28, change: 0, changePercent: 0, isUp: true, volume: 2500000 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.34, change: 0, changePercent: 0, isUp: true, volume: 3100000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1120.68, change: 0, changePercent: 0, isUp: true, volume: 900000 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 810.15, change: 0, changePercent: 0, isUp: true, volume: 1800000 },
];

export class MockMarketDataProvider implements IMarketDataProvider {
  private stocks: Map<string, StockData>;

  constructor() {
    this.stocks = new Map();
    INITIAL_STOCKS.forEach(stock => this.stocks.set(stock.symbol, stock));
  }

  public async initialize(): Promise<void> {
    console.log('[MockMarketDataProvider] Initialized');
  }

  public async fetchLatestPrices(symbols: string[]): Promise<StockData[]> {
    const results: StockData[] = [];
    
    for (const symbol of symbols) {
      let stock = this.stocks.get(symbol);
      if (!stock) continue;

      // Simulate a price tick for some subset of stocks, or all of them.
      // To simulate real market variance, we'll tick them all randomly.
      const volatility = 0.005; 
      const movement = stock.price * volatility * (Math.random() - 0.5);
      
      const newPrice = Math.max(0.01, stock.price + movement);
      const newChange = stock.change + movement;
      const originalPrice = stock.price - stock.change;
      const newChangePercent = (newChange / originalPrice) * 100;

      const updatedStock = {
        ...stock,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
        isUp: newChange >= 0,
        volume: stock.volume + Math.floor(Math.random() * 5000),
      };

      this.stocks.set(symbol, updatedStock);
      results.push(updatedStock);
    }

    return results;
  }

  public async shutdown(): Promise<void> {
    console.log('[MockMarketDataProvider] Shut down');
  }
}
