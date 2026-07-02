'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';

export function ServerIndicator() {
  const isLoading = useServerIndicatorStore((state) => state.isLoading);
  const [progress, setProgress] = useState(0);

  // Simulate progress increments while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.random() * 10 : p)); // cap at ~90%
      }, 300);
    } else {
      setProgress(100); // finish
      const timeout = setTimeout(() => setProgress(0), 400); // reset after complete
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className='fixed top-0 left-0 w-full h-1 z-50'>
      <AnimatePresence>
        {isLoading || progress > 0 ? (
          <motion.div
            key='progress-bar'
            className='h-1 bg-blue-500 shadow-md'
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
