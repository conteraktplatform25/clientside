'use client';
import { registerFormSchema, TRegisterFormSchema } from '@/lib/schemas/auth/signup.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { useSignupFormStore } from '@/lib/store/auth/signup.store';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';

const SignupForm = () => {
  const router = useRouter();
  // Local state for alerts
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const { formData, setFormData } = useSignupFormStore();
  const registerForm = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: formData, //hydrate from zustand
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = registerForm;

  // Use useWatch to avoid infinite loop
  const watchedValues = useWatch({ control: control });

  useEffect(() => {
    setFormData(watchedValues);
  }, [watchedValues, setFormData]);

  const handleRegisterSubmit = async (data: TRegisterFormSchema) => {
    //toast.success(JSON.stringify(data))
    const response = await fetchWithIndicatorHook('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (response?.ok) {
      reset();
      setAlert({
        type: 'success',
        title: json.message || 'Check your Mail for one time password.',
        description: 'Check your Mail for one time password.',
      });
      router.push(`/signup-otp-verification?email=${data.email}`);
      // resetForm();
      // reset();
      // setAlert({
      //   type: 'success',
      //   title: 'Registration Successful',
      //   description: 'Check your email to verify your account.',
      // });
      // router.push(`/verification/${data.email}`);
    } else {
      setAlert({
        type: 'error',
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };
  return (
    <Form {...registerForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleRegisterSubmit)} className='space-y-6 w-full'>
        <InputField<TRegisterFormSchema> name={'email'} control={control} type='email' label='Work Email' important />
        <div className='flex item-center justify-center gap-4 w-full'>
          <InputField<TRegisterFormSchema>
            name={'first_name'}
            control={control}
            type='text'
            label='First Name'
            important
          />
          <InputField<TRegisterFormSchema>
            name={'last_name'}
            control={control}
            type='text'
            label='Last Name'
            important
          />
        </div>
        <Button
          variant={'default'}
          className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
        >
          Next
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
