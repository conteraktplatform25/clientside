import React from 'react';
import TopNotification from '../custom/TopNotification';
import ChatRoom from './ChatRoom';

const InboxPage = () => {
  return (
    <div className='flex flex-col item-start gap-0 m-0'>
      <TopNotification />
      <div className='flex flex-col gap-3'>
        <ChatRoom />
      </div>
    </div>
  );
};

export default InboxPage;
