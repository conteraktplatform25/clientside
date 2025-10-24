import { ISelectOption } from '@/type/client/default.type';

export const ConstGetStarted: string[] = [
  'Connect your number',
  'Setup whatsapp profile',
  'Create product catalogue',
  'Set up quick replies',
  'Add contacts',
];

export const ConstUserTask: ISelectOption[] = [
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
    value: 'productCatalogue',
    label: 'Create product catalogue',
    href: '/catalogue/create',
  },
  {
    value: 'quickReplies',
    label: 'Setup quick replies',
    href: '/messaging/quick-replies',
  },
  {
    value: 'contactInformtion',
    label: 'Add contacts',
    href: '/profile/contact-info',
  },
];
