'use client';
import { Bell } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import NotificationList from './NotificationList';

const NotificationBell = ({ userId }: { userId?: string }) => {
  const [unread, setUnread] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const fetchUnread = useCallback(async () => {
    const headers: HeadersInit = userId ? { 'x-user-id': userId } : {};
    const res = await fetch('/api/notifications/count', { headers });
    const data = await res.json();
    setUnread(data.profile);
  }, [userId]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);
  return (
    <div className='relative'>
      <Button variant={'ghost'} onClick={() => setOpen(!open)} className='relative p-2  hover:bg-gray-100'>
        <Bell width={28} height={33} className='w-[28px] h-[33px]' />
        {unread > -1 && (
          <span className='absolute top-[2px] right-[4px] bg-red-500 text-white text-xs rounded-full px-1'>
            {unread}
          </span>
        )}
      </Button>
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border'>
          <NotificationList userId={userId!} onRead={fetchUnread} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
