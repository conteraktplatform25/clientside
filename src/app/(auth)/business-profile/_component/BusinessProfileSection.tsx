'use client';

import SVGIcon from '@/components/customs/SVGIcons';
import { popIn, staggerContainer } from '@/lib/animations.motion';
import { useMediaQuery } from '@reactuses/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { isInvalidParam } from '@/lib/helpers/string-manipulator.helper';
import AlertDisplayField, { IAlertProps } from '@/components/customs/AlertMessageField';
import { IoPersonCircle } from 'react-icons/io5';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import PhoneInput from 'react-phone-number-input';
import InputField from '@/components/customs/InputField';
import SelectField from '@/components/customs/SelectField';
import { useBusinessProfileStore } from '@/lib/store/auth/auth-businessProfile.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';
import { validateAndNormalizePhone } from '@/utils/custom-control.util';
import { Button } from '@/components/ui/button';
import {
  ConstBusinessCategories as categories,
  ConstAnnualRevenue as revenues,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constants';
import { businessProfileHook } from '@/lib/hooks/business-profile.hook';
//import { businessProfileSchema, TBusinessProfilePayload } from '@/types/business/business-profile.type';
import { businessProfileSchema, TBusinessProfilePayload } from '@/types/business/business-profile.type';

interface IBusinessProfileFormProps {
  email: string;
  fullName: string;
}

function BusinessProfileForm({ email, fullName }: Readonly<IBusinessProfileFormProps>) {
  const router = useRouter();
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const { profile, clearProfile } = useBusinessProfileStore();
  const businessProfileMutation = businessProfileHook.useBusinessProfile();

  const businessProfileForm = useForm<TBusinessProfilePayload>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: profile,
    mode: 'onChange',
  });

  const { handleSubmit, control, reset, clearErrors, formState } = businessProfileForm;

  const onBusinessProfileSubmit = async (data: TBusinessProfilePayload) => {
    const { startRequest, endRequest } = useServerIndicatorStore.getState();
    const validatePhoneNumber = validateAndNormalizePhone(data.phoneNumber, 'NG');
    if (!validatePhoneNumber.isValid) {
      setAlert({
        type: 'error',
        title: 'Failed to validate phone number',
        description: validatePhoneNumber.error,
      });
      return;
    }
    if (!validatePhoneNumber.normalized) {
      setAlert({
        type: 'error',
        title: 'Failed!!!',
        description: 'Phone number cannot be empty',
      });
      return;
    }

    data.phoneNumber = validatePhoneNumber.normalized;

    startRequest();
    try {
      const { confirmPassword, ...payload } = data;
      console.log('Destructure Request payload', payload);
      await businessProfileMutation.mutateAsync(payload, {
        onSuccess: (response) => {
          clearProfile();
          reset();
          setAlert({
            type: 'success',
            title: `Business Profile Successful`,
            description: `Your business information has been integrated to the contakt platform ${response.data?.creator}`,
          });
          router.push(`/connect-business-details?email=${email}&name=${fullName}`);
        },
        onError: (error) => {
          setAlert({
            type: 'error',
            title: `Business Profile registry failed - ${error.message.message}`,
            description: error.message.message || 'Something went wrong. Please try again.',
          });
        },
      });
    } finally {
      endRequest();
    }
  };
  return (
    <div className='max-w-lg mt-10'>
      <h1 className='text-2xl font-semibold text-center'>Business Profile Registry</h1>
      <p className='text-sm text-gray-600 mb-4 text-center'>
        {`Welcome ${fullName}, fill in your business details on the assigned field`}
      </p>
      <Form {...businessProfileForm}>
        <form onSubmit={handleSubmit(onBusinessProfileSubmit)} className='flex flex-col gap-6 w-full'>
          <div className='flex item-start gap-2'>
            <IoPersonCircle className='text-[#E2E8F0]' size={64} />
            <div className='block space-y-0'>
              <h6 className='font-semibold text-[18px] leading-[150%] text-neutral-800'>{fullName}</h6>
              <span className='text-sm leading-[155%] text-neutral-base'>{email}</span>
            </div>
          </div>
          {alert.type && (
            <AlertDisplayField
              type={alert.type}
              title={alert.title || ''}
              description={alert.description}
              onClose={() => setAlert({ type: null, description: '', title: '' })}
            />
          )}
          <div className='w-full grid grid-cols-2 gap-8'>
            <div className='block space-y-0.5'>
              <FormField
                control={control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm leading-[150%]'>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry='NG'
                        value={field.value}
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
            </div>
            <div className='mt-1.5'>
              <InputField<TBusinessProfilePayload>
                name={'companyName'}
                control={control}
                type='text'
                label='Company name'
                placeholder='Enter Company Name'
                className='p-5 border border-gray-400 bg-white'
                important
              />
            </div>
          </div>
          <div className='w-full flex items-start gap-6'>
            <InputField<TBusinessProfilePayload>
              name={'companyWebsite'}
              control={control}
              type='text'
              label='Company website'
              placeholder='Enter Company Website'
              className='mt-1 border border-gray-400 bg-white'
            />
            <InputField<TBusinessProfilePayload>
              name={'companyLocation'}
              control={control}
              type='text'
              label='Company location'
              placeholder='Enter Company Location'
              className='border border-gray-400 bg-white'
              important
            />
          </div>
          <div className='w-full flex items-start gap-6'>
            <SelectField<TBusinessProfilePayload>
              name={'businessIndustry'}
              control={control}
              label='Industry of your business'
              options={industries}
              className='w-full border border-gray-300'
              placeholder='Select Industry'
            />
            <SelectField<TBusinessProfilePayload>
              name={'businessCategory'}
              control={control}
              label='Category'
              options={categories}
              className='w-full border border-gray-300'
              placeholder='Select Category'
            />
          </div>
          <SelectField<TBusinessProfilePayload>
            name={'annualRevenue'}
            control={control}
            label='Annual Revenue (₦)'
            options={revenues}
            className='w-full border border-gray-300'
            placeholder='Select Revenue'
          />
          <div className='flex item-center justify-center gap-6 w-full'>
            <InputField<TBusinessProfilePayload>
              name={'password'}
              control={control}
              type='password'
              label='Password'
              className='border border-gray-300'
              important
            />
            <InputField<TBusinessProfilePayload>
              name={'confirmPassword'}
              control={control}
              type='password'
              label='Confirm Password'
              className='border border-gray-300'
              important
            />
          </div>
          <div className='block space-y-2'>
            <Button
              variant={'default'}
              className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
              type='submit'
              disabled={!formState.isValid || formState.isSubmitting}
            >
              Create account
            </Button>
            <div className='w-full flex items-center justify-center max-w-xs mx-auto'>
              <div className='inline font-normal text-base leading-[150%] text-center'>
                By clicking on ‘Create Account’ you agree to our{' '}
                <span className='text-primary-base underline'>Terms and services</span> and{' '}
                <span className='text-primary-base underline'>Privacy policy.</span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function BusinessProfileSection() {
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [decodedEmail, setDecodedEmail] = useState<string>('');

  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const email = searchParams.get('email');
  const full_name = searchParams.get('name');

  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const router = useRouter();

  useEffect(() => {
    if (email === null || isInvalidParam(email) || isInvalidParam(full_name) || !verified) {
      router.replace('/login');
    } else {
      const dEmail = decodeURIComponent(email);
      setDecodedEmail(dEmail);
      setIsEmailVerified(true);
    }
  }, [email, full_name, verified, setDecodedEmail, router]);

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
      <ScrollArea className='h-[84vh]'>
        <motion.div
          variants={popIn}
          className='flex flex-col items-start gap-4 min-h-[82vh] px-4 sm:px-6 lg:px-8 max-w-3xl'
        >
          <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='w-full flex flex-col items-start gap-3'>
              <div className='w-full flex items-start justify-end'>
                {isEmailVerified && (
                  <div className='w-[65%]'>
                    <AlertDisplayField
                      type={'success'}
                      title='Success!'
                      description='Email address verified successfully.'
                      onClose={() => setIsEmailVerified(false)}
                    />
                  </div>
                )}
              </div>
              <div className='w-full flex items-start justify-between'>
                <div className='flex flex-col gap-1'>
                  <h6 className='font-bold text-black'>Create your account</h6>
                  <p className=' text-neutral-base text-base max-w-97.25 leading-5'>
                    Sign up to Contakt universe and accelerate the speed in which you do business.
                  </p>
                </div>
              </div>
              <BusinessProfileForm email={decodedEmail} fullName={full_name!} />
            </div>
          </div>
        </motion.div>
      </ScrollArea>
    </motion.section>
  );
}
