import { create } from 'zustand';
import { TProfileLevelFormSchema } from '@/lib/schemas/dashboard/getstarted.schema';

interface ProfileLevelFormState {
  data: Partial<TProfileLevelFormSchema>;
  setFormData: (values: Partial<TProfileLevelFormSchema>) => void;
  resetForm: () => void;
}

export const useProfileLevelFormStore = create<ProfileLevelFormState>((set) => ({
  data: {},
  setFormData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
  resetForm: () => set({ data: {} }),
}));
