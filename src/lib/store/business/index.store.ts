import { TOnboardingProfiles } from '@/type/client/default.type';
import { create } from 'zustand';

interface GettingStartedState {
  onboardingStatus: TOnboardingProfiles;
  progressBar: number;
  setOnboardingStatus: (profile: TOnboardingProfiles) => void;
  setProgressBar: (value: number) => void;
}

export const useGettingStartedStore = create<GettingStartedState>((set) => ({
  onboardingStatus: {
    businessProfile: false,
    contactInformation: false,
    phoneNumber: false,
    productCatalogue: false,
    quickReplies: false,
  },
  progressBar: 0,
  setOnboardingStatus: (profile) =>
    set({
      onboardingStatus: profile,
    }),
  setProgressBar: (value) => set({ progressBar: value }),
}));
