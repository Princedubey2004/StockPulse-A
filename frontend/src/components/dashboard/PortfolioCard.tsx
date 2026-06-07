import { Card } from '../ui/Card';
import { TrendingUp, Briefcase } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

const portfolioHistory = [
  { value: 110000 }, { value: 112000 }, { value: 118000 }, { value: 115000 }, { value: 120000 }, { value: 124500 }
];

const pnlHistory = [
  { value: 400 }, { value: 600 }, { value: -200 }, { value: 800 }, { value: 1100 }, { value: 1240.5 }
];

const buyingPowerHistory = [
  { value: 15000 }, { value: 14000 }, { value: 12000 }, { value: 13000 }, { value: 12450 }, { value: 12450 }
];

export function PortfolioCard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col gap-2 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 relative z-10">
          <span className="text-sm font-medium">Total Portfolio</span>
          <Briefcase size={16} />
        </div>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-bold tracking-tight text-white">124,500.00</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-500 relative z-10 mt-1">
          <TrendingUp size={14} />
          <span className="font-medium">+2.5%</span>
          <span className="text-slate-500">vs last month</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioHistory}>
              <defs>
                <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPort)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex flex-col gap-2 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 relative z-10">
          <span className="text-sm font-medium">Daily P&L</span>
          <ActivityIcon />
        </div>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-bold tracking-tight text-emerald-400">+1,240.50</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-500 relative z-10 mt-1">
          <TrendingUp size={14} />
          <span className="font-medium">+1.01%</span>
          <span className="text-slate-500">today</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlHistory}>
              <defs>
                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPnL)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex flex-col gap-2 relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 relative z-10">
          <span className="text-sm font-medium">Buying Power</span>
          <WalletIcon />
        </div>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-bold tracking-tight text-white">12,450.00</span>
        </div>
        <div className="text-sm text-slate-500 relative z-10 mt-1">Available for trading</div>
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-50 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={buyingPowerHistory}>
              <defs>
                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
              <Area type="stepAfter" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 bg-indigo-900/20 border-indigo-500/20">
        <div className="flex items-center justify-between text-indigo-300">
          <span className="text-sm font-medium">AI Market Insight</span>
          <BrainIcon />
        </div>
        
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Sentiment:</span>
            <span className="font-semibold text-emerald-400">Bullish</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Confidence:</span>
            <span className="font-semibold text-indigo-400">84%</span>
          </div>
        </div>

        <div className="space-y-2 mt-1">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Key Drivers:</div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Strong IT earnings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Positive market breadth</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Institutional buying activity</span>
            </li>
          </ul>
        </div>

        <div className="text-xs text-slate-500 mt-auto pt-2">
          Generated 2 mins ago
        </div>
      </Card>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  )
}

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
  )
}

function BrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>
  )
}
