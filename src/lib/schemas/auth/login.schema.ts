import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z.string().min(6, 'Invalid Password'),
});

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;
