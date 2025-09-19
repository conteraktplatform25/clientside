import prisma from '@/lib/prisma';
import { supabase } from './superbase/client';
import { AppNotificationType, NotificationTemplateType } from '@prisma/client';

export async function createAppNotification({
  recipientId,
  senderId,
  type,
  title,
  body,
  data,
  channel = NotificationTemplateType.IN_APP,
  expiresAt,
}: {
  recipientId: string;
  senderId?: string | null;
  type: AppNotificationType;
  title: string;
  body?: string;
  data?: Record<string, object>;
  channel?: NotificationTemplateType;
  expiresAt?: Date | null;
}) {
  const notif = await prisma.applicationNotification.create({
    data: {
      recipientId,
      senderId,
      type,
      title,
      body,
      data,
      channel,
      expiresAt,
    },
  });

  // Optional: push realtime update
  try {
    await supabase.channel(`user:${recipientId}`).send({
      type: 'broadcast',
      event: 'new-notification',
      payload: notif,
    });
  } catch (err) {
    console.error('Supabase broadcast failed', err);
  }

  return notif;
}

/**
 * Get notifications for a specific user
 */
export async function getUserNotifications(userId: string, limit = 20, offset = 0) {
  return prisma.applicationNotification.findMany({
    where: { recipientId: userId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Count unread notifications
 */
export async function countUnreadNotifications(userId: string) {
  return prisma.applicationNotification.count({
    where: { recipientId: userId, isRead: false, isDeleted: false },
  });
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  return prisma.applicationNotification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return prisma.applicationNotification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true },
  });
}

/**
 * Soft delete a notification
 */
export async function deleteNotification(notificationId: string) {
  return prisma.applicationNotification.update({
    where: { id: notificationId },
    data: { isDeleted: true },
  });
}

/**
 * Hard delete (use with caution)
 */
export async function hardDeleteNotification(notificationId: string) {
  return prisma.applicationNotification.delete({
    where: { id: notificationId },
  });
}
