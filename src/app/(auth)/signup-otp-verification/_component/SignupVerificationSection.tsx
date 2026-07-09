'use client';

import { useEffect, useState } from 'react';
import SVGIcon from '@/components/customs/SVGIcons';
import { useMediaQuery } from '@reactuses/core';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AlertDisplayField, { IAlertProps } from '@/components/customs/AlertMessageField';
import { useForm } from 'react-hook-form';
import { signupVerificationSchema, TSignupVerificationPayload } from '@/types/auth/auth-user.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerIndicatorStore } from '@/lib/store/defaults/server-indicator.store';
import { useSignupVerificationStore } from '@/lib/store/auth/auth-signup-verification.store';
import { authenticationHook } from '@/lib/hooks/auth.hook';
import { motion } from 'framer-motion';
import OTPInputField from '@/components/customs/OTPInputField';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isInvalidParam } from '@/lib/helpers/string-manipulator.helper';

interface ISignupVerificationFormProps {
  email: string;
  flow: string;
}

export function SignupVerificationForm({ email, flow }: Readonly<ISignupVerificationFormProps>) {
  const [countdown, setCountdown] = useState(20);
  const [canResend, setCanResend] = useState(false);

  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const signupVerificationMutation = authenticationHook.useEmailVerification();
  const { mutate: resendOtp } = authenticationHook.useRendOTP();

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const signupVerificationForm = useForm<TSignupVerificationPayload>({
    resolver: zodResolver(signupVerificationSchema),
    defaultValues: { otp: '', email },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
    reset,
  } = signupVerificationForm;

  const onSubmitResendOtp = () => {
    if (!email || !canResend) return;

    resendOtp(
      { email },
      {
        onSuccess: (response) => {
          toast.success(response.message);

          setCountdown(20);
          setCanResend(false);
        },
        onError: (error) => {
          toast.error(error.message.message);
        },
      },
    );
  };

  const onSignupVerificationSubmit = async (data: TSignupVerificationPayload) => {
    setShake(false);
    const { startRequest, endRequest } = useServerIndicatorStore.getState();
    startRequest();
    try {
      await signupVerificationMutation.mutateAsync(data, {
        onSuccess: (response) => {
          setAlert({
            type: 'success',
            title: `Email verification was successful - ${response.data?.onboardingStep}`,
            description: response.message,
          });
          console.log('Successful delivery: ', response);
          const fullName = `${response.data?.firstName} ${response.data?.lastName}`;
          router.push(`/business-profile?email=${response.data?.email}&name=${fullName}&verified=${true}`);
          reset();
        },
        onError: (error) => {
          setShake(true);
          setTimeout(() => setShake(false), 3000);
          setAlert({
            type: 'error',
            title: `Email Verification Failed - ${error.message.message}`,
            description: error.message.message || 'Something went wrong. Please try again.',
          });
        },
      });
    } finally {
      endRequest();
      setShake(false);
    }
  };

  return (
    <motion.div className='max-w-lg mx-auto mt-10' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className='text-2xl font-semibold mb-2 text-center'>Enter OTP</h1>
      <p className='text-sm text-gray-600 mb-4 text-center'>
        Contakt sent a 6-digit code to <strong>{email}</strong>
      </p>
      <div className='my-3'>
        {alert.type && (
          <AlertDisplayField
            type={alert.type}
            title={alert.title || ''}
            description={alert.description}
            onClose={() => setAlert({ type: null, description: '', title: '' })}
          />
        )}
      </div>

      <form onSubmit={handleSubmit(onSignupVerificationSubmit)} className='space-y-6 w-full'>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <OTPInputField value={watch('otp')} onChange={(val) => setValue('otp', val)} shake={shake} autoFocus />
        {signupVerificationForm.formState.errors.otp && (
          <p className='text-red-500 text-sm text-center'>{signupVerificationForm.formState.errors.otp.message}</p>
        )}

        <Button
          type='submit'
          disabled={isSubmitting}
          className={`bg-primary-base hover:bg-primary-700 py-5 px-4 rounded-[8px] text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span>Verifying OTP ...</span>
            </>
          ) : (
            <span>Verify OTP</span>
          )}
        </Button>
      </form>
      <div className='w-full flex flex-col items-center justify-center'>
        <p className='text-center text-sm text-gray-600 mt-4'>Didn&apos;t receive the code?</p>

        <Button
          variant='ghost'
          disabled={!canResend}
          className='mt-4 w-full cursor-pointer bg-gray-800 hover:bg-gray-700 text-sm font-normal leading-5 text-white hover:text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={onSubmitResendOtp}
        >
          {canResend ? `Resend Code` : `Resend in ${countdown}s`}
        </Button>
      </div>
    </motion.div>
  );
}

export function SignupVerificationSection() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const decodedEmail = decodeURIComponent(email!);
  const { flow, setFlow, setEmail } = useSignupVerificationStore();
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const router = useRouter();

  useEffect(() => {
    if (isInvalidParam(email) || isInvalidParam(decodedEmail)) {
      router.replace('/login');
    }
  }, [email, decodedEmail, router]);

  useEffect(() => {
    setFlow('signup');
    setEmail(decodedEmail);
  }, [decodedEmail, setFlow, setEmail]);
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
      <div className='flex flex-col items-start gap-4 min-h-[85vh] px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='flex flex-col gap-1'>
            <h6 className='font-bold text-black'>{`Password Reset for ${decodedEmail}`}</h6>
            <p className=' text-neutral-base text-base max-w-97.25 leading-5'>
              Enter your One Time Password to begin process to reclaim your account.
            </p>
          </div>
          <SignupVerificationForm email={decodedEmail} flow={flow} />
          {/* <OTPVerificationForm email={decodedEmail} flow={flow} /> */}
        </div>
      </div>
    </section>
  );
}
