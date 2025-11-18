import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  ConstAnnualRevenue as revenues,
  ConstBusinessCategories as categories,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constant';

extendZodWithOpenApi(z);

export const UpdateUserSettingsSchema = z
  .object({
    first_name: z.string().nullable().openapi({ example: 'abcdef' }),
    last_name: z.string().nullable().openapi({ example: 'abcdef' }),
    image: z.string().nullable(),
    phone_country_code: z.string().min(1, 'Country code is required'),
    phone_number: z.string().min(6, 'Phone number is required'),
  })
  .openapi('UpdateUserSettings');

const RoleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const UserSettingsResponseSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    image: z.string().nullable(),
    phone: z.string().nullable(),
    email_verified_date: z.date().nullable(),
    is_activated: z.boolean(),
    is_deleted: z.boolean(),
    role: RoleResponseSchema,
  })
  .openapi('UserSettingsResponse');

export const BusinessHoursSchema = z.object({
  monday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  tuesday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  wednesday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  thursday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  friday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  saturday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
  sunday: z.object({ open: z.string().nullable(), close: z.string().nullable() }),
});

export const CreateBusinessSettingsSchema = z
  .object({
    company_name: z.string(),
    // phone_country_code: z.string().min(1, 'Country code is required').nullable().optional(),
    phone_number: z.string().min(6, 'Phone number is required'),
    company_location: z.string().nullable().optional(),
    company_website: z.string().nullable().optional(),
    business_industry: z
      .string()
      .refine((value) => industries.includes(value), {
        message: 'Invalid Selection',
      })
      .nullable()
      .optional(),
    business_category: z
      .string()
      .refine((value) => categories.includes(value), {
        message: 'Invalid Selection',
      })
      .nullable()
      .optional(),
    annual_revenue: z
      .string()
      .refine((value) => revenues.includes(value), {
        message: 'Invalid Selection',
      })
      .nullable()
      .optional(),
    business_email: z.string().nullable().optional(),
    business_logo_url: z.string().nullable().optional(),
    business_bio: z.string().nullable().optional(),
    business_hour: BusinessHoursSchema.nullable().optional(),
  })
  .openapi('CreateBusinessSettings');

export const UpdateBusinessSettingsSchema = CreateBusinessSettingsSchema.partial().openapi('UpdateBusinessSettings');

const UserBusinessSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: RoleResponseSchema,
});

export const BusinessSettingsResponseSchema = z
  .object({
    id: z.string(),
    company_name: z.string(),
    phone_number: z.string(),
    business_number: z.string().nullable(),
    company_location: z.string().nullable(),
    company_website: z.string().nullable(),
    business_industry: z.string().nullable(),
    business_category: z.string().nullable(),
    annual_revenue: z.string().nullable(),
    business_email: z.string().nullable(),
    business_logo_url: z.string().nullable(),
    business_bio: z.string().nullable(),
    business_hour: BusinessHoursSchema.optional().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    user: UserBusinessSchema,
  })
  .openapi('BusinessSettingsResponse');
