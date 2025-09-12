'use client';
import { registerFormSchema, TRegisterFormSchema } from '@/lib/schemas/auth/signup.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { useSignupFormStore } from '@/lib/store/auth/signup.store';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';

const SignupForm = () => {
  const router = useRouter();

  const { formData, setFormData, resetForm } = useSignupFormStore();
  const registerForm = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: formData, //hydrate from zustand
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = registerForm;

  // Use useWatch to avoid infinite loop
  const watchedValues = useWatch({ control: control });

  useEffect(() => {
    setFormData(watchedValues);
  }, [watchedValues, setFormData]);

  const handleRegisterSubmit = async (data: TRegisterFormSchema) => {
    const response = await fetchWithIndicatorHook('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.ok) {
      resetForm();
      toast('Successful Registration.', {
        // description: 'User registered. Check your email for verification.',
        description: 'User created. Check email to verify.',
        action: {
          label: 'Ok',
          onClick: () => router.push(`/auth/verification/${data.email}`),
        },
      });
    } else
      toast('Registration Failed', {
        description: 'Registration',
        action: {
          label: 'Ok',
          onClick: () => console.log(data),
        },
      });
  };
  return (
    <Form {...registerForm}>
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
        <div className='flex item-center justify-center gap-6 w-full'>
          <InputField<TRegisterFormSchema>
            name={'password'}
            control={control}
            type='password'
            label='Password'
            important
          />
          <InputField<TRegisterFormSchema>
            name={'confirm_password'}
            control={control}
            type='password'
            label='Confirm Password'
            important
          />
        </div>
        <Button
          variant={'default'}
          className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={isSubmitting}
          type='submit'
          onClick={() => handleRegisterSubmit}
        >
          Next
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
