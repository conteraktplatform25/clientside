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
    href: '/apps/settings/manage-team',
  },
  {
    value: 'businessProfile',
    label: 'Setup whatsapp profile',
    href: '/apps/settings/business-profile',
  },
  {
    value: 'contactInformation',
    label: 'Add contacts',
    href: '/apps/contacts',
  },
  {
    value: 'productCatalogue',
    label: 'Create product catalogue',
    href: '/apps/catalogue-sharing',
  },
  {
    value: 'quickReplies',
    label: 'Setup quick replies',
    href: '/apps/messaging/quick-reply',
  },
];
