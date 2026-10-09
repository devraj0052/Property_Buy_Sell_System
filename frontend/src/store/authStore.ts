import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any, endpoint?: string) => Promise<void>;
  register: (data: any, endpoint?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials, endpoint = '/auth/login') => {
    const response = await api.post(endpoint, credentials);
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  register: async (userData, endpoint = '/auth/register') => {
    const response = await api.post(endpoint, userData);
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    // Check if token in URL hash or search (from Google OAuth)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      let hashToken = null;
      if (window.location.hash.includes('token=')) {
        hashToken = new URLSearchParams(window.location.hash.substring(1)).get('token');
      }
      
      const queryToken = urlParams.get('token') || hashToken;
      
      if (queryToken) {
        localStorage.setItem('token', queryToken);
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data.user, isAuthenticated: true, isLoading: false, token });
    } catch (error) {
      try {
        // Try refresh
        const refreshRes = await api.post('/auth/refresh-token');
        const newToken = refreshRes.data.data.token;
        localStorage.setItem('token', newToken);
        
        const response = await api.get('/auth/me');
        set({ user: response.data.data.user, isAuthenticated: true, isLoading: false, token: newToken });
      } catch (refreshErr) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    }
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    set({ user: response.data.data.user });
  },

  changePassword: async (data) => {
    await api.put('/auth/change-password', data);
  }
}));
