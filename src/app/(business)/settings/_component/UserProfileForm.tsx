'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { TUserProfileForm, userProfileSchema } from '@/lib/schemas/business/client/client-settings.schema';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useGetUserProfile } from '@/lib/hooks/business/userprofile-settings.hook';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const UserProfileForm = () => {
  const { data, isLoading } = useGetUserProfile();
  const userProfileForm = useForm<TUserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
    },
  });

  const {
    //register,
    control,
    handleSubmit,
    formState: { isSubmitting },
    clearErrors,
    reset,
  } = userProfileForm;

  useEffect(() => {
    if (data) {
      reset({
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone_number: data.phone || '',
      });
    }
  }, [data, reset]);

  const handleFormSubmit = async (data: TUserProfileForm) => {
    console.log(data);
  };
  if (isLoading) {
    return <UILoaderIndicator label='Fetching your user profile details...' />;
  }
  return (
    <div className='flex flex-col gap-6 max-w-6xl px-4 py-6'>
      <h2 className='font-medium text-xl leading-[150%] text-neutral-800'>Your Personal Profile Account</h2>
      <Form {...userProfileForm}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
          {/* Personal Information */}
          <div className='space-y-6 w-full max-w-xl'>
            <InputField<TUserProfileForm> name={'email'} control={control} type='email' label='Work Email' disabled />
            <InputField<TUserProfileForm> name={'first_name'} control={control} type='text' label='First Name' />
            <InputField<TUserProfileForm> name={'last_name'} control={control} type='text' label='Last Name' />
            {/* Phone Number */}
            <FormField
              control={control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry='NG'
                      value={field.value!}
                      onChange={async (val) => {
                        field.onChange(val);
                        if (val) {
                          clearErrors('phone_number');
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className={`mt-4 bg-primary-base hover:bg-primary-700 py-5 px-4 rounded-[8px] text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span className='text-sm leading-[150%]'>Updating personal profile...</span>
                </>
              ) : (
                <>
                  <span className='text-base leading-[150%]'>Update personal Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
