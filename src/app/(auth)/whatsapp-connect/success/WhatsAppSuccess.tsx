'use client';
import SVGIcon from '@/components/custom/SVGIcons';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const WhatsAppSuccess = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  //const decodedEmail = decodeURIComponent(email!);
  const full_name = searchParams.get('name') ?? 'INVALID CONNECTION';
  return (
    <section className='w-full flex flex-col gap-4'>
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
      </div>
      <div className='flex flex-col items-start gap-4 min-h-[82vh] px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <div className='flex-1 flex flex-col items-center justify-center gap-6 w-full'>
          {/* Heading */}
          <h1 className='text-center text-2xl font-semibold text-neutral-900'>{`Hi ${full_name}, WhatsApp Connected Successfully 🎉`}</h1>
          {/* Description */}
          <p className='mt-3 text-center text-neutral-600 leading-relaxed'>
            Your WhatsApp Business account has been successfully connected. You can now start chatting with customers,
            receive messages, and manage conversations directly from your dashboard.
          </p>
          {/* Info box */}
          <div className='w-full flex flex-col gap-4 items-center justify-center'>
            <div className='rounded-lg bg-primary-700 p-4 text-sm text-white'>
              <ul className='space-y-2'>
                <li>✅ Incoming messages will appear in your Inbox</li>
                <li>✅ Message delivery & read statuses are enabled</li>
                <li>✅ Webhooks are active and synced</li>
              </ul>
            </div>
            {/* Actions */}
            <div className='mt-8 flex flex-col sm:flex-row gap-3'>
              <Button
                className='w-full bg-primary-base hover:bg-primary-700 text-white'
                onClick={() => router.push('/login')}
              >
                Back to login
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <p className='mt-6 text-center text-xs text-neutral-500'>
            Need help? Visit our support center or contact us anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSuccess;
