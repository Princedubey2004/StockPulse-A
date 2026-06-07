import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { socket } from '../../services/socket';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
}

export function Watchlist() {
  const [watchlistData, setWatchlistData] = useState<StockData[]>([]);

  useEffect(() => {
    // Subscribe to general market overview which contains all stocks
    socket.emit('subscribe_market_overview');

    const handleMarketUpdate = (data: { all: StockData[] }) => {
      if (data && data.all) {
        setWatchlistData(data.all.slice(0, 6)); // show first 6
      }
    };

    socket.on('market_overview_update', handleMarketUpdate);

    return () => {
      socket.off('market_overview_update', handleMarketUpdate);
    };
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Watchlist</h3>
        <button className="text-slate-400 hover:text-slate-200 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
        {watchlistData.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4">Connecting to Live Market...</div>
        ) : (
          watchlistData.map((item) => (
            <div 
              key={item.symbol}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50"
            >
              <div>
                <div className="font-bold text-slate-200">{item.symbol}</div>
                <div className="text-xs text-slate-500 truncate max-w-[100px]">{item.name}</div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-slate-200">${item.price.toFixed(2)}</div>
                <div className={`text-xs flex items-center justify-end gap-1 ${item.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors">
        View All
      </button>
    </Card>
  );
}
