import { BusinessAccountSchema } from '@/lib/schemas/admin/registered-account.schema';
import z from 'zod';

export type TBusinessAccountResponse = z.infer<typeof BusinessAccountSchema>;
