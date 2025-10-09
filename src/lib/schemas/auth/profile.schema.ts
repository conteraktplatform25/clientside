import {
  ConstAnnualRevenue as revenues,
  ConstBusinessCategories as categories,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constant';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const profileFormSchema = z
  .object({
    phone_country_code: z.string().min(1, 'Country code is required'),
    phone_number: z.string().min(5, 'Invalid Phone Number'),
    company_name: z.string().min(5),
    company_website: z.string().nullable(),
    company_location: z.string().nullable(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
    business_industry: z.string().refine((value) => industries.includes(value), {
      message: 'Invalid Selection',
    }),
    business_category: z.string().refine((value) => categories.includes(value), {
      message: 'Invalid Selection',
    }),
    annual_revenue: z.string().refine((value) => revenues.includes(value), {
      message: 'Invalid Selection',
    }),
    term_of_service: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the terms.',
      })
      .nullable(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;
