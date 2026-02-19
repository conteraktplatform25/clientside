'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SVGIcon from '@/components/custom/SVGIcons';

const HeroSection: FC = () => {
  return (
    <section className='relative bg-primary-50 py-6 md:py-12 overflow-hidden'>
      <div className='relative z-1 container mx-auto px-4'>
        {/* Hero Content */}
        <div className='max-w-2xl mx-auto text-center md:mb-84'>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='text-4xl md:text-[64px] leading-tight font-bold text-primary-900 mb-4'
          >
            Stay Connected. Sell Smarter.{' '}
            <span className='bg-gradient-to-r from-[rgba(18,115,241,1)] to-[rgba(116,84,218,1)] text-transparent bg-clip-text'>
              Grow Faster
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className='w-full md:max-w-lg mx-auto'
          >
            <p className='text-lg md:text-xl text-neutral-base mb-8 text-center'>
              Contakt helps you manage all your customer conversations, orders, and payments from one place — whether
              you&apos;re on your phone or at your desk.
            </p>
          </motion.div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-4 mb-12'>
            <motion.a
              href='#'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-primary-base text-white px-6 py-3 rounded-[10px] font-medium shadow-md hover:bg-primary-600 transition-colors cursor-pointer'
            >
              Download the app →
            </motion.a>
            <motion.a
              href='#'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='text-primary-base px-6 py-3 rounded-[10px] font-medium border border-primary-base hover:bg-primary-100 transition-colors cursor-pointer'
            >
              Learn more
            </motion.a>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            className='w-full flex gap-2 items-center justify-center mb-4'
          >
            <p className='text-sm text-neutral-500'>Available on:</p>
            <div className='flex justify-center gap-4'>
              <SVGIcon fileName='playstore-icon.svg' alt='playstore-icon' />
              <SVGIcon fileName='apple-icon.svg' alt='apple-icon' />
            </div>
          </motion.div>
        </div>
        {/* App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
          className='hidden md:block absolute top-[370px] left-1/2 transform -translate-x-1/2 -translate-y-[0%] mt-16 w-[70%] rounded-xl shadow-2xl overflow-hidden border border-neutral-200 bg-white'
        >
          {/* Browser bar simulation */}
          <div className='flex items-center px-4 py-2 bg-neutral-100 border-b border-neutral-200'>
            <div className='flex space-x-2'>
              <div className='w-3 h-3 rounded-full bg-error-base'></div>
              <div className='w-3 h-3 rounded-full bg-warning-base'></div>
              <div className='w-3 h-3 rounded-full bg-success-base'></div>
            </div>
            <div className='flex-1 text-center text-sm text-neutral-600'>https://usecontakt.com</div>
          </div>
          {/* Mockup content - use an image or replicate with components */}
          <Image
            src='/images/inbox_expanded.png' // Replace with actual mockup image path
            alt='Contakt Inbox Interface'
            width={1200}
            height={800}
            className='w-full h-auto'
          />
        </motion.div>
      </div>
      {/* Decorative elements like the chat bubble and notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        className='hidden md:inline absolute top-64 left-48'
      >
        <Image
          src='/images/img-hero_1.png' // Replace with actual mockup image path
          alt='Hero Icon'
          width={75.29}
          height={75.29}
          className='w-full h-auto'
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
        className='hidden md:inline absolute top-20 right-40'
      >
        <Image
          src='/images/img-comment_1.png' // Replace with actual mockup image path
          alt='Comment Icon'
          width={75.29}
          height={75.29}
          className='w-full h-auto'
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
