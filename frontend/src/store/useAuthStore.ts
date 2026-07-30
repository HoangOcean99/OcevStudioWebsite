import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  preferredSize: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, preferredSize: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: "Alex Ocean",
    email: "alex@ocevstudio.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    preferredSize: "M",
    role: "admin",
  },
  isLoggedIn: true, // default demo logged in state
  login: (email, name = "Alex Ocean") =>
    set({
      isLoggedIn: true,
      user: {
        name: name || email.split("@")[0],
        email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        preferredSize: "M",
        role: "user",
      },
    }),
  register: (name, email, preferredSize) =>
    set({
      isLoggedIn: true,
      user: {
        name,
        email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        preferredSize,
        role: "user",
      },
    }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
