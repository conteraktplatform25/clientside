'use client';

import React, { FC } from 'react';
import { easeOut, motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';

const features = [
  'One number for your entire team',
  'Easy-to-use interface: no training needed',
  'Real-time updates on orders and payments',
  'Designed for small, growing and large businesses',
];

const WhyChooseSection: FC = () => {
  return (
    <section className='relative z-2 bg-[#F8FAFC] py-16 md:py-32 overflow-hidden '>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='grid lg:grid-cols-2 gap-28 md:gap-4 items-center'>
          {/* LEFT: PHONES */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            viewport={{ once: true, amount: 0.25 }}
            className='relative flex justify-center lg:justify-start'
          >
            <div>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className='absolute -left-0 -bottom-24 z-3'
              >
                <Image
                  src='/images/iPhone-quickreplies.jpg'
                  alt='Quick replies interface'
                  width={160}
                  height={442.82}
                  className='drop-shadow-2xl'
                />
              </motion.div>
              {/* Front phone */}
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                viewport={{ once: true }}
                className='relative z-1 lg:px-28'
              >
                <Image
                  src='/images/iPhone-contacts.jpg'
                  alt='Contacts interface'
                  width={186.44}
                  height={401}
                  className='drop-shadow-2xl'
                />
              </motion.div>
            </div>
          </motion.div>
          {/* RIGHT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='text-center lg:text-left'
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='text-base md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'
            >
              Why Businesses Choose Kontakt
            </motion.h2>
            <ul className='space-y-4'>
              {features.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                  }}
                  viewport={{ once: true }}
                  className='flex items-start gap-2 font-normal text-neutral-600 text-sm md:text-base'
                >
                  <div className='flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-primary-900'>
                    <Check color='white' width={12} height={12} />
                  </div>
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
