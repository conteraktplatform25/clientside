import { POST } from '@/lib/api-client';
import {
  TSignupVerificationPayload,
  TSignupPayload,
  TResendOTPPayload,
  SignupVerificationResponse,
  ResendOTPResponse,
  SignupResponse,
  TLoginPayload,
  LoginResponse,
} from '@/types/auth/auth-user.type';

export const authService = {
  login: (payload: TLoginPayload) => POST<LoginResponse, TLoginPayload>('/auth/login', payload),
  register: (payload: TSignupPayload) => POST<SignupResponse, TSignupPayload>('/auth/register', payload),
  emailVerification: (payload: TSignupVerificationPayload) =>
    POST<SignupVerificationResponse, TSignupVerificationPayload>('/auth/verify-email', payload),
  resendOTP: (payload: TResendOTPPayload) => POST<ResendOTPResponse, TResendOTPPayload>('/auth/resend-otp', payload),
};
