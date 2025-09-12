import { ISideMenuProps } from '@/type/client/default.type';
import { Bolt, House, Mail, Megaphone, NotepadText, Settings, UserRound } from 'lucide-react';
// Menu items.
export const ConstAdminSideMenu: ISideMenuProps[] = [
  {
    title: 'Home',
    url: '/',
    icon: House,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Mail,
  },
  {
    title: 'Automated Messaging',
    url: '/automated-messaging',
    icon: Megaphone,
  },
  {
    title: 'Contact',
    url: '/contact',
    icon: UserRound,
  },
  {
    title: 'Integration',
    url: '/integration',
    icon: Bolt,
  },
  {
    title: 'Catalogue Sharing',
    url: '/catalogue-sharing',
    icon: NotepadText,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
] as const;
