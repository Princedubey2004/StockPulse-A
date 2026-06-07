import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useStockStore, type Stock } from '../../store/useStockStore';

const STOCK_DATASET: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2900.50 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3950.88 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1420.28 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.34 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1120.68 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 810.15 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1150.20 },
  { symbol: 'ITC', name: 'ITC Limited', price: 420.75 },
  { symbol: 'L&T', name: 'Larsen & Toubro', price: 3500.40 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 7200.10 },
];

const TRENDING_STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2900.50 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3950.88 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.34 },
];

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Stock[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const setActiveStock = useStockStore(state => state.setActiveStock);

  useEffect(() => {
    // Load recent searches from local storage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
  }, []);

  useEffect(() => {
    // Click outside to close
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStock = (stock: Stock) => {
    // Add to recent searches
    const updatedRecents = [stock, ...recentSearches.filter(s => s.symbol !== stock.symbol)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecents));
    
    // Set active stock in Zustand
    setActiveStock(stock);

    setQuery('');
    setIsOpen(false);
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-indigo-400 font-bold bg-indigo-500/10 px-0.5 rounded">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const filteredStocks = STOCK_DATASET.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
    stock.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`block w-full border border-slate-700 bg-slate-900 py-2 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isOpen ? 'rounded-t-2xl' : 'rounded-full'}`}
          placeholder="Search stocks, indices..."
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-x border-b border-slate-700 bg-slate-900 shadow-2xl z-50 rounded-b-2xl overflow-hidden max-h-[400px] flex flex-col">
          <div className="overflow-y-auto custom-scrollbar">
            
            {/* Empty Query State (Trending & Recent) */}
            {!query && (
              <div className="p-2 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <Clock size={14} />
                        Recent Searches
                      </div>
                      <button onClick={clearRecentSearches} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>
                    </div>
                    <div>
                      {recentSearches.map(stock => (
                        <div 
                          key={`recent-${stock.symbol}`}
                          onClick={() => handleSelectStock(stock)}
                          className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-slate-800/80 rounded-lg transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{stock.symbol}</span>
                            <span className="text-xs text-slate-400">{stock.name}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-300">₹{stock.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <TrendingUp size={14} className="text-emerald-500" />
                    Trending Stocks
                  </div>
                  <div>
                    {TRENDING_STOCKS.map(stock => (
                      <div 
                        key={`trending-${stock.symbol}`}
                        onClick={() => handleSelectStock(stock)}
                        className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-slate-800/80 rounded-lg transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{stock.symbol}</span>
                          <span className="text-xs text-slate-400">{stock.name}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-300">₹{stock.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stocks
                </div>
                {filteredStocks.length > 0 ? (
                  <div>
                    {filteredStocks.map(stock => (
                      <div 
                        key={`result-${stock.symbol}`}
                        onClick={() => handleSelectStock(stock)}
                        className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-slate-800/80 rounded-lg transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{getHighlightedText(stock.symbol, query)}</span>
                          <span className="text-xs text-slate-400">{getHighlightedText(stock.name, query)}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-300">₹{stock.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    No matching stocks found for "{query}"
                  </div>
                )}
              </div>
            )}

          </div>
          
          {/* Footer branding */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 text-[10px] text-center text-slate-500 uppercase tracking-widest">
            StockPulse Search
          </div>
        </div>
      )}
    </div>
  );
}
