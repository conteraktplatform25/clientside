'use client';

import React from 'react';
import SettingsNavigation from './_component/SettingsNavigation';
import { useSettingsPageTitle } from './_hooks/useSettingsPageTitle';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useSettingsPageTitle();
  return (
    <div className='flex flex-col gap-4 mt-4 px-12'>
      <SettingsNavigation />
      <AnimatePresence mode='wait'>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
