'use client';

import { useMediaQuery } from '@reactuses/core';
import { motion } from 'framer-motion';
import { blurIn, staggerContainer } from '@/lib/animations.motion';
import SVGIcon from '@/components/customs/SVGIcons';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaCheckCircle } from 'react-icons/fa';
import { IoShieldCheckmarkSharp, IoLogoWhatsapp } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface IRegistrationCompletedSectionProps {
  businessName?: string;
  displayPhone?: string;
  verifiedName?: string;
}
interface ISummaryItemProps {
  label: string;
  value: React.ReactNode;
}

function SummaryItem({ label, value }: Readonly<ISummaryItemProps>) {
  return (
    <div className='space-y-0.5'>
      <p className='text-sm font-medium text-neutral-500'>{label}</p>
      <div className='text-base font-semibold text-neutral-700'>{value}</div>
    </div>
  );
}

function ReadyItem({ text }: Readonly<{ text: string }>) {
  return (
    <div className='flex items-center gap-3'>
      <FaCheckCircle className='text-success-base' size={14} />
      <span className='text-neutral-700 text-sm'>{text}</span>
    </div>
  );
}

const RegistrationCompletedSection = ({
  businessName,
  displayPhone,
  verifiedName,
}: Readonly<IRegistrationCompletedSectionProps>) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:768px)', false);

  const handleLogin = () => {
    sessionStorage.removeItem('meta-onboarding');
    router.push('/login');
  };
  return (
    <motion.section variants={staggerContainer} initial='hidden' animate='visible' className='w-full'>
      {/* Header */}
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8 py-6'>
        <Link href='/'>
          <div className='flex gap-2'>
            <SVGIcon className='mt-1' fileName='icon-logo.svg' alt='Contakt' width={isMobile ? 30 : 46} height={32} />

            <span className='text-3xl font-semibold tracking-tight text-neutral-800'>contakt</span>
          </div>
        </Link>
      </div>
      <ScrollArea className='h-[88vh]'>
        <motion.div variants={blurIn} className='mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-16'>
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.45,
            }}
            className='flex h-16 w-16 items-center justify-center rounded-full bg-success-50'
          >
            <FaCheckCircle className='text-success-base' size={32} />
          </motion.div>
          {/* Heading */}
          <h1 className='text-center text-lg md:text-xl lg:text-2xl font-semibold text-neutral-800'>
            Registration Completed
          </h1>
          <p className='max-w-xl text-center text-base leading-[150%] text-neutral-base'>
            Your WhatsApp Business Account has been successfully connected to
            <span className='font-semibold text-primary-base'> Contakt</span>.
            <br />
            Your workspace is ready and you can now securely sign in.
          </p>
          {/* Connection Summary */}
          <div className='mt-4 w-full rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm'>
            <div className='mb-2 flex items-center gap-3'>
              <IoLogoWhatsapp className='text-success-base' size={26} />
              <h2 className='text-lg font-semibold text-neutral-800'>Business Connection</h2>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <SummaryItem label='Business Name' value={businessName ?? 'Business'} />

              <SummaryItem label='WhatsApp Number' value={displayPhone ?? 'Connected'} />

              <SummaryItem label='Verified Name' value={verifiedName ?? 'Verified'} />

              <SummaryItem
                label='Status'
                value={
                  <span className='rounded-full bg-success-50 px-3 py-1 text-sm font-medium text-success-700'>
                    Active
                  </span>
                }
              />
            </div>
          </div>
          {/* Ready Card */}
          <div className='mt-8 w-full rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-neutral-800'>Everything is Ready</h3>
            <div className='mt-2 flex flex-col gap-3'>
              <ReadyItem text='Business workspace created' />
              <ReadyItem text='WhatsApp Business connected' />
              <ReadyItem text='Webhook successfully subscribed' />
              <ReadyItem text='Ready to configure your AI Assistant after login' />
            </div>
          </div>

          {/* Security */}
          <div className='mt-8 flex w-full items-start gap-4 rounded-2xl bg-primary-50 p-6'>
            <IoShieldCheckmarkSharp className='text-primary-base' size={42} />
            <div>
              <h4 className='mt-0.5 font-semibold text-lg mg:text-xl text-neutral-800'>Secure Integration</h4>

              <p className='mt-2 text-sm md:text-base leading-[150%] text-neutral-base'>
                Your Meta authorization has been securely linked to your Contakt workspace. Only authorized members of
                your business can manage this WhatsApp Business Account.
              </p>
            </div>
          </div>
          {/* CTA */}
          <div className='mt-6 flex flex-col items-center'>
            <Button onClick={handleLogin} size='lg' className='bg-primary-base px-10 hover:bg-primary-700'>
              Login to Contakt
            </Button>
            <p className='mt-5 text-center text-sm text-neutral-500'>
              After signing in you'll be able to configure your product catalogue, begin managing customer conversations
              and invite teammates.
            </p>
          </div>
        </motion.div>
      </ScrollArea>
    </motion.section>
  );
};

export default RegistrationCompletedSection;
