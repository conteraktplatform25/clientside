// /components/inbox/InboxFilters.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InboxFilterState } from '@/lib/schemas/business/server/inbox.schema';
import { Input } from '@/components/ui/input';

export default function InboxFilters({ onChange }: { onChange: (filters: InboxFilterState) => void }) {
  const [status, setStatus] = useState<InboxFilterState['status']>('ALL');
  const [channel, setChannel] = useState<InboxFilterState['channel']>('ALL');
  const [assigned, setAssigned] = useState<InboxFilterState['assigned']>('ALL');
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    const handleUpdate = () => {
      onChange({ status, channel, assigned, search });
    };
    const debounce = setTimeout(() => handleUpdate(), 300);
    return () => clearTimeout(debounce);
  }, [status, channel, assigned, search, onChange]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-3 border-b bg-white space-y-3'>
      <div className='flex flex-col items-start gap-4'>
        {/* Search */}
        <Input
          type='text'
          value={search}
          placeholder='Search contacts or messages...'
          onChange={(e) => setSearch(e.target.value)}
          className='border rounded-lg p-2 text-sm w-full'
        />
        <div className='grid grid-cols-3 gap-3'>
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InboxFilterState['status'])}
            className='border rounded-lg p-2 text-xs'
          >
            <option value='ALL'>All Status</option>
            <option value='OPEN'>Open</option>
            <option value='CLOSED'>Closed</option>
            <option value='ARCHIVED'>Archived</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as InboxFilterState['channel'])}
            className='border rounded-lg p-2 text-xs'
          >
            <option value='ALL'>All Channels</option>
            <option value='WHATSAPP'>WhatsApp</option>
            <option value='WEBCHAT'>WebChat</option>
            <option value='SMS'>SMS</option>
            <option value='EMAIL'>Email</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigned}
            onChange={(e) => setAssigned(e.target.value as InboxFilterState['assigned'])}
            className='border rounded-lg p-2 text-xs'
          >
            <option value='ALL'>Assignee: All</option>
            <option value='UNASSIGNED'>Unassigned</option>
            <option value='ME'>Assigned to me</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
