'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SVGIcon from '@/components/custom/SVGIcons';
import { useMediaQuery } from '@reactuses/core';

const FooterSection: FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  return (
    <footer className='bg-[#F1F5F9] py-10 lg:py-12 px-6 overflow-hidden'>
      <div className='container mx-auto px-6'>
        {/* Top Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='max-w-sm'
          >
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2'>Get Started Now</h2>

            <p className='text-neutral-base text-lg leading-relaxed'>
              Join hundreds of businesses using Kontakt to stay organized, delight customers, and grow faster.
            </p>
          </motion.div>
          {/* Right CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='w-full lg:w-auto'
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className='w-full lg:w-auto inline-flex items-center justify-center gap-2
              bg-blue-600 text-white font-medium
              px-8 py-4 rounded-xl shadow-lg
              hover:bg-blue-700 transition-colors duration-300'
            >
              Get started
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
        {/* Bottom Bar */}
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-8 border-t border-gray-200'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className='pt-6 flex items-center gap-2'
          >
            {/* Replace with your logo */}
            <SVGIcon
              className=' mt-1.5'
              fileName='icon-logo.svg'
              alt='Concakt Logo'
              width={isMobile ? 29.39 : 45.89}
              height={32.58}
            />
            <span className='text-lg font-semibold text-gray-900'>Contakt</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className=' pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500'
          >
            <span>© Copyright 2025 Contakt platform. All Rights Reserved&nbsp;</span>
            <div className='flex items-center'>
              <Link
                href='/privacy-policy'
                className='text-primary-base hover:text-primary-700 transition-colors duration-200 underline underline-offset-2'
              >
                Privacy Policy
              </Link>
              <span>&nbsp;and&nbsp;</span>
              <Link
                href='/terms-condition'
                className='text-primary-base hover:text-primary-700 transition-colors duration-200 underline underline-offset-2'
              >
                Terms & Conditions
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
