import { TLoginFormSchema, loginFormSchema } from '@/lib/schemas/auth/login.schema';
import { create } from 'zustand';

interface ILoginFormState {
  profile: TLoginFormSchema;
  setProfile: (profile: TLoginFormSchema) => void;
  clearUser: () => void;
}

export const useLoginFormStore = create<ILoginFormState>((set) => ({
  profile: {
    email: '',
    password: '',
  },
  setProfile: (profile) => {
    try {
      loginFormSchema.parse(profile);
      set({ profile });
    } catch (error: unknown) {
      console.error('Validation error:', error);
    }
  },
  clearUser: () => set({ profile: { email: '', password: '' } }),
}));
