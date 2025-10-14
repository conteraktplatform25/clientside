import { ISideMenuProps } from '@/type/client/default.type';
import { Bolt, House, Mail, Megaphone, NotepadText, Settings, ShoppingCart, UserRound } from 'lucide-react';
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
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Automated Messaging',
    icon: Megaphone,
    submenu: [
      {
        title: 'Quick reply',
        url: '/messaging/quick-reply',
      },
      {
        title: 'Broadcast messages',
        url: '/messaging/broadcast',
      },
    ],
  },
  {
    title: 'Contacts',
    url: '/contacts',
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
