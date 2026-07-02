import { businessProfileService } from '@/app/services/business-profile.service';
import { ApiErrorResponse, ApiResponse } from '@/types/api-response.type';
import {
  ConnectPhoneNumberResponse,
  CreateBusinessProfileResponse,
  TConnectPhoneNumberPayload,
  TCreateBusinessProfilePayload,
} from '@/types/business/business-profile.type';
import { useMutation } from '@tanstack/react-query';

export const businessProfileHook = {
  useBusinessProfile: () => {
    return useMutation<ApiResponse<CreateBusinessProfileResponse>, ApiErrorResponse, TCreateBusinessProfilePayload>({
      mutationFn: (payload) => businessProfileService.createBusinessProfile(payload),
    });
  },
  useConnectPhoneNumber: () => {
    return useMutation<ApiResponse<ConnectPhoneNumberResponse>, ApiErrorResponse, TConnectPhoneNumberPayload>({
      mutationFn: (payload) => businessProfileService.connectPhoneNumber(payload),
    });
  },
};
