import React from 'react';
import TopNotification from '../../custom/TopNotification';
import { DataTableField } from '@/components/custom/DataTableField';
import { BroadcastTableHeaders } from './_component/BroadcastTableHeader';
import { ConstBroadcastProfile as broadcasts } from '@/lib/constants/broadcast-message.constant';
//import AddBroadcast from './_component/AddBroadcast';
import BroadcastDrawer from './_component/BroadcastDrawer';

const BroadcastMessaging = () => {
  return (
    <div className='flex flex-col item-start gap-0 m-0'>
      <TopNotification />
      <div className='flex flex-col gap-3 px-4'>
        {/* <QuickReplyDataTable columns={QuickReplyTableHeaders} data={replies} /> */}
        <DataTableField columns={BroadcastTableHeaders} data={broadcasts}>
          <BroadcastDrawer />
        </DataTableField>
      </div>
    </div>
  );
};

export default BroadcastMessaging;
