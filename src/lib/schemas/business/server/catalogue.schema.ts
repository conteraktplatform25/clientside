// lib/schema/business/server/catalogue.ts
import { CurrencyType, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateCategoryRequestSchema = z
  .object({
    name: z.string().min(2, 'Category Name is required').openapi({
      example: 'Electronics',
    }),
    description: z.string().optional().openapi({
      example: 'All kinds of electronic gadgets and appliances.',
    }),
  })
  .openapi('CreateCategoryRequest');

export const UpdateCategoryRequestSchema = z
  .object({
    name: z.string().min(2).optional().openapi({ example: 'Electronics' }),
    description: z.string().optional().openapi({ example: 'Devices and gadgets' }),
  })
  .openapi('UpdateCategoryRequest');

export const CategoryResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string().min(2, 'Category Name is required').openapi({
      example: 'Electronics',
    }),
    description: z.string().optional().openapi({
      example: 'All kinds of electronic gadgets and appliances.',
    }),
  })
  .openapi('CategoryResponse');

export const CategoryDetailsResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string().openapi({ example: 'Electronics' }),
    slug: z.string().openapi({ example: 'electronics' }),
    description: z.string().nullable().openapi({ example: 'Devices and gadgets' }),
    businessProfileId: z.uuid().openapi({ example: 'c55af6ea-5932-4e15-b7e1-d6d6373eb5f7' }),
    created_at: z.coerce.date().openapi({ example: '2025-10-21T10:00:00Z' }),
    updated_at: z.coerce.date().openapi({ example: '2025-10-21T11:00:00Z' }),
  })
  .openapi('CategoryDetailsResponse');

export const CategoryResponseListSchema = z.array(CategoryResponseSchema);

export const CreateProductSchema = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  category: CategoryResponseSchema.optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  currency: z.enum(Object.values(CurrencyType)).default(CurrencyType.NAIRA),
  price: z.number().positive(),
  stock: z.number().min(0).default(0),
  sku: z.string().optional(),
  status: z.enum(Object.values(ProductStatus)).default(ProductStatus.DRAFT).optional(),
  media: z
    .array(
      z.object({
        url: z.url(),
        altText: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
});

export const UpdateProductSchema = z.object({
  id: z.uuid().optional(),
  categoryId: z.uuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  currency: z.enum(Object.values(CurrencyType)).default(CurrencyType.NAIRA).optional(),
  price: z.number().positive().optional(),
  stock: z.number().min(0).default(0).optional(),
  sku: z.string().nullable().optional(),
  media: z
    .array(
      z.object({
        url: z.url(),
        altText: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
});

// Zod schema for status or soft-delete actions
export const UpdateProductStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(Object.values(ProductStatus)).default(ProductStatus.DRAFT).optional(),
  deleted: z.boolean().optional(),
});

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
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, 'Page must be positive')
    .default(1),
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
    //slug: z.string(),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    sku: z.string().optional(),
    stock: z.coerce.number().positive(),
    currency: z.string(),
    status: z.enum(Object.values(ProductStatus)).default(ProductStatus.DRAFT),
    category: z
      .object({
        id: z.uuid(),
        name: z.string(),
      })
      .optional(),
    media: z
      .array(
        z.object({
          id: z.uuid(),
          url: z.url(),
          altText: z.string().nullable().optional(),
        })
      )
      .optional(),
    // variants: z
    //   .array(
    //     z.object({
    //       id: z.uuid(),
    //       name: z.string(),
    //       price: z.number(),
    //     })
    //   )
    //   .optional(),
  })
  .openapi('ProductResponse');
export const ProductResponseListSchema = z.array(ProductResponseSchema).openapi('ProductResponseList');

export const ProductDetailResponseSchema = z
  .object({
    id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    sku: z.string().optional(),
    stock: z.coerce.number().positive(),
    currency: z.string(),
    status: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    //status: z.enum(Object.values(ProductStatus)).default(ProductStatus.DRAFT),
    //z.enum(Object.values(CurrencyType)).default(CurrencyType.NAIRA),
    category: z
      .object({
        id: z.uuid(),
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
  .openapi('ProductDetailResponse');

export const ProductDesktopResponseSchema = z.object({
  id: z.uuid().openapi({ example: 'b8d43f9e-cc8b-4b84-a20d-8e85acb8a654' }),
  name: z.string(),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  currency: z.enum(Object.values(CurrencyType)), // ✅ use enum type here
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .optional(),
});
export const ProductDesktopResponseListSchema = z.array(ProductDesktopResponseSchema);

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
