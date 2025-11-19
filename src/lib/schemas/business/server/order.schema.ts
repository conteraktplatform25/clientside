import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
//import { PaginationSchema } from '../pagination.schema';
import { PaginationResponsechema } from '../pagination.schema';
import { CurrencyType, OrderStatus, PaymentStatus } from '@prisma/client';
import { CreateContactSchema } from './contacts.schema';
import { CreateOrderItemSchema } from './order-item.schema';

extendZodWithOpenApi(z);

const DateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .openapi({
    example: '2025-01-01',
    description: 'Date formatted as YYYY-MM-DD',
  });

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
    startDate: DateOnly.optional(),
    endDate: DateOnly.optional(),
    search: z.string().optional(),
    sortBy: z.enum(['created_at', 'order_number']).default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    status: z.nativeEnum(OrderStatus).optional(),
  })
  .openapi('OrderQuery');

/**
 * Create Order
 */
export const CreateOrderRequestSchema = z
  .object({
    contactId: z.string().optional(),
    contact: CreateContactSchema.optional(),
    items: z.array(CreateOrderItemSchema).min(1, 'Order must contain at least one item'),
    //order_number: z.string().min(1), // Orders Should Auto-Generate order_number for example const order_number = "ORD-" + nanoid(10);
    currency: z.nativeEnum(CurrencyType).optional().default(CurrencyType.NAIRA),
    payment_method: z.string().optional(),
    delivery_address: z.record(z.string(), z.any()).optional(),
    notes: z.string().optional(),
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

const OrderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  total_amount: z.number(),
});

export const CreateOrderResponseSchema = z
  .object({
    contactName: z.string(),
    contactPhone: z.string(),
    order: OrderSchema,
  })
  .openapi('CreateOrderResponse');

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
  contactId: z.uuid(),
  contact_name: z.string(),
  contact_phone_number: z.string(),
  order_number: z.string(),
  total_amount: z.number(),
  status: z.nativeEnum(OrderStatus),
  payment_status: z.nativeEnum(PaymentStatus),
  created_at: z.coerce.date(),
});

const OrderSummarySchema = z.object({
  totalOrders: z.number().default(0),
  totalRevenue: z.number().default(0.0),
});

export const OrderListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    orders: z.array(OrderResponseSchema),
    summary: OrderSummarySchema,
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
