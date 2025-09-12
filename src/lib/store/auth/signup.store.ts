import { registerFormSchema, TRegisterFormSchema } from '@/lib/schemas/auth/signup.schema';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// interface ISignupFormState {
//   profile: TRegisterFormSchema;
//   setProfile: (profile: TRegisterFormSchema) => void;
//   clearProfile: () => void;
// }
interface ISignupFormState {
  formData: TRegisterFormSchema;
  setFormData: (data: Partial<TRegisterFormSchema>) => void;
  resetForm: () => void;
  validateForm: () => { success: boolean; errors?: Record<string, string> };
}

// Default state
const defaultFormData: TRegisterFormSchema = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
};

export const useSignupFormStore = create<ISignupFormState>()(
  persist(
    (set, get) => ({
      formData: defaultFormData,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ formData: defaultFormData }),
      validateForm: () => {
        const result = registerFormSchema.safeParse(get().formData);
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
      name: 'register-form-storage', // key in localStorage
      skipHydration: true, // helpful for Next.js SSR
    }
  )
);
//   profile: {
//     first_name: '',
//     last_name: '',
//     email: '',
//   },
//   setProfile: (profile) => {
//     try {
//       registerFormSchema.parse(profile);
//       set({ profile });
//     } catch (error: unknown) {
//       console.error('Validation error:', error);
//     }
//   },
//   clearProfile: () =>
//     set({
//       profile: {
//         first_name: '',
//         last_name: '',
//         email: '',
//         // password: '',
//         // confirm_password: '',
//       },
//     }),
// }));
