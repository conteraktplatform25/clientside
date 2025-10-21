import { create } from 'zustand';

export type OTPFlow = 'signup' | 'reset';

interface OTPState {
  email: string;
  flow: OTPFlow;
  setEmail: (email: string) => void;
  setFlow: (flow: OTPFlow) => void;
  clear: () => void;
}

export const useOTPStore = create<OTPState>((set) => ({
  email: '',
  flow: 'signup',
  setEmail: (email) => set({ email }),
  setFlow: (flow) => set({ flow }),
  clear: () => set({ email: '', flow: 'signup' }),
}));
