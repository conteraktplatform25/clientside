import { authService } from '@/app/services/authentication.service';
import { ApiErrorResponse, ApiResponse } from '@/types/api-response.type';
import {
  TSignupVerificationPayload,
  TSignupPayload,
  TResendOTPPayload,
  SignupVerificationResponse,
  SignupResponse,
  ResendOTPResponse,
  LoginResponse,
  TLoginPayload,
} from '@/types/auth/auth-user.type';
import { useMutation } from '@tanstack/react-query';

export const authenticationHook = {
  useSignup: () => {
    return useMutation<ApiResponse<SignupResponse>, ApiErrorResponse, TSignupPayload>({
      mutationFn: (payload) => authService.register(payload),
    });
  },
  useLogin: () => {
    return useMutation<ApiResponse<LoginResponse>, ApiErrorResponse, TLoginPayload>({
      mutationFn: (payload) => authService.login(payload),
    });
  },
  useEmailVerification: () => {
    return useMutation<ApiResponse<SignupVerificationResponse>, ApiErrorResponse, TSignupVerificationPayload>({
      mutationFn: (payload) => authService.emailVerification(payload),
    });
  },
  useRendOTP: () => {
    return useMutation<ApiResponse<ResendOTPResponse>, ApiErrorResponse, TResendOTPPayload>({
      mutationFn: (payload) => authService.resendOTP(payload),
    });
  },
};
