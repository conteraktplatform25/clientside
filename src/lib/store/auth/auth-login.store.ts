// import { loginFormSchema, TLoginFormSchema } from '@/types/auth-user.type';
import { loginFormSchema, TLoginPayload } from '@/types/auth/auth-user.type';
import { create } from 'zustand';

interface ILoginFormState {
  profile: TLoginPayload;
  setProfile: (profile: TLoginPayload) => void;
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