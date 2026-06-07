import { X, CreditCard, CheckCircle2, Zap } from 'lucide-react';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BillingModal({ isOpen, onClose }: BillingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <CreditCard className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Billing & Subscription</h2>
              <p className="text-sm text-slate-400">Manage your Pro plan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-800/50 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Zap className="text-indigo-400/20 w-32 h-32 absolute -top-8 -right-8" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold tracking-wider uppercase mb-4">
                Current Plan
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">StockPulse Pro</h3>
              <p className="text-slate-400 mb-6">You are on the unlimited annual plan.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Billing Cycle</p>
                  <p className="font-semibold text-slate-200">Yearly</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Next Payment</p>
                  <p className="font-semibold text-slate-200">Oct 14, 2027</p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Payment Method</h3>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="bg-slate-700 rounded-md p-2 flex items-center justify-center w-12 h-8 border border-slate-600">
                  <span className="text-xs font-bold italic text-white">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-slate-200">Visa ending in 4242</p>
                  <p className="text-sm text-slate-400">Expires 12/28</p>
                </div>
              </div>
              <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">
                Update
              </button>
            </div>
          </section>

          <section className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Included in Pro</h3>
            {[
              'Unlimited real-time price alerts',
              'Advanced portfolio analytics',
              'Priority WebSocket connections',
              'Ad-free experience'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </section>

        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button 
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-lg border border-slate-700"
          >
            View Invoices
          </button>
        </div>

      </div>
    </div>
  );
}
