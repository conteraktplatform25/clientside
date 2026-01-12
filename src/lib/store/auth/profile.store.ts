import { profileFormSchema, TProfileFormSchema } from '@/lib/schemas/auth/profile.schema';
import { create } from 'zustand';

interface IProfileFormState {
  profile: TProfileFormSchema;
  setProfile: (profile: TProfileFormSchema) => void;
  clearProfile: () => void;
}

const defaultFormData: TProfileFormSchema = {
  phone_number: '',
  password: '',
  confirm_password: '',
  company_name: '',
  company_website: '',
  company_location: '',
  business_industry: '',
  business_category: '',
  annual_revenue: '',
  term_of_service: false,
};

export const useProfileFormStore = create<IProfileFormState>((set) => ({
  profile: defaultFormData,
  setProfile: (profile) => {
    try {
      profileFormSchema.parse(profile);
      set({ profile });
    } catch (error: unknown) {
      console.error('Validation error:', error);
    }
  },
  clearProfile: () =>
    set({
      profile: defaultFormData,
    }),
}));
