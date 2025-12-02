'use client';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ConstBusinessIndustries as industries,
  ConstBusinessCategories as categories,
  ConstAnnualRevenue as revenues,
} from '@/lib/constants/auth.constant';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import SelectField from '@/components/custom/SelectField';
import InputField from '@/components/custom/InputField';
import {
  useCreateBusinessProfile,
  useGetBusinessProfile,
  useUpdateBusinessProfile,
} from '@/lib/hooks/business/business-settings.hook';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { businessProfileSchema, TBusinessProfileForm } from '@/lib/schemas/business/client/client-settings.schema';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { defaultBusinessHours } from '@/utils/defaults.util';
import { BusinessHourRow } from './BusinessHourRow';
import {
  mapCreateBusinessFormToApiPayload,
  mapUpdateBusinessFormToApiPayload,
} from '@/utils/mappings/settings.mapping';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import ImageUploaderWithCrop from '@/components/custom/img/ImageUploaderWithCrop';

interface BusinessProfileFormProps {
  className?: string;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const BusinessProfileForm = ({ className }: BusinessProfileFormProps) => {
  const [isBusinessExist, setIsBusinessExist] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { data, isLoading, isError } = useGetBusinessProfile();
  const { mutateAsync: updateBusinessProfile, isPending: updateIsPending } = useUpdateBusinessProfile();
  const { mutateAsync: createBusinessProfile, isPending: createIsPending } = useCreateBusinessProfile();

  const form = useForm<TBusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      companyName: '',
      phoneNumber: '',
      logo: null,
      logo_url: '',
      bio: '',
      category: '',
      industry: '',
      revenue: '',
      address: '',
      email: '',
      website: '',
      business_hour: defaultBusinessHours(),
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    reset,
  } = form;

  useEffect(() => {
    if (!data) {
      setIsBusinessExist(false);
      return;
    }

    setIsBusinessExist(true);

    const matchedCategory = categories.find((cat) => cat.toLowerCase() === data.business_category?.toLowerCase()) || '';
    const matchedIndustry = industries.find((ind) => ind.toLowerCase() === data.business_industry?.toLowerCase()) || '';
    const matchedRevenue = revenues.find((rev) => rev.toLowerCase() === data.annual_revenue?.toLowerCase()) || '';

    reset({
      companyName: data.company_name || '',
      phoneNumber: data.phone_number,
      logo: null,
      logo_url: data.business_logo_url,
      bio: data.business_bio || '',
      category: matchedCategory,
      industry: matchedIndustry,
      revenue: matchedRevenue,
      address: data.company_location || '',
      email: data.user.email || '',
      website: data.company_website || '',
      business_hour: data.business_hour ?? defaultBusinessHours(),
    });
  }, [data, reset]);

  const applyToAll = () => {
    days.forEach((day) => {
      setValue(`business_hour.${day}.open` as const, '09:00');
      setValue(`business_hour.${day}.close` as const, '17:00');
    });
  };
  const clearAll = () => {
    days.forEach((day) => {
      setValue(`business_hour.${day}.open` as const, null);
      setValue(`business_hour.${day}.close` as const, null);
    });
  };

