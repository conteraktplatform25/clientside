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
import { useSignupFormStore } from '@/lib/store/auth/signup.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ProfileForm = () => {
  const router = useRouter();

  const { profile, clearProfile } = useProfileFormStore();
  const { setFormData } = useSignupFormStore();
  const profileForm = useForm<TProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
  });

  //type TRegistrationDetails = TProfileFormSchema & TRegisterFormSchema;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
  } = profileForm;

  // Watch the checkbox value
  const isTermsAccepted = watch('term_of_service');

  useEffect(() => {
    // Run only in the browser
    const storedData = localStorage.getItem('register-form-storage');
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
  }, [setFormData]);

  const handleProfileSubmit = async (profile: TProfileFormSchema) => {
    const data: TProfileFormSchema = {
      phone_number: profile.phone_number,
      whatsapp_business_number: profile.whatsapp_business_number,
      company_name: profile.company_name,
      company_website: profile.company_website,
      company_location: profile.company_location,
      business_industry: profile.business_industry,
      business_category: profile.business_category,
      annual_revenue: profile.annual_revenue,
      term_of_service: profile.term_of_service,
    };

    console.log(data);

    const response = await fetchWithIndicatorHook('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.ok) {
      clearProfile();
      toast('Successful Registration.', {
        // description: 'User registered. Check your email for verification.',
        description: 'Click OK to enter your business profile.',
        action: {
          label: 'Ok',
          //onClick: () => router.push('/profile'),
          onClick: () => router.push('/login?registered=true'),
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
    <Form {...profileForm}>
      <form onSubmit={handleSubmit(handleProfileSubmit)} className='block space-y-4 w-full'>
        <div className='w-full flex items-start gap-6'>
          <InputField<TProfileFormSchema>
            name={'phone_number'}
            control={control}
            type='text'
            label='Phone number'
            placeholder='Enter Personal Phone Number'
            important
          />
          <InputField<TProfileFormSchema>
            name={'whatsapp_business_number'}
            control={control}
            type='text'
            label='Business Number (Whatsapp)'
            placeholder='Enter Business Number'
            important
          />
        </div>
        <InputField<TProfileFormSchema>
          name={'company_name'}
          control={control}
          type='text'
          label='Company name'
          placeholder='Enter Company Name'
          important
        />
        <div className='w-full flex items-start gap-6'>
          <InputField<TProfileFormSchema>
            name={'company_website'}
            control={control}
            type='text'
            label='Company website'
            placeholder='Enter Company Website'
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
        <div className='block space-y-2'>
          <Button
            variant={'default'}
            className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
            type='submit'
            onClick={() => handleProfileSubmit}
            disabled={!isTermsAccepted || isSubmitting}
          >
            Create Account
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
            {/* <div className='flex items-center gap-3 max-w-[80%]'>
              <CheckboxGroupField<TProfileFormSchema> />
              <Checkbox id='terms' />
              <Label htmlFor='terms' className='inline font-normal text-base leading-[150%] text-center'>
                By clicking on ‘Create Account’ you agree to our{' '}
                <span className='text-primary-base underline'>Terms and services</span> and{' '}
                <span className='text-primary-base underline'>Privacy policy.</span>
              </Label>
            </div> */}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
