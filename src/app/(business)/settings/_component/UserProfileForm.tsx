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
import { Card } from '@/components/ui/card';
import SelectField from '@/components/custom/SelectField';
import { parsePhoneNumber } from '@/lib/helpers/string-manipulator.helper';
import { ConstCountryCodeOptions } from '@/lib/constants/auth.constant';

const UserProfileForm = () => {
  const [phone, setPhoneNumber] = useState('');
  const [parsedPhone, setParsedPhoneNumber] = useState<{
    countryCode: string | null;
    phoneNumber: string;
  }>({ countryCode: null, phoneNumber: '' });
  const { data, isLoading } = useGetUserProfile();
  const userProfileForm = useForm<TUserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_country_code: '',
      phone_number: '',
    },
  });

  const {
    //register,
    control,
    handleSubmit,
    formState: { isSubmitting },
    // setValue,
    // watch,
    // clearErrors,
    reset,
  } = userProfileForm;

  console.log(phone);
  console.log(parsedPhone);

  useEffect(() => {
    if (data) {
      const phoneValue = data.phone ?? '';
      const phone_details = parsePhoneNumber(phoneValue);
      setPhoneNumber(phoneValue);
      setParsedPhoneNumber(phone_details);
      reset({
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone_country_code: phone_details.countryCode || '+234',
        phone_number: phone_details.phoneNumber || '',
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
        {/* Personal Information */}
        <div className='space-y-6 w-full max-w-xl'>
          <InputField<TUserProfileForm> name={'email'} control={control} type='email' label='Work Email' disabled />
          <InputField<TUserProfileForm> name={'first_name'} control={control} type='text' label='First Name' />
          <InputField<TUserProfileForm> name={'last_name'} control={control} type='text' label='Last Name' />
          <Card className='w-full max-w-xs p-0 shadow-none rounded-sm'>
            <div className='grid grid-cols-3'>
              <div className='col-span-1'>
                <SelectField<TUserProfileForm>
                  control={control}
                  name={'phone_country_code'}
                  label=''
                  options={ConstCountryCodeOptions}
                  className='border-none shadow-none rounded-none focus-visible:ring-0 w-[90px]'
                />
              </div>
              <div className='col-span-2 flex flex-item gap-0.5'>
                <InputField<TUserProfileForm>
                  name={'phone_number'}
                  control={control}
                  type='text'
                  placeholder='Enter Phone Number'
                  className='mt-1 pl-0 border-none shadow-none rounded-none focus-visible:border-none focus-visible:ring-0'
                />
              </div>
            </div>
          </Card>
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
    </div>
  );
};

export default UserProfileForm;
