import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;
