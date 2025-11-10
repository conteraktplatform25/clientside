import { z } from 'zod';
import {
  ConstAnnualRevenue as revenues,
  ConstBusinessCategories as categories,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constant';
import { BusinessHoursSchema } from '../server/settings.schema';

export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email({ message: 'Invalid email' }),
  phone_country_code: z.string().min(1, 'Country code is required'),
  phone_number: z.string().min(6, 'Phone number is required'),
});

export const businessProfileSchema = z.object({
  companyName: z.string(),
  phoneNumber: z.string(),
  phoneCountryCodeNumber: z.string(),
  logo: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .refine((val) => categories.includes(val), 'Invalid category'),
  industry: z.enum(industries, { message: 'Business Industry is required' }),
  revenue: z.enum(revenues, { message: 'Business Annual Revenue is required' }),
  address: z.string().min(1, 'Business address is required'),
  email: z.email('Please enter a valid email address'),
  website: z.url('Please enter a valid website URL').optional().or(z.literal('')),
  business_hour: BusinessHoursSchema,
});

export type TUserProfileForm = z.infer<typeof userProfileSchema>;
export type TBusinessProfileForm = z.infer<typeof businessProfileSchema>;
