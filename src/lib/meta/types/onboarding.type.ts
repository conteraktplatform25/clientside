export class MetaAccountProfile {
  companyName!: string;
  whatsappAccountId!: string;
  wabaId!: string | null;
  phoneNumberId!: string | null;
  displayPhone!: string | null;
  verifiedName!: string | null;
  webhookSubscribed!: boolean;
  status!: string;
  connectedAt!: Date;
}

export interface OnboardingResultType {
  success: boolean;
  message: string;
  data: MetaAccountProfile;
}

export interface ICompleteOnboardingResponse {
  message: string;
  data: OnboardingResultType;
}

export interface IEmbeddedSignupState {
  loading: boolean;
  error?: string;
  success: boolean;
}

export type TCompleteOnboardingPayload = {
  authorizationCode: string;
  wabaId: string;
  phoneNumberId: string;
};
