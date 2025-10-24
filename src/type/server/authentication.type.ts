import { User, BusinessProfile, Role } from '@prisma/client';

export type AuthenticatedUser = User & {
  role?: Role | null;
  businessProfile: BusinessProfile[];
};

export interface DecodedToken {
  id: string;
  email?: string;
  iat?: number; // issued at
  exp?: number; // expiration
}
