'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationCompletedSection from './_component/RegistrationCompletedSection';
import { useMeta } from '@/lib/meta/hooks/useMeta.hook';

export default function SuccessConnectionPage() {
  const router = useRouter();
  const { onboarding } = useMeta();

  useEffect(() => {
    const onboarding = sessionStorage.getItem('meta-onboarding');
    if (!onboarding) {
      router.push('/login');
    }
  }, [router]);

  if (!onboarding) return null;
  const account = onboarding;

  return (
    <div>
      <RegistrationCompletedSection
        businessName={account.companyName!}
        displayPhone={account.displayPhone!}
        verifiedName={account.verifiedName!}
      />
    </div>
  );
}
