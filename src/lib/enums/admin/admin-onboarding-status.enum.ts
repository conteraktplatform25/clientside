export const AdminOnboardingStatusEnum = {
  INVITED: 'INVITED',
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  PROFILE_COMPLETED: 'PROFILE_COMPLETED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type AdminOnboardingStatus = (typeof AdminOnboardingStatusEnum)[keyof typeof AdminOnboardingStatusEnum];
