import { z } from 'zod';

export const businessProfileSchema = z.object({
  businessLogo: z.string().optional(),
  businessBio: z.string().min(1, 'Business bio is required').max(500, 'Bio must be less than 500 characters'),
  category: z.string().min(1, 'Please select a category'),
  businessAddress: z.string().min(1, 'Business address is required'),
  businessEmail: z.email('Please enter a valid email address'),
  businessWebsite: z.url('Please enter a valid website URL').optional().or(z.literal('')),
});

export type TBusinessProfileForm = z.infer<typeof businessProfileSchema>;
