'use client';

import SVGIcon from '@/components/customs/SVGIcons';
import HorizontalLineWithText from '@/components/customs/HorizontalLineWithText';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@reactuses/core';
import InputField from '@/components/customs/InputField';
// import { signInWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
//import { loginFormSchema, TLoginFormSchema } from '@/lib/schemas/auth/login.schema';
// import { useLoginFormStore } from '@/lib/store/auth/login.store';
//import { getSession } from 'next-auth/react';
// import { loginFormSchema, TLoginFormSchema } from '@/types/auth-user.type';
import { loginFormSchema, TLoginPayload } from '@/types/auth/auth-user.type';
import { useLoginFormStore } from '@/lib/store/auth/auth-login.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AlertDisplayField, { IAlertProps } from '@/components/customs/AlertMessageField';
import { Form } from '@/components/ui/form';
import { authenticationHook } from '@/lib/hooks/auth.hook';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';

function LoginMainForm() {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const loginMutation = authenticationHook.useLogin();

  const { profile } = useLoginFormStore();
  const loginForm = useForm<TLoginPayload>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: profile.email,
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = loginForm;

  const loginSubmit = async (data: TLoginPayload) => {
    const { startRequest, endRequest } = useServerIndicatorStore.getState();
    startRequest();
    try {
      await loginMutation.mutateAsync(data, {
        onSuccess: (response) => {
          //console.log('Verified Login information', response);
          toast('Successfully Logged In.');
          router.push(`/business`);
        },
        onError: (error) => {
          //console.log('Verified Login information', JSON.stringify(error));
          setAlert({
            type: 'error',
            title: `Signup Failed - ${error.message.message}`,
          });
          toast.error(`Failed to log in. ${error.message.message}`);
        },
      });
    } finally {
      endRequest();
    }
  };
  return (
    <Form {...loginForm}>
      <form onSubmit={handleSubmit(loginSubmit)} className='w-full space-y-2'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {alert.type && (
          <AlertDisplayField
            type={alert.type}
            title={alert.title || ''}
            description={alert.description}
            onClose={() => setAlert({ type: null, description: '', title: '' })}
          />
        )}
        <div className='block space-y-4 w-full'>
          <InputField<TLoginPayload>
            name={'email'}
            control={control}
            type='email'
            label='Email'
            className='bg-white border border-[#DEE2E6] rounded-md'
          />
          <InputField<TLoginPayload>
            name={'password'}
            control={control}
            type='password'
            label='Password'
            className='bg-white border border-[#DEE2E6] rounded-md'
          />
        </div>
        <Button
          type='button'
          variant={'ghost'}
          className='font-semibold text-primary-base hover:bg-transparent hover:text-primary-700 mb-6'
          onClick={() => router.push('/forgot-password')}
        >
          Forgot password?
        </Button>
        <Button
          variant={'default'}
          className='mt-2 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          Login
        </Button>
      </form>
    </Form>
  );
}

const LoginSection = () => {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const callbackUrl = searchParams.get('callbackUrl') || '/';
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
          <span className='font-normal text-neutral-base'>Not on Contakt?</span>
          <Link href={'/register'}>
            <span className='font-semibold text-primary-base hover:text-primary-700 focus-visible:border-none'>
              Sign up
            </span>
          </Link>
        </div>
      </div>
      <ScrollArea className='h-[87vh]'>
        <div className='flex flex-col items-start gap-4 min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8 max-w-3xl'>
          <div className=' flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='flex flex-col gap-2'>
              <h6 className='font-bold text-black'>Welcome to Contakt</h6>
              <p className=' text-neutral-base text-base max-w-[296px] leading-5'>
                Enter your email address and password to log in to your account
              </p>
            </div>
            <div className='w-full'>
              <Button
                //onClick={() => signIn('google', { callbackUrl: callbackUrl })}
                variant={'outline'}
                className='w-full cursor-pointer hover:bg-gray-100'
                asChild
              >
                <div className='flex gap-4'>
                  <SVGIcon fileName='icon-google.svg' alt='Google Icon' height={25} />
                  <span className='font-semibold text-base md:text-[18px]'>Sign in with Google</span>
                </div>
              </Button>
            </div>
            <HorizontalLineWithText text='Or continue with' />
            <Suspense fallback={<div>Loading...</div>}>
              <LoginMainForm />
            </Suspense>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

export default LoginSection;
