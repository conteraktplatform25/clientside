import { signupFormSchema, TSignupPayload } from '@/types/auth/auth-user.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ISignupFormState {
  signupFormData: TSignupPayload;
  setSignupFormData: (data: Partial<TSignupPayload>) => void;
  resetForm: () => void;
  validateForm: () => { success: boolean; errors?: Record<string, string> };
}

const defaultSignupForm: TSignupPayload = {
  firstName: '',
  lastName: '',
  email: '',
};

export const useSignupFormStore = create<ISignupFormState>()(
  persist(
    (set, get) => ({
      signupFormData: defaultSignupForm,
      setSignupFormData: (data) =>
        set((state) => ({
          signupFormData: { ...state.signupFormData, ...data },
        })),
      resetForm: () => set({ signupFormData: defaultSignupForm }),
      validateForm: () => {
        const result = signupFormSchema.safeParse(get().signupFormData);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          return { success: false, errors };
        }
        return { success: true };
      },
    }),
    {
      name: 'contakt-signup-storage', // key in localStorage
      skipHydration: true,
    },
  ),
);
