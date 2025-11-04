import z from 'zod';

export const PaginationSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, 'Page must be positive')
    .default(1)
    .openapi({ example: 1 }),
  limit: z
    .string()
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, 'Limit must be between 1 and 100')
    .default(10)
    .openapi({ example: 10 }),
  total: z.number(),
  totalPages: z.number(),
});
