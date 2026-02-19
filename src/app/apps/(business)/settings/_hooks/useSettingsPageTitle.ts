'use client';

import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const titleMap: Record<string, string> = {
  '/settings/user-profile': 'User Profile',
  '/settings/business-profile': 'Business Profile',
  '/settings/security-setup': 'Security Setup',
  '/settings/manage-team': 'Manage Team',
  '/settings/manage-tags': 'Manage Tags',
  '/settings/roles-permissions': 'Roles & Permissions',
};

export function useSettingsPageTitle() {
  const pathname = usePathname();
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    const title = titleMap[pathname];
    if (title) setTitle(title);
  }, [pathname, setTitle]);
}
