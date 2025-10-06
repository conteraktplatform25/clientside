import React from 'react';
import { QuickReplyTableHeaders } from './_component/QuickReplyTableHeaders';
import { ConstQuickReplyProfile as replies } from '@/lib/constants/quick-reply.constant';
import { DataTableField } from '@/components/custom/DataTableField';
import AddQuickReply from './_component/AddQuickReply';

const QuickReplyMessaging = () => {
  return (
    <div className='flex flex-col item-start gap-0 m-0'>
      <div className='flex flex-col gap-3'>
        <DataTableField columns={QuickReplyTableHeaders} data={replies} title='Quick Reply'>
          <AddQuickReply />
        </DataTableField>
      </div>
    </div>
  );
};

export default QuickReplyMessaging;
