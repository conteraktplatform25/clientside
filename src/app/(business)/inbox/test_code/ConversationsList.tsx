import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInboxConversations } from '@/lib/hooks/business/inbox-conversation.hook';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import type { TConversationResponse } from '@/lib/schemas/business/server/inbox.schema';

export default function ConversationsList({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string) => void;
  selectedId?: string | null;
}) {
  const query = useInboxConversations({ page: 1, limit: 25, search: '' });
  const convs = useMemo(() => query.data?.conversations ?? [], [query.data?.conversations]);

  // read filters from store
  const filters = useInboxStore((s) => s.filters);

  const setCache = useInboxStore((s) => s.setConversationsCache);
  useEffect(() => {
    if (convs.length) setCache(convs);
  }, [convs, setCache]);

  const filtered = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    return convs.filter((c: TConversationResponse) => {
      if (filters.status !== 'ALL' && c.status !== filters.status) return false;
      if (filters.channel !== 'ALL' && c.channel !== filters.channel) return false;
      if (filters.assigned === 'UNASSIGNED' && c.assignee) return false;
      if (filters.assigned === 'ME') {
        // naive: treat any non-null assignee as "me" if not available; ideally compare to current user id
        if (!c.assignee) return false;
      }
      if (search) {
        const name = c.contact?.name ?? '';
        const phone = c.contact?.phone_number ?? '';
        const found =
          name.toLowerCase().includes(search) ||
          phone.toLowerCase().includes(search) ||
          (c.lastMessagePreview ?? '').toLowerCase().includes(search);
        if (!found) return false;
      }

      return true;
    });
  }, [convs, filters]);

  console.log('Trying to get Information:', filtered);

  return (
    <div className='h-full flex flex-col'>
      <div className='overflow-auto'>
        <ul className='divide-y'>
          <AnimatePresence initial={false}>
            {filtered.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className={`p-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 ${selectedId === c.id ? 'bg-slate-100' : ''}`}
                onClick={() => onSelect(c.id)}
              >
                <div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-medium'>
                  {c.contact?.name ? c.contact.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <div className='truncate text-sm font-medium'>
                      {c.contact?.name ?? c.contact?.phone_number ?? 'Unknown'}
                    </div>
                    <div className='text-xs text-slate-400'>
                      {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className='text-xs text-slate-500 truncate'>{c.lastMessagePreview ?? '—'}</div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
