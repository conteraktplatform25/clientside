import { create } from 'zustand';
import { UserObject } from 'next-auth';

interface AuthState {
  collapsed: boolean;
  user: UserObject | null;
  role: string | null;
  toggle: () => void;
  setUser: (user: UserObject | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  collapsed: false,
  user: null,
  role: null,

  toggle: () => set((s) => ({ collapsed: !s.collapsed })),

  setUser: (user) =>
    set({
      user,
      role: user?.role ?? null,
    }),

  clearUser: () =>
    set({
      user: null,
      role: null,
    }),
}));
