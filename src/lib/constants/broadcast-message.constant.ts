import { IBroadcastMessageTableHeaderProps } from '@/type/client/business/broadcast.type';

export const ConstBroadcastProfile: IBroadcastMessageTableHeaderProps[] = [
  {
    id: 1,
    title: 'All orders dispatched',
    created_by: 'Precious O.',
    state: 'Sent',
    recipients: '5 recipient',
  },
  {
    id: 2,
    title: 'New product Launch announcement',
    created_by: 'Dolapo M.',
    state: 'Scheduled',
    recipients: '2 recipient',
  },
  {
    id: 3,
    title: 'Easter Sales',
    created_by: 'Mayowa B',
    state: 'Sent',
    recipients: '4 recipient',
  },
  {
    id: 4,
    title: 'Delay in order dispatch',
    created_by: 'Alfred J',
    state: 'Draft',
    recipients: '8 recipient',
  },
];
