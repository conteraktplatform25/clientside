export interface MetaAccount {
  id: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhone: string;
  verifiedName: string;
  status: string;
  webhookSubscribed: boolean;
}

export interface MetaState {
  loading: boolean;
  connecting: boolean;
  connected: boolean;
  account?: MetaAccount;
}
