export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  volume: number;
}

export interface IMarketDataProvider {
  /**
   * Initialize the provider (e.g., connect to websockets or authenticate)
   */
  initialize(): Promise<void>;

  /**
   * Fetch the latest prices for a list of symbols
   */
  fetchLatestPrices(symbols: string[]): Promise<StockData[]>;

  /**
   * Shut down the provider cleanly
   */
  shutdown(): Promise<void>;
}
