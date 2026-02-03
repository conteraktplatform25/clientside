'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth/auth.store';
import { settingTabs } from '../_constants/settings-nav-tab.constant';
import { ApplicationRole } from '../_types/defaults.settings';

export default function SettingsNavigation() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const visibleTabs = settingTabs.filter((tab) => tab.roles.includes(role as ApplicationRole));
  return (
    <div className='bg-[#F3F4F6] w-full max-w-7xl border shadow-2xl rounded-[10px] p-1 flex flex-wrap md:flex-nowrap gap-2'>
      {visibleTabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative px-4 py-2 rounded-md text-sm z-10 transition-colors',
              isActive ? 'text-primary-base' : 'text-neutral-base hover:text-primary-base',
            )}
          >
            {isActive && (
              <motion.div
                layoutId='settings-tab-indicator'
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className='absolute inset-0 bg-white rounded-md shadow-sm z-[-1]'
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
