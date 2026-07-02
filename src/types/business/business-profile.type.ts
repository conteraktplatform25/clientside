import { z } from 'zod';
import { validateAndNormalizePhone } from '@/utils/custom-control.util';
import { TBusinessAccountStatus } from '@/types/auth/shared.type';

import {
  ConstAnnualRevenue as revenues,
  ConstBusinessCategories as categories,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constants';

export const businessProfileSchema = z
  .object({
    phoneNumber: z.string().min(5, 'Invalid Phone Number'),
    companyName: z.string().min(5),
    companyWebsite: z.string().nullable(),
    companyLocation: z.string().nullable(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    businessIndustry: z.string().refine((value) => industries.includes(value), {
      message: 'Invalid Selection',
    }),
    businessCategory: z.string().refine((value) => categories.includes(value), {
      message: 'Invalid Selection',
    }),
    annualRevenue: z.string().refine((value) => revenues.includes(value), {
      message: 'Invalid Selection',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const connectPhoneNumberSchema = z.object({
  phoneNumber: z.string().refine((val) => {
    const result = validateAndNormalizePhone(val, 'NG');
    return result.isValid;
  }, 'Invalid phone number'),
});

export interface CreateBusinessProfileResponse {
  id: string;
  creator: string;
  company_name: string;
  phone_number: string;
  business_number: string | null;
  company_location: string | null;
  company_website: string | null;
  business_industry: string | null;
  business_category: string | null;
  annual_revenue: string | null;
  business_email: string | null;
  created_at: Date;
  account_status: TBusinessAccountStatus;
}

export interface ConnectPhoneNumberResponse {
  businessProfileId: string;
  phoneNumber: string;
  configId: string;
}


export type TConnectPhoneNumberPayload = z.infer<typeof connectPhoneNumberSchema>;
export type TBusinessProfilePayload = z.infer<typeof businessProfileSchema>;
export type TCreateBusinessProfilePayload = Omit<TBusinessProfilePayload, 'confirmPassword'>;
