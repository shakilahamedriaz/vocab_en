import { create } from 'zustand';
import { User, SRSStats } from '../types';
import { authAPI, srsAPI } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  register: async (email, password, name) => {
    const res = await authAPI.register({ email, password, name });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  googleLogin: async (credential: string) => {
    const res = await authAPI.googleLogin(credential);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

interface AppState {
  srsStats: SRSStats | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fetchSRSStats: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  srsStats: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  fetchSRSStats: async () => {
    try {
      const res = await srsAPI.getStats();
      set({ srsStats: res.data });
    } catch (error) {
      console.error('Failed to fetch SRS stats:', error);
    }
  },
}));
