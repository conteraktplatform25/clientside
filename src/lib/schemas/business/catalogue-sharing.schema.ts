import { z } from 'zod';

export const productCatalogueFormSchema = z.object({
  productName: z.string().min(1, { message: 'Product name is required.' }),
  productSKU: z.string().optional(),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  stockQuantity: z.coerce.number().min(0, { message: 'Stock quantity cannot be negative.' }).optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  productImages: z.array(z.string()).optional(), // Storing base64 strings or URLs
});

export type TProductCatalogueFormValues = z.infer<typeof productCatalogueFormSchema>;
