import { create } from 'zustand';

export type OTPStateFlow = 'signup' | 'reset';

interface SignupVerificationState {
  email: string;
  flow: OTPStateFlow;
  setEmail: (email: string) => void;
  setFlow: (flow: OTPStateFlow) => void;
  clear: () => void;
}

export const useSignupVerificationStore = create<SignupVerificationState>((set) => ({
  email: '',
  flow: 'signup',
  setEmail: (email) => set({ email }),
  setFlow: (flow) => set({ flow }),
  clear: () => set({ email: '', flow: 'signup' }),
}));
