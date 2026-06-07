import { useState, useRef, useEffect } from 'react';
import { Bell, User, Activity, Check, Trash2, Settings, CreditCard } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from './SettingsModal';
import { BillingModal } from './BillingModal';

export function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  
  const logoutAction = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = useNavigate();
  
  // Click outside handlers
  const navRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navRef]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    logoutAction();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    setShowProfile(false);
    setIsSettingsOpen(true);
  };

  const handleBillingClick = () => {
    setShowProfile(false);
    setIsBillingOpen(true);
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">StockPulse<span className="text-indigo-400">AI</span></span>
            </div>
            
            <GlobalSearch />

            <div className="flex items-center gap-4" ref={navRef}>
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden flex flex-col max-h-[400px]">
                    <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md">
                      <span className="font-semibold text-slate-200">Notifications</span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAll}
                          className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={12} /> Clear all
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                          <Bell size={24} className="text-slate-700" />
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-800">
                          {notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-4 flex gap-3 ${notif.read ? 'opacity-60' : 'bg-slate-800/30'}`}
                            >
                              <div className="flex-1">
                                <p className="text-sm text-slate-300">{notif.message}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {notif.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                              {!notif.read && (
                                <button 
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-indigo-400 hover:text-indigo-300 transition-colors self-start p-1"
                                  title="Mark as read"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors bg-slate-800/50"
                >
                  <User size={20} />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 mb-1 bg-slate-800/20">
                      <div className="font-semibold text-slate-200 truncate">{user?.email || 'My Account'}</div>
                      <div className="text-xs text-indigo-400 font-medium mt-0.5">StockPulse Pro</div>
                    </div>
                    <div 
                      onClick={handleSettingsClick}
                      className="px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} className="text-slate-400" /> Settings
                    </div>
                    <div 
                      onClick={handleBillingClick}
                      className="px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <CreditCard size={16} className="text-slate-400" /> Billing
                    </div>
                    <div 
                      onClick={handleLogout}
                      className="px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors border-t border-slate-800 mt-1 flex items-center gap-2"
                    >
                      Sign out
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <BillingModal isOpen={isBillingOpen} onClose={() => setIsBillingOpen(false)} />
    </>
  );
}

