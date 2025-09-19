import { TUserMessageProfile } from '@/type/client/business/inbox.type';

export const ConstInboxCategory: string[] = ['All', 'You', 'Unassigned', 'Spam'] as const;
export const ConstChatStatus: string[] = ['Open', 'Close'] as const;
export const ConstTagLabels: string[] = [
  'All',
  'No Label Attached',
  'Adunni Party',
  'Canada',
  'COD',
  'Delivery Delay',
  'Friday Order',
  'Monday Order',
  'Newbie',
  'Next Monday',
  'US',
  'Wedneday Order',
  'White Label',
  'Will Look Into',
] as const;
export const ConstAssignee: string[] = ['All', 'Unassigned', 'Michael Adewale', 'Jame Jimoh'] as const;
export const ConstSorting: string[] = ['Newest', 'Oldest'] as const;

export const ConstMessageProfile: TUserMessageProfile[] = [
  {
    userId: 1,
    full_name: 'Adewale Soliu',
    initials: 'AS',
    message:
      'Hello, Thanks for your message. This line is available from 9am till 5pm Monday to Saturday. Please order or get product info on our website https://www.adunniorganics.com It is available 24 hours a day, 7 days a week. (Paid orders will be processed next working day.)',
    tag_title: 'Friday_order',
    agent: 'Amaka',
    time: '11:24pm',
    color: '#207120',
    color_text: 'text-[#207120]',
  },
  {
    userId: 12,
    full_name: 'Michael Daramola',
    initials: 'MD',
    message: 'Thank you for your order...',
    agent: 'Amaka',
    time: '15:02pm',
  },
  {
    userId: 18,
    full_name: 'Uchenna Amadi',
    initials: 'UA',
    message: 'I have paid',
    tag_title: 'Wednesday order',
    agent: 'Jimoh',
    time: '08:02am',
    color: '#a13729',
    color_text: 'text-[#a13729]',
  },
];
