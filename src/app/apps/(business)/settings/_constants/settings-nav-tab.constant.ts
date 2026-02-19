import { ISettingsTab } from '../_types/defaults.settings';

export const settingTabs: ISettingsTab[] = [
  {
    label: 'User Profile',
    href: '/settings/user-profile',
    roles: ['Business', 'Agent', 'Manager'],
    title: 'User Profile',
  },
  {
    label: 'Business Profile',
    href: '/settings/business-profile',
    roles: ['Manager', 'Business'],
    title: 'Business Profile',
  },
  {
    label: 'Security Setup',
    href: '/settings/security-setup',
    roles: ['Business', 'Agent', 'Manager'],
    title: 'Security Setup',
  },
  {
    label: 'Manage Team',
    href: '/settings/manage-team',
    roles: ['Business'],
    title: 'Manage Team',
  },
  {
    label: 'Manage Tags',
    href: '/settings/manage-tags',
    roles: ['Manager', 'Business'],
    title: 'Manage Tags',
  },
  {
    label: 'Roles & Permission',
    href: '/settings/roles-permissions',
    roles: ['Business'],
    title: 'Roles & Permissions',
  },
];
