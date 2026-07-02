// import { ICompleteOnboardingResponse, TCompleteOnboardingPayload } from '@/types/business/meta/onboarding.type';
import { POST } from '../../api-client';
import { OnboardingResultType, TCompleteOnboardingPayload } from '../types/onboarding.type';

export const metaService = {
  onboarding: (payload: TCompleteOnboardingPayload) =>
    POST<OnboardingResultType, TCompleteOnboardingPayload>('/meta/onboarding', payload),
};
