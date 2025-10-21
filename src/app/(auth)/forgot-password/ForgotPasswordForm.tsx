'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/custom/InputField';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  const router = useRouter();
  const forgotPasswordForm = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = forgotPasswordForm;

  const handleForgotPasswordSubmit = async (data: FormData) => {
    const response = await fetchWithIndicatorHook('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await response.json();
    if (json?.ok) {
      reset();
      setAlert({
        type: 'success',
        title: json.message || 'Check your Mail for one time password.',
        description: 'Check your Mail for one time password.',
      });
      router.push(`/otp-verification?email=${data.email}`);
    } else {
      setAlert({
        type: 'error',
        title: 'Password Reset Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Form {...forgotPasswordForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleForgotPasswordSubmit)} className='space-y-6 w-full'>
        <InputField<FormData> name={'email'} control={control} type='email' label='Work Email' important />
        <Button
          variant={'default'}
          className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
