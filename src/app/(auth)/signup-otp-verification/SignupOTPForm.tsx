'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // or react-hot-toast
import OTPInputField from '@/components/custom/OTPInputField';
import { Loader2 } from 'lucide-react';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { useRouter } from 'next/navigation';

const signupOTPSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

type TSignupOTPFormValues = z.infer<typeof signupOTPSchema>;
type TUserProfile = {
  email: string;
  first_name: string;
  last_name: string;
  email_verified_date: Date;
};
type TSignupVerificationResponse = {
  ok: boolean;
  message: string;
  profile: TUserProfile;
};

const SignupOTPForm = ({ email, flow }: { email: string; flow: string }) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const form = useForm<TSignupOTPFormValues>({
    resolver: zodResolver(signupOTPSchema),
    defaultValues: { otp: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
    reset,
  } = form;

  const onSubmit = async (values: TSignupOTPFormValues) => {
    setShake(false);
    const response = await fetchWithIndicatorHook('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: values.otp, flow }),
    });

    const json: TSignupVerificationResponse = await response.json();
    console.log(json);
    if (json?.ok) {
      const full_name = `${json.profile.first_name} ${json.profile.last_name}`;
      reset();
      setAlert({
        type: 'success',
        title: json.message || 'Valid OTP Successful',
      });
      router.push(`/profile?email=${email}&name=${full_name}`);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
      setAlert({
        type: 'error',
        title: 'Password Reset Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
      setShake(false);
    }
  };

  return (
    <motion.div className='max-w-md mx-auto mt-10' initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className='text-2xl font-semibold mb-2 text-center'>Enter OTP</h1>
      <p className='text-sm text-gray-600 mb-4 text-center'>
        We’ve sent a 6-digit code to <strong>{email}</strong>
      </p>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='mt-3 space-y-4'>
        <OTPInputField value={watch('otp')} onChange={(val) => setValue('otp', val)} shake={shake} autoFocus />

        {form.formState.errors.otp && (
          <p className='text-red-500 text-sm text-center'>{form.formState.errors.otp.message}</p>
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
            <>
              <span>Verify OTP</span>
            </>
          )}
        </Button>
      </form>
      <Button
        variant='ghost'
        className='w-full mt-3'
        onClick={async () => {
          await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, flow }),
          });
          toast('New OTP sent!');
        }}
      >
        Resend Code
      </Button>
    </motion.div>
  );
};

export default SignupOTPForm;
