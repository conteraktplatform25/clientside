'use client';

import { Suspense, useEffect, useState } from 'react';
import SVGIcon from '@/components/customs/SVGIcons';
import { useMediaQuery } from '@reactuses/core';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import HorizontalLineWithText from '@/components/customs/HorizontalLineWithText';
import AlertDisplayField, { IAlertProps } from '@/components/customs/AlertMessageField';
import { useForm, useWatch } from 'react-hook-form';
import InputField from '@/components/customs/InputField';
import { signupFormSchema, TSignupPayload } from '@/types/auth/auth-user.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignupFormStore } from '@/lib/store/auth/auth-signup.store';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';
import { authenticationHook } from '@/lib/hooks/auth.hook';

function SignupFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  const { signupFormData, setSignupFormData } = useSignupFormStore();

  const signupMutation = authenticationHook.useSignup();

  const signupForm = useForm<TSignupPayload>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupFormData, //hydrate from zustand
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = signupForm;
  const watchedValues = useWatch({ control: control });

  useEffect(() => {
    setSignupFormData(watchedValues);
  }, [watchedValues, setSignupFormData]);

  const onSignupSubmit = async (data: TSignupPayload) => {
    const { startRequest, endRequest } = useServerIndicatorStore.getState();
    startRequest();
    try {
      await signupMutation.mutateAsync(data, {
        onSuccess: (response) => {
          reset();
          setAlert({
            type: 'success',
            title: `Signup was Successful - ${response.data?.onboardingStep}`,
            description: response.message || 'Check your Mail for one time password.',
          });
          router.push(`/signup-otp-verification?email=${response.data?.email}`);
        },
        onError: (error) => {
          setAlert({
            type: 'error',
            title: `Signup Failed - ${error.message.message}`,
          });
        },
      });
    } finally {
      endRequest();
    }
  };
  return (
    <div className='w-full space-y-3 mt-2 max-w-lg'>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(onSignupSubmit)} className='space-y-6 w-full'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <InputField<TSignupPayload>
          name={'email'}
          control={control}
          type='email'
          label='Work Email'
          className='bg-white border border-[#DEE2E6] rounded-md'
          important
        />
        <InputField<TSignupPayload>
          name={'firstName'}
          control={control}
          type='text'
          label='First Name'
          className='bg-white border border-[#DEE2E6] rounded-md'
          important
        />
        <InputField<TSignupPayload>
          name={'lastName'}
          control={control}
          type='text'
          label='Last Name'
          className='bg-white border border-[#DEE2E6] rounded-md'
          important
        />
        <Button
          variant={'default'}
          className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          {isSubmitting ? <>Registering User Profile</> : <>Register Profile</>}
        </Button>
      </form>
    </div>
  );
}

export function RegistrationSection() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  return (
    <section className='w-full space-y-4'>
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
      <ScrollArea className='h-[87vh]'>
        <div className='flex flex-col items-start gap-4 min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8 max-w-3xl'>
          <div className=' flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='flex flex-col gap-1'>
              <h6 className='font-bold text-black'>Create your account</h6>
              <p className=' text-neutral-base text-base max-w-97.25 leading-5'>
                Sign up to Contakt universe and accelerate the speed in which you do business.
              </p>
            </div>
            <div className='w-full'>
              <Button variant={'outline'} className='w-full cursor-pointer hover:bg-gray-100' asChild>
                <div className='flex gap-4'>
                  <SVGIcon fileName='icon-google.svg' alt='Google Icon' height={25} />
                  <span className='font-semibold text-base md:text-[18px]'>Sign in with Google</span>
                </div>
              </Button>
            </div>
            <HorizontalLineWithText text='Or continue with' />
            <Suspense fallback={<div>Loading...</div>}>
              <SignupFormComponent />
            </Suspense>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
