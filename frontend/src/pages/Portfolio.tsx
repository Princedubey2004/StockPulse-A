import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { PortfolioAnalytics } from '../components/portfolio/PortfolioAnalytics';
import { Card } from '../components/ui/Card';
import { Plus } from 'lucide-react';

export function Portfolio() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setHoldings(data);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity, averagePrice })
      });
      if (response.ok) {
        setSymbol('');
        setQuantity('');
        setAveragePrice('');
        setShowAddForm(false);
        fetchPortfolio();
      }
    } catch (err) {
      console.error('Failed to add holding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <header className="mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio Management</h1>
            <p className="text-slate-400">Track positions, profit/loss, and analyze your asset allocation.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <Plus size={16} /> Add Holding
          </button>
        </header>

        {showAddForm && (
          <Card className="bg-slate-900 border-indigo-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Position</h3>
            <form onSubmit={handleAddHolding} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Symbol</label>
                <input 
                  type="text" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. RELIANCE"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
                <input 
                  type="number" 
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-1">Average Price ($)</label>
                <input 
                  type="number" 
                  step="any"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(e.target.value)}
                  placeholder="e.g. 150.50"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-full sm:w-auto">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Position'}
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Existing Analytics Component. 
            In a real app, we would pass 'holdings' to PortfolioAnalytics to dynamically generate the charts.
            Since PortfolioAnalytics currently uses static mock data for visually appealing charts, 
            we will render the user's holdings list below it to demonstrate the CRUD functionality.
        */}
        <PortfolioAnalytics />

        {holdings.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Positions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-xs uppercase bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Asset</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Avg Price</th>
                    <th className="px-6 py-3 rounded-tr-lg">Invested Value</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-medium text-white">{h.symbol}</td>
                      <td className="px-6 py-4">{h.quantity}</td>
                      <td className="px-6 py-4">${Number(h.averagePrice).toFixed(2)}</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">${(Number(h.quantity) * Number(h.averagePrice)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
