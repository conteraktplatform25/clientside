import { PaymentChannel, PaymentStatus } from '@prisma/client';
import z from 'zod';

export const FinancialTransactionSchema = z.object({
  id: z.uuid(),
  business_name: z.string(),
  businessTransactionId: z.string(),
  transaction_type: z.string(),
  transaction_fee: z.coerce.number().optional(),
  amount: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  paid_by: z.string(),
  transaction_status: z.nativeEnum(PaymentStatus),
  payment_channel: z.nativeEnum(PaymentChannel),
  created_at: z.string(),
});
