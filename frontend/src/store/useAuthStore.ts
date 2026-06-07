import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authenticateSocket } from '../services/socket';

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        authenticateSocket(accessToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken })
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        // Re-authenticate socket on page reload if token exists
        if (state && state.accessToken) {
          authenticateSocket(state.accessToken);
        }
      }
    }
  )
);
