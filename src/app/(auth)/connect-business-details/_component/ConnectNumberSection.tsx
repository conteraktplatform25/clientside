'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@reactuses/core';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

import SVGIcon from '@/components/customs/SVGIcons';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { isInvalidParam } from '@/lib/helpers/string-manipulator.helper';
import { staggerContainer, zoomIn } from '@/lib/animations.motion';

export function BusinessDetailsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const decodedEmail = email ? decodeURIComponent(email) : '';
  const full_name = searchParams.get('name');

  const isMobile = useMediaQuery('(max-width: 768px)', false);

  useEffect(() => {
    if (isInvalidParam(email) || isInvalidParam(full_name)) {
      router.replace('/register');
    }
  }, [email, full_name, decodedEmail, router]);
  return (
    <motion.section
      variants={staggerContainer}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className='w-full space-y-4'
    >
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-0.5'>
          <Link href={'/'}>
            <div className='flex gap-2'>
              <SVGIcon
                className=' mt-1.5'
                fileName='icon-logo.svg'
                alt='Concakt Logo'
                width={isMobile ? 29.39 : 45.89}
                height={32.58}
              />
              <div className='mt-1 text-neutral-800 text-3xl font-semibold tracking-tight'>contakt</div>
            </div>
          </Link>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a user?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base hover:text-primary-700'>Login</span>
          </Link>
        </div>
      </div>
      <ScrollArea className='h-[82vh]'>
        <motion.div
          variants={zoomIn}
          className='flex flex-col items-start gap-4 min-h-[82vh] px-4 sm:px-6 lg:px-8 max-w-3xl'
        >
          <div className='max-w-3xl flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='flex flex-col gap-3'>
              <h6 className='font-normal text-lg text-neutral-600'>{`Hi ${full_name}!, still processing your contakt onboarding.`}</h6>
            </div>
            {/* HERO CARD */}
            <div className='mt-2 relative overflow-hidden rounded-[32px] border border-gray-200 bg-white/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]'>
              {/* Decorative blur */}
              <div className='absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-70' />
              <div className='absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-orange-100 blur-3xl opacity-70' />
              <div className='relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10'>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className='w-fit'
                >
                  <div className='flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2'>
                    <Sparkles className='h-4 w-4 text-primary-700' />
                    <span className='text-sm font-medium text-primary-800'>WhatsApp Business API Setup</span>
                  </div>
                </motion.div>
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='space-y-4'
                >
                  <h1 className='max-w-2xl text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 leading-tight'>
                    Connect a number for your WhatsApp Business API Account
                  </h1>

                  <p className='max-w-2xl text-base sm:text-base text-gray-500 leading-relaxed'>
                    Launch campaigns, automate customer conversations and manage support chats with a modern shared
                    inbox experience.
                  </p>
                </motion.div>
                {/* ACTIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='flex flex-col sm:flex-row items-start sm:items-center gap-4'
                >
                  {/* DIALOG + HOVER */}
                  <Dialog>
                    <HoverCard openDelay={120}>
                      <HoverCardTrigger asChild>
                        <DialogTrigger asChild>
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              size='lg'
                              className='h-12 px-6 rounded-2xl bg-primary-base hover:bg-primary-600 shadow-lg shadow-primary-500/20'
                            >
                              Connect a new number
                            </Button>
                          </motion.div>
                        </DialogTrigger>
                      </HoverCardTrigger>
                      {/* SMOOTH HOVER EXPLANATION CARD */}
                      <AnimatePresence>
                        <HoverCardContent
                          align='start'
                          sideOffset={12}
                          className='w-[92vw] sm:w-105 rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-xl p-0 shadow-[0_20px_70px_rgba(0,0,0,0.12)] overflow-hidden'
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{
                              duration: 0.25,
                              ease: 'easeOut',
                            }}
                          >
                            {/* Header */}
                            <div className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-5 py-4'>
                              <h3 className='text-sm font-semibold text-gray-900'>Why Connect your number?</h3>
                            </div>
                            <div className='space-y-5 p-5'>
                              {/* POSITIVE */}
                              <div className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />

                                  <p className='text-sm leading-relaxed text-gray-700'>
                                    Send bulk campaigns and automated notifications
                                  </p>
                                </div>

                                <div className='flex items-start gap-3'>
                                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />

                                  <p className='text-sm leading-relaxed text-gray-700'>
                                    Build automated chat flows and auto-replies
                                  </p>
                                </div>
                              </div>
                              {/* NEGATIVE */}
                              <div className='border-t border-gray-200 pt-5 space-y-4'>
                                <div className='flex items-start gap-3'>
                                  <XCircle className='h-5 w-5 text-red-500 mt-0.5 shrink-0' />

                                  <p className='text-sm leading-relaxed text-gray-700'>
                                    Business contacts and conversations from WhatsApp Business App cannot be synced to
                                    this new number
                                  </p>
                                </div>

                                <div className='flex items-start gap-3'>
                                  <XCircle className='h-5 w-5 text-red-500 mt-0.5 shrink-0' />

                                  <p className='text-sm leading-relaxed text-gray-700'>
                                    Viewing and replying to chats from both WhatsApp Business App and Contakt is not
                                    supported
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </HoverCardContent>
                      </AnimatePresence>
                    </HoverCard>
                    <DialogContent className='w-[80vw] sm:max-w-160 p-0 overflow-hidden rounded-[32px] border-0 shadow-[0_30px_120px_rgba(0,0,0,0.25)]'>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: 'easeOut',
                        }}
                        className='overflow-hidden'
                      >
                        {/* TOP HERO */}
                        <div className='relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 px-3 py-4 sm:px-4 sm:py-6 text-white'>
                          <div className='absolute top-0 right-0 h-56 w-56 bg-white/10 rounded-full blur-3xl' />

                          <div className='relative z-10'>
                            <DialogHeader>
                              <DialogTitle className='text-lg sm:text-2xl font-bold tracking-tight'>
                                Connect your WhatsApp Number
                              </DialogTitle>

                              <DialogDescription className='max-w-xl text-primary-50 text-sm sm:text-base leading-relaxed'>
                                Set up your WhatsApp Business API account to automate customer conversations, launch
                                campaigns and manage chats with your team.
                              </DialogDescription>
                            </DialogHeader>
                          </div>
                        </div>
                        {/* CONTENT */}
                        <div className='bg-white px-4 py-5 sm:px-6 sm:py-6 space-y-3'>
                          {/* FEATURES */}
                          <div className='space-y-3'>
                            {[
                              {
                                title: 'Bulk Messaging',
                                desc: 'Send campaigns, updates and promotional broadcasts to customers.',
                              },
                              {
                                title: 'Automated Workflows',
                                desc: 'Create onboarding flows, chatbot automations and smart replies.',
                              },
                              {
                                title: 'Shared Team Inbox',
                                desc: 'Allow your support and sales teams manage customer conversations together.',
                              },
                            ].map((item, index) => (
                              <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: index * 0.08,
                                }}
                                className='flex items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50/70 p-3'
                              >
                                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-100'>
                                  <CheckCircle2 className='h-5 w-5 text-green-700' />
                                </div>

                                <div className='space-y-1'>
                                  <h4 className='font-semibold text-lg text-gray-900'>{item.title}</h4>

                                  <p className='text-sm leading-relaxed text-gray-600'>{item.desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {/* WARNING */}
                          {/* <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className='rounded-2xl border border-amber-200 bg-amber-50 p-3'
                          >
                            <h4 className='font-semibold text-lg text-amber-900'>Important</h4>

                            <p className='text-sm leading-relaxed text-amber-800'>
                              Once your number is connected to WhatsApp Business API, some WhatsApp Business App
                              features may no longer work on that number.
                            </p>
                          </motion.div> */}
                          {/* ACTIONS */}
                          <div className='flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2'>
                            <Button variant='outline' className='h-11 rounded-2xl'>
                              Cancel
                            </Button>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                className='h-11 rounded-2xl px-6 shadow-lg shadow-primary-500/20'
                                onClick={() => {
                                  window.location.href = `/connect-number?email=${email}&name=${full_name}`;
                                }}
                              >
                                Continue Setup
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </ScrollArea>
    </motion.section>
  );
}
