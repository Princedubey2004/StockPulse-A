import { useState } from 'react';
import { Card } from '../ui/Card';
import { Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStockStore } from '../../store/useStockStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';

export function AlertPanel() {
  const activeStock = useStockStore(state => state.activeStock);
  const { accessToken } = useAuthStore();
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<string>(activeStock.price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAlert = async () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid target price');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          symbol: activeStock.symbol,
          condition,
          targetPrice: price
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create alert');
      }

      toast.success(`Alert set for ${activeStock.symbol} ${condition.toLowerCase()} ₹${price.toFixed(2)}`);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Error setting alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col h-auto">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-indigo-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Set Alert</h3>
      </div>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Stock Symbol</label>
          <div className="text-sm font-semibold text-white bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            {activeStock.name} ({activeStock.symbol})
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Condition</label>
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setCondition('ABOVE')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                condition === 'ABOVE' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <ArrowUpRight size={14} /> Above
            </button>
            <button
              onClick={() => setCondition('BELOW')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                condition === 'BELOW' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <ArrowDownRight size={14} /> Below
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Target Price (₹)</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="block w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="e.g. 3000"
          />
        </div>
      </div>
      
      <button 
        onClick={handleCreateAlert}
        disabled={isSubmitting}
        className="mt-6 w-full py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Bell size={16} />
        {isSubmitting ? 'Saving...' : 'Create Alert'}
      </button>
    </Card>
  );
}
