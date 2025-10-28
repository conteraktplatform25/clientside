// lib/schema/business/server/catalogue.ts
import { CurrencyType } from '@prisma/client';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateCategorySchema = z
  .object({
    name: z.string().min(2, 'Category Name is required').openapi({
      example: 'Electronics',
    }),
    description: z.string().optional().openapi({
      example: 'All kinds of electronic gadgets and appliances.',
    }),
    parentCategoryId: z.uuid().nullable().optional().openapi({
      example: null,
    }),
  })
  .openapi('CreateCategoryRequest');

// Category response schema
export const CategoryResponseSchema2 = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string().openapi({ example: 'Electronics' }),
    slug: z.string().openapi({ example: 'electronics' }),
    description: z.string().nullable().openapi({ example: 'Devices and gadgets' }),
    businessProfileId: z.uuid().openapi({ example: 'c55af6ea-5932-4e15-b7e1-d6d6373eb5f7' }),
    created_at: z.string().datetime().openapi({ example: '2025-10-21T10:00:00Z' }),
    updated_at: z.string().datetime().openapi({ example: '2025-10-21T11:00:00Z' }),
    subCategories: z
      .array(
        z.object({
          id: z.uuid(),
          name: z.string(),
          slug: z.string(),
          description: z.string().nullable(),
        })
      )
      .openapi({
        example: [
          {
            id: 'a8f93e5d-cdb4-4e3f-8245-d2ab19db5b9b',
            name: 'Smartphones',
            slug: 'smartphones',
            description: 'All mobile phones',
          },
        ],
      }),
  })
  .openapi('CategoryResponse2');

export const CategoryResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string().openapi({ example: 'Electronics' }),
  })
  .openapi('CategoryResponse');

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional().openapi({ example: 'Electronics' }),
  description: z.string().optional().openapi({ example: 'Devices and gadgets' }),
  parentCategoryId: z.uuid().optional().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  categoryId: z.uuid(),
  price: z.number().positive(),
  description: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().min(0).default(0),
  currency: z.enum(Object.values(CurrencyType)).default(CurrencyType.NAIRA),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const CreateVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().min(0).default(0),
  attributes: z.record(z.string(), z.string()).optional(), // e.g. { color: "Red", size: "M" }
});

export const CreateMediaSchema = z.object({
  url: z.url(),
  altText: z.string().optional(),
  order: z.number().optional(),
});

// ✅ Query validation schema
export const ProductQuerySchema = z.object({
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(10),
  search: z.string().optional(),
  categoryId: z.uuid().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  sortBy: z.enum(['created_at', 'price']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const ProductResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    price: z.number(),
    sku: z.string().optional(),
    stock: z.number(),
    currency: z.string(),
    category: z
      .object({
        name: z.string(),
      })
      .optional(),
    media: z
      .array(
        z.object({
          id: z.uuid(),
          url: z.url(),
        })
      )
      .optional(),
    variants: z
      .array(
        z.object({
          id: z.uuid(),
          name: z.string(),
          price: z.number(),
        })
      )
      .optional(),
  })
  .openapi('ProductResponse');

export const ProductMediaResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    productId: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    url: z.string(),
    altText: z.string(),
    order: z.string().optional(),
  })
  .openapi('ProductMediaResponse');

export const ProductVariantsResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    productId: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    sku: z.string().optional(),
    price: z.number(),
    stock: z.number(),
  })
  .openapi('ProductVariantResponse');

//export type TCreateCategorySchema = z.infer<typeof CreateCategorySchema>;
