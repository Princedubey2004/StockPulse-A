import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { socket } from '../../services/socket';
import { useStockStore } from '../../store/useStockStore';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRealisticMockData } from '../../utils/mockChartData';

const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function StockChart() {
  const activeStock = useStockStore(state => state.activeStock);
  const [activeRange, setActiveRange] = useState('1D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(activeStock.price);
  const [priceChange, setPriceChange] = useState({ diff: 0, percent: 0, isUp: true });

  useEffect(() => {
    // Reset price state when stock changes
    setCurrentPrice(activeStock.price);
    setPriceChange({ diff: 0, percent: 0, isUp: true });
    setChartData(generateRealisticMockData(activeStock.symbol, activeRange));
  }, [activeStock, activeRange]);

  useEffect(() => {
    // Listen for live updates
    const handlePriceUpdate = (data: any) => {
      if (data && data.symbol === activeStock.symbol) {
        setCurrentPrice(data.price);
        setPriceChange({
          diff: data.change,
          percent: data.changePercent,
          isUp: data.isUp
        });
        
        // Add new data point
        setChartData(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            price: data.price
          }];
          return newData;
        });
      }
    };

    socket.on('price_update', handlePriceUpdate);
    socket.emit('subscribe_stock', activeStock.symbol);

    return () => {
      socket.off('price_update', handlePriceUpdate);
      socket.emit('unsubscribe_stock', activeStock.symbol);
    };
  }, [activeStock.symbol]);

  return (
    <Card className="col-span-full lg:col-span-2 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStock.symbol}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{activeStock.name} ({activeStock.symbol})</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-white">₹{currentPrice.toFixed(2)}</span>
                <span className={`font-medium ${priceChange.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {priceChange.isUp ? '+' : ''}{priceChange.diff.toFixed(2)} ({priceChange.percent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeRange === range
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={priceChange.isUp ? "#10b981" : "#f43f5e"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={priceChange.isUp ? "#10b981" : "#f43f5e"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  orientation="right"
                  dx={10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={priceChange.isUp ? "#10b981" : "#f43f5e"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
