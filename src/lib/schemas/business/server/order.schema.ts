import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
//import { PaginationSchema } from '../pagination.schema';
import { PaginationResponsechema } from '../pagination.schema';
import { CurrencyType, OrderStatus, PaymentStatus } from '@prisma/client';

extendZodWithOpenApi(z);

/**
 * Query Parameters
 */
export const OrderQuerySchema = z
  .object({
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
    search: z.string().optional(),
    sortBy: z.enum(['created_at', 'order_number']).default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    status: z.nativeEnum(OrderStatus).optional(),
    payment_status: z.nativeEnum(PaymentStatus).optional(),
  })
  .openapi('OrderQuery');

/**
 * Create Order
 */
export const CreateOrderSchema = z
  .object({
    contactId: z.uuid(),
    //order_number: z.string().min(1), // Orders Should Auto-Generate order_number for example const order_number = "ORD-" + nanoid(10);
    currency: z.nativeEnum(CurrencyType).default(CurrencyType.NAIRA),
    payment_status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
    payment_method: z.string().optional(),
    delivery_address: z.record(z.string(), z.any()).optional(),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          name: z.string(),
          quantity: z.number().min(1),
          price: z.number().positive(),
        })
      )
      .min(1, 'Order must contain at least one item'),
  })
  .openapi('CreateOrderRequest');

/**
 * Update Order
 */
export const UpdateOrderSchema = z
  .object({
    status: z.nativeEnum(OrderStatus).optional(),
    payment_status: z.nativeEnum(PaymentStatus).optional(),
    notes: z.string().optional(),
    delivery_address: z.record(z.string(), z.any()).optional(),
  })
  .openapi('UpdateOrderRequest');

/**
 * Responses
 */
export const ContactResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  phone_number: z.string(),
});
export const OrderItemResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
});

export const OrderResponseSchema = z.object({
  id: z.uuid(),
  contact: ContactResponseSchema,
  order_number: z.string(),
  total_amount: z.number(),
  currency: z.nativeEnum(CurrencyType),
  status: z.nativeEnum(OrderStatus),
  payment_status: z.nativeEnum(PaymentStatus),
  notes: z.string().nullable(),
});

export const OrderListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    orders: z.array(OrderResponseSchema),
  })
  .openapi('OrderListResponse');

export const OrderDetailsResponseSchema = z
  .object({
    id: z.uuid(),
    contact: ContactResponseSchema,
    order_number: z.string(),
    status: z.nativeEnum(OrderStatus),
    total_amount: z.number(),
    currency: z.nativeEnum(CurrencyType),
    payment_status: z.nativeEnum(PaymentStatus),
    payment_method: z.string(),
    delivery_address: z.record(z.string(), z.any()).nullable(),
    notes: z.string().nullable(),
    items: z.array(OrderItemResponseSchema),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .openapi('OrderDetailListResponse');
