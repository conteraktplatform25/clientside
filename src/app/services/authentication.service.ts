import { POST } from '@/lib/api-client';
import { apiClientV } from '@/lib/api/api-client-v';
import { ApiResponse } from '@/types/api-response.type';
import {
  TSignupVerificationPayload,
  TSignupPayload,
  TResendOTPPayload,
  SignupVerificationResponse,
  ResendOTPResponse,
  SignupResponse,
  TLoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from '@/types/auth/auth-user.type';

export const authService = {
  async signup(payload: TSignupPayload): Promise<ApiResponse<SignupResponse>> {
    const { data } = await apiClientV.post<ApiResponse<SignupResponse>>('/auth/signup', payload);
    return data;
  },
  async login(payload: TLoginPayload): Promise<ApiResponse<LoginResponse>> {
    const { data } = await apiClientV.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    return data;
  },
  async email_verification(payload: TSignupVerificationPayload): Promise<ApiResponse<SignupVerificationResponse>> {
    const { data } = await apiClientV.post<ApiResponse<SignupVerificationResponse>>('/auth/email-verification', payload);
    return data;
  },
  async resend_otp(payload: TResendOTPPayload): Promise<ApiResponse<ResendOTPResponse>> {
    const { data } = await apiClientV.post<ApiResponse<ResendOTPResponse>>('/auth/resend-otp', payload);
    return data;
  },
  async logout(): Promise<ApiResponse<LogoutResponse>> {
    const { data } = await apiClientV.post<ApiResponse<LogoutResponse>>('/auth/logout');
    return data;
  },
  async refresh(): Promise<ApiResponse<RefreshResponse>> {
    const { data } = await apiClientV.post<ApiResponse<RefreshResponse>>('/auth/refresh');
    return data;
  },
};
