import { X, Settings, Shield, Bell, Palette } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const user = useAuthStore(state => state.user);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
              <Settings className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Account Settings</h2>
              <p className="text-sm text-slate-400">Manage your profile and preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.email?.split('@')[0] || ''} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} /> App Preferences
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div>
                <p className="font-medium text-slate-200">Dark Theme</p>
                <p className="text-sm text-slate-400">Use dark mode interface</p>
              </div>
              <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </section>

          <hr className="border-slate-800" />

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bell size={16} /> Notification Settings
            </h3>
            
            <div className="space-y-3">
              {[
                { title: 'Price Alerts', desc: 'Receive notifications when targets are hit', active: true },
                { title: 'Weekly Summary', desc: 'Email report of your portfolio performance', active: false },
                { title: 'Security Alerts', desc: 'Get notified of new logins', active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-200">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.active ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
