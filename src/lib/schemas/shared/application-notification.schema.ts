import { NotificationTemplateTypeEnum } from '@/lib/enums/shared/application-notification.enums';
import { AppNotificationType } from '@prisma/client';
import { z } from 'zod';

export const ApplicationNotificationSchema = z.object({
  id: z.uuid(),
  recipientId: z.string(),
  senderId: z.string().nullable(),
  type: z.nativeEnum(AppNotificationType),
  channel: z.nativeEnum(NotificationTemplateTypeEnum),
  title: z.string(),
  body: z.string().nullable(),
  data: z
    .record(
      z.string(),
      z.object({
        type: z.enum(['text', 'number', 'date', 'boolean']),
        value: z.any(),
      }),
    )
    .optional(),
  isRead: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  expiresAt: z.coerce.date().nullable(),
});

export const GetNotificationsResponseSchema = z.object({
  ok: z.boolean(),
  profile: z.object({
    notifications: z.array(ApplicationNotificationSchema),
    unreadCount: z.number().int(),
  }),
});

export const UnauthorizedResponseSchema = z.object({
  ok: z.literal(false),
  message: z.literal('UNAUTHORIZED'),
});

export const MarkAllReadSuccessResponseSchema = z.object({
  ok: z.literal(true),
  profile: z.object({
    updated: z.number().int(),
  }),
});
