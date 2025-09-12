import {
  ConstAnnualRevenue as revenues,
  ConstBusinessCategories as categories,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constant';
import { z } from 'zod';

export const profileFormSchema = z.object({
  phone_number: z.string().min(10, 'Invalid Phone Number'),
  whatsapp_business_number: z.string().min(10, 'Invalid Phone Number'),
  company_name: z.string().min(5),
  company_website: z.string().nullable(),
  company_location: z.string().nullable(),
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
});
// .refine((data) => data.password === data.confirm_password, {
//   message: "Passwords don't match",
//   path: ['confirm_password'],
// });

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;
