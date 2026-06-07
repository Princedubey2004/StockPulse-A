import { Layout } from '../components/layout/Layout';
import { PortfolioCard } from '../components/dashboard/PortfolioCard';
import { StockChart } from '../components/dashboard/StockChart';
import { Watchlist } from '../components/dashboard/Watchlist';
import { AIInsightPanel } from '../components/ai/AIInsightPanel';
import { PortfolioAnalytics } from '../components/portfolio/PortfolioAnalytics';
import { AlertPanel } from '../components/dashboard/AlertPanel';

export function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <header className="mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, here's your market overview.</p>
        </header>

        <PortfolioCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <StockChart />
            <AIInsightPanel />
          </div>
          <div className="flex flex-col gap-6">
            <Watchlist />
            <AlertPanel />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold tracking-tight text-white mb-4">Portfolio Analytics</h2>
          <PortfolioAnalytics />
        </div>
      </div>
    </Layout>
  );
}
