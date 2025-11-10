import { z } from 'zod';

export const CategoryDropDownSchema = z.object({
  value: z.uuid(),
  label: z.string().min(2, 'Category Name is required'),
});

export type TCategoryDropDown = z.infer<typeof CategoryDropDownSchema>;
