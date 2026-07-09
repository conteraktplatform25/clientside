import { apiClientV } from '@/lib/api/api-client-v';
import { ApiResponse } from '@/types/api-response.type';
import {
  ConnectPhoneNumberResponse,
  CreateBusinessProfileResponse,
  TConnectPhoneNumberPayload,
  TCreateBusinessProfilePayload,
} from '@/types/business/business-profile.type';

export const businessProfileService = {
  async createBusinessProfile(
    payload: TCreateBusinessProfilePayload,
  ): Promise<ApiResponse<CreateBusinessProfileResponse>> {
    const { data } = await apiClientV.post<ApiResponse<CreateBusinessProfileResponse>>(
      '/business-profile/create',
      payload,
    );
    return data;
  },
  async connectPhoneNumber(payload: TConnectPhoneNumberPayload): Promise<ApiResponse<ConnectPhoneNumberResponse>> {
    const { data } = await apiClientV.post<ApiResponse<ConnectPhoneNumberResponse>>(
      '/business-profile/connect-phone',
      payload,
    );
    return data;
  },
};
