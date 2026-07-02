import { createContext } from 'react';
import { MetaAccountProfile } from '../types/onboarding.type';

export interface MetaContextType {
  onboarding?: MetaAccountProfile;
  loading: boolean;
  connected: boolean;
  success: boolean;
  error: string | undefined;
  connect(metaConfigId: string): Promise<void>;
  clearOnboarding(): void;
}

export const MetaContext = createContext<MetaContextType | undefined>(undefined);