  const handleFormSubmit = async (values: TBusinessProfileForm) => {
    try {
      //toast.success('Successfully hit client');
      // If logo is a File, upload it first via your existing API route (/api/upload) or pass it to your mutate functions
      let logoUrl: string | null = null;

      // Convert Blob → File just in case
      if (values.logo && values.logo instanceof Blob && !(values.logo instanceof File)) {
        values.logo = new File([values.logo], 'logo.png', { type: values.logo.type });
      }
      if (values.logo instanceof File) {
        const formData = new FormData();
        formData.append('file', values.logo);

        setImageLoading(true);
        const res = await fetch('/api/uploads', { method: 'POST', body: formData });
        const body = await res.json();
        setImageLoading(false);
        console.log('image delivered: ', body);
        logoUrl = body.profile.url ?? null;
      }

      if (isBusinessExist) {
        const payload = mapUpdateBusinessFormToApiPayload({ ...values, logo_url: logoUrl });
        console.log('Clientside profile update: ', payload);
        await updateBusinessProfile(payload);
      } else {
        const payload = mapCreateBusinessFormToApiPayload({ ...values, logo_url: logoUrl });
        console.log('Clientside profile update: ', payload);
        await createBusinessProfile(payload);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isLoading) {
    return <UILoaderIndicator label='Fetching your business profile...' />;
  }

  if (isError) {
    return <div className='text-red-600 text-center py-4'>Failed to load business profile. Please try again.</div>;
  }
  return (
    <div className={cn('flex flex-col gap-6 max-w-6xl px-4 py-6', className)}>
      <h2 className='font-medium text-xl leading-[150%] text-neutral-800'>Setup your Business Whatsapp Profile</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
          {/* Business Logo */}
          <div className='flex flex-col gap-6 '>
            {/* Business Logo Uploader */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Business Logo</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Logo will appear as the profile picture for your business.
                </p>
              </div>
              <Controller
                control={control}
                name='logo'
                render={({ field }) => (
                  <ImageUploaderWithCrop
                    value={field.value}
                    existingUrl={watch('logo_url')}
                    onChange={(f) => field.onChange(f)}
                  />
                )}
              />
              {/* {errors.logo?.message && <p className='text-sm text-red-600'>{errors.logo.message}</p>} */}
            </div>
            <Separator orientation='horizontal' />

            {/* Contact Information */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>
                  Your Business information
                </Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Add your busines information for your profile.
                </p>
              </div>
              {/* Business Address */}
              <div className='space-y-2'>
                <Label htmlFor='companyName' className='text-base leading-[150%] font-medium text-gray-700'>
                  Company Name
                </Label>
                <InputField<TBusinessProfileForm>
                  name='companyName'
                  control={control}
                  type='text'
                  placeholder='Enter Business Name'
                  className='max-w-md mt-1 focus-visible:ring-0'
                  disabled
                />
                {errors.companyName && <p className='text-sm text-red-600'>{errors.companyName.message}</p>}
              </div>
              {/* Business Email and Website */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg'>
                <div className='space-y-2'>
                  <FormField
                    control={control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-base leading-[150%] font-medium text-gray-700'>
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry='NG'
                            value={field.value!}
                            onChange={async (val) => {
                              field.onChange(val);
                              if (val) {
                                clearErrors('phoneNumber');
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <Card className='w-full max-w-xs p-0 shadow-none rounded-sm'>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1'>
                      <SelectField<TBusinessProfileForm>
                        control={control}
                        name={'phoneCountryCodeNumber'}
                        label=''
                        options={ConstCountryCodeOptions}
                        className='border-none shadow-none rounded-none focus-visible:ring-0 w-[90px]'
                        disabled
                      />
                    </div>
                    <div className='col-span-2 flex flex-item gap-0.5'>
                      <InputField<TBusinessProfileForm>
                        name={'phoneNumber'}
                        control={control}
                        type='text'
                        placeholder='Enter Phone Number'
                        className='border-none shadow-none rounded-none focus-visible:border-none focus-visible:ring-0'
                      />
                    </div>
                  </div>
                </Card> */}
                  {/* <InputField<TBusinessProfileForm>
                  name='phoneNumber'
                  control={control}
                  type='text'
                  placeholder='Enter Business Phone Number'
                  className={`focus-visible:ring-0 ${cn(errors.phoneNumber && 'border-red-500 focus:border-red-500')}`}
                />
                {errors.phoneNumber && <p className='text-sm text-red-600'>{errors.phoneNumber.message}</p>} */}
                </div>
              </div>
            </div>
            <Separator orientation='horizontal' />

            {/* Contact Information */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Contact information</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Add your contact information for your business profile.
                </p>
              </div>
              {/* Business Address */}
              <div className='space-y-2'>
                <Label htmlFor='address' className='text-base font-medium text-gray-700'>
                  Business address
                </Label>
                <InputField<TBusinessProfileForm>
                  name='address'
                  control={control}
                  type='text'
                  placeholder='Enter Business Address'
                  className='max-w-md mt-1 focus-visible:ring-0'
                />
                {errors.address && <p className='text-sm text-red-600'>{errors.address.message}</p>}
              </div>
              {/* Business Email and Website */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='mb-1 text-base font-medium text-gray-700'>
                    Business email
                  </Label>
                  <InputField<TBusinessProfileForm>
                    name='email'
                    control={control}
                    type='email'
                    placeholder='Enter Business Email'
                    className={`focus-visible:ring-0 ${cn(errors.email && 'border-red-500 focus:border-red-500')}`}
                  />
                  {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='website' className='text-base font-medium text-gray-700'>
                    Business website
                  </Label>
                  <InputField<TBusinessProfileForm>
                    name='website'
                    control={control}
                    type='text'
                    placeholder='Enter Business Website'
                    className={`focus-visible:ring-0 ${cn(errors.website && 'border-red-500 focus:border-red-500')}`}
                  />
                  {errors.website && <p className='text-sm text-red-600'>{errors.website.message}</p>}
                </div>
              </div>
            </div>
            <Separator orientation='horizontal' />

            {/* Business Bio */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>
                  Your Transactional Profile
                </Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Introduce your business and let customers know how you can help
                </p>
              </div>
              <div className='space-y-4'>
                <div className='space-y-0.5'>
                  <Textarea
                    id='businessBio'
                    placeholder='Tell customers about your business...'
                    className={cn(
                      'min-h-[100px] resize-none max-w-md',
                      errors.bio && 'border-red-500 focus:border-red-500'
                    )}
                    {...register('bio')}
                  />
                  {errors.bio && <p className='text-sm text-red-600'>{errors.bio.message}</p>}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='category' className='text-sm text-gray-700'>
                      Business Category
                    </Label>
                    <SelectField<TBusinessProfileForm>
                      name={'category'}
                      control={control}
                      options={categories}
                      className='w-full max-w-md'
                      placeholder='Select Category'
                    />
                  </div>
                  <div className='space-y-0.5'>
                    <Label htmlFor='industry' className='text-sm text-gray-700'>
                      Business Industry
                    </Label>
                    <SelectField<TBusinessProfileForm>
                      name={'industry'}
                      control={control}
                      options={industries}
                      className='w-full max-w-md'
                      placeholder='Select Industry'
                    />
                  </div>
                  <div className='space-y-0.5'>
                    <Label htmlFor='revenue' className='text-sm text-gray-700'>
                      Business Annual Revenue
                    </Label>
                    <SelectField<TBusinessProfileForm>
                      name={'revenue'}
                      control={control}
                      options={revenues}
                      className='w-full max-w-md'
                      placeholder='Select Annual Revenue'
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator orientation='horizontal' />

            {/* Business Hours */}
            <div className='space-y-4  max-w-lg'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Business Hours</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Specify your business opening and closing hours for each day.
                </p>
              </div>
              <div className='flex gap-2'>
                <Button type='button' variant='secondary' onClick={applyToAll} className='text-sm'>
                  Apply 9–5 to All
                </Button>
                <Button type='button' variant='outline' onClick={clearAll} className='text-sm'>
                  Clear All
                </Button>
              </div>
              <div className='grid grid-cols-1 gap-4'>
                {days.map((day) => (
                  <BusinessHourRow key={day} day={day} register={register} watch={watch} setValue={setValue} />
                ))}
              </div>
            </div>
          </div>
          {isBusinessExist ? (
            <Button
              type='submit'
              className={`bg-primary-base hover:bg-primary-700 py-5 px-4 rounded-[8px] text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
                updateIsPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {updateIsPending || imageLoading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span className='text-sm leading-[150%]'>Updating business profile...</span>
                </>
              ) : (
                <>
                  <span className='text-base leading-[150%]'>Update Business Profile</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type='submit'
              className={`bg-success-base hover:bg-success-700 py-5 px-4 rounded-[8px] text-sm leading-5 cursor-pointer inline-flex items-center space-x-2 ${
                createIsPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {createIsPending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span className='text-sm leading-[150%]'>Creating business profile...</span>
                </>
              ) : (
                <>
                  <span className='text-sm leading-[150%]'>Create Business Profile</span>
                </>
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BusinessProfileForm;
