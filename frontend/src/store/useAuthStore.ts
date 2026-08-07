import { create } from 'zustand';
import api from '../lib/api';

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  age?: number;
  shirtSize?: string;
  pantsSize?: string;
  shoeSize?: string;
  role: 'admin' | 'staff' | 'user';
  token?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  googleLogin: (idToken: string, name?: string, avatar?: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  
  login: async (email, password = "password123") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/users/login', { email, password });
      
      localStorage.setItem('token', data.token);
      
      set({
        isLoggedIn: true,
        user: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (name, email, password = "password123") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/users/register', { name, email, password });
      
      localStorage.setItem('token', data.token);
      
      set({
        isLoggedIn: true,
        user: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  googleLogin: async (idToken: string, name?: string, avatar?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/users/google-login', { token: idToken, name, avatar });
      
      localStorage.setItem('token', data.token);
      
      set({
        isLoggedIn: true,
        user: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Google login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/users/profile', profileData);
      set({
        user: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Profile update failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("hasSkippedShippingModal");
      window.location.href = '/';
    }
    set({ isLoggedIn: false, user: null });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/users/me');
      set({
        isLoggedIn: true,
        user: data,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isLoggedIn: false, user: null, isLoading: false });
    }
  },
}));
