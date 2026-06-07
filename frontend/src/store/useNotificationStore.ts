import { create } from 'zustand';

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      message: 'RELIANCE crossed above ₹2900',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
    },
    {
      id: '2',
      message: 'TCS upcoming dividend announcement',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
    {
      id: '3',
      message: 'Welcome to StockPulse AI Pro',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    }
  ],
  addNotification: (message) => 
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  clearAll: () => set({ notifications: [] }),
}));
