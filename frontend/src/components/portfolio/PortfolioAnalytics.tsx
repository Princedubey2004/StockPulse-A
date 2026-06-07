import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, Target } from 'lucide-react';

const SECTOR_DATA = [
  { name: 'Technology', value: 40, color: '#6366f1' },
  { name: 'Banking', value: 30, color: '#10b981' },
  { name: 'Energy', value: 15, color: '#f59e0b' },
  { name: 'FMCG', value: 15, color: '#ec4899' },
];

const ALLOCATION_DATA = [
  { name: 'RELIANCE', value: 30 },
  { name: 'TCS', value: 25 },
  { name: 'INFY', value: 15 },
  { name: 'HDFCBANK', value: 10 },
  { name: 'Others', value: 20 },
];

export function PortfolioAnalytics() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Key Metrics */}
      <Card className="flex flex-col gap-4 bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/20">
        <div className="flex items-center gap-2 text-indigo-400">
          <Activity size={20} />
          <h3 className="font-semibold text-white">Return Analytics</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-slate-400">Total Return (All Time)</div>
            <div className="text-2xl font-bold text-emerald-400">+24,500.00 (18.4%)</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Daily Return</div>
            <div className="text-xl font-semibold text-emerald-500">+1,240.50 (1.01%)</div>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert size={20} />
            <h3 className="font-semibold text-white">Risk Score</h3>
          </div>
          <div className="text-2xl font-bold text-white">6.8<span className="text-sm text-slate-500 font-normal">/10</span></div>
        </div>
        <p className="text-sm text-slate-400">
          Your portfolio exhibits a moderate-to-high risk profile, primarily driven by heavy exposure to the Technology sector.
        </p>
        <div className="mt-auto">
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 text-amber-400">
          <Target size={20} />
          <h3 className="font-semibold text-white">Sector Diversification</h3>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SECTOR_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {SECTOR_DATA.map((entry: { color: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {SECTOR_DATA.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-300">{s.name} ({s.value}%)</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Allocation Breakdown Chart */}
      <Card className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
        <h3 className="font-semibold text-white">Asset Allocation Breakdown</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ALLOCATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                formatter={(value: any) => [`${value}%`, 'Allocation']}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
