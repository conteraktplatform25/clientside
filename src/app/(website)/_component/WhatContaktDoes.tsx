'use client';

import React, { FC } from 'react';
import { easeOut, motion } from 'framer-motion';
import Image from 'next/image';
import { Check, SendHorizonal, SmileIcon } from 'lucide-react';

const bulletPoints = [
  'Chat with all your customers from one shared number',
  'Share products, track orders, and send automated updates',
  'Tag and organize customers (like "high spender" or "new buyer")',
  'Receive payments directly inside the app',
];

const WhatContaktDoesSection: FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };
  return (
    <section className='relative z-2 bg-white py-16 md:py-24'>
      <div className='container mx-auto px-4 max-w-5xl'>
        {/* Main Content: What Contakt Does */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 items-center mb-16 md:mb-24'
        >
          {/* Text Content */}
          <motion.div variants={itemVariants} className='order-2 md:order-1 block space-y-4'>
            <h2 className='text-3xl md:text-4xl font-bold text-neutral-900 leading-tight'>What Contakt Does</h2>
            <p className='text-sm sm:text-base text-neutral-600 leading-relaxed'>
              Running a business shouldn&apos;t mean juggling WhatsApp chats, spreadsheets, and payment links. With
              Contakt, you can:
            </p>
            <ul className='space-y-2'>
              {bulletPoints.map((point, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className='flex items-start gap-4 text-neutral-700 text-sm md:text-base'
                >
                  <div className='flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-primary-900'>
                    <Check color='white' width={12} height={12} />
                  </div>
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          {/* Image with Overlays */}
          <motion.div variants={itemVariants} className='relative order-1 md:order-2 max-w-[360px] mx-auto lg:mx-0'>
            <div className='relative rounded-[10px] overflow-hidden shadow-2xl border border-neutral-200/60'>
              <Image
                src='/images/man-using-phone.jpg' // Replace with actual image path
                alt='Entrepreneur using Contakt app'
                width={539}
                height={527}
                className='w-full h-auto object-cover'
              />
            </div>
            {/* Payment Link Bubble - now interactive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              whileHover={{ scale: 1.04, y: -6, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.4 }}
              viewport={{ once: true }}
              className='absolute top-6 sm:top-8 -right-4 sm:-right-18 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-[10px] shadow-xl border border-neutral-200/70 max-w-[220px] sm:max-w-[280px] cursor-pointer'
            >
              <div className='flex items-start justify-between'>
                <p className='text-sm text-neutral-800 font-medium leading-snug'>
                  Click this link to complete your payment...
                </p>
                <div className='mt-3 flex justify-end gap-4'>
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className='border-[#DEE2E6] px-1.5 py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center'
                  >
                    <SmileIcon className='' width={13.31} height={13.31} />
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className='bg-primary-base text-white px-1.5 py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 shadow-sm'
                  >
                    <SendHorizonal width={13.31} height={13.31} />
                  </motion.span>
                </div>
              </div>
            </motion.div>
            {/* Order Info Card - interactive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.04, y: -8, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              viewport={{ once: true }}
              className='absolute -bottom-6 sm:bottom-2 -left-4 sm:-left-24 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-[10px] shadow-xl border border-neutral-200/70 w-[260px]'
            >
              <h4 className='font-semibold text-sm sm:text-[15.41px] mb-3 text-neutral-900'>Order Information</h4>
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 items-start justify-between text-sm text-neutral-600 text-[13.48px] leading-[155%]'>
                <span className='font-medium text-neutral-400'>Order ID</span>
                <span className='text-right font-semibold text-neutral-800'>#014</span>
                <span className='font-medium text-neutral-400'>Order Date</span>
                <span className='text-right font-medium text-neutral-800'>12/09/2025</span>
                <span className='font-medium text-neutral-400'>Order Status</span>
                <div className='flex items-center justify-end gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-warning-base' />
                  <span className='font-medium text-warning-700'>Pending</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Built for Your Day-to-Day */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-0 items-start'
        >
          <motion.h2
            variants={itemVariants}
            className='text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 leading-tight w-full sm:max-w-[90%] lg:max-w-[75%]'
          >
            Built for Your Day-to-Day
          </motion.h2>
          <motion.p variants={itemVariants} className='text-base md:text-lg text-neutral-600 leading-relaxed'>
            Whether you&apos;re handling sales, dispatch, or customer service, Contakt keeps everyone on the same page.
            Use it on Mobile and Web devices to track orders, payments, performance, manage chats and sales on the go.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatContaktDoesSection;
