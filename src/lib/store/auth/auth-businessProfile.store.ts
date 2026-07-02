//import { profileFormSchema, TProfileFormSchema } from '@/lib/schemas/auth/profile.schema';
import { create } from 'zustand';
// import { businessProfileSchema, TBusinessProfilePayload } from '@/types/auth/auth-user.type';
import { businessProfileSchema, TBusinessProfilePayload } from '@/types/business/business-profile.type';

interface IBusinessProfileState {
  profile: TBusinessProfilePayload;
  setProfile: (profile: TBusinessProfilePayload) => void;
  clearProfile: () => void;
}

const defaultFormData: TBusinessProfilePayload = {
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  companyWebsite: '',
  companyLocation: '',
  businessIndustry: '',
  businessCategory: '',
  annualRevenue: '',
};

export const useBusinessProfileStore = create<IBusinessProfileState>((set) => ({
  profile: defaultFormData,
  setProfile: (profile) => {
    try {
      businessProfileSchema.parse(profile);
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
