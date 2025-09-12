import { create } from 'zustand';

type UIState = { collapsed: boolean; toggle: () => void };
export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
}));
