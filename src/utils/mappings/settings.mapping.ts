import { TCreateBusinessSettings, TUpdateBusinessSettings } from '@/lib/hooks/business/business-settings.hook';
import { TBusinessProfileForm } from '@/lib/schemas/business/client/client-settings.schema';

export const mapUpdateBusinessFormToApiPayload = (data: TBusinessProfileForm): TUpdateBusinessSettings => ({
  phone_number: data.phoneNumber,
  company_location: data.address || null,
  company_website: data.website || null,
  business_industry: data.industry || null,
  business_category: data.category || null,
  annual_revenue: data.revenue || null,
  business_email: data.email || null,
  business_logo_url: data.logo_url,
  business_bio: data.bio || null,
  business_hour: data.business_hour ?? null,
});

export const mapCreateBusinessFormToApiPayload = (data: TBusinessProfileForm): TCreateBusinessSettings => ({
  company_name: data.companyName,
  phone_number: data.phoneNumber,
  company_location: data.address || null,
  company_website: data.website || null,
  business_industry: data.industry || null,
  business_category: data.category || null,
  annual_revenue: data.revenue || null,
  business_email: data.email || null,
  business_logo_url: null,
  business_bio: data.bio || null,
  business_hour: data.business_hour ?? null,
});
