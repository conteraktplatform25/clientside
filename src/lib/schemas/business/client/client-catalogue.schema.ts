import { z } from 'zod';

export const CategoryDropDownSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2, 'Category Name is required'),
});

export type TCategoryDropDown = z.infer<typeof CategoryDropDownSchema>;
