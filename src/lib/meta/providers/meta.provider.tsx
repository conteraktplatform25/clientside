'use client';

import { useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MetaContext } from '../context/meta.context';
import { useMetaEmbeddedSignup } from '../hooks/useMetaEmbeddedSignup';
import { MetaAccountProfile } from '../types/onboarding.type';

interface IMetaProviderProps {
  children: ReactNode;
}

export function MetaProvider({ children }: Readonly<IMetaProviderProps>) {
  const router = useRouter();
  const [onboardingProfile, setOnboarding] = useState<MetaAccountProfile | undefined>(undefined);

  const { connect: embeddedSignup, loading, error, success } = useMetaEmbeddedSignup();

  useEffect(() => {
    const stored = sessionStorage.getItem('meta-onboarding');
    if (!stored) return;
    try {
      const onboarding: MetaAccountProfile = JSON.parse(stored);
      setOnboarding(onboarding);
    } catch {
      sessionStorage.removeItem('meta-onboarding');
    }
  }, []);
  
  const connect = useCallback(
    async (metaConfigId: string) => {
        const onboardingProfile = await embeddedSignup({
          meta_config_id: metaConfigId,
        });
        if (!onboardingProfile) {
          return;
        }
        const accountProfile: MetaAccountProfile = onboardingProfile;
        setOnboarding(accountProfile);
        sessionStorage.setItem('meta-onboarding', JSON.stringify(accountProfile));
        router.push('/meta-connect/success');
    },
    [embeddedSignup, router],
  );

  const value = useMemo(
    () => ({
      success,
      loading,
      connected: !!onboardingProfile,
      error,
      onboardingProfile,
      connect,
      clearOnboarding: () => {
        sessionStorage.removeItem('meta-onboarding');
        setOnboarding(undefined);
      },
    }),
    [success, loading, error, onboardingProfile, connect],
  );

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
}
