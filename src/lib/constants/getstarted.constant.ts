import { IGettingStartedOption } from '@/type/client/default.type';

export const ConstGetStarted: string[] = [
  'Connect your number',
  'Setup whatsapp profile',
  'Create product catalogue',
  'Set up quick replies',
  'Add contacts',
];

export const ConstUserTask: IGettingStartedOption[] = [
  {
    value: 'phoneNumber',
    label: 'Connect your number',
    href: '/profile/settings',
  },
  {
    value: 'businessProfile',
    label: 'Setup whatsapp profile',
    href: '/business/profile',
  },
  {
    value: 'contactInformation',
    label: 'Add contacts',
    href: '/contacts',
  },
  {
    value: 'productCatalogue',
    label: 'Create product catalogue',
    href: '/catalogue-sharing',
  },
  {
    value: 'quickReplies',
    label: 'Setup quick replies',
    href: '/messaging/quick-reply',
  },
];
