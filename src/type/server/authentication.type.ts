import { User, BusinessProfile, Role, AdminOnboardingStatus } from '@prisma/client';

export type AuthenticatedUser = User & {
  role: Role | null;
  businessProfile: BusinessProfile[];
};

type UserRole = {
  id: string;
  name: string;
};

export type AdminAuthenticatedUser = {
  id: string;
  email: string;
  email_verified_date: Date | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  is_activated: boolean;
  is_deleted: boolean;
  role: UserRole;
  created_at: Date;
  admin_onboarding_status: AdminOnboardingStatus;
};

export interface DecodedToken {
  id: string;
  email?: string;
  iat?: number; // issued at
  exp?: number; // expiration
}
