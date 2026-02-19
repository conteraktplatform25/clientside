'use client';
import React, { useEffect } from 'react';
import { DataTableField } from '@/components/custom/DataTableField';
import { BroadcastTableHeaders } from './_component/BroadcastTableHeader';
import { ConstBroadcastProfile as broadcasts } from '@/lib/constants/broadcast-message.constant';
//import AddBroadcast from './_component/AddBroadcast';
import BroadcastDrawer from './_component/BroadcastDrawer';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const BroadcastMessaging = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Automated Messaging');
  }, [setTitle]);
  return (
    <div className='flex flex-col item-start gap-0 m-0'>
      <div className='flex flex-col gap-3 px-4'>
        <DataTableField columns={BroadcastTableHeaders} data={broadcasts} title='Broadcast Message'>
          <BroadcastDrawer />
        </DataTableField>
      </div>
    </div>
  );
};

export default BroadcastMessaging;
