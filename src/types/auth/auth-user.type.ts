import { z } from 'zod';
import { ApiResponse } from '../api-response.type';
import { TBusinessAccountStatus, TOnboardingStepStatus } from './shared.type';

export const AuthenticationSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
});

export const loginFormSchema = AuthenticationSchema.pick({
  email: true,
}).extend({
  password: z.string().min(6, 'Invalid Password'),
});

export const signupFormSchema = AuthenticationSchema.pick({
  email: true,
}).extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const signupVerificationSchema = AuthenticationSchema.pick({
  email: true,
}).extend({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const resendOtpSchema = AuthenticationSchema.pick({
  email: true,
});

export interface ISessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  role: string;
}
export interface IBusinessProfile {
  id: string;
  roleName: string;
  company_name: string;
  account_status: TBusinessAccountStatus;
}

export interface ICurrentSessionUser {
  sessionUser: ISessionUser;
  onboardingStep: TOnboardingStepStatus;
  hasBusinessProfile: boolean;
  businessProfile: IBusinessProfile[];
}

export type TValidateSessionResponse = ApiResponse<ICurrentSessionUser>;
export type TLoginPayload = z.infer<typeof loginFormSchema>;
export type TSignupPayload = z.infer<typeof signupFormSchema>;
export type TSignupVerificationPayload = z.infer<typeof signupVerificationSchema>;
export type TResendOTPPayload = z.infer<typeof resendOtpSchema>;

export interface AuthUserResponse {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  image: string | null;
  roleId: number;
  onboarding_step: string;
  is_activated: boolean;
}

export interface LoginResponse {
  user: AuthUserResponse;
}

export interface SignupResponse {
  email: string;
  onboardingStep: TOnboardingStepStatus;
  otpExpiresIn_minute: number;
  message: string;
}

export interface SignupVerificationResponse {
  firstName: string | null;
  lastName: string | null;
  email: string;
  onboardingStep: TOnboardingStepStatus;
  verified: boolean;
  emailVerifiedDate: Date;
  message: string;
}

export interface ResendOTPResponse {
  email: string;
  success: boolean;
  message: string;
}
