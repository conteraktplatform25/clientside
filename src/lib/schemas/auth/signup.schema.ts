import { z } from 'zod';

export const registerFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email({ message: 'Invalid email' }),
  // password: z.string().min(6, 'Password must be at least 6 characters'),
  // confirm_password: z.string(),
});
//.refine((data) => data.password === data.confirm_password, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

export type TRegisterFormSchema = z.infer<typeof registerFormSchema>;
