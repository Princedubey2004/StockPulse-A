import { create } from 'zustand';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
}

interface StockStore {
  activeStock: Stock;
  setActiveStock: (stock: Stock) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  activeStock: { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2900.50 },
  setActiveStock: (stock) => set({ activeStock: stock }),
}));
