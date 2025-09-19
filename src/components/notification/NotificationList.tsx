import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import React, { useCallback, useEffect, useState } from 'react';

interface INotificationProps {
  id: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList = ({ userId, onRead }: { userId: string; onRead?: () => void }) => {
  const [notifications, setNotifications] = useState<INotificationProps[]>([]);

  // async function fetchNotifications() {
  //   const res = await fetchWithIndicatorHook('/api/notifications?limit=10', {
  //     headers: { 'x-user-id': userId },
  //   });
  //   const data = await res.json();
  //   console.log('Client Notification List:', data);
  //   setNotifications(data.profile.notifications);
  // }
  const fetchNotifications = useCallback(async () => {
    const headers: HeadersInit = userId ? { 'x-user-id': userId } : {};
    const res = await fetchWithIndicatorHook('/api/notifications?limit=10', {
      headers,
    });
    const data = await res.json();
    setNotifications(data.profile.notifications);
  }, [userId]);

  async function markAsRead(id: string) {
    await fetchWithIndicatorHook(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'x-user-id': userId! },
    });
    fetchNotifications();
    onRead?.();
  }

  async function deleteNotif(id: string) {
    await fetchWithIndicatorHook(`/api/notifications/${id}/delete`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId! },
    });
    fetchNotifications();
    onRead?.();
  }

  useEffect(() => {
    fetchNotifications();
  }, [userId, fetchNotifications]);

  if (!notifications.length) {
    return <div className='p-4 text-sm text-gray-500'>No notifications</div>;
  }
  return (
    <div className='max-h-96 overflow-y-auto'>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDelete={deleteNotif} />
      ))}
    </div>
  );
};

const NotificationItem = ({
  notification,
  onRead,
  onDelete,
}: {
  notification: INotificationProps;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div
      className={`flex justify-between items-start p-3 border-b hover:bg-gray-50 ${
        notification.isRead ? 'opacity-70' : ''
      }`}
    >
      <div>
        <div className='font-medium'>{notification.title}</div>
        {notification.body && <div className='text-sm text-gray-600'>{notification.body}</div>}
        <div className='text-xs text-gray-400'>{new Date(notification.createdAt).toLocaleString()}</div>
      </div>
      <div className='flex gap-2'>
        {!notification.isRead && (
          <button className='text-blue-500 text-xs' onClick={() => onRead(notification.id)}>
            Mark Read
          </button>
        )}
        <button className='text-red-500 text-xs' onClick={() => onDelete(notification.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
