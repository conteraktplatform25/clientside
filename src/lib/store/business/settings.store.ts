import { create } from 'zustand';

// ----------------- Zustand store -----------------
export interface IUserProfileDialogStore {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export const useUserProfileDialogStore = create<IUserProfileDialogStore>((set) => ({
  open: false,
  setOpen: (val) => set({ open: val }),
}));
