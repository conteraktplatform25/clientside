'use client';
import InputField from '@/components/custom/InputField';
import SelectField from '@/components/custom/SelectField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  ConstBusinessCategories as categories,
  ConstAnnualRevenue as revenues,
  ConstBusinessIndustries as industries,
} from '@/lib/constants/auth.constant';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { profileFormSchema, TProfileFormSchema } from '@/lib/schemas/auth/profile.schema';
import { useProfileFormStore } from '@/lib/store/auth/profile.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoPersonCircle } from 'react-icons/io5';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { validateAndNormalizePhone } from '@/lib/phone/phone.util';

const ProfileForm = ({ email, full_name }: { email?: string; full_name?: string }) => {
  const router = useRouter();
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const { profile, clearProfile } = useProfileFormStore();
  const profileForm = useForm<TProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    reset,
    clearErrors,
  } = profileForm;

  // Watch the checkbox value
  const isTermsAccepted = watch('term_of_service');

  const handleProfileSubmit = async (data: TProfileFormSchema) => {
    const validatePhoneNumber = validateAndNormalizePhone(data.phone_number, 'NG');
    if (!validatePhoneNumber.isValid) {
      setAlert({
        type: 'error',
        title: 'Failed to validate phone number',
        description: validatePhoneNumber.error,
      });
      return;
    }
    if (!validatePhoneNumber.normalized) {
      setAlert({
        type: 'error',
        title: 'Failed!!!',
        description: 'Phone number cannot be empty',
      });
      return;
    }
    data.phone_number = validatePhoneNumber.normalized;
    const response = await fetchWithIndicatorHook(`/api/auth/profile?email=${email}`, {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (json?.ok) {
      clearProfile();
      reset();
      setAlert({
        type: 'success',
        title: 'Business Profile Successful',
        description: json.message || '',
      });
      router.push(`/connect-number?email=${email}&name=${full_name}`);
    } else {
      setAlert({
        type: 'error',
        title: 'Profile Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
    }
  };
  return (
    <Form {...profileForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleProfileSubmit)} className='flex flex-col gap-6 w-full'>
        <div className='flex item-start gap-2'>
          <IoPersonCircle className='text-[#E2E8F0]' size={64} />
          <div className='block space-y-0'>
            <h6 className='font-semibold text-[18px] leading-[150%] text-neutral-800'>{full_name}</h6>
            <span className='text-sm leading-[155%] text-neutral-base'>{email}</span>
          </div>
        </div>
        <div className='w-full grid grid-cols-2 gap-3'>
          <div className='block space-y-0.5'>
            <div className='block space-y-0.5'>
              <FormField
                control={control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base leading-[150%]'>Phone Number</FormLabel>
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
            </div>
          </div>
          <div className='mt-1.5'>
            <InputField<TProfileFormSchema>
              name={'company_name'}
              control={control}
              type='text'
              label='Company name'
              placeholder='Enter Company Name'
              important
            />
          </div>
        </div>
        <div className='w-full flex items-start gap-6'>
          <InputField<TProfileFormSchema>
            name={'company_website'}
            control={control}
            type='text'
            label='Company website'
            placeholder='Enter Company Website'
            className='mt-1'
          />
          <InputField<TProfileFormSchema>
            name={'company_location'}
            control={control}
            type='text'
            label='Company location'
            placeholder='Enter Company Location'
            important
          />
        </div>
        <div className='w-full flex items-start gap-6'>
          <SelectField<TProfileFormSchema>
            name={'business_industry'}
            control={control}
            label='Industry of your business'
            options={industries}
            className='w-full'
            placeholder='Select Industry'
          />
          <SelectField<TProfileFormSchema>
            name={'business_category'}
            control={control}
            label='Category'
            options={categories}
            className='w-full'
            placeholder='Select Category'
          />
        </div>
        <SelectField<TProfileFormSchema>
          name={'annual_revenue'}
          control={control}
          label='Annual Revenue (₦)'
          options={revenues}
          className='w-full'
          placeholder='Select Revenue'
        />
        <div className='flex item-center justify-center gap-6 w-full'>
          <InputField<TProfileFormSchema>
            name={'password'}
            control={control}
            type='password'
            label='Password'
            important
          />
          <InputField<TProfileFormSchema>
            name={'confirm_password'}
            control={control}
            type='password'
            label='Confirm Password'
            important
          />
        </div>
        <div className='block space-y-2'>
          <Button
            variant={'default'}
            className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
            type='submit'
            disabled={!isTermsAccepted || isSubmitting}
          >
            Create account
          </Button>
          <div className='w-full flex items-center justify-center'>
            <FormField
              control={control}
              name='term_of_service'
              render={({ field }) => (
                <FormItem className='flex items-center gap-3 max-w-[75%]'>
                  <FormControl>
                    <Checkbox onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className='inline font-normal text-base leading-[150%] text-center'>
                    By clicking on ‘Create Account’ you agree to our{' '}
                    <span className='text-primary-base underline'>Terms and services</span> and{' '}
                    <span className='text-primary-base underline'>Privacy policy.</span>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
