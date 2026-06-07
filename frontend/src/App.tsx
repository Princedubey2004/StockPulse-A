import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Portfolio } from './pages/Portfolio';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { socket } from './services/socket';

import { useNotificationStore } from './store/useNotificationStore';

function App() {
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    const handleAlert = (data: any) => {
      addNotification(data.message);
      toast.success(data.message, {
        duration: 8000,
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      });
    };

    socket.on('alert_triggered', handleAlert);

    return () => {
      socket.off('alert_triggered', handleAlert);
    };
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/watchlist" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
