import {POST} from '@/lib/api-client'
import {
  ConnectPhoneNumberResponse,
  CreateBusinessProfileResponse,
  TConnectPhoneNumberPayload,
  TCreateBusinessProfilePayload,
} from '@/types/business/business-profile.type';

export const businessProfileService = {
  createBusinessProfile: (payload: TCreateBusinessProfilePayload) =>
    POST<CreateBusinessProfileResponse, TCreateBusinessProfilePayload>('/business/create-profile', payload),
  connectPhoneNumber: (payload: TConnectPhoneNumberPayload) =>
    POST<ConnectPhoneNumberResponse, TConnectPhoneNumberPayload>('/whatsapp/onboarding/init', payload),
};
