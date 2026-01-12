import { FinancialTransactionSchema } from '@/lib/schemas/admin/financial-transaction.schema';
import z from 'zod';

export type TFinancialTransactionResponse = z.infer<typeof FinancialTransactionSchema>;
