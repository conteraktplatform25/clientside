import { BusinessAccountStatus } from '@prisma/client';
import z from 'zod';

export const BusinessAccountSchema = z.object({
  id: z.uuid(),
  businessAccountId: z.uuid(),
  business_name: z.string(),
  contact_phone_number: z.string(),
  contact_email: z.string(),
  account_status: z.nativeEnum(BusinessAccountStatus),
  last_login: z.string(),
  created_at: z.coerce.date(),
  total_revenue: z.string(),
  total_customers: z.string(),
});
