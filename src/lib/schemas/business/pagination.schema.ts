import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const PaginationResponsechema = z
  .object({
    page: z.number().int().min(1).openapi({
      example: 1,
      description: 'Current page number (starting from 1)',
    }),
    limit: z.number().int().min(1).openapi({
      example: 10,
      description: 'Number of items per page',
    }),
    total: z.number().int().nonnegative().openapi({
      example: 125,
      description: 'Total number of items across all pages',
    }),
    totalPages: z.number().int().min(1).openapi({
      example: 13,
      description: 'Total number of pages available',
    }),
  })
  .openapi('PaginationResponse');

// TypeScript type inference
export type TPaginationResponse = z.infer<typeof PaginationResponsechema>;
