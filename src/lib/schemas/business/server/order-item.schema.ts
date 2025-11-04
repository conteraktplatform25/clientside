import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * Create / Update Order Item
 */
export const CreateOrderItemSchema = z
  .object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.union([z.number(), z.string().transform(Number)]),
  })
  .openapi('CreateOrderItemRequest');

export const UpdateOrderItemSchema = z
  .object({
    quantity: z.number().min(1).optional(),
    price: z.union([z.number(), z.string().transform(Number)]),
  })
  .openapi('UpdateOrderItemRequest');

export const OrderItemResponseSchema = z
  .object({
    id: z.uuid(),
    orderId: z.uuid(),
    name: z.string(),
    quantity: z.number(),
    price: z.union([z.number(), z.string().transform(Number)]),
    total: z.number(),
  })
  .openapi('OrderItemResponse');
