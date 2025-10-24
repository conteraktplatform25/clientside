'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SetupComplete() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md mx-auto p-6 bg-success-light/10 border border-success-light rounded-2xl text-center shadow-sm'
    >
      <div className='flex justify-center mb-3'>
        <CheckCircle2 className='text-success-base w-12 h-12' />
      </div>
      <h3 className='text-xl font-semibold text-neutral-800'>Setup Complete 🎉</h3>
      <p className='text-neutral-base mt-2 mb-4'>
        You’ve successfully completed your Contakt setup! Your account is ready to go.
      </p>
      <div className='flex flex-col sm:flex-row justify-center gap-3'>
        <a
          href='/dashboard'
          className='px-4 py-2 bg-primary-base text-white rounded-md hover:bg-primary-700 transition'
        >
          Go to Dashboard
        </a>
        <a
          href='/help/getting-started'
          className='px-4 py-2 border border-primary-base text-primary-base rounded-md hover:bg-primary-700/20 transition'
        >
          Learn More
        </a>
      </div>
    </motion.div>
  );
}
