import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { PaginationResponsechema } from '../pagination.schema';

extendZodWithOpenApi(z);

export const QuickReplyQuerySchema = z
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
    sortBy: z.enum(['created_at', 'usageCount']).default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .openapi('QuickRepliesQuery');

export const QuickReplyDetailsResponseSchema = z
  .object({
    id: z.uuid(),
    title: z.string(),
    shortcut: z.string().nullable().optional(),
    content: z.string(),
    category: z.string().nullable().optional(),
    isActive: z.boolean().default(false),
    variables: z.record(z.string(), z.any()).nullable().optional(),
    createdById: z.string().nullable().optional(),
    is_global: z.boolean().default(false),
    usageCount: z.number().default(0),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  })
  .openapi('QuickReplyDetailsResponse');

export const QuickReplyResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  isActive: z.boolean().default(false),
  variables: z.record(z.string(), z.any()).nullable().optional(),
  createdById: z.string().nullable().optional(),
  created_at: z.coerce.date(),
});

export const QuickReplyListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    replies: z.array(QuickReplyResponseSchema),
  })
  .openapi('QuickReplyListResponse');

export const CreateQuickReplyRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    shortcut: z.string().optional().nullable(), // e.g. "/welcome"
    content: z.string().min(1, 'Content is required'),
    category: z.string().optional().nullable(),
    is_global: z.boolean().optional(),
  })
  .openapi('CreateQuickReplyRequest');

export const UpdateQuickReplyRequestSchema = CreateQuickReplyRequestSchema.partial().openapi('UpdateQuickReplyRequest');

export const CreateQuickReplyResponseSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    created_at: z.coerce.date(),
  })
  .openapi('CreateQuickReplyResponse');
export const UpdateQuickReplyResponseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  updated_at: z.coerce.date(),
});
