'use client';
import React, { useState } from 'react';
import { TResetPasswordFormSchema, resetPasswordFormSchema } from '@/lib/schemas/auth/resetpassword.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { Form } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';

const ResetPasswordForm = ({ email, token }: { email: string; token: string }) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  //const router = useRouter();

  const resetPasswordForm = useForm<TResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = resetPasswordForm;

  const handleResetPasswordSubmit = async (data: TResetPasswordFormSchema) => {
    const response = await fetchWithIndicatorHook('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        email,
        password: data.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (json?.ok) {
      reset();
      setAlert({
        type: 'success',
        title: json.message || 'Password Reset Successful',
      });
    } else {
      setAlert({
        type: 'error',
        title: 'Password Reset Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
    }
  };
  return (
    <Form {...resetPasswordForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleResetPasswordSubmit)} className='space-y-6 w-full'>
        <InputField<TResetPasswordFormSchema>
          name={'password'}
          control={control}
          type='password'
          label='New Password'
          important
        />
        <InputField<TResetPasswordFormSchema>
          name={'confirm_password'}
          control={control}
          type='password'
          label='Confirm New Password'
          important
        />
        <Button
          variant={'default'}
          className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          {isSubmitting ? 'Password Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
