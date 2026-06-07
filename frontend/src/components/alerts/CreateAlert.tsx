import { useState } from 'react';
import { Card } from '../ui/Card';
import { BellRing, CheckCircle2 } from 'lucide-react';

export function CreateAlert() {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [condition, setCondition] = useState('ABOVE');
  const [price, setPrice] = useState('3000');
  const [notifyWeb, setNotifyWeb] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          condition,
          targetPrice: parseFloat(price)
        })
      });

      if (!response.ok) throw new Error('Failed to create alert');
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4 border-[#2A2E3D]">
      <div className="flex items-center gap-2 mb-2">
        <BellRing size={20} className="text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">Set Alert</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Stock Symbol */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Stock</label>
          <input 
            type="text" 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-[#151822] border border-[#2A2E3D] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
          <div className="flex items-center gap-2">
            <select 
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="bg-[#151822] border border-[#2A2E3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ABOVE">Price &gt;</option>
              <option value="BELOW">Price &lt;</option>
            </select>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-slate-400">₹</span>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#151822] border border-[#2A2E3D] rounded-lg pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Notify Channels */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Notify</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyWeb}
                onChange={(e) => setNotifyWeb(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Web</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Email</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {loading ? 'Creating...' : success ? <><CheckCircle2 size={18} /> Created</> : 'Create Alert'}
        </button>
      </form>
    </Card>
  );
}
