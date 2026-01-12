import { MetaAPIError, parseMetaError } from './meta-errors';
import {
  TMetaBusiness,
  TMetaPhoneNumber,
  TMetaTokenResponse,
  TMetaWABA,
  TWhatsAppDiscoveryResult,
} from './whatsapp.types';

const GRAPH_BASE_URL = process.env.META_AI_WHATSAPP_BASEURL;
const FACEBOOK_URL = process.env.FACEBOOK_BASEURL;
const API_VERSION = process.env.META_AI_WHATSAPP_API_VERSION!;

export function buildMetaOAuthUrl(businessProfileId: string) {
  const endpoint = `${FACEBOOK_URL}/${API_VERSION}/dialog/oauth`;
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_META_AI_APP_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
    scope: ['whatsapp_business_management', 'whatsapp_business_messaging', 'business_management'].join(','),
    response_type: 'code',
    state: businessProfileId, // CRITICAL
  });

  return `${endpoint}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const WABA_ACCESSTOKEN_ENDPOINT = `${GRAPH_BASE_URL}/${API_VERSION}/oauth/access_token`;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_META_AI_APP_ID!,
    client_secret: process.env.META_AIAPP_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
    code,
  });

  const response = await fetch(`${WABA_ACCESSTOKEN_ENDPOINT}?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Meta token exchange failed:', error);
    throw new Error('Failed to exchange Meta OAuth code');
  }

  const data = (await response.json()) as TMetaTokenResponse;

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

export async function fetchWhatsAppBusinessAccount(accessToken: string): Promise<TWhatsAppDiscoveryResult> {
  const WABA_MY_ACCESSTOKEN_ENDPOINT = `${GRAPH_BASE_URL}/${API_VERSION}/me/businesses?access_token=${accessToken}`;

  const businessesRes = await fetch(`${WABA_MY_ACCESSTOKEN_ENDPOINT}`);

  if (!businessesRes.ok) {
    throw await parseMetaError(businessesRes);
  }

  const businesses = (await businessesRes.json()) as { data: TMetaBusiness[] };
  if (!businesses.data.length) {
    throw new MetaAPIError('No Meta business found for this user');
  }

  for (const business of businesses.data) {
    const WABA_MY_ACCESSTOKEN_ENDPOINT = `${GRAPH_BASE_URL}/${API_VERSION}/${business.id}/owned_whatsapp_business_accounts?access_token=${accessToken}`;
    const wabaRes = await fetch(`${WABA_MY_ACCESSTOKEN_ENDPOINT}`);
    if (!wabaRes.ok) continue;

    const wabaData = (await wabaRes.json()) as { data: TMetaWABA[] };

    if (!wabaData.data.length) continue;

    const waba = wabaData.data[0];
    const WABA_PHONE_ACCESSTOKEN_ENDPOINT = `${GRAPH_BASE_URL}/${API_VERSION}/${waba.id}/phone_numbers?access_token=${accessToken}`;

    // 3️⃣ Fetch phone numbers under WABA
    const phoneRes = await fetch(`${WABA_PHONE_ACCESSTOKEN_ENDPOINT}`);
    if (!phoneRes.ok) throw await parseMetaError(phoneRes);

    const phoneData = (await phoneRes.json()) as {
      data: TMetaPhoneNumber[];
    };
    if (!phoneData.data.length) throw new MetaAPIError('WABA has no phone numbers');

    return {
      metaBusinessId: business.id,
      wabaId: waba.id,
      phoneNumbers: phoneData.data,
    };
  }

  throw new MetaAPIError('No WhatsApp Business Account found for any business');
}
