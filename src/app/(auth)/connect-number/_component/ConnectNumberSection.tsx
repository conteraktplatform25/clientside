'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SVGIcon from '@/components/customs/SVGIcons';
import { useMediaQuery } from '@reactuses/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { isInvalidParam } from '@/lib/helpers/string-manipulator.helper';
import { blurIn, staggerContainer } from '@/lib/animations.motion';
import AlertDisplayField, { IAlertProps } from '@/components/customs/AlertMessageField';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import PhoneInput from 'react-phone-number-input';

import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import { validateAndNormalizePhone } from '@/utils/custom-control.util';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';
import { businessProfileHook } from '@/lib/hooks/business-profile.hook';
import { connectPhoneNumberSchema, TConnectPhoneNumberPayload } from '@/types/business/business-profile.type';
import { useMeta } from '@/lib/meta/hooks/useMeta.hook';

const onboardingSteps = [
  'Enter the phone number you want to use for WhatsApp Business',
  'You’ll be redirected to securely connect your Meta account',
  'Confirm your business details and approve access',
] as const;

export function ConnectNumberSection() {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const decodedEmail = email ? decodeURIComponent(email) : '';
  const full_name = searchParams.get('name');
  const isMobile = useMediaQuery('(max-width: 768px)', false);

  const connectPhoneMutation = businessProfileHook.useConnectPhoneNumber();
  const { connect, loading: metaLoading } = useMeta();

  useEffect(() => {
    if (isInvalidParam(email) || isInvalidParam(full_name)) {
      router.replace('/register');
    }
  }, [email, full_name, decodedEmail, router]);

  const connectPhoneNumberForm = useForm<TConnectPhoneNumberPayload>({
    resolver: zodResolver(connectPhoneNumberSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    clearErrors,
  } = connectPhoneNumberForm;

  const onConnectPhoneNumberSubmit = async (data: TConnectPhoneNumberPayload) => {
    const { startRequest, endRequest } = useServerIndicatorStore.getState();
    //validate phone number
    const { normalized, isValid, error } = validateAndNormalizePhone(data.phoneNumber, 'NG');
    if (!isValid) {
      setAlert({
        type: 'error',
        title: 'Failed to validate phone number',
        description: error,
      });
      return;
    }
    if (!normalized) {
      setAlert({
        type: 'error',
        title: 'Failed!!!',
        description: 'Phone number cannot be empty',
      });
      return;
    }

    startRequest();
    try {
      const response = await connectPhoneMutation.mutateAsync({
        phoneNumber: normalized,
      });
      await connect(response.data?.configId!);
    } catch (err: any) {
      setAlert({
        type: 'error',
        title: 'Connection failed',
        description: err?.message ?? 'Something went wrong.',
      });
    } finally {
      endRequest();
    }
  };
  return (
    <motion.section
      variants={staggerContainer}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className='w-full space-y-4'
    >
      <div className='w-full flex items-start justify-between px-4 sm:px-6 lg:px-8'>
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
        <div className='flex items-end mt-4 w-full gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a user?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base hover:text-primary-700'>Login</span>
          </Link>
        </div>
      </div>
      <ScrollArea className='h-[82vh]'>
        <motion.div
          variants={blurIn}
          className='flex flex-col items-start gap-4 min-h-[82vh] px-4 sm:px-6 lg:px-8 max-w-3xl'
        >
          <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <Form {...connectPhoneNumberForm}>
              <h2 className='font-semibold text-2xl leading-tight text-neutral-700'>
                Connect your WhatsApp Business account
              </h2>
              <div className='w-full flex items-start justify-between mx-auto'>
                <div className='flex flex-col gap-3'>
                  <h6 className='font-normal text-xl text-neutral-600'>{`Hi ${full_name}!, Welcome to the Contakt Platform`}</h6>
                  <p className='font-semibold text-neutral-600 text-base leading-5'>
                    Connect your number in a few quick steps. This allows you to send and receive messages directly from
                    Contakt.
                  </p>
                  <div className='mt-2 flex flex-col gap-2'>
                    {onboardingSteps.map((profile) => (
                      <div key={profile} className='inline-flex space-x-2'>
                        <FaRegCircleCheck className='mt-1.5 text-primary-base' />
                        <p className='text-base leading-[150%] text-neutral-base'>{profile}</p>
                      </div>
                    ))}
                  </div>
                  <div className='mt-4 w-full mx-auto p-3 bg-yellow-100 text-gray-700 flex items-center justify-center gap-4 max-w-[26rem]'>
                    <IoIosWarning color='#E17100' size={32} />
                    <h6 className=' flex-1 w-full text-sm leading-[150%] text-center text-yellow-800'>
                      Before you continue: If this number is already used on WhatsApp, you may need to remove it from
                      the existing account before connecting it here.
                    </h6>
                  </div>
                  <form onSubmit={handleSubmit(onConnectPhoneNumberSubmit)} className='flex flex-col gap-6 w-full'>
                    <div className='mt-4 w-full mx-auto flex flex-col gap-6 items-center justify-center'>
                      {alert.type && (
                        <div className='flex flex-col items-start gap-4'>
                          <AlertDisplayField
                            type={alert.type}
                            title={alert.title || ''}
                            description={alert.description}
                            onClose={() => setAlert({ type: null, description: '', title: '' })}
                          />
                        </div>
                      )}
                      <FormField
                        control={control}
                        name='phoneNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <PhoneInput
                                defaultCountry='NG'
                                value={field.value!}
                                onChange={async (val) => {
                                  field.onChange(val);
                                  if (val) {
                                    clearErrors('phoneNumber');
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        variant={'default'}
                        className='bg-primary-base text-white hover:bg-primary-700 font-medium w-fit'
                        type='submit'
                        disabled={!isValid || isSubmitting || metaLoading}
                      >
                        {isSubmitting || metaLoading ? 'Connecting...' : 'Connect to WhatsApp Business'}
                      </Button>
                    </div>
                  </form>
                  <div className='flex items-center mt-4 w-full gap-1 text-sm md:text-base leading-4 md:leading-5'>
                    <span className='font-normal text-neutral-base'>
                      Cannot continue with your Business Connection?
                    </span>
                    <Link href={'/login'}>
                      <span className='font-semibold text-primary-base hover:text-primary-700 hover:underline'>
                        Login
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </motion.div>
      </ScrollArea>
    </motion.section>
  );
}
